import React, { useState, useEffect } from "react";
import { View, Ad, Image, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Head from "../../images/head.jpg";
import ShareImg from "../../images/logo.jpg";

import "./index.scss";

const inviteId = Taro.getCurrentInstance().router.params.id || "";

const UserInfo = ({
  userInfo,
  avatar,
  nickname,
  freeQuota,
  totalQuota,
  inviteCount,
  userId,
  endTime,
  todayCount,
  userType,
}) => {
  const onCopyText = (text) => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({
          title: "已复制到剪贴板",
          icon: "success",
          duration: 2000,
        });
      },
      fail: (err) => {
        console.error("复制到剪贴板失败:", err);
      },
    });
  };
  function formatDate(timestamp) {
    // 创建一个新的 Date 对象，使用时间戳
    const date = new Date(timestamp);

    // 获取年份
    const year = date.getFullYear();

    // 获取月份（0-11），加1以便为1-12
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // 获取日期
    const day = String(date.getDate()).padStart(2, "0");

    // 获取小时
    const hours = String(date.getHours()).padStart(2, "0");

    // 获取分钟
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // 拼接成 YYYY-MM-DD HH:MM 格式
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // 使用示例
  const config = {
    default: "普通用户",
    month: "包月会员",
    "1day": "一天会员",
    "3days": "三天会员",
    twoMonth: "双月会员",
    threeMonth: "三月会员",
    halfYearMonth: "半年会员",
    year: "包年会员",
    never: "永久会员",
  };
  return (
    <View className="user-info">
      <View className="user-details">
        <View className="user-item">
          <Text className="label">我的等级</Text>
          <Text className="value">{config[userType]}</Text>
        </View>
        {userType !== "default" && (
          <View className="user-item">
            <Text className="label">会员到期时间</Text>
            <Text className="value">{formatDate(endTime)}</Text>
          </View>
        )}

        <View
          className="user-item"
          onClick={() => {
            onCopyText(userId);
          }}
        >
          <View
            className="label"
            style={{ display: "flex", flexDirection: "column" }}
          >
            我的ID <View style={{ fontSize: "12px" }}>(点击复制)</View>
          </View>
          <Text className="value">{userId || "xxx"}</Text>
        </View>

        {/* <View className="user-item">
          <Text className="label">免费使用总次数</Text>
          <Text className="value">
            {userType !== "default" ? "不限量" : "共2次"}
          </Text>
        </View> */}
        {/* <View className="user-item">
          <Text className="label">已使用次数</Text>
          <Text className="value">{totalQuota}</Text>
        </View> */}
        <View className="user-item">
          <Text className="label">待提现</Text>
          <Text className="value">{userInfo.mone || "0"}元</Text>
        </View>
        <View className="user-item">
          <Text className="label">邀请获赠总次数</Text>
          <Text className="value">{inviteCount || 0}</Text>
        </View>
        <View className="user-item">
          <Text className="label">已使用次数/总次数</Text>
          <Text className="value">
            {userType !== "default"
              ? "不限量"
              : (totalQuota || "0") + ("/" + (2 + (inviteCount || 0)))}
          </Text>
        </View>
        {userType !== "default" && (
          <View
            className="user-item"
            onClick={() => {
              onCopyText("jason_story");
            }}
          >
            <View
              className="label"
              style={{ display: "flex", flexDirection: "column" }}
            >
              客服微信 <View style={{ fontSize: "12px" }}>(点击复制)</View>
            </View>
            <Text className="value">{"jason_story"}</Text>
          </View>
        )}

        {/* <View
          style={{ fontSize: "16px", marginTop: "10px", color: "rgb(#808080)" }}
        >
          邀请好友<Text style={{color:"#ff4d4f"}}>成功拍照</Text>1次，赠送您2次(同一好友每日最多赠送4次)
        </View> */}
        {/* <View
          style={{ fontSize: "16px", marginTop: "10px", color: "rgb(#808080)" }}
        >
          点击ID即可复制
        </View> */}
      </View>
      <View style={{ width: "100%", marginTop: "50px" }}>
        <Button
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/vip/index?id=" + inviteId,
            });
          }}
          style={{
            background: "linear-gradient(45deg,#fc4a1a, #f7b733)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "0 20px",
            fontSize: "30rpx",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
            marginBottom: "20px",
          }}
          type="default"
          className="guide-btn"
        >
          会员
        </Button>
      </View>
      {userType === "default" && <Ad unit-id="adunit-5545a3fd94d5af76"></Ad>}
    </View>
  );
};

const Index = () => {
  const [userInfo, setUserInfo] = useState({
    avatar: Head,
    nickname: "",
    freeQuota: 5,
    totalQuota: "30",
    userId: "12345678",
  });
  const [data, setData] = useState({});

  useEffect(() => {
    Taro.cloud.callFunction({
      name: "addUser",
      success: function (res) {
        setData(res.result.data);
      },
    });

  }, []);
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + data.openid,
      imageUrl: ShareImg,
    };
  });
  return (
    <View className="index">
      <UserInfo
        avatar={userInfo.avatar}
        nickname={userInfo.nickname}
        freeQuota={userInfo.freeQuota}
        totalQuota={data.times}
        inviteCount={data.invite_count}
        todayCount={data.todayUsageCount}
        userId={data.openid}
        userInfo={data}
        userType={Date.now() > data.end_time ? "default" : data.type}
        endTime={data.end_time}
      />
    </View>
  );
};

export default Index;
