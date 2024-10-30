import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import { formatTextWithLineLimit } from "../../unitls";
import "./index.scss";

const Index = ({ hours, minutes, locationName, weekly, day, month, year }) => {
  return (
    <View className="item2-wrapper">
      {/* <View className="item2-badage">
        <Image src={Icon1} ></Image>
      </View> */}
      <View className="item2-text-box flex">
        {/* 黄线 */}
        <View className="item2-line"></View>
        {/* 日期地址 */}
        <View className="item2-add-date flex">
          <View className="item2-location">
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  "吉林省长春市朝阳区永昌街道永昌街道永昌街道永昌街道",
                  20,
                  3
                ),
              }}
            ></View>
          </View>
          <View className="item2-date">2024.10.03 星期二</View>
        </View>
      </View>
      {/* <View className="item1-time">
        <Text>
          {hours}:{minutes}
        </Text>
      </View>
      <View className="flex item1-addr-wrap">
        <View className="item1-date flex">
          <Text>
            {year}.{month}.{day}
          </Text>
          <Text className="item1-week">{weekly}</Text>
        </View>
        <Image src={Icon1}></Image>
        <View
          className="item1-location"
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(locationName, 15, 3),
          }}
        ></View>
      </View> */}
    </View>
  );
};

export default Index;
