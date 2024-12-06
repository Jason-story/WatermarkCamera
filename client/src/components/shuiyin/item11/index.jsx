import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import {
  formatTextWithLineLimit,
  parseDateString,
  getEditItem,
} from "../../utils";
import "./index.scss";

const Index = ({ maskScale, editLabel }) => {
  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");
  const jingdu = getEditItem(editLabel, "jingdu");
  const weidu = getEditItem(editLabel, "weidu");

  return (
    <View
      className="item11-wrapper"
      key={"item11"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className={"item11-label-item item1-biaoti"}>
        <View
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(
              getEditItem(editLabel, "biaoti").value,
              10,
              1
            ),
          }}
        ></View>
      </View>
      <View className="item11-border-box">
        <View className={"item11-label-item"}>
          <View className="item11-label-title">
            <Text>时</Text> <Text>间:</Text>
          </View>
          <View>
            {`${time.year}.${time.month}.${time.day}  ${time.hours}:${time.minutes}`}
          </View>
        </View>
        {getEditItem(editLabel, "tianqi").visible && (
          <View className={"item11-label-item"}>
            <View className="item11-label-title">
              <Text>天</Text> <Text>气:</Text>
            </View>
            <View >
              <Text
                dangerouslySetInnerHTML={{
                  __html: formatTextWithLineLimit(
                    getEditItem(editLabel, "tianqi").value + " ℃",
                    30,
                    2
                  ),
                }}
              ></Text>
            </View>
          </View>
        )}
        <View className={"item11-label-item"}>
          <View className="item11-label-title">
            <Text>地</Text> <Text>点:</Text>
          </View>
          <View className="item11-value">
            <Text
              dangerouslySetInnerHTML={{
                __html: formatTextWithLineLimit(
                  getEditItem(editLabel, "didian").value || "",
                  30,
                  2
                ),
              }}
            ></Text>
          </View>
        </View>{" "}
        {weidu.visible && jingdu.visible && (
          <View className={"item11-label-item no-margin-bottom"}>
            <View className="item11-label-title">
              <Text>经纬度:</Text>
            </View>
            <View>{`${weidu.value}°E,${jingdu.value}°N`}</View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;
