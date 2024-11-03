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
    <View className="item5-wrapper" key={"item-5"}>
      <View
        className="item5-title"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(title, 12, 1),
        }}
      ></View>
      <View className="item5-label-item">
        <View className="item5-label-title">时间:</View>
        <View>{`${year}-${month}-${day} ${hours}:${minutes}`}</View>
      </View>
      <View className="item5-label-item">
        <View className="item5-label-title">天气:</View>
        <Text>{`${weather}`}℃</Text>
      </View>
      <View className="item5-label-item">
        <View className="item5-label-title">地点:</View>
        <View
          className="item5-location"
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(locationName, 10, 5),
          }}
        ></View>
      </View>
      {remark.length > 0 && (
        <View className="item5-label-item">
          <View className="item5-label-title">备注:</View>
          <View
            className="item5-location"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(remark, 10, 2),
            }}
          ></View>
        </View>
      )}
    </View>
  );
};

export default Index;
