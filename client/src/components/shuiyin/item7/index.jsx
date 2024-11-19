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
  editLabel,
}) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");

  return (
    <View
      className="item7-wrapper"
      key={"item-7"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item7-box">
        {getEditItem(editLabel, "jingdu").visible && (
          <View className="item7-label-item">
            <View className="item7-label-title">经度:</View>
            <View>{`${getEditItem(editLabel, "jingdu").value}`}</View>
          </View>
        )}
        {getEditItem(editLabel, "weidu").visible && (
          <View className="item7-label-item">
            <View className="item7-label-title">纬度:</View>
            <View>{`${getEditItem(editLabel, "jingdu").value}`}</View>
          </View>
        )}
        <View className="item7-label-item">
          <View className="item7-label-title">时间:</View>
          <View>{`${time.year}-${time.month}-${time.day} ${time.hours}:${time.minutes}`}</View>
        </View>
        {getEditItem(editLabel, "tianqi").visible && (
          <View className="item7-label-item">
            <View className="item7-label-title">天气:</View>
            <Text>{`${getEditItem(editLabel, "tianqi").value}`}℃</Text>
          </View>
        )}
        <View className="item7-label-item">
          <View className="item7-label-title">地点:</View>
          <View
            className="item7-location"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(
                getEditItem(editLabel, "didian").value || "",
                20,
                3
              ),
            }}
          ></View>
        </View>
        {getEditItem(editLabel, "beizhu").visible && (
          <View className="item7-label-item">
            <View className="item7-label-title">备注:</View>
            <View
              className="item7-location"
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  getEditItem(editLabel, "beizhu").value ||
                  getEditItem(editLabel, "beizhu").title,
                  10,
                  2
                ),
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
