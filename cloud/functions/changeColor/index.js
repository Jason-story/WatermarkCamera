/*eslint-disable*/
const cloud = require('wx-server-sdk');
// 设置APPID/AK/SK
const APP_ID = '23016000';
const API_KEY = '3E76BLTRlrWdpFbF5BRyUbIH';
const SECRET_KEY = 'fNtkjNAPEB4z83gHWILwPFbygCeXyUoM';
const AipBodyAnalysisClient = require('baidu-aip-sdk').bodyanalysis;
const client = new AipBodyAnalysisClient(APP_ID, API_KEY, SECRET_KEY);
const images = require('images');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

let checkResult = '';
// 云函数入口函数
exports.main = async (event) => {
    const file = await cloud.downloadFile({
        fileID: event.fileId
    });
    try {
        checkResult = await cloud.openapi.security.imgSecCheck({
            media: {
                contentType: 'image/jpg',
                value: Buffer.from(file.fileContent)
            }
        });
    } catch (error) {
        return error;
    }
    // 检测通过
    if (checkResult.errCode === 0) {
        var options = {};
        options['type'] = 'foreground';
        const imgBase64 = Buffer.from(file.fileContent, 'utf8').toString('base64');
        // 调用百度API
        const bdNewImg = await client.bodySeg(imgBase64, options);
        // 将百度返回的透明人像转成buffer 并云函数上传

        const defaultData = images(Buffer.from(bdNewImg.foreground, 'base64'));
        const { width, height } = defaultData.size();
        const color = event.color.split(',').map((item) => item * 1);
        const data = images(width, height).fill(color[0], color[1], color[2], 1).draw(defaultData, 0, 0).encode('jpg', {
            operation: 100
        });
        let newCloudPath = '';

        // 兼容老版本，上线后删除

        // zphs-liuyu/5-month/30-date/15-hour/1717055784276lwsyoifp.jpg
        newCloudPath = event.path.split('/').reverse();
        const newFileName = newCloudPath[0].split('.')[0] + '-new.' + newCloudPath[0].split('.')[1];
        newCloudPath[0] = newFileName;
        newCloudPath = newCloudPath.reverse().join('/');
        const cloudNewImg = await cloud.uploadFile({
            cloudPath: 'files/zphs/' + newCloudPath,
            fileContent: data //base64 to buffer
        });
        return { fileID: cloudNewImg.fileID, errCode: 0 };
    } else {
        return {
            checkResult
        };
    }
};
