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
  editLabel,
  setEditLabel,
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
      className="item10-wrapper"
      key={"item10"}
      style={{
        transform: `scale(${maskScale})`,
      }}
    >
      <View className="item10-title">
        <View className="item10-dot"></View>
        <Text
          dangerouslySetInnerHTML={{
            __html: formatTextWithLineLimit(
              gongchengmingcheng[0]?.value || gongchengmingcheng[0]?.title,
              10,
              3
            ),
          }}
        ></Text>
      </View>

      {normalItems.map(
        (item, index) =>
          item.visible && (
            <View className={"item10-label-item"} key={index}>
              <View className="item10-label-title">
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

      <View className="item10-bg-container">
        {bgItems.map((item, index) => {
          return (
            item.visible && (
              <View
                className="item10-label-item item10-label-item-bg"
                key={index}
              >
                <View className="item10-label-title">
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
    </View>
  );
};

export default Index;
