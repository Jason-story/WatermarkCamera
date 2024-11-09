import React, { useEffect } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Picker,
  Input,
  Switch,
  ScrollView,
} from "@tarojs/components";
import { AtFloatLayout } from "taro-ui";
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
  setRemark,
  // 打卡标签
  dakaName,
  setDakaName,
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

  return (
    <AtFloatLayout
      isOpened={showFloatLayout}
      overlay={false}
      closeable={true}
      style={{ height: "100%", flexShrink: "0" }}
      title="水印选择、修改"
      onClose={() => {
        setEdit(false);
        wx.hideKeyboard();
        setShowFloatLayout(!showFloatLayout);
      }}
    >
      {!edit ? (
        // 水印选择界面
        <ScrollView
          scroll-y
          style={{ height: "100%", flexShrink: "0", flex: 1 }}
        >
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
                        <View className="vip-arrow">永久会员专属</View>
                      )}
                      <Image mode="aspectFit" src={item.options.cover}></Image>
                    </View>
                  </View>
                  {currentShuiyinIndex === index && (
                    <View
                      className="shuiyin-item-cover"
                      onTouchStart={() => {
                        setEdit(true);
                        updateShuiyinIndex(index);
                      }}
                    >
                      <Button>编辑</Button>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        // 编辑界面
        <ScrollView scroll-y className="edit-box">
          {/* 保存设置区域 */}
          <View className="shantui-btns">
            <View
              style={{
                color: "#151515",
                marginRight: "10px",
              }}
            >
              保存地点、打卡标签、水印名称等设置，下次使用时无需再次修改
            </View>
            <Switch
              style={{ transform: "scale(0.7)" }}
              disabled={!locationName}
              checked={isShuiyinSaved}
              onChange={(e) => {
                saveChange(e.detail.value);
              }}
            />
          </View>

          {/* 日期选择 */}
          <View className="edit-item">
            <Picker
              mode="date"
              value={`${year}年${month}月${day}日`}
              onChange={handleDateChange}
            >
              <View>选择日期： {`${year}年${month}月${day}日`}</View>
            </Picker>
          </View>

          {/* 时间选择 */}
          <View className="edit-item">
            <Picker
              mode="time"
              value={`${hours}:${minutes}`}
              onChange={handleTimeChange}
            >
              <View>选择时间： {`${hours}:${minutes}`}</View>
            </Picker>
          </View>

          {/* 地点输入 */}
          <View className="edit-item">
            <View className="picker">
              <Text>详细地点： </Text>
              <Input
                className="input"
                value={locationName}
                maxlength={50}
                clear={true}
                clearable
                onInput={(e) => {
                  debounce(setLocationName(e.detail.value), 100);
                }}
              />
            </View>
          </View>

          {/* 防伪水印设置 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.showRightCopyright && (
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
                    <Text style={{ color: "#f22c3d" }}>右下角水印名称：</Text>
                    <Input
                      className="input"
                      value={shuiyinxiangjiName}
                      maxlength={4}
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
                      : "可填写衿日水印、马克水印。开通会员可获得专属图标"}
                  </View>
                </View>
              )}
            </>
          )}

          {/* 左下角验证标记 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.showLeftCopyright && (
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

          {/* 工程标题 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.hasTitle && (
            <View className="edit-item">
              <View className="picker">
                <Text>工程标题： </Text>
                <Input
                  className="input"
                  value={title}
                  maxlength={12}
                  cursorSpacing={100}
                  clear={true}
                  onInput={(e) => {
                    debounce(setTitle(e.detail.value), 100);
                  }}
                />
              </View>
            </View>
          )}

          {/* 防盗水印 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.hasFangDao && (
            <View className="edit-item">
              <View className="picker">
                <Text>防盗水印文字： </Text>
                <Input
                  className="input"
                  value={fangdaoShuiyin}
                  maxlength={6}
                  cursorSpacing={100}
                  clear={true}
                  onInput={(e) => {
                    debounce(setFangDaoShuiyin(e.detail.value), 100);
                  }}
                />
              </View>
            </View>
          )}

          {/* 天气信息 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.hasWeather && (
            <View className="edit-item">
              <View className="picker">
                <Text>天气&温度： </Text>
                <Input
                  className="input"
                  value={weather}
                  cursorSpacing={100}
                  maxlength={8}
                  clear={true}
                  onInput={(e) => {
                    setWeather(e.detail.value);
                  }}
                />
              </View>
            </View>
          )}

          {/* 经纬度信息 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.hasJingWeiDu && (
            <>
              <View className="edit-item">
                <View className="picker">
                  <Text>经度： </Text>
                  <Input
                    className="input"
                    value={longitude + ""}
                    maxlength={14}
                    cursorSpacing={100}
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
                    value={latitude + ""}
                    cursorSpacing={100}
                    maxlength={14}
                    clear={true}
                    onInput={(e) => {
                      setLatitude(e.detail.value + "");
                    }}
                  />
                </View>
              </View>
            </>
          )}

          {/* 备注信息 */}
          {ShuiyinDoms[currentShuiyinIndex].options?.hasRemark && (
            <View className="edit-item">
              <View className="picker">
                <Text>备注： </Text>
                <Input
                  className="input"
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
          )}
          {!edit && (
            <View>
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                更多水印样式开发中...
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </AtFloatLayout>
  );
};

export default WatermarkPopup;
