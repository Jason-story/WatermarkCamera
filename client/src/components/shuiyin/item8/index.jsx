import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { formatTextWithLineLimit } from "../../utils";
import "./index.scss";
import Cover from "./cover.png";

const Index = ({
  hours,
  minutes,
  title,
  locationName,
  weather,
  weekly,
  day,
  month,
  year,
  remark,
  latitude,
  longitude,
  fangdaoShuiyin,
}) => {
  return (
    <View className="item8-watermark-container" key={"item-8"}>
      <View className="item8-watermark-wrap">
        {new Array(100).fill(null).map((item, index) => {
          return (
            <Text key={index} class="item8-watermark-text">
              {fangdaoShuiyin}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default Index;
