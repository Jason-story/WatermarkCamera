// 云函数入口文件
const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init();

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext(); 
    const { OPENID } = wxContext;

    try {
        // 查询数据库中是否已存在该 openid 的记录
        const userCheck = await db
            .collection('users')
            .where({
                openid: OPENID
            })
            .get();

        if (userCheck.data.length > 0) {
            const data = {
                // type: 'month',
                remark: event.remark,
                _updateTime: +new Date() // 最近登录时间
            };
            if (event.remark === '成功使用') {
                data.times = db.command.inc(1);
            }
            // 如果记录存在，则更新该记录
            const openId = userCheck.data[0]._id;
            const res = await db.collection('users').doc(openId).update({ data });
            return {
                success: true,
                data: res,
                message: '用户信息已更新'
            };
        } else {
            // 如果记录不存在，则插入新记录
            const res = await db.collection('users').add({
                data: {
                    openid: OPENID,
                    _createTime: +new Date(), // 第一次登录时间
                    type: 'default',
                    times: 0
                }
            });
            return {
                success: true,
                data: res,
                message: '用户信息已添加'
            };
        }
    } catch (e) {
        return {
            success: false,
            errorMessage: e.message
        };
    }
};
