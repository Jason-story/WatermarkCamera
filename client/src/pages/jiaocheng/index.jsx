import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";
const app = getApp();

const QRCodePage = () => {
  const config = app.$app.globalData.config;
  return (
    <View className="qr-code-page">
      <View className="user-details">
        {config.jiaochengtext.map((item, index) => {
          return <View key={index}>• {item}</View>;
        })}
        <View style={{ color: "#f22c3d" }}>
          • 邀请好友开通会员，你将获得他开通额度的20%（可提现）
        </View>
      </View>
      <View className="qr-code-container">
        {config.jiaocheng_image.map((item, index) => (
          <View key={index} className="qr-code-item">
            <Image
              src={item}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{
                width: "calc(45vw)",
                height: "calc(60vw)",
                margin: "10px 0",
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default QRCodePage;
