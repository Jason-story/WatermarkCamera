import React, { useState, useEffect } from "react";
import { View, Image, Ad, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";

import Head from "../../images/head.jpg";
import "./index.scss";
const UserInfo = ({ userType, price = { show: false } }) => {
console.log('price.show: ', price.show);

  return (
    <View className="user-info">
      <View className="user-details" style={{ marginBottom: "40px" }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>会员权益</Text>
        </View>
        <View>• 无限使用次数</View>
        <View>• 高清水印图片</View>
        <View>• 客服支持</View>
        <View>• 去掉除封面广告之外的一切广告</View>
      </View>
      {/* <View style={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}>
        <Button
          type="primary"
          size="mini"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/img/index",
            });
          }}
        >
          高清图片对比
        </Button>
      </View> */}

      {!price.show  ? (
        ""
      ) : (
        <View style={{ width: "100%" }}>
          <View className="user-details">
            <View>
              <Text>一天会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>{price["1day"]}</Text>
              元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>三天会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>
                {price["3days"]}
              </Text>
              元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>包月会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>{price.month}</Text>元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>双月会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>
                {price.twoMonth}
              </Text>
              元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>三月会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>
                {price.threeMonth}
              </Text>
              元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>半年会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>
                {price.halfYearMonth}
              </Text>
              元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>包年会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>{price.year}</Text>元
            </View>
          </View>
          <View className="user-details">
            <View>
              <Text>永久会员</Text>，
              <Text style={{ color: "rgb(233, 60, 70)" }}>{price.never}</Text>元
            </View>
          </View>
          <View
            className="user-details"
            style={{ marginTop: "20px", fontWeight: "bold" }}
          >
            需要定制水印可以咨询客服
          </View>
        </View>
      )}
      <View style={{ width: "100%", marginTop: "50px" }}>
        {!price.show ? (
          ""
        ) : (
          <View style={{ marginBottom: "10px" }}>开通会员请联系客服</View>
        )}
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
          开通会员
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
