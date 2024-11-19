import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import {
  formatTextWithLineLimit,
  getWeekdayCN,
  parseDateString,
  getEditItem,
} from "../../utils";
import "./index.scss";

const Index = ({
  hours,
  maskScale,
  minutes,
  locationName,
  weekly,
  day,
  month,
  year,
  editLabel
}) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");

  return (
    <View
      className="item4-wrapper"
      key={"item-4"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item4-badage">
        <View className="item4-daka-text">打卡记录</View>
        <View className="item4-time">
          {hours}
          <Text>：</Text>
          {minutes}
        </View>
      </View>
      <View className="item4-date">
        <Text>{`${time.year}.${time.month}.${time.day}`}</Text>
        {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}
      </View>
      <View
        className="item4-location"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(
            getEditItem(editLabel, "didian").value || "",
            20,
            3
          ),
        }}
      ></View>
      <Image
        src={Icon1}
        style={{
          width: 165,
          height: 17,
          opacity: 0.7,
        }}
      ></Image>
    </View>
  );
};

export default Index;
