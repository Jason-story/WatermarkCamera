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
        // 查询price数据库中第一条记录
        const priceCheck = await transaction
            .collection('price')
            .limit(1)
            .get();
        
        if (priceCheck.data.length > 0) {
            // 获取第一条记录
            const firstPrice = priceCheck.data[0];
            console.log('First Price Record:', firstPrice);
            
            // 如果需要对第一条记录进行操作，可以在这里进行
            // ...
            
            // 提交事务
            await transaction.commit();
            return {
                success: true,
                data: firstPrice
            };
        } else {
            // 没有找到记录
            await transaction.commit();
            return {
                success: false,
                message: 'No price records found'
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