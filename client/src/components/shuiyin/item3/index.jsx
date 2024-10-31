import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import { formatTextWithLineLimit } from "../../utils";
import "./index.scss";

const Index = ({ hours, minutes, locationName, weekly, day, month, year }) => {
  return (
    <View className="item3-wrapper">
      <View className="item3-time">
        <Text>
          {hours}:{minutes}
        </Text>
      </View>
      <View className="flex item3-addr-wrap">
        <View className="item3-date flex">
          <Text>
            {year}.{month}.{day}
          </Text>
          <Text className="item3-week">{weekly}</Text>
        </View>
        <Image src={Icon1}></Image>
        <View
          className="item3-location"
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(locationName, 15, 3),
          }}
        ></View>
      </View>
    </View>
  );
};

export default Index;
