const cloud = require('wx-server-sdk');
const Jimp = require('jimp');

cloud.init();
let checkResult = '';
exports.main = async (event, context) => {
    const { firstImageFileID, secondImageFileID, position, userInfo } = event;

    try {
        // 下载图片
        const [firstImageRes, secondImageRes] = await Promise.all([
            cloud.downloadFile({ fileID: firstImageFileID }),
            cloud.downloadFile({ fileID: secondImageFileID })
        ]);
        // checkResult = await cloud.openapi.security.imgSecCheck({
        //     media: {
        //         contentType: 'image/jpeg',
        //         value: Buffer.from(firstImageRes.fileContent)
        //     }
        // });
        // if (checkResult.errCode !== 0) {
        //     return { message: '图片不合规' };
        // }
        // 使用 Jimp 读取图片
        const [firstImage, secondImage] = await Promise.all([
            Jimp.read(firstImageRes.fileContent),
            Jimp.read(secondImageRes.fileContent)
        ]);

        // 获取第一张图片的尺寸
        const canvasWidth = firstImage.getWidth();
        const canvasHeight = firstImage.getHeight();

        // 调整第二张图片的大小
        let img2Width = position === 'center' ? canvasWidth * 0.8 : secondImage.getWidth() * 0.8;
        let img2Height = img2Width * (secondImage.getHeight() / secondImage.getWidth());
        secondImage.resize(img2Width, img2Height);

        // 计算第二张图片的位置
        let x = position === 'center' ? (canvasWidth - img2Width) / 2 : 10;
        let y = canvasHeight - img2Height - 10;

        // 合并图片
        firstImage.composite(secondImage, x, y);

        // 根据用户类型决定是否需要额外的缩放
        const scaleFactor = userInfo.type === 'default' ? 1 / 1.7 : 1;
        const finalWidth = Math.round(canvasWidth * scaleFactor);
        const finalHeight = Math.round(canvasHeight * scaleFactor);

        // 调整图片大小和质量
        firstImage.resize(finalWidth, finalHeight);
        if (userInfo.type === 'default') {
            firstImage.quality(50); // 设置 JPEG 质量为 50
        }

        // 将图片转换为 buffer
        const buffer = await firstImage.getBufferAsync(Jimp.MIME_JPEG);

        // 上传到云存储
        const uploadResult = await cloud.uploadFile({
            cloudPath: `merged_images/${Date.now()}.jpg`,
            fileContent: buffer
        });

        // 删除临时上传的原始图片
        await cloud.deleteFile({
            fileList: [firstImageFileID, secondImageFileID]
        });

        return {
            success: true,
            fileID: uploadResult.fileID,
            width: finalWidth,
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
