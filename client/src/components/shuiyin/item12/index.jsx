import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./dot.png";
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
      className="item12-wrapper"
      key={"item-3"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item12-time">
        <Text>{time.hours}</Text>
        <Image src={Icon1}></Image>
        <Text>{time.minutes}</Text>
      </View>
      <View className="flex item12-addr-wrap">
        <View className="item12-date flex">
          <Text>{`${time.year}年${time.month}月${time.day}日`}</Text>
          <Text className="item12-week">
            {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}
          </Text>
        </View>
        {/* <Image src={Icon1}></Image> */}
        <View
          className="item12-date flex"
          style={{
            marginTop: "6px",
          }}
        >
          <View
            className="item12-location"
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
    </View>
  );
};

export default Index;
