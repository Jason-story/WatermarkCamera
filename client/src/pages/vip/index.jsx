import React, { useState, useEffect } from "react";
import { View, Image, Ad, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";

import Head from "../../images/head.jpg";
import "./index.scss";
const UserInfo = ({
  avatar,
  nickname,
  freeQuota,
  totalQuota,
  userId,
  endTime,
  onChooseAvatar,
  userType,
}) => {
  const [showDD, setIsShowDD] = useState(false);

  Taro.cloud.callFunction({
    name: "getDD",
    success: function (res) {
      setIsShowDD(res.result.data.open);
    },
  });

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

    // 拼接成 YYYY-MM-DD 格式
    return `${year}-${month}-${day}`;
  }

  return (
    <View className="user-info">
      <View className="user-details">
        <View style={{ marginBottom: "30px" }}>
          会员有以下两种
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>普通会员</Text>
          ，每月10元，包括以下特权:{" "}
        </View>
        <View>• 去掉除封面广告之外的一切广告</View>
        <View>• 生成高清水印图片</View>
        <View>• 每天、每月不限量生成水印图片</View>
      </View>
      <View className="user-details" style={{ marginTop: "20px" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>高级会员</Text>，
          每月20元，
          包括普通会员的所有权益以及解锁所有会员水印
        </View>
      </View>
      <View
        className="user-details"
        style={{ marginTop: "20px", fontWeight: "bold" }}
      >
        DD打卡可以联系客服，支持修改定位和扫脸等功能
      </View>
      <View style={{ width: "100%", marginTop: "50px" }}>
        <View style={{ marginBottom: "10px" }}>开通会员请联系客服</View>
        <Button
          openType="contact"
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
          联系客服
        </Button>
      </View>
      {userType === "default" && <Ad unit-id="adunit-079549954a0a9386"></Ad>}
    </View>
  );
};

const Index = () => {
  const userType = Taro.getCurrentInstance().router.params.type; // 第一张图片的本地路径

  const [userInfo, setUserInfo] = useState({
    avatar: Head,
    nickname: "",
    freeQuota: 5,
    totalQuota: "50",
    userId: "12345678",
  });
  const [data, setData] = useState({});

  const getUserProfile = () => {
    Taro.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别",
      success: (res) => {
        const { avatarUrl, nickName } = res.userInfo;
        setUserInfo((prev) => ({
          ...prev,
          avatar: avatarUrl,
          nickname: nickName,
        }));
      },
      fail: (err) => {
        console.error("获取用户信息失败:", err);
      },
    });
  };

  const onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    setUserInfo((prev) => ({
      ...prev,
      avatar: avatarUrl,
    }));
  };

  const checkAuthorization = () => {
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserProfile 获取头像昵称
          getUserProfile();
        } else {
          // 未授权，主动请求用户授权
          Taro.authorize({
            scope: "scope.userInfo",
            success: () => {
              getUserProfile();
            },
            fail: () => {
              // 用户拒绝授权，引导用户手动授权
              Taro.showModal({
                title: "授权提示",
                content:
                  "需要获取您的用户信息以完善个人资料，请前往设置页面授权。",
                showCancel: false,
                success: () => {
                  Taro.openSetting();
                },
              });
            },
          });
        }
      },
    });
  };

  useEffect(() => {}, []);
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
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
        userId={data.openid}
        onChooseAvatar={onChooseAvatar}
        userType={userType}
        endTime={data.end_time}
      />
    </View>
  );
};

export default Index;
