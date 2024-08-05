const cloud = require('wx-server-sdk');
const Jimp = require('jimp');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

// Helper function to convert file content to buffer and check size
// 获取数据库引用
const db = cloud.database();
const _ = db.command;
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
    const { firstImageFileID, secondImageFileID, position, userInfo } = event;
    const transaction = await db.startTransaction();
    const isCheckData = await transaction.collection('isCheck').limit(1).get();
    let isCheck = false;
    if (isCheckData.data.length > 0) {
        // 获取第一条记录
        isCheck = isCheckData.data[0].check;
        console.log('isCheck: ', isCheck);
    }
    try {
        // Download images
        const [firstImageRes, secondImageRes] = await Promise.all([
            cloud.downloadFile({ fileID: firstImageFileID }),
            cloud.downloadFile({ fileID: secondImageFileID })
        ]);

        if (isCheck) {
            console.log('isCheck222: ', isCheck);
            // Perform security check on both images
            await Promise.all([securityCheck(firstImageRes.fileContent)]);
        }

        // Read images with Jimp
        const [firstImage, secondImage] = await Promise.all([
            Jimp.read(firstImageRes.fileContent),
            Jimp.read(secondImageRes.fileContent)
        ]);

        // Get dimensions of the first image
        const canvasWidth = firstImage.getWidth();
        const canvasHeight = firstImage.getHeight();
        const scaleFactor = 1;

        // Resize the second image
        let img2Width = position === 'center' ? canvasWidth * scaleFactor * 0.95 : (canvasWidth * scaleFactor) / 2.5;
        let img2Height = img2Width * (secondImage.getHeight() / secondImage.getWidth());
        secondImage.resize(img2Width, img2Height);

        // Calculate position for the second image
        let x = position === 'center' ? (canvasWidth - img2Width) / 2 : 10;
        let y = canvasHeight - img2Height - 10;

        // Composite images
        firstImage.composite(secondImage, x, y);

        // Scale factor based on user type
        const finalWidth = Math.round(canvasWidth * scaleFactor);
        const finalHeight = Math.round(canvasHeight * scaleFactor);

        // Resize and adjust quality
        firstImage.resize(finalWidth, finalHeight);
        if (userInfo.type === 'default') {
            firstImage.quality(50);
        }

        // Convert to buffer
        const buffer = await firstImage.getBufferAsync(Jimp.MIME_JPEG);

        // Upload to cloud storage
        const uploadResult = await cloud.uploadFile({
            cloudPath: `merged_images/${Date.now()}.jpg`,
            fileContent: buffer
        });

        // Delete temporary original images
        await cloud.deleteFile({
            fileList: [firstImageFileID, secondImageFileID]
        });

        return {
            success: true,
            fileID: uploadResult.fileID,
            width: finalWidth,
            canvasWidth,
            img2Width,
            sss: img2Width * scaleFactor,
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
