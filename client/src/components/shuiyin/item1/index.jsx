import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Icon1 from "./icon-1.png";
import { formatTextWithLineLimit } from "../../utils";
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
  remark,
}) => {
  return (
    <View className="item1-wrapper">
      <View className="item1-badage">
        <Image src={Icon1}></Image>
        <Text className="item1-dakaText">{dakaName}</Text>
        <View className="item1-time-box">
          <Text className="item1-time item1-time-base">{`${hours}:${minutes}`}</Text>
          <Text className="item1-time item1-time-cover">{`${hours}:${minutes}`}</Text>
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
                __html: formatTextWithLineLimit(locationName, 20, 3),
              }}
            ></View>
          </View>
          <View className="item1-date">
            <Text>{`${year}.${month}.${day}`}</Text>
            {`${weekly}`}
          </View>
        </View>
      </View>
      {/* 备注 */}
      {remark.length > 0 && (
        <View className="item1-text-box item1-remark-box flex">
          <View className="item1-location">
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(remark, 20, 1),
              }}
            ></View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Index;
