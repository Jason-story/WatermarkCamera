// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const { body, headers } = event;
    if (headers.referer !== 'https://api.xunhupay.com') {
        return false;
    }

    // 使用正则表达式提取 openid
    let openidMatch = body.match(/openid%3D([^%&]*)/);
    let openid = openidMatch ? decodeURIComponent(openidMatch[1]) : null;

    // 使用正则表达式提取 type
    let typeMatch = body.match(/type%3D([^%&]*)/);
    let type = typeMatch ? decodeURIComponent(typeMatch[1]) : null;

    console.log('openid:', openid);
    console.log('type:', type);

    const transaction = await db.startTransaction();
    const config = {
        '1day': 1,
        month: 30,
        threeMonth: 90,
        halfYearMonth: 180,
        year: 365,
        never: 99999
    };

    try {
        const currentTime = Date.now(); // 获取当前时间的毫秒时间戳
        const endTime = currentTime + config[type] * 24 * 60 * 60 * 1000; // 计算结束时间

        // 更新用户信息
        const result = await transaction
            .collection('users')
            .where({
                openid
            })
            .update({
                data: {
                    type: type,
                    pay_time: currentTime,
                    end_time: endTime
                }
            });

        return {
            msg: '用户信息更新成功'
        };
    } catch (error) {
        return {
            error
        };
    }
};
