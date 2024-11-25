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

const Index = ({ maskScale, editLabel }) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");
  return (
    <View
      className="item1-wrapper"
      key={"item-1"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item1-badage">
        <Image src={Icon1}></Image>
        <Text className="item1-dakaText">
          {getEditItem(editLabel, "daka").value}
        </Text>
        <View className="item1-time-box">
          <Text className="item1-time item1-time-base">{`${time.hours}:${time.minutes}`}</Text>
          <Text className="item1-time item1-time-cover">{`${time.hours}:${time.minutes}`}</Text>
        </View>
      </View>
      <View className="item1-text-box flex">
        {/* 黄线 */}
        <View className="item1-line"></View>
        {/* 日期地址 */}
        <View className="item1-add-date flex">
          <View className="item1-location">
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  getEditItem(editLabel, "didian").value || "",
                  20,
                  3
                ),
              }}
            ></View>
          </View>
          <View className="item1-date">
            <Text>{`${time.year}.${time.month}.${time.day}`}</Text>
            {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}
          </View>
        </View>
      </View>
      {/* 备注 */}
      {getEditItem(editLabel, "beizhu").visible && (
        <View className="item1-text-box item1-remark-box flex">
          <View className="item1-location">
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  getEditItem(editLabel, "beizhu").value ||
                    getEditItem(editLabel, "beizhu").title,
                  20,
                  1
                ),
              }}
            ></View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Index;
