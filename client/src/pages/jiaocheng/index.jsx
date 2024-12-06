import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";
const app = getApp();
const imgs = ["1.png", "2.png", "3.png", "4.png", "5.png"];
const prefix = "https://gitee.com/jasonstory/fonts/raw/master/img/";
const QRCodePage = () => {
  const config = app.$app.globalData.config;

  return (
    <View className="qr-code-page">
      {/* <View className="user-details">
        <View>1. 先点击首页-修改，选择水印</View>
        <View>2. 点击编辑或者直接点击水印</View>
        <View>3. 修改时间、地点、水印名字、打卡标签等信息</View>
        <View>4. 拍照或者相册选择图片</View>
        <View>5. 稍等片刻、图片自动保存</View>
        <View>
          6. 如果是视频水印，请先用手机原相机拍摄一段视频，然后再从相册选择即可
        </View>
      </View> */}
      {/* {!app.$app.globalData.fuckShenHe && (
        <View className="user-details">
          {config.jiaochengtext.map((item, index) => {
            return (
              <View
                key={index}
                style={{ color: index === 2 ? "#f22c3d" : "#000" }}
              >
                • {item}
              </View>
            );
          })}
          <View>
            •
            如果您已经开通会员，好友通过您的分享开通会员，将获得他开通额度的20%（可提现），如果您未开通会员，则只能获得5%
          </View>
        </View>
      )} */}
      <View className="qr-code-container">
        {imgs.map((item, index) => (
          <View key={index} className="qr-code-item">
            <Image
              src={prefix + item}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{
                width: "calc(45vw)",
                height: "calc(45vw * 1.778)",
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
