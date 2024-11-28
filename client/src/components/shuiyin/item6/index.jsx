import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
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
      className="item6-wrapper"
      key={"item-6"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item6-time-box item6-flex">
        <View className="item6-time">
          <Text>
            <Text>{`${time.hours?.slice(0, 1)}`}</Text>
            <Text>{`${time.hours?.slice(1)}:`}</Text>
            <Text>{`${time.minutes?.slice(0, 1)}`}</Text>
            <Text>{`${time.minutes?.slice(1)}`}</Text>
          </Text>
          <Text className="item-6-top-time">
            <Text className="green">{`${time.hours?.slice(0, 1)}`}</Text>
            <Text>{`${time.hours?.slice(1)}:`}</Text>
            <Text>{`${time.minutes?.slice(0, 1)}`}</Text>
            <Text className="blue">{`${time.minutes?.slice(1)}`}</Text>
          </Text>
        </View>
        <View className="item6-line"></View>
        <View className="item6-date-box item6-flex">
          <View className="item6-date">
            <View>{`${time.year}-${time.month}-${time.day}`}</View>
          </View>
          <View className="item6-weather">
            <Text>
              {getWeekdayCN(`${time.year}-${time.month}-${time.day}`)}{" "}
              {"  " + getEditItem(editLabel, "tianqi").value} ℃
            </Text>
          </View>
        </View>
      </View>
      <View
        className="item6-location"
        dangerouslySetInnerHTML={{
          __html: formatTextWithLineLimit(
            getEditItem(editLabel, "didian").value || "",
            20,
            3
          ),
        }}
      ></View>
      {getEditItem(editLabel, "jingdu").visible &&
      getEditItem(editLabel, "weidu").visible ? (
        <View className="ite6-jingweidu">{`经纬度：${
          getEditItem(editLabel, "weidu").value
        }，${getEditItem(editLabel, "jingdu").value}`}</View>
      ) : null}
      {getEditItem(editLabel, "beizhu").visible && (
        <View className="item6-remark item6-flex">
          <View
            className="item6-remark-text"
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineLimit(
                getEditItem(editLabel, "beizhu").value ||
                  getEditItem(editLabel, "beizhu").title,
                20,
                1
              ),
            }}
          ></View>
        </View>
      )}
    </View>
  );
};

export default Index;
