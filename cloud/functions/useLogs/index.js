const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    // 确保 type 参数存在
    if (!event.type) {
        return {
            success: false,
            message: 'Type parameter is required'
        };
    }

    try {
        // 创建新记录
        const result = await db.collection('useLogs').add({
            data: {
                type: event.type
            }
        });

        return {
            success: true,
            data: {
                _id: result._id
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            message: error.message
        };
    }
};
