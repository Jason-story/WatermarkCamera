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

    // 获取当天的日期
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
    let todayUsageCount = 0;

    try {
        // 查询数据库中是否已存在该 openid 的记录
        const userCheck = await transaction
            .collection('users')
            .where({
                openid: OPENID
            })
            .get();

        if (userCheck.data.length > 0) {
            const userData = userCheck.data[0];
            const updateData = {
                _updateTime: +new Date(), // 最近登录时间
                ...event,
            };

            // 检查上次记录日期是否与今天相同
            if (userData.lastUsageDate !== todayStr) {
                updateData.todayUsageCount = 0; // 重置今日使用次数
                updateData.lastUsageDate = todayStr; // 更新上次记录日期
            } else {
                updateData.todayUsageCount = userData.todayUsageCount || 0;
            }

            // 更新今日使用次数
            if (event.remark === '成功使用') {
                todayUsageCount = updateData.todayUsageCount + 1;
                updateData.todayUsageCount = todayUsageCount;

                // 更新 times 字段
                updateData.times = _.inc(1);
                if (userData.vip_count > 0) {
                    updateData.vip_count = userData.vip_count - 1;
                }
            }

            // 如果记录存在，则更新该记录
            const openId = userData._id;
            await transaction.collection('users').doc(openId).update({ data: updateData });
            await transaction.commit();
        } else {
            // 如果记录不存在，则插入新记录
            const newUser = {
                openid: OPENID,
                _createTime: +new Date(), // 第一次登录时间
                type: 'default',
                todayUsageCount: event.remark === '成功使用' ? 1 : 0,
                times: event.remark === '成功使用' ? 1 : 0,
                lastUsageDate: todayStr, // 记录上次使用日期
            };
            await transaction.collection('users').add({ data: newUser });
            await transaction.commit();
            if (event.remark === '成功使用') {
                todayUsageCount = 1;
            }
        }

        // 再次查询并返回当前 openid 下的用户信息
        const updatedUserCheck = await db
            .collection('users')
            .where({
                openid: OPENID
            })
            .get();

        if (updatedUserCheck.data.length > 0) {
            const userData = updatedUserCheck.data[0];

            // 重新计算今日使用次数
            todayUsageCount = userData.todayUsageCount || 0;

            return {
                success: true,
                data: { ...userData, todayUsageCount, share: true },
                message: '用户信息已更新或添加',
            };
        } else {
            return {
                success: false,
                data: { share: true },
                errorMessage: '用户信息查询失败',
            };
        }
    } catch (e) {
        await transaction.rollback();

        // 处理唯一索引冲突错误
        if (e.message.includes("duplicate key error")) {
            // 处理唯一索引冲突错误，进行更新操作
            const userCheck = await db
                .collection('users')
                .where({
                    openid: OPENID
                })
                .get();

            if (userCheck.data.length > 0) {
                const userData = userCheck.data[0];
                const updateData = {
                    _updateTime: +new Date(), // 最近登录时间
                    ...event,
                };

                // 检查上次记录日期是否与今天相同
                if (userData.lastUsageDate !== todayStr) {
                    updateData.todayUsageCount = 0; // 重置今日使用次数
                    updateData.lastUsageDate = todayStr; // 更新上次记录日期
                } else {
                    updateData.todayUsageCount = userData.todayUsageCount || 0;
                }

                if (event.remark === '成功使用') {
                    todayUsageCount = updateData.todayUsageCount + 1;
                    updateData.todayUsageCount = todayUsageCount;

                    // 更新 times 字段
                    updateData.times = _.inc(1);
                    if (userData.vip_count > 0) {
                        updateData.vip_count = userData.vip_count - 1;
                    }
                }

                // 如果记录存在，则更新该记录
                const openId = userData._id;
                const res = await db.collection('users').doc(openId).update({ data: updateData });

                // 再次查询并返回当前 openid 下的用户信息
                const updatedUserCheck = await db
                    .collection('users')
                    .where({
                        openid: OPENID
                    })
                    .get();

                if (updatedUserCheck.data.length > 0) {
                    const userData = updatedUserCheck.data[0];

                    // 重新计算今日使用次数
                    todayUsageCount = userData.todayUsageCount || 0;

                    return {
                        success: true,
                        data: { ...userData, todayUsageCount, share: true },
                        message: '用户信息已更新',
                    };
                } else {
                    return {
                        success: false,
                        data: { share: true },
                        errorMessage: '用户信息查询失败',
                    };
                }
            } else {
                return {
                    success: false,
                    data: { share: true },
                    errorMessage: '用户信息更新失败，记录不存在',
                };
            }
        }

        return {
            success: false,
            data: { share: true },
            errorMessage: e.message,
        };
    }
};
