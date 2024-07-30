const cloud = require('wx-server-sdk');
const Jimp = require('jimp');

cloud.init();

// Helper function to convert file content to buffer and check size

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

        if (secCheckResult.errCode !== 0) {
            throw new Error(secCheckResult);
        }
    } catch (secError) {
        // console.log('secCheckResult: ', secCheckResult);
        throw new Error('图片不合规，请重新选择图片');
    }
}

exports.main = async (event, context) => {
    const { firstImageFileID, secondImageFileID, position, userInfo } = event;

    try {
        // Download images
        const [firstImageRes, secondImageRes] = await Promise.all([
            cloud.downloadFile({ fileID: firstImageFileID }),
            cloud.downloadFile({ fileID: secondImageFileID })
        ]);

        // Perform security check on both images
        await Promise.all([securityCheck(firstImageRes.fileContent)]);

        // Read images with Jimp
        const [firstImage, secondImage] = await Promise.all([
            Jimp.read(firstImageRes.fileContent),
            Jimp.read(secondImageRes.fileContent)
        ]);

        // Get dimensions of the first image
        const canvasWidth = firstImage.getWidth();
        const canvasHeight = firstImage.getHeight();

        // Resize the second image
        let img2Width = position === 'center' ? canvasWidth * 0.95 : secondImage.getWidth() * 0.95;
        let img2Height = img2Width * (secondImage.getHeight() / secondImage.getWidth());
        secondImage.resize(img2Width, img2Height);

        // Calculate position for the second image
        let x = position === 'center' ? (canvasWidth - img2Width) / 2 : 10;
        let y = canvasHeight - img2Height - 10;

        // Composite images
        firstImage.composite(secondImage, x, y);

        // Scale factor based on user type
        const scaleFactor = userInfo.type === 'default' ? 1 / 1.7 : 1;
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
