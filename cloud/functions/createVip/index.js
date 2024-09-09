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

    // 使用正则表达式提取 inviteId
    let inviteIdMatch = body.match(/inviteId%3D([^%&]*)/);
    let inviteId = inviteIdMatch ? decodeURIComponent(inviteIdMatch[1]) : null;

    // 使用正则表达式提取 inviteId
    let priceMatch = body.match(/price%3D([^%&]*)/);
    let price = priceMatch ? decodeURIComponent(priceMatch[1]) : null;
    // 使用正则表达式提取 inviteId
    let plateformMatch = body.match(/plateform%3D([^%&]*)/);
    let plateform = plateformMatch ? decodeURIComponent(plateformMatch[1]) : null;

    console.log('openid:', openid);
    console.log('type:', type);
    console.log('inviteId: ', inviteId);
    console.log('price: ', price);

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
                    plateform,
                    pay_time: currentTime,
                    end_time: endTime
                }
            });
        // 更新邀请来源用户信息
        if (openid !== inviteId) {
            await transaction
                .collection('users')
                .where({
                    openid: inviteId
                })
                .update({
                    data: {
                        mone: _.inc((price * 0.2).toFixed(2)) // 使用 _.inc 来增加 mone 的值
                    }
                });
        }

        return {
            msg: '用户信息更新成功'
        };
    } catch (error) {
        return {
            error
        };
    }
};
