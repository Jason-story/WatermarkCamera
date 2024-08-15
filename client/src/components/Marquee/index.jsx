import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { appConfigs } from "../../appConfig.js";

let cloud = "";
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const getCloud = async () => {
  const config = appConfigs[appid] || appConfigs.defaultApp;
  if (config.type === "shared") {
    cloud = await new Taro.cloud.Cloud({
      resourceAppid: config.resourceAppid,
      resourceEnv: config.resourceEnv,
    });
    await cloud.init();
  } else {
    cloud = await Taro.cloud.init({
      env: config.env,
    });
  }
  return cloud;
};

const Marquee = ({}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [text, setText] = useState(false);

  useEffect(() => {
    // 获取窗口宽度
    const res = Taro.getSystemInfoSync();
    setWindowWidth(res.windowWidth);
    // 是否滚动DD字幕
    const getDD = async () => {
      await getCloud();
      cloud.callFunction({
        name: "getDD",
        success: function (res) {
          setText(res.result.data);
        },
      });
    };
    getDD();
  }, []);

  return (
    <View className="marquee-container">
      {text.open && <View className="marquee-text">{text.text}</View>}
    </View>
  );
};

export default Marquee;
