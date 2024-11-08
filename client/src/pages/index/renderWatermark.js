import React from "react";
import { View, Image, Text, Camera, Snapshot } from "@tarojs/components";
import P1 from "../../images/p-1.png";
import P2 from "../../images/p-2.png";
import P2_1 from "../../images/p-2-1.png";
import P4 from "../../images/p-4.png";
import P5 from "../../images/p-5.png";
import Fw from "../../images/fw.png";
import Icon2 from "../../images/icon-2.png";
import ShuiyinDoms from "../../components/shuiyin";
const app = getApp();

const RenderWatermark = ({
  type,
  tempPath,
  onLoadHandler,
  currentShuiyinIndex,
  devicePosition,
  shanguangflag,
  screenWidth,
  selected,
  showTrueCode,
  showHasCheck,
  shuiyinxiangjiName,
  userInfo,
  showFloatLayout,
  hours,
  minutes,
  day,
  month,
  year,
  weekly,
  locationName,
  dakaName,
  title,
  weather,
  remark,
  latitude,
  longitude,
  fangdaoShuiyin,
  fangweimaText,
  makefangweimaText,
  cameraError,
  snapshotHeight,
  setEdit,
  setShowFloatLayout,
}) => {
  const isCamera = type === "camera";

  const renderLeftCopyright = () => {
    const option = ShuiyinDoms[currentShuiyinIndex].options;

    if (
      option?.copyright === "mk" &&
      showHasCheck &&
      option?.showLeftCopyright &&
      showHasCheck
    ) {
      // 左下角今日水印风格下标

      return (
        <View style={{ position: "absolute", left: 0, bottom: 0 }}>
          <View className="make-left-copyright">
            <Image src={P1}></Image>
            <Text>马克相机已验证照片真实性</Text>
          </View>
        </View>
      );
    } else if (
      option?.copyright === "jrsy" &&
      showHasCheck &&
      option?.showLeftCopyright &&
      showHasCheck
    ) {
      // 左下角马克水印风格下标
      return (
        <View style={{ position: "absolute", left: 0, bottom: 0 }}>
          <View className="jinri-left-copyright">
            <Image src={P1}></Image>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text>{shuiyinxiangjiName + "相机已验证"}</Text>
              <Text className="short-line"></Text>
              <Text>{" 时间地点真实"}</Text>
            </View>
          </View>
        </View>
      );
    } else {
    }
  };
  const renderRightCopyright = () => {
    const option = ShuiyinDoms[currentShuiyinIndex].options;

    if (option?.showRightCopyright && showTrueCode) {
      if (option?.copyright === "mk") {
        if (userInfo.type === "default") {
          // 马克相机 如果是普通用户则显示今日水印风格右下角
          return shuiyinxiangjiName.includes("马克") ? (
            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
              <View className="make-right-copyright">
                {/* 马克 右下角背景图 */}
                <Image src={P4}></Image>
                {/* 马克 防伪码 */}
                <Text
                  style={{
                    fontSize: "10px",
                    position: "absolute",
                    color: "rgba(255,255,255,.85)",
                    right: "1px",
                    bottom: "-1px",
                    fontFamily: "HYQiHei 65J",
                  }}
                  className="fangweima"
                >
                  防伪
                  <Text
                    style={{
                      fontSize: "9px",
                      fontFamily: "Monaco",
                    }}
                  >
                    {" " + makefangweimaText}
                  </Text>
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
              <View className="jinri-right-copyright">
                {/* 今日水印 右下角背景图 */}
                {/* {shuiyinxiangjiName.includes("今日水印") ? ( */}
                {/* <Image src={P2_1}></Image> */}
                <Image src={P2}></Image>
                {/* )} */}
                <View className="fw-box">
                  <Image src={Fw} className="fwm"></Image>
                  <Text className="fangweima">{fangweimaText}</Text>
                </View>
                {/* 输入什么就显示什么 */}
                {/* {!shuiyinxiangjiName.includes("今日水印") ? ( */}
                <Text
                  style={{
                    position: "absolute",
                    color: "#fbfbfb",
                    right: "3px",
                    top: "2px",
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: 700,
                    width: "100rpx",
                    textShadow: "0.2rpx 0.2rpx 0.2rpx #d6d5d5",
                    fontFamily: "黑体",
                    opacity: ".85",
                  }}
                >
                  {shuiyinxiangjiName}
                </Text>
                {/* ) : null} */}
              </View>
            </View>
          );
        } else {
          return shuiyinxiangjiName ? (
            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
              <View className="make-right-copyright">
                {/* 马克 右下角背景图 */}
                <Image src={P4}></Image>
                {/* 马克 防伪码 */}
                <Text
                  style={{
                    fontSize: "10px",
                    position: "absolute",
                    color: "rgba(255,255,255,.85)",
                    right: "1px",
                    bottom: "-1px",
                    fontFamily: "HYQiHei 65J",
                  }}
                  className="fangweima"
                >
                  防伪
                  <Text
                    style={{
                      fontSize: "9px",
                      fontFamily: "Monaco",
                    }}
                  >
                    {" " + makefangweimaText}
                  </Text>
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                position: "absolute",
                right: "10px",
                bottom: "10px",
              }}
            >
              <Image
                src={P5}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              ></Image>
            </View>
          );
        }
      } else if (option?.copyright === "jrsy") {
        if (userInfo.type === "default") {
          // 今日水印相机 如果是普通用户则显示体验相机右下角
          return (
            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
              <View className="jinri-right-copyright">
                {/* 今日水印 右下角背景图 */}
                {/* {shuiyinxiangjiName.includes("今日水印") ? (
                  <Image src={P2_1}></Image>
                ) : ( */}
                <Image src={P2}></Image>
                {/* )} */}
                <View className="fw-box">
                  <Image src={Fw} className="fwm"></Image>
                  <Text className="fangweima">{fangweimaText}</Text>
                </View>

                {/* 输入什么就显示什么 */}
                {/* {!shuiyinxiangjiName.includes("今日水印") ? ( */}
                <Text
                  style={{
                    position: "absolute",
                    color: "#fbfbfb",
                    right: "3px",
                    top: "2px",
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: 700,
                    width: "100rpx",
                    textShadow: "0.2rpx 0.2rpx 0.2rpx #d6d5d5",
                    fontFamily: "黑体",
                    opacity: ".85",
                  }}
                >
                  {shuiyinxiangjiName}
                </Text>
                {/* ) : null} */}
              </View>
            </View>
          );
        } else {
          // 如果是付费用户 则显示今日水印相机的logo
          return shuiyinxiangjiName ? (
            <View style={{ position: "absolute", right: 0, bottom: 0 }}>
              <View className="jinri-right-copyright">
                {/* 今日水印 右下角背景图 */}
                {shuiyinxiangjiName.includes("今日水印") ? (
                  <Image src={P2_1}></Image>
                ) : (
                  <Image src={P2}></Image>
                )}
                <View className="fw-box">
                  <Image src={Fw} className="fwm"></Image>
                  <Text className="fangweima">{fangweimaText}</Text>
                </View>

                {/* 输入什么就显示什么 */}
                {!shuiyinxiangjiName.includes("今日水印") ? (
                  <Text
                    style={{
                      position: "absolute",
                      color: "#fbfbfb",
                      right: "3px",
                      top: "2px",
                      fontSize: "12px",
                      textAlign: "center",
                      fontWeight: 700,
                      width: "100rpx",
                      textShadow: "0.2rpx 0.2rpx 0.2rpx #d6d5d5",
                      fontFamily: "黑体",
                      opacity: ".85",
                    }}
                  >
                    {shuiyinxiangjiName}
                  </Text>
                ) : /* 右下角今日水印四个字图片 */
                null}
              </View>
            </View>
          ) : (
            <View
              style={{
                position: "absolute",
                right: "10px",
                bottom: "10px",
              }}
            >
              <Image
                src={P5}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              ></Image>
            </View>
          );
        }
      }
    } else {
    }
    if (option?.copyright === "syxj") {
      return (
        <View className="copySYXJ">
          <Image
            src={Icon2}
            style={{
              width: "147rpx",
              height: "46rpx",
            }}
          ></Image>
        </View>
      );
    }
  };
  const height = isCamera
    ? ShuiyinDoms[currentShuiyinIndex].options?.proportion
      ? ShuiyinDoms[currentShuiyinIndex].options?.proportion * screenWidth
      : (screenWidth / 3) * 4
    : snapshotHeight;
  return (
    <Snapshot
      className={isCamera ? "snapshot" : "snapshot-outside"}
      style={
        !isCamera
          ? {
              position: "absolute",
              left: "-999999px",
              width: "100%",
              pointerEvents: "none",
              height,
            }
          : undefined
      }
    >
      <View
        style={{
          position: "relative",
          height,
          background: selected === "视频水印" ? "rgba(0,0,0,.6)" : "auto",
        }}
        onClick={(e) => {
          if (!showFloatLayout) {
            setEdit(true);
            setShowFloatLayout(!showFloatLayout);
          }
        }}
      >
        <View
          style={{
            widh: "100%",
            position: "relative",
            height,
          }}
        >
          {selected === "图片水印" && isCamera && (
            <Camera
              className="camera"
              resolution="high"
              devicePosition={devicePosition}
              flash={shanguangflag}
              frameSize="medium"
              onError={cameraError}
            />
          )}

          {/* {isCamera && !isRealDevice && (
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              src="https://imgs-1326662896.cos.ap-guangzhou.myqcloud.com/placeholder.jpg?111"
            ></Image>
          )} */}
          {tempPath && (
            <Image
              src={tempPath}
              onLoad={() => {
                console.log("图片已经onload");
                onLoadHandler();
              }}
              className={
                isCamera ? "cameraSelectedImage" : "xiangceSelectedImage"
              }
              style={{
                width: "100%",
                position: "absolute",
                zIndex: 2,
                top: "0",
                left: "0",
                height,
              }}
            ></Image>
          )}
        </View>
        {!app.$app.globalData.fuckShenHe && userInfo.type === "default" && (
          <View
            style={{
              color: "rgba(0, 0, 0)",
              fontSize: "16px",
              position: "absolute",
              fontFamily: "黑体",
              textAlign: "center",
              fontWeight: "bold",
              bottom: "110px",
              right: "20px",
            }}
          >
            可修改水印相机 <br />
            开通会员可去掉此水印
          </View>
        )}
        <View className="mask-inner-box">
          {ShuiyinDoms[currentShuiyinIndex].component({
            hours,
            minutes,
            day,
            month,
            year,
            weekly,
            locationName,
            dakaName,
            title,
            weather,
            remark: remark || "",
            latitude,
            longitude,
            fangdaoShuiyin,
          })}
        </View>
        {renderLeftCopyright()}
        {renderRightCopyright()}
      </View>
    </Snapshot>
  );
};

export default RenderWatermark;