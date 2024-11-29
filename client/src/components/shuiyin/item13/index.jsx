import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { formatTextWithLineLimit, getEditItem } from "../../utils";
import "./index.scss";

const Index = ({ maskScale, editLabel }) => {
  const bgItems = editLabel.filter((item) => item.bg && item.visible);
  const normalItems = editLabel.filter(
    (item) =>
      !item.bg &&
      item.key !== "gongchengmingcheng" &&
      item.key !== "shuiyinmingcheng" &&
      item.key !== "yanzhengmingcheng"
  );

  return (
    <View
      className="item13-wrapper"
      key={"item13"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item13-title">
        <Text
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(
              getEditItem(editLabel, "gongchengmingcheng").value ||
                getEditItem(editLabel, "gongchengmingcheng").title,
              10,
              3
            ),
          }}
        ></Text>
      </View>

      {normalItems.map(
        (item, index) =>
          item.visible && (
            <View className={"item13-label-item"} key={index}>
              <View className="item13-label-title">
                {item.title.split("").map((value1, index1) => (
                  <Text key={index1}>
                    {value1}
                    {/* 如果是最后一个字符，添加冒号 */}
                    {index1 === item.title.length - 1 ? ":" : ""}
                  </Text>
                ))}
              </View>
              <View>
                {item.key === "tianqi" ? item?.value + "℃" : item?.value}
              </View>
            </View>
          )
      )}

      {bgItems.length > 0 && (
        <View className="item13-bg-container">
          {bgItems.map((item, index) => {
            return (
              item.visible && (
                <View
                  className="item13-label-item item13-label-item-bg"
                  key={index}
                >
                  <View className="item13-label-title">
                    {item.title.split("").map((value1, index1) => (
                      <Text key={index1}>
                        {value1}
                        {index1 === item.title.length - 1 ? ":" : ""}
                      </Text>
                    ))}
                  </View>
                  <View>{item?.value}</View>
                </View>
              )
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Index;
