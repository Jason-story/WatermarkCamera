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
  editLabel,
}) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");

  return (
    <View className="item9-wrapper" key={"item-6"}>
      <View className="item9-time-box item9-flex">
        <View className="item9-time">{`${time.hours}:${time.minutes}`}</View>
        <View className="item9-line"></View>
        <View className="item9-date-box item9-flex">
          <View className="item9-date">
            <View>{`${time.year}-${time.month}-${time.day}`}</View>
          </View>
          <View className="item9-weather">
            <Text>
              {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}
              {'    '+getEditItem(editLabel, "tianqi").value} ℃
            </Text>
          </View>
        </View>
      </View>
      <View
        className="item9-location"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(
            getEditItem(editLabel, "didian").value || "",
            30,
            2
          ),
        }}
      ></View>
    </View>
  );
};

export default Index;
