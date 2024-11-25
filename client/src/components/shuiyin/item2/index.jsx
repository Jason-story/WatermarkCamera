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
  maskScale,
  editLabel,
}) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");
  return (
    <View
      className="item2-wrapper"
      key={"item-2"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item2-badage">
        <Image src={Icon1}></Image>
        <View className="item2-time-box">{`${time.hours}:${time.minutes}`}</View>
      </View>
      <View className="item2-date">
        <Text>{`${time.year}/${time.month}/${time.day}`}</Text>
        {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}
      </View>
      <View className="item2-text-box flex">
        {/* 日期地址 */}
        <View className="item2-add-date flex">
          <View className="item2-location">
            <View className="item2-dot"></View>
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  getEditItem(editLabel, "didian").value || "",
                  24,
                  2
                ),
              }}
            ></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
