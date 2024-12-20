// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云环境
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/**
 * 从云存储下载图片
 * @param {string} fileID - 云存储中的文件ID
 * @returns {Promise<Buffer>} 返回图片的buffer
 */
const downloadImage = async (fileID) => {
    try {
        const res = await cloud.downloadFile({ fileID });
        return res.fileContent;
    } catch (error) {
        console.error('下载图片失败:', error);
        throw error;
    }
};

/**
 * 将媒体文件上传到微信服务器
 * @param {Buffer} buffer - 图片的buffer
 * @returns {Promise<Object>} 返回上传结果，包含mediaId
 */
const uploadToWechat = async (buffer) => {
    try {
        return await cloud.openapi.customerServiceMessage.uploadTempMedia({
            type: 'image',
            media: {
                contentType: 'image/png',
                value: buffer
            }
        });
    } catch (error) {
        console.error('上传到微信服务器失败:', error);
        throw error;
    }
};

/**
 * 发送客服消息
 * @param {string} openid - 用户的openid
 * @param {string} msgtype - 消息类型
 * @param {Object} content - 消息内容
 */
const sendCustomerServiceMessage = async (openid, msgtype, content) => {
    try {
        await cloud.openapi.customerServiceMessage.send({
            touser: openid,
            msgtype,
            [msgtype]: content
        });
    } catch (error) {
        console.error('发送客服消息失败:', error);
        throw error;
    }
};

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const userOpenId = wxContext.OPENID;

    try {
        // 发送欢迎文本消息
        await sendCustomerServiceMessage(userOpenId, 'text', {
            content:
                // '您好，欢迎使用水印相机。如果您要开通会员请复制下面链接到浏览器中打开。如有问题请留言，我会第一时间回复您。'
                '感谢使用，觉得好用就开个会员支持一下吧 ☺️ 有任何问题可留言，第一时间回复。'
        });
        // 发送微信号
        // await sendCustomerServiceMessage(userOpenId, 'text', {
        //     content: '开通会员请到 小程序-我的-点击id 复制文字发送给我。并选择会员类型。'
        // });
         // 会员价格
        // const imageBuffer = await downloadImage('cloud://sy-4gecj2zw90583b8b.7379-sy-4gecj2zw90583b8b-1326662896/kefu/WechatIMG366.jpg');
        // const uploadResult = await uploadToWechat(imageBuffer);
        // await sendCustomerServiceMessage(userOpenId, 'image', {
        //     media_id: uploadResult.mediaId
        // });

        return 'success';
    } catch (error) {
        console.error('云函数执行失败:', error);
        return 'error';
    }
};
