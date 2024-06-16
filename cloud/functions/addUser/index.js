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
    const { OPENID } = wxContext;

    const transaction = await db.startTransaction();

    try {
        // 查询数据库中是否已存在该 openid 的记录
        const userCheck = await transaction
            .collection('users')
            .where({
                openid: OPENID
            })
            .get();

        if (userCheck.data.length > 0) {
            const data = {
                // type: 'month',
                _updateTime: +new Date(), // 最近登录时间
                ...event,
            };
            if (event.remark === '成功使用') {
                data.times = _.inc(1);
            }
            // 如果记录存在，则更新该记录
            const openId = userCheck.data[0]._id;
            const res = await transaction.collection('users').doc(openId).update({ data });
            await transaction.commit();
            return {
                success: true,
                data: res,
                message: '用户信息已更新'
            };
        } else {
            // 如果记录不存在，则插入新记录
            const res = await transaction.collection('users').add({
                data: {
                    openid: OPENID,
                    _createTime: +new Date(), // 第一次登录时间
                    type: 'default',
                    times: 0
                }
            });
            await transaction.commit();
            return {
                success: true,
                data: res,
                message: '用户信息已添加'
            };
        }
    } catch (e) {
        await transaction.rollback();
        return {
            success: false,
            errorMessage: e.message
        };
    }
};
