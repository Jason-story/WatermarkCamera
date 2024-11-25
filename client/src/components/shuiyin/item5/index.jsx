import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { formatTextWithLineLimit } from "../../utils";
import "./index.scss";

const Index = ({
  maskScale,
  editLabel,
}) => {
  const bgItems = editLabel.filter((item) => item.bg);
  const normalItems = editLabel.filter(
    (item) =>
      !item.bg &&
      item.key !== "gongchengmingcheng" &&
      item.key !== "shuiyinmingcheng" &&
      item.key !== "yanzhengmingcheng"
  );
  const gongchengmingcheng = editLabel.filter(
    (item) => item.key == "gongchengmingcheng"
  );

  return (
    <View
      className="item5-wrapper"
      key={"item5"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item5-title">
        <View className="item5-dot"></View>
        <Text
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(
              gongchengmingcheng[0].value || gongchengmingcheng[0].title,
              10,
              3
            ),
          }}
        ></Text>
      </View>

      {normalItems.map(
        (item, index) =>
          item.visible && (
            <View className={"item5-label-item"} key={index}>
              <View className="item5-label-title">
                {item.title.split("").map((value1, index1) => (
                  <Text key={index1}>
                    {value1}
                    {/* 如果是最后一个字符，添加冒号 */}
                    {index1 === item.title.length - 1 ? ":" : ""}
                  </Text>
                ))}
              </View>
              <View>
                {item.key === "tianqi" ? item.value + "℃" : item.value}
              </View>
            </View>
          )
      )}

      {/* <View className="item5-bg-container">
        {bgItems.map((item, index) => {
          return (
            item.visible && (
              <View
                className="item5-label-item item5-label-item-bg"
                key={index}
              >
                <View className="item5-label-title">
                  {item.title.split("").map((value1, index1) => (
                    <Text key={index1}>
                      {value1}
                      {index1 === item.title.length - 1 ? ":" : ""}
                    </Text>
                  ))}
                </View>
                <View>{item.value}</View>
              </View>
            )
          );
        })}
      </View> */}
    </View>
  );
};

export default Index;
