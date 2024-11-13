import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { formatTextWithLineLimit } from "../../utils";
import "./index.scss";

const Index = ({
  hours,
  minutes,
  title,
  locationName,
  weather,
  weekly,
  day,
  maskScale,
  month,
  year,
  remark,
  gongchengjilu1,
  // shigongquyu,
  // shigongneirong,
  // shigongzerenren,
  // jianlizerenren,
}) => {
  return (
    <View
      className="item5-wrapper"
      key={"item-5"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View
        className="item5-title"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(title, 12, 1),
        }}
      ></View>
      {gongchengjilu1.map((item, index) => (
        <View className="item5-label-item">
          <View className="item5-label-title" key={index}>
            {item.value.split("").map((value1, index1) => (
              <Text key={index1}>
                {value1}
                {/* 如果是最后一个字符，添加冒号 */}
                {index1 === item.value.length - 1 ? ":" : ""}
              </Text>
            ))}
          </View>
          <View>{item.text}</View>
        </View>
      ))}

      {/* <View className="item5-label-item">
        <View className="item5-label-title">拍摄时间:</View>
        <View>{`${year}-${month}-${day} ${hours}:${minutes}`}</View>
      </View>
       */}
      <View className="item5-label-item">
        <View className="item5-label-title">天气:</View>
        <Text>{`${weather}`}℃</Text>
      </View>
      <View className="item5-label-item">
        <View className="item5-label-title">地点:</View>
        <View
          className="item5-location"
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(locationName, 10, 5),
          }}
        ></View>
      </View>
      {remark.length > 0 && (
        <View className="item5-label-item">
          <View className="item5-label-title">备注:</View>
          <View
            className="item5-location"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(remark, 10, 2),
            }}
          ></View>
        </View>
      )}
    </View>
  );
};

export default Index;
