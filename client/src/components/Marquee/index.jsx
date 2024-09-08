import Taro from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
const app = Taro.getApp();
const Marquee = () => {
  const text = app.$app.globalData.config;
  return (
    <View className="marquee-container">
      {text.open && <View className="marquee-text">{text.text}</View>}
    </View>
  );
};

export default Marquee;
