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
  minutes,
  maskScale,
  locationName,
  weekly,
  day,
  month,
  year,
  editLabel,
}) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");

  return (
    <View
      className="item3-wrapper"
      key={"item-3"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item3-time">
        <Text>
          {time.hours}:{time.minutes}
        </Text>
      </View>
      <View className="flex item3-addr-wrap">
        <View className="item3-date flex">
          <Text>{`${time.year}.${time.month}.${time.day}`}</Text>
          <Text className="item3-week">
            {getWeekdayCN(`${time.year}${time.month}${time.day}`)}
          </Text>
        </View>
        <Image src={Icon1}></Image>
        <View
          className="item3-location"
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(
              getEditItem(editLabel, "didian").value || "",
              15,
              3
            ),
          }}
        ></View>
      </View>
    </View>
  );
};

export default Index;
