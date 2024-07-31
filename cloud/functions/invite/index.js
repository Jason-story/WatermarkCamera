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
    const OPENID = wxContext.OPENID;
    const invite_id = event.invite_id;
    if (invite_id == OPENID) {
        return {
            success: false,
            message: 'You cannot invite yourself'
        };
    }

    const transaction = await db.startTransaction();

    try {
        // 检查当前 invite_id 是否已经用过2次
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const inviteCheck = await transaction
            .collection('invites')
            .where({
                invite_id: invite_id,
                openid: OPENID,
                timestamp: _.gte(today).and(_.lte(endOfDay)),
                _createTime: +new Date()
            })
            .count();

        if (inviteCheck.total >= 2) {
            await transaction.rollback();
            return {
                success: false,
                message: 'Invite limit reached for today'
            };
        }

        // 获取邀请用户数据
        const userCheck = await transaction
            .collection('users')
            .where({
                openid: invite_id
            })
            .get();

        if (userCheck.data.length === 0) {
            await transaction.rollback();
            return {
                success: false,
                message: 'User not found'
            };
        }

        // 更新邀请用户的 invite_count
        await transaction
            .collection('users')
            .doc(userCheck.data[0]._id)
            .update({
                data: {
                    invite_count: _.inc(2)
                }
            });

        // 记录此次 invite_id 使用
        await transaction.collection('invites').add({
            data: {
                invite_id: invite_id,
                openid: OPENID,
                timestamp: new Date(),
                _createTime: +new Date()
            }
        });

        await transaction.commit();
        return {
            success: true,
            message: 'Invite count updated successfully'
        };
    } catch (e) {
        await transaction.rollback();
        return {
            success: false,
            message: 'Transaction failed',
            error: e
        };
    }
};
