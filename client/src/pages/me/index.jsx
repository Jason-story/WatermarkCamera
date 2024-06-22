import React, { useState, useEffect } from "react";
import { View, Image, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Head from "../../images/head.jpg";
import "./index.scss";
const UserInfo = ({
  avatar,
  nickname,
  freeQuota,
  totalQuota,
  userId,
  onChooseAvatar,
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
  return (
    <View className="user-info">
      <View className="user-details">
      <View className="user-item">
          <Text className="label">我的等级</Text>
          <Text
            className="value"
          >
            {userType === "default" && "普通用户"}
            {userType === "month" && "包月会员"}
            {userType === "buyout" && "终身会员"}
            {userType === "customize_month" && "定制包月会员"}
          </Text>
        </View>
        <View className="user-item">
          <Text className="label">我的ID</Text>
          <Text
            className="value"
            onClick={() => {
              onCopyText(userId);
            }}
          >
            {userId || "xxx"}
          </Text>
        </View>
        <View className="user-item">
          <Text className="label">额度</Text>
          <Text className="value">
            {userType !== "default" ? "无限" : (totalQuota || "0") + "/50"}
          </Text>
        </View>
      </View>
      <View style={{ width: "100%", marginTop: "50px" }}>
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
    </View>
  );
};

const Index = () => {
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

  useEffect(() => {
    Taro.cloud.callFunction({
      name: "addUser",
      success: function (res) {
        setData(res.result.data);
      },
    });

    checkAuthorization();
  }, []);
  console.log("data: ", data);

  return (
    <View className="index">
      <UserInfo
        avatar={userInfo.avatar}
        nickname={userInfo.nickname}
        freeQuota={userInfo.freeQuota}
        totalQuota={data.todayUsageCount}
        userId={data.openid}
        onChooseAvatar={onChooseAvatar}
        userType={data.type}
      />
    </View>
  );
};

export default Index;