import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";
const app = getApp();
const imgs = [
  {
    title: "美团外卖",
    img: "meituan.png",
  },
  {
    title: "饿了么外卖",
    img: "elm.png",
  },
  {
    title: "电影",
    img: "dianying.png",
  },
  {
    title: "滴滴打车",
    img: "didi.png",
  },
  {
    title: "电费",
    img: "dianfei.png",
  },
  {
    title: "话费",
    img: "huafei.jpg",
  },
];
const prefix = "https://gitee.com/jasonstory/fonts/raw/master/hongbao/";
const QRCodePage = () => {
  const config = app.$app.globalData.config;
  const downloadVideo = (imageUrl) => {
    console.log("imageUrl: ", imageUrl);
    wx.showLoading({
      title: "保存中...",
    });
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        // 3. 保存图片到相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "保存成功",
              icon: "success",
            });
          },
        });
      },
      complete: function () {
        wx.hideLoading();
      },
    });
  };
  return (
    <View className="qr-code-page">
      <View className="qr-code-container">
        {imgs.map((item, index) => (
          <View key={item.img} className="qr-code-item">
            <Image
              src={prefix + item.img}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{
                width: "calc(45vw)",
                height: "calc(45vw)",
                margin: "10px 0",
              }}
            />
            <View>{item.title}</View>
            <Button
              onClick={() => downloadVideo(prefix + item.img)}
              style={{
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "0 10px",
                fontSize: "26rpx",
                marginTop: "10px",
                marginBottom: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              保存本地 扫码领取
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QRCodePage;
