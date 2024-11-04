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
}) => {
  return (
    <View className="item2-wrapper"  key={"item-2"}>
      <View className="item2-badage">
        <Image src={Icon1}></Image>
        <View className="item2-time-box">{`${hours}:${minutes}`}</View>
      </View>
      <View className="item2-date">
        <Text>{`${year}/${month}/${day}`}</Text>
        {`${weekly}`}
      </View>
      <View className="item2-text-box flex">
        {/* 日期地址 */}
        <View className="item2-add-date flex">
          <View className="item2-location">
            <View className="item2-dot"></View>
            <View
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(locationName, 24, 2),
              }}
            ></View>

          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
