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
    const OPENID = wxContext.OPENID; // 被邀请者
    const invite_id = event.invite_id; // 邀请者
    console.log('event: ', event);
    console.log('invite_id: ', invite_id);
    if (invite_id === OPENID || !invite_id) {
        return {
            success: false,
            message: 'You cannot invite yourself'
        };
    }

    const transaction = await db.startTransaction();

    try {
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        // 检查邀请者(invite_id)在过去24小时内是否已经邀请过
        const inviterCheck = await transaction
            .collection('invites')
            .where({
                invite_id: invite_id,
                timestamp: _.gte(yesterday)
            })
            .count();

        if (inviterCheck.total >= 1) {
            await transaction.rollback();
            return {
                success: false,
                invite_id,
                event,
                message: '24小时内已邀请过'
            };
        }

        // 检查被邀请者(OPENID)今天被邀请的次数
        const inviteeCheck = await transaction
            .collection('invites')
            .where({
                openid: OPENID,
                timestamp: _.gte(today).and(_.lte(endOfDay))
            })
            .count();

        if (inviteeCheck.total >= 3) {
            await transaction.rollback();
            return {
                success: false,
                invite_id,
                event,
                message: '今日已被邀请3次'
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
                event,

                message: 'User not found'
            };
        }

        // 更新邀请用户的 invite_count
        await transaction
            .collection('users')
            .doc(userCheck.data[0]._id)
            .update({
                data: {
                    invite_count: _.inc(1)
                }
            });

        // 记录此次邀请
        await transaction.collection('invites').add({
            data: {
                invite_id: invite_id,
                openid: OPENID,
                _createTime: +new Date(),
                timestamp: now
            }
        });

        await transaction.commit();
        return {
            success: true,
            invite_id,
            event,
            message: '邀请成功'
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
