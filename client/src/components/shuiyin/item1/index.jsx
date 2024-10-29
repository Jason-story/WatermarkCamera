import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import { formatTextWithLineLimit } from "../../unitls";
import "./index.scss";

const Index = ({ hours, minutes, locationName, weekly, day, month, year }) => {
  return (
    <View className="item1-wrapper">
      <View className="item1-time">
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
      </View>
    </View>
  );
};

export default Index;
