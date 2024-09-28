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
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID || wxContext.FROM_OPENID;

    const transaction = await db.startTransaction();

    try {
        // 查询数据库中第一条记录
        const existingRecord = await transaction.collection('videos').where({ 'data.openid': OPENID }).get();
        if (existingRecord.data.length > 0) {
            // 获取第一条记录
            const firstRecord = existingRecord.data[0];
    
            // 提交事务
            // await transaction.commit();
            return {
                success: true,
                data: firstRecord.data.files
            };
        } else {
            // 没有找到记录
            await transaction.commit();
            return {
                success: false,
                message: 'No records found'
            };
        }
    } catch (error) {
        console.error('Error:', error);
        // 回滚事务
        await transaction.rollback();
        return {
            success: false,
            message: error.message
        };
    }
};
