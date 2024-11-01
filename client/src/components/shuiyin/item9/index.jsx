import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { formatTextWithLineLimit } from "../../utils";
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
}) => {
  return (
    <View className="item9-wrapper" key={"item-6"}>
      <View className="item9-time-box item9-flex">
        <View className="item9-time">{`${hours}:${minutes}`}</View>
        <View className="item9-line"></View>
        <View className="item9-date-box item9-flex">
          <View className="item9-date">
            <View>{`${year}-${month}-${day}`}</View>
          </View>
          <View className="item9-weather">
            <Text>{`${weekly} ${weather}`}℃</Text>
          </View>
        </View>
      </View>
      <View
        className="item9-location"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(locationName, 30, 2),
        }}
      ></View>
    </View>
  );
};

export default Index;
