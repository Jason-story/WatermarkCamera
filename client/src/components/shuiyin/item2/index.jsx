import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import { formatTextWithLineLimit } from "../../unitls";
import "./index.scss";

const Index = ({
  hours,
  minutes,
  dakaName,
  locationName,
  weekly,
  day,
  month,
  year,
}) => {

  return (
    <View className="item2-wrapper">
      <View className="item2-badage">
        <Image src={Icon1}></Image>
        <Text className="item2-dakaText">{dakaName}</Text>
        <View className="item2-time-box">

        <Text className="item2-time item2-time-base">{`${hours}:${minutes}`}</Text>
        <Text className="item2-time item2-time-cover">{`${hours}:${minutes}`}</Text>
        </View>
      </View>
      <View className="item2-text-box flex">
        {/* 黄线 */}
        <View className="item2-line"></View>
        {/* 日期地址 */}
        <View className="item2-add-date flex">
          <View className="item2-location">
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(locationName, 20, 3),
              }}
            ></View>
          </View>
          <View className="item2-date">
            <Text>{`${year}.${month}.${day}`}</Text>
            {`${weekly}`}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
