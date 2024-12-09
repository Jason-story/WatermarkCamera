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
    if (invite_id === OPENID || !invite_id) {
        return {
            success: false,
            message: '不能邀请自己'
        };
    }

    const transaction = await db.startTransaction();

    try {
        // 检查被邀请者(OPENID)是否曾经被邀请过
        const inviteeCheck = await transaction
            .collection('invites')
            .where({
                openid: OPENID
            })
            .count();
        const yaoqingrenshu = await transaction
            .collection('invites')
            .where({
                invite_id
            })
            .count();

        if (yaoqingrenshu.total >= 10) {
            await transaction.rollback();
            return {
                success: false,
                invite_id,
                OPENID,
                event,
                message: '最多邀请10人'
            };
        }
        if (inviteeCheck.total >= 1) {
            await transaction.rollback();
            return {
                success: false,
                invite_id,
                OPENID,
                event,
                message: '该用户已被邀请过'
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
                OPENID,
                message: 'User not found'
            };
        }

        // 更新邀请用户的 youhui
        await transaction
            .collection('users')
            .doc(userCheck.data[0]._id)
            .update({
                data: {
                    youhui: _.inc(1),
                    inviteCount: _.inc(1)
                }
            });

        // 记录此次邀请
        await transaction.collection('invites').add({
            data: {
                invite_id: invite_id,
                openid: OPENID,
                _createTime: +new Date(),
                timestamp: new Date()
            }
        });

        await transaction.commit();
        return {
            success: true,
            invite_id,
            event,
            OPENID,
            message: '邀请成功'
        };
    } catch (e) {
        await transaction.rollback();
        return {
            success: false,
            invite_id,
            OPENID,
            message: 'Transaction failed',
            error: e
        };
    }
};
