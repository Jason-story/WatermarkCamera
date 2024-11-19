import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Picker,
  Input,
  InputNumber,
  Switch,
  ScrollView,
} from "@tarojs/components";
import {
  formatTextWithLineLimit,
  getWeekdayCN,
  parseDateString,
  getEditItem,
} from "../../components/utils";
import Taro from "@tarojs/taro";
import CustomSlider from "../../components/CustomSlider";
import { AtFloatLayout, AtSlider } from "taro-ui";
import ShuiyinDoms from "../../components/shuiyin";
/**
 * 水印编辑弹窗组件
 * @param {Object} props
 * @param {boolean} props.showFloatLayout - 控制弹窗显示隐藏
 * @param {boolean} props.edit - 是否处于编辑模式
 * @param {number} props.currentShuiyinIndex - 当前选中的水印索引
 * @param {function} props.setShowFloatLayout - 设置弹窗显示状态
 * @param {function} props.setEdit - 设置编辑状态
 * @param {function} props.updateShuiyinIndex - 更新水印索引
 */
const WatermarkPopup = ({
  showFloatLayout,
  edit,
  currentShuiyinIndex,
  setShowFloatLayout,
  setEdit,
  updateShuiyinIndex,
  // 日期时间相关
  year,
  month,
  day,
  hours,
  minutes,
  handleDateChange,
  handleTimeChange,
  // 位置信息相关
  locationName,
  setLocationName,
  // 水印保存配置
  isShuiyinSaved,
  saveChange,
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
  // 标题相关
  title,
  setTitle,
  // 防盗水印
  fangdaoShuiyin,
  setFangDaoShuiyin,
  // 天气信息
  weather,
  setWeather,
  // 经纬度信息
  longitude,
  latitude,
  setLongitude,
  setLatitude,
  // 备注信息
  remark,
  // 打卡标签
  setMaskScale,
  editLabel,
  setEditLabel,
}) => {
  /**
   * 防抖函数
   * @param {Function} func - 需要防抖的函数
   * @param {number} delay - 延迟时间(ms)
   */
  function debounce(func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }

  const time = parseDateString(getEditItem(editLabel, "shijian").value || "");
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
    console.log("newEditLabel: ", newEditLabel);
    console.log("index: ", index);

    if (type === "title") {
      newEditLabel[index] = { ...newEditLabel[index], title: value };
    } else if (type === "value") {
      if (valueType === "riqi" || valueType === "shijian") {
        // 获取当前值以保留日期或时间部分
        const currentValue = newEditLabel[index].value || "";
        console.log("newEditLabel[index]: ", newEditLabel[index]);
        console.log("currentValue: ", currentValue);
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

    console.log("newEditLabel: ", newEditLabel);
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
                      {item.options.vip && (
                        <View className="vip-arrow">半年及以上会员专属</View>
                      )}
                      <Image mode="aspectFit" src={item.options.cover}></Image>
                    </View>
                  </View>
                  {currentShuiyinIndex == index && (
                    <View
                      className="shuiyin-item-cover"
                      onTouchStart={async () => {

                        console.log('index: ', index);
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
                  saveChange(e.detail.value);
                }}
              />
            </View>

            <View>
              {/* 防伪水印设置 */}
              {editLabel.showRightCopyright && (
                <>
                  <View className="edit-item">
                    <View className="picker" style={{ height: "50px" }}>
                      <Text>右下角防伪水印是否显示： </Text>
                      <Switch
                        style={{
                          transform: "scale(0.7)",
                        }}
                        checked={showTrueCode}
                        onChange={(e) => {
                          setShowTrueCode(e.detail.value);
                        }}
                      />
                    </View>
                  </View>
                  {showTrueCode && (
                    <View className="edit-item flex-row">
                      <View className="picker">
                        <Text style={{ color: "#f22c3d" }}>
                          右下角水印名称：
                        </Text>
                        <Input
                          className="input"
                          id="input-item-2"
                          onFocus={handleFocus}
                          value={shuiyinxiangjiName}
                          maxlength={4}
                          onBlur={handleBlur}
                          adjustPosition={false}
                          clear={true}
                          placeholder="点击填写"
                          onInput={(e) => {
                            debounce(
                              setShuiyinxiangjiName(
                                e.detail.value.replace(/\s+/g, "")
                              ),
                              100
                            );
                          }}
                        />
                      </View>
                      <View className="input-tips">
                        {userInfo.type !== "default"
                          ? "可填写 衿日水印、马克水印"
                          : "填写水印名称。开通会员可获得专属图标 😎"}
                      </View>
                    </View>
                  )}
                </>
              )}

              {/* 左下角验证标记 */}
              {editLabel.showLeftCopyright && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>左下角已验证下标是否显示： </Text>
                    <Switch
                      style={{
                        transform: "scale(0.7)",
                      }}
                      checked={showHasCheck}
                      onChange={(e) => {
                        setShowHasCheck(e.detail.value);
                      }}
                    />
                  </View>
                </View>
              )}
              {editLabel.maskScale && (
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

              {/* <View className="edit-item">
                <Picker
                  mode="date"
                  value={`${year}年${month}月${day}日`}
                  onChange={handleDateChange}
                >
                  <View>选择日期： {`${year}年${month}月${day}日`}</View>
                </Picker>
              </View> */}

              {/* 时间选择 */}
              {/* <View className="edit-item">
                <Picker
                  mode="time"
                  value={`${hours}:${minutes}`}
                  onChange={handleTimeChange}
                >
                  <View>选择时间： {`${hours}:${minutes}`}</View>
                </Picker>
              </View> */}

              {/* 地点输入 */}
              {/* <View className="edit-item">
                <View className="picker">
                  <Text>详细地点： </Text>
                  <Input
                    className="input"
                    id="input-item-1"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={locationName}
                    maxlength={50}
                    adjustPosition={false}
                    clear={true}
                    clearable
                    onInput={(e) => {
                      setLocationName(e.detail.value);
                    }}
                  />
                </View>
              </View> */}

              {/* 工程标题 */}
              {/* {editLabel.hasTitle && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>工程标题： </Text>
                    <Input
                      className="input"
                      id="input-item-3"
                      onFocus={handleFocus}
                      value={title}
                      maxlength={12}
                      onBlur={handleBlur}
                      adjustPosition={false}
                      cursorSpacing={100}
                      clear={true}
                      onInput={(e) => {
                        setTitle(e.detail.value);
                      }}
                    />
                  </View>
                </View>
              )} */}

              {/* 防盗水印 */}
              {/* {editLabel.hasFangDao && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>防盗水印文字： </Text>
                    <Input
                      className="input"
                      id="input-item-4"
                      onFocus={handleFocus}
                      value={fangdaoShuiyin}
                      adjustPosition={false}
                      onBlur={handleBlur}
                      maxlength={6}
                      cursorSpacing={100}
                      clear={true}
                      onInput={(e) => {
                        debounce(setFangDaoShuiyin(e.detail.value), 100);
                      }}
                    />
                  </View>
                </View>
              )} */}

              {/* 天气信息 */}
              {/* {editLabel.hasWeather && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>天气&温度： </Text>
                    <Input
                      className="input"
                      id="input-item-5"
                      onFocus={handleFocus}
                      value={weather}
                      cursorSpacing={100}
                      adjustPosition={false}
                      onBlur={handleBlur}
                      maxlength={8}
                      clear={true}
                      onInput={(e) => {
                        setWeather(e.detail.value);
                      }}
                    />
                  </View>
                </View>
              )} */}

              {/* 经纬度信息 */}
              {/* {editLabel.hasJingWeiDu && (
                <>
                  <View className="edit-item">
                    <View className="picker">
                      <Text>经度： </Text>
                      <Input
                        className="input"
                        id="input-item-6"
                        onFocus={handleFocus}
                        value={longitude + ""}
                        maxlength={14}
                        cursorSpacing={100}
                        adjustPosition={false}
                        onBlur={handleBlur}
                        clear={true}
                        onInput={(e) => {
                          setLongitude(e.detail.value + "");
                        }}
                      />
                    </View>
                  </View>
                  <View className="edit-item">
                    <View className="picker">
                      <Text>纬度： </Text>
                      <Input
                        className="input"
                        id="input-item-7"
                        onFocus={handleFocus}
                        value={latitude + ""}
                        cursorSpacing={100}
                        adjustPosition={false}
                        onBlur={handleBlur}
                        maxlength={14}
                        clear={true}
                        onInput={(e) => {
                          setLatitude(e.detail.value + "");
                        }}
                      />
                    </View>
                  </View>
                </>
              )} */}

              {/* 备注信息 */}
              {/* {editLabel.hasRemark && (
                <View className="edit-item">
                  <View className="picker">
                    <Text>备注： </Text>
                    <Input
                      className="input"
                      id="input-item-8"
                      onFocus={handleFocus}
                      adjustPosition={false}
                      onBlur={handleBlur}
                      value={remark}
                      maxlength={20}
                      cursorSpacing={100}
                      clear={true}
                      onInput={(e) => {
                        debounce(setRemark(e.detail.value), 100);
                      }}
                    />
                  </View>
                  <View className="input-tips">最多20个字</View>
                </View>
              )} */}
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
