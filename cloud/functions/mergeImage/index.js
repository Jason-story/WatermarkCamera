const cloud = require('wx-server-sdk');
const Jimp = require('jimp');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

// Helper function to convert file content to buffer and check size
// 获取数据库引用
const db = cloud.database();
const _ = db.command;
function generateTimestamp(info) {
    const now = new Date();

    // 获取当前时间的时间戳（毫秒）
    const timestamp = now.getTime();

    // 计算北京时间，中国位于 UTC+8 时区
    const beijingTime = new Date(timestamp + 8 * 60 * 60 * 1000);

    // 格式化时间
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    const hours = String(beijingTime.getUTCHours()).padStart(2, '0');
    const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0');

    return `${hours}.${minutes}${info.type !== "default" ? "vip" : ""}`;
}
// Optimized security check function
async function securityCheck(fileContent) {
    try {
        const buffer = await Buffer.from(fileContent);
        // 检查文件大小
        //  const maxFileSize = 1 * 1024 * 1024; // 5MB
        // if (buffer.length > maxFileSize) {
        //     throw new Error('图片过大，请重新选择');
        // }
        const secCheckResult = await cloud.openapi.security.imgSecCheck({
            media: {
                contentType: 'image/jpg',
                value: buffer
            }
        });
        console.log('secCheckResult: ', secCheckResult);
        if (secCheckResult.errCode !== 0) {
            throw new Error(secCheckResult);
        }
    } catch (secError) {
        console.log('secError: ', secError);
        throw new Error('图片不合规，请重新选择图片');
    }
}

exports.main = async (event, context) => {
    const {
        firstImageFileID,
        secondImageFileID,
        logoConfig,
        screenWidth,
        logoImageFileId,
        scale = 1,
        userInfo
    } = event;
    const transaction = await db.startTransaction();
    const isCheckData = await transaction.collection('isCheck').limit(1).get();
    let isCheck = false;
    if (isCheckData.data.length > 0) {
        // 获取第一条记录
        isCheck = isCheckData.data[0].check;
    }
    try {
        // Download images
        const downloadTasks = [
            cloud.downloadFile({ fileID: firstImageFileID }),
            cloud.downloadFile({ fileID: secondImageFileID })
        ];

        // 只有当 logoImageFileId 存在时才添加到任务列表
        if (logoImageFileId) {
            downloadTasks.push(cloud.downloadFile({ fileID: logoImageFileId }));
        }

        const [firstImageRes, secondImageRes, logoImageRes = null] = await Promise.all(downloadTasks);

        if (isCheck) {
            console.log('isCheck222: ', isCheck);
            // Perform security check on both images
            await Promise.all([securityCheck(firstImageRes.fileContent)]);
        }

        // 准备读取图像的任务
        const readTasks = [Jimp.read(firstImageRes.fileContent), Jimp.read(secondImageRes.fileContent)];

        // 只有当 logoImageRes 存在时才添加读取任务
        if (logoImageRes) {
            readTasks.push(Jimp.read(logoImageRes.fileContent));
        } else {
            readTasks.push(null); // 保证数组长度一致
        }

        const [firstImage, secondImage, logoImage] = await Promise.all(readTasks);
        // 处理读取的图像

        // Get dimensions of the first image
        const canvasWidth = firstImage.getWidth();
        const canvasHeight = firstImage.getHeight();

        // Resize the second image
        let img2Width = canvasWidth * scale;
        let img2Height = img2Width * (secondImage.getHeight() / secondImage.getWidth());
        secondImage.resize(img2Width, img2Height);
        // Calculate position for the second image
        let x = 0;
        let y = canvasHeight - img2Height - 10;

        // Composite images
        firstImage.composite(secondImage, x, y);

        // Resize the logo image
        if (logoImageFileId) {
            let logoWidth = logoConfig.width * (canvasWidth / screenWidth);
            let logoHeight = logoConfig.height * (canvasWidth / screenWidth);
            logoImage.resize(logoWidth, logoHeight);

            let logoX = logoConfig.x;
            let logoY = logoConfig.y * canvasHeight;
            firstImage.composite(logoImage, logoX, logoY);
        }

        // Scale factor based on user type
        const finalWidth = Math.round(canvasWidth);
        const finalHeight = Math.round(canvasHeight);

        // Resize and adjust quality
        firstImage.resize(finalWidth, finalHeight);
        if (userInfo.type === 'default') {
            firstImage.quality(50);
        }

        // Convert to buffer
        const buffer = await firstImage.getBufferAsync(Jimp.MIME_JPEG);

        // Upload to cloud storage
        const uploadResult = await cloud.uploadFile({
            cloudPath: `files/server_images/${generateTimestamp(userInfo)}_${userInfo.openid}.jpg`,
            fileContent: buffer
        });

        // 构建文件列表，排除无效的 logoImageFileId
        const fileList = [firstImageFileID, secondImageFileID].filter(Boolean); // 排除 null 或 undefined

        // 如果 logoImageFileId 存在，才添加到 fileList 中
        if (logoImageFileId) {
            fileList.push(logoImageFileId);
        }

        await cloud.deleteFile({
            fileList: fileList
        });

        return {
            success: true,
            fileID: uploadResult.fileID,
            width: finalWidth,
            canvasWidth,
            img2Width,
            height: finalHeight
        };
    } catch (error) {
        console.error('处理图片失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
