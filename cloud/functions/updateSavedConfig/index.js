// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init();

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID || wxContext.FROM_OPENID;

    try {
        // 更新用户的 saveConfig
        const result = await db.collection('users').where({
            openid: OPENID
        }).update({
            data: {
                saveConfig: event.saveConfig,
            }
        });

        if (result.stats.updated > 0) {
            return {
                success: true,
                message: '保存成功'
            };
        } else {
            // 如果没有更新任何文档，可能是因为用户不存在
            return {
                success: false,
                message: '保存失败'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};