import React, { useState, useEffect } from "react";
import { View, Image, Ad, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";

import Head from "../../images/head.jpg";
import "./index.scss";
const UserInfo = ({ userType,price }) => {
  return (
    <View className="user-info">
      <View className="user-details">
        <View>
          <Text style={{ fontWeight: "bold" }}>普通会员</Text>
          ，每月{price.month}元，包括以下特权:{" "}
        </View>
        <View>• 每天、每月不限量生成水印图片</View>
        <View>• 生成高清水印图片</View>
        <View>• 去掉除封面广告之外的一切广告</View>
      </View>

      <View style={{ marginTop: "20px", width: "100%" }}>
        <Button
          type="primary"
          size="mini"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/img/index",
            });
          }}
        >
          图片对比
        </Button>
      </View>
      <View className="user-details" style={{ marginTop: "20px" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>高级会员</Text>， 每月{price.svip}元，
          包括普通会员的所有权益以及解锁所有会员水印
        </View>
      </View>
      <View className="user-details" style={{ marginTop: "20px" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>超级会员</Text>， 一次性{price.never}元，
          永久使用，包括普通会员的所有权益以及解锁所有会员水印
        </View>
      </View>
      <View
        className="user-details"
        style={{ marginTop: "20px", fontWeight: "bold" }}
      >
        定制水印需求可以咨询客服
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
      {userType === "default" && (
        // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
        // wxml文件
        <ad
          unit-id="adunit-a6a297a8f2347f9d"
          ad-type="video"
          ad-theme="white"
        ></ad>
      )}
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
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });

  const [price, setPrice] = useState(false);

  useEffect(() => {
    Taro.cloud.callFunction({
      name: "getPrice",
      success: function (res) {
        setPrice(res.result.data);
      },
    });
  }, []);
  return (
    <View className="index">
      <UserInfo userType={userType} price={price} />
    </View>
  );
};

export default Index;
