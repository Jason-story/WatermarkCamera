import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const Marquee = ({}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [text, setText] = useState(false);

  useEffect(() => {
    // 获取窗口宽度
    const res = Taro.getSystemInfoSync();
    setWindowWidth(res.windowWidth);

    // 是否滚动DD字幕
    Taro.cloud.callFunction({
      name: "getDD",
      success: function (res) {
        setText(res.result.data.text);
      },
    });
  }, []);

  return (
    <View className="marquee-container">
      <View className="marquee-text">{text}</View>
    </View>
  );
};

export default Marquee;
