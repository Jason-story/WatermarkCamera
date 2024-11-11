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
  maskScale,

  remark,
  latitude,
  longitude,
}) => {
  return (
    <View className="item7-wrapper" key={"item-7"}
    style={{
      transform: `scale(${maskScale})`,
    }}>
      <View className="item7-box">
        {longitude && (
          <View className="item7-label-item">
            <View className="item7-label-title">经度:</View>
            <View>{`${longitude}`}</View>
          </View>
        )}
        {latitude && (
          <View className="item7-label-item">
            <View className="item7-label-title">纬度:</View>
            <View>{`${latitude}`}</View>
          </View>
        )}
        <View className="item7-label-item">
          <View className="item7-label-title">时间:</View>
          <View>{`${year}-${month}-${day} ${hours}:${minutes}`}</View>
        </View>
        <View className="item7-label-item">
          <View className="item7-label-title">天气:</View>
          <Text>{`${weather}`}℃</Text>
        </View>
        <View className="item7-label-item">
          <View className="item7-label-title">地点:</View>
          <View
            className="item7-location"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(locationName, 20, 3),
            }}
          ></View>
        </View>
        {remark.length > 0 && (
          <View className="item7-label-item">
            <View className="item7-label-title">备注:</View>
            <View
              className="item7-location"
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(remark, 10, 2),
              }}
            ></View>
          </View>
        )}
      </View>
      <Image src={Cover}></Image>
    </View>
  );
};

export default Index;
