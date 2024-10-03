// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init();

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type = '', zphsId } = event;
    const wxContext = cloud.getWXContext();
    const OPENID = zphsId || wxContext.OPENID || wxContext.FROM_OPENID;

    try {
        // 先获取用户当前的 cishu 值
        const userRecord = await db
            .collection('zphsUser')
            .where({
                openid: OPENID
            })
            .get();

        let currentCishu, newCishu;

        if (userRecord.data.length === 0) {
            // 用户不存在，创建新用户
            await db.collection('zphsUser').add({
                data: {
                    openid: OPENID,
                    cishu: 1
                }
            });
            currentCishu = 0;
        } else {
            currentCishu = userRecord.data[0].cishu || 0;
        }

        // 根据 type 决定是增加还是减少 cishu
        if (type === 'consume') {
            newCishu = currentCishu - 1;
        } else if (type === 'add') {
            newCishu = currentCishu + 1;
        } else {
            newCishu = currentCishu;
        }

        // 更新 cishu 值
        const result = await db
            .collection('zphsUser')
            .where({
                openid: OPENID
            })
            .update({
                data: {
                    cishu: newCishu
                }
            });

        return {
            success: true,
            message: 'cishu updated successfully',
            newCishu: newCishu,
            openid: OPENID,
            wxContext: wxContext
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};
