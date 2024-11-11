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
  maskScale,

  month,
  year,
  remark,
  latitude,
  longitude,
}) => {
  return (
    <View className="item6-wrapper" key={"item-6"}
    style={{
      transform: `scale(${maskScale})`,
    }}>
      <View className="item6-time-box item6-flex">
        <View className="item6-time">{`${hours}:${minutes}`}</View>
        <View className="item6-line"></View>
        <View className="item6-date-box item6-flex">
          <View className="item6-date">
            <View>{`${year}-${month}-${day}`}</View>
          </View>
          <View className="item6-weather">
            <Text>{`${weekly} ${weather}`}℃</Text>
          </View>
        </View>
      </View>
      <View
        className="item6-location"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(locationName, 20, 3),
        }}
      ></View>
      {longitude == 0 || latitude == 0 ? null : (
        <View className="ite6-jingweidu">{`经纬度：${longitude}，${latitude}`}</View>
      )}
      {remark.length > 0 && (
        <View className="item6-remark item6-flex">
          <View
            className="item6-remark-text"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(remark, 20, 1),
            }}
          ></View>
        </View>
      )}
    </View>
  );
};

export default Index;
