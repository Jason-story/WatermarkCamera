import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Picker,
  Input,
  Switch,
} from "@tarojs/components";
import {
  formatTextWithLineLimit,
  getWeekdayCN,
  parseDateString,
  getEditItem,
} from "../../components/utils";
import Taro from "@tarojs/taro";
import CustomSlider from "../../components/CustomSlider";
import { AtFloatLayout } from "taro-ui";
import ShuiyinDoms from "../../components/shuiyin";

const WatermarkPopup = ({
  showFloatLayout,
  edit,
  currentShuiyinIndex,
  setShowFloatLayout,
  setEdit,
  updateShuiyinIndex,

  // 水印保存配置
  isShuiyinSaved,
  saveIsShuiyinSaved,
  // 用户信息
  userInfo,
  // 水印右下角防伪信息
  showTrueCode,
  setShowTrueCode,
  shuiyinxiangjiName,
  setShuiyinxiangjiName,
  // 左下角验证标记
  showHasCheck,
  setShowHasCheck,
  setMaskScale,
  editLabel,
  setEditLabel,
}) => {
  function debounce(func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }

  const time = parseDateString(getEditItem(editLabel, "shijian")?.value || "");
  const scrollViewRef = useRef(null);
  const [height, setHeight] = useState("100%");
  const handleBlur = () => {
    setHeight("100%");
    scrollViewRef.current.scrollTop = 0;
  };
  const handleFocus = (e) => {
    const query = Taro.createSelectorQuery();
    const elementId = e.mpEvent.currentTarget.id;
    if (!elementId) {
      return;
    }
    setHeight("1000vh");

    // 延迟执行滚动,确保键盘弹出后再滚动
    setTimeout(() => {
      query
        .select(`#${elementId}`)
        .boundingClientRect()
        .select(".layout-body__content")
        .fields({
          rect: true,
          scrollOffset: true, // 这里改用 fields 来获取滚动位置
        })
        .exec((res) => {
          const childRect = res[0];
          const parentInfo = res[1]; // 包含了位置和滚动信息

          // 计算目标滚动位置
          const targetScrollTop =
            childRect.top - parentInfo.top + parentInfo.scrollTop;

          // 使用 Taro API 设置滚动位置
          Taro.createSelectorQuery()
            .select(".layout-body__content")
            .node((res) => {
              const scrollView = res.node;
              if (scrollView && scrollView.scrollTo) {
                scrollView.scrollTo({
                  top: targetScrollTop - 10,
                  behavior: "smooth",
                });
              } else {
                // 降级方案：直接设置 scrollTop
                scrollViewRef.current.scrollTop = targetScrollTop - 10;
              }
            })
            .exec();
        });
    }, 100);
  };
  const changeEditLabelItem = (index, value, type, valueType) => {
    const newEditLabel = [...editLabel];

    if (type === "title") {
      newEditLabel[index] = { ...newEditLabel[index], title: value };
    } else if (type === "value") {
      if (valueType === "riqi" || valueType === "shijian") {
        // 获取当前值以保留日期或时间部分
        const currentValue = newEditLabel[index].value || "";
        let [datePart, timePart] = currentValue.split(" ");

        // 根据 valueType 更新日期或时间部分
        if (valueType === "riqi") {
          datePart = value;
        } else if (valueType === "shijian") {
          timePart = value;
        }

        // 将日期和时间组合在一起
        const combinedValue =
          datePart && timePart
            ? `${datePart} ${timePart}`
            : datePart || timePart;

        newEditLabel[index] = {
          ...newEditLabel[index],
          value: combinedValue,
        };
      } else {
        newEditLabel[index] = { ...newEditLabel[index], value: value };
      }
    } else {
      newEditLabel[index] = { ...newEditLabel[index], [type]: value };
    }

    setEditLabel(newEditLabel);
  };
  return (
    <AtFloatLayout
      isOpened={showFloatLayout}
      overlay={false}
      closeable={true}
      style={{ height: "100%", flexShrink: "0" }}
      title="水印选择、修改"
      onClose={() => {
        setEdit(false);
        setShowFloatLayout(!showFloatLayout);
      }}
    >
      <View>
        {!edit ? (
          // 水印选择界面
          <View
            className="shuiyin-list"
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
              height: "100%",
              overflow: "auto",
              flex: 1,
            }}
          >
            {ShuiyinDoms.map((item, index) => (
              <View key={index}>
                <View className="shuiyin-item">
                  <View
                    className="shuiyin-item-img"
                    style={{
                      width: "100%",
                      padding: 0,
                    }}
                    onClick={() => {
                      updateShuiyinIndex(index);
                    }}
                  >
                    <View
                      className="shuiyin-item-img"
                      style={{
                        width: "100%",
                        padding: 0,
                      }}
                    >
                      <Image mode="aspectFit" src={item.options.cover}></Image>
                      {item.options.vip && (
                        <View className="vip-arrow">半年及以上会员专属</View>
                      )}
                    </View>
                  </View>
                  {currentShuiyinIndex == index && (
                    <View
                      className="shuiyin-item-cover"
                      onTouchStart={async () => {
                        await updateShuiyinIndex(index);
                        setEdit(true);
                      }}
                    >
                      <Button>编辑</Button>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          // 编辑界面
          <View
            className="edit-box"
            style={{
              height,
            }}
          >
            {/* 保存设置区域 */}
            <View className="shantui-btns">
              <View
                style={{
                  color: "#151515",
                  marginRight: "10px",
                }}
              >
                保存地点、水印名称等设置，下次使用时无需再次修改
              </View>
              <Switch
                style={{ transform: "scale(0.7)" }}
                checked={isShuiyinSaved}
                onChange={(e) => {
                  saveIsShuiyinSaved(e.detail.value);
                }}
              />
            </View>

            <View>
              {ShuiyinDoms[currentShuiyinIndex].options?.maskScale && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>水印大小： </Text>
                    <CustomSlider
                      min={0.75}
                      max={1.25}
                      step={0.01}
                      onChange={(value) => {
                        setMaskScale(value);
                      }}
                    />
                  </View>
                </View>
              )}
              {editLabel.map((item, index) => {
                return (
                  <View className="edit-item" key={index}>
                    <View className="show-switch">
                      <Switch
                        style={{
                          transform: "scale(0.7)",
                          opacity: item.switchVisible === false ? "0.4" : "1",
                        }}
                        checked={item.visible}
                        disabled={item.switchVisible === false}
                        onChange={(e) => {
                          changeEditLabelItem(index, e.detail.value, "visible");
                        }}
                      />
                    </View>
                    <View className="edit-item-title">
                      <Input
                        style={{
                          color: item.visible ? "#000" : "#ddd",
                          // opacity: item.editTitle === false ? "0.4" : "1",
                        }}
                        className="input"
                        id={"input-item-title" + (index + 1)}
                        onFocus={handleFocus}
                        adjustPosition={false}
                        onBlur={handleBlur}
                        value={item.title ? item.title : ""}
                        disabled={item.editTitle !== true}
                        maxlength={5}
                        cursorSpacing={100}
                        clear={true}
                        onInput={(e) => {
                          changeEditLabelItem(index, e.detail.value, "title");
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: item.visible ? "#000" : "#ddd",
                      }}
                    >
                      ：
                    </Text>
                    <View className="edit-item-text">
                      {item.key === "shijian" ? (
                        <View className="shijian-picker">
                          <Picker
                            mode="date"
                            value={`${time.year}-${time.month}-${time.day}`}
                            onChange={(e) => {
                              changeEditLabelItem(
                                index,
                                e.detail.value,
                                "value",
                                "riqi"
                              );
                            }}
                          >
                            <View>{`${time.year}年${time.month}月${time.day}日`}</View>
                          </Picker>
                          <Picker
                            mode="time"
                            value={`${time.hours}:${time.minutes}`}
                            onChange={(e) => {
                              changeEditLabelItem(
                                index,
                                e.detail.value,
                                "value",
                                "shijian"
                              );
                            }}
                          >
                            <View>{`${time.hours}:${time.minutes}`}</View>
                          </Picker>
                        </View>
                      ) : (
                        <View>
                          <Input
                            style={{
                              color:
                                item.visible || !item.defaultValue
                                  ? "#000"
                                  : "#ddd",
                            }}
                            className="input"
                            id={"input-item-" + (index + 1)}
                            onFocus={handleFocus}
                            adjustPosition={false}
                            onBlur={handleBlur}
                            disabled={item.defaultValue}
                            value={
                              item.defaultValue
                                ? item.defaultValue
                                : item.value
                                ? item.value
                                : ""
                            }
                            maxlength={item.length || 50}
                            cursorSpacing={100}
                            clear={true}
                            onInput={(e) => {
                              changeEditLabelItem(
                                index,
                                e.detail.value,
                                "value"
                              );
                            }}
                          />
                          {item.key === "shuiyinmingcheng" && (
                            <View className="input-tips">
                              {userInfo.type !== "default"
                                ? "可填写 衿日水印、马克水印"
                                : "填写水印名称。开通会员可获得专属图标 😎"}
                            </View>
                          )}
                          {item.key === "daka" && (
                            <View className="input-tips">
                              可填写 打卡、开会、上班、考勤、会议、工作，需要其他文字可联系客服
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </AtFloatLayout>
  );
};

export default WatermarkPopup;
