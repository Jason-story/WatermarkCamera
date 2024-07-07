// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init();

// 获取数据库引用
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const transaction = await db.startTransaction();

    try {
        // 查询数据库中第一条记录
        const userCheck = await transaction
            .collection('dingding')
            .limit(1)
            .get();

        if (userCheck.data.length > 0) {
            // 获取第一条记录
            const firstRecord = userCheck.data[0];
            console.log('First Record:', firstRecord);

            // 如果需要对第一条记录进行操作，可以在这里进行
            // ...

            // 提交事务
            await transaction.commit();
            return {
                success: true,
                data: firstRecord
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
