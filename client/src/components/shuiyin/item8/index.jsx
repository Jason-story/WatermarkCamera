import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import {
  formatTextWithLineLimit,
  getWeekdayCN,
  parseDateString,
  getEditItem,
} from "../../utils";
import "./index.scss";

const Index = ({ editLabel }) => {
  console.log(
    'getEditItem(editLabel, "fangdaowenzi").value: ',
    getEditItem(editLabel, "fangdaowenzi").value
  );

  return (
    <View className="item8-watermark-container" key={"item-8"}>
      <View className="item8-watermark-wrap">
        {new Array(100).fill(null).map((item, index) => {
          return (
            <Text key={index} class="item8-watermark-text">
              {getEditItem(editLabel, "fangdaowenzi").value}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default Index;
