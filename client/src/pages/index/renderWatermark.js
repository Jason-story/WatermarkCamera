import React from "react";
import { View, Image, Text, Camera, Snapshot } from "@tarojs/components";
import { getEditItem } from "../../components/utils";
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
  // shuiyinxiangjiName,
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
  latitude,
  longitude,
  fangdaoShuiyin,
  fangweimaText,
  makefangweimaText,
  editLabel,
  setEditLabel,
  cameraError,
  snapshotHeight,
  setEdit,
  maskScale,
  setShowFloatLayout,
  bili,
}) => {
  const newMaskScale = maskScale + 0.1;
  const isCamera = type === "camera";
  const shuiyinxiangjiName =
    getEditItem(editLabel, "shuiyinmingcheng")?.value || "";

  const renderLeftCopyright = () => {
    const option = ShuiyinDoms[currentShuiyinIndex].options;

    if (
      option?.copyright === "mk" &&
      showHasCheck &&
      getEditItem(editLabel, "yanzhengmingcheng")?.visible
    ) {
      // 左下角今日水印风格下标
      return (
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            transform: `scale(${newMaskScale})`,
            transformOrigin: "left bottom",
          }}
        >
          <View className="make-left-copyright">
            <Image src={P1}></Image>
            <Text>马克相机已验证照片真实性</Text>
          </View>
        </View>
      );
    } else if (
      option?.copyright === "jrsy" &&
      showHasCheck &&
      getEditItem(editLabel, "yanzhengmingcheng")?.visible
    ) {
      // 左下角马克水印风格下标
      return (
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            transform: `scale(${newMaskScale})`,
            transformOrigin: "left bottom",
          }}
        >
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
    if (option?.copyright === "syxj") {
      return (
        <View className="copySYXJ" key={"syxj"}>
          <View
            className="syxj-icon"
            style={{
              width: "147rpx",
              height: "46rpx",
            }}
          ></View>
        </View>
      );
    } else {
      if (getEditItem(editLabel, "shuiyinmingcheng")?.visible && showTrueCode) {
        if (option?.copyright === "mk") {
          if (userInfo.type === "default") {
            // 马克相机 如果是普通用户则显示今日水印风格右下角
            return shuiyinxiangjiName.includes("马克") ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: `scale(${newMaskScale - 0.1})`,
                  transformOrigin: "right bottom",
                }}
              >
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
                  right: 0,
                  bottom: 0,
                  transform: `scale(${newMaskScale})`,
                  transformOrigin: "right bottom",
                }}
              >
                <View className="jinri-right-copyright">
                  {/* 今日水印 右下角背景图 */}
                  {/* {shuiyinxiangjiName.includes("今日水印") ? ( */}
                  {/* <Image src={P2_1}></Image> */}
                  <Image src={P2}></Image>
                  {/* )} */}
                  <View className="fw-box">
                    <Image src={Fw} className="fwm"></Image>
                    <Text className="fangweima jrsy">{fangweimaText}</Text>
                  </View>
                  {/* 输入什么就显示什么 */}
                  {/* {!shuiyinxiangjiName.includes("今日水印") ? ( */}
                  <Text
                    style={{
                      position: "absolute",
                      color: "#fff",
                      right: "3px",
                      top: "2px",
                      fontSize: "12px",
                      textAlign: "center",
                      fontWeight: 700,
                      width: "100rpx",
                      fontFamily: "Roboto",
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
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: `scale(${newMaskScale - 0.1})`,
                  transformOrigin: "right bottom",
                }}
              >
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
                  transform: `scale(${newMaskScale})`,
                  transformOrigin: "right bottom",
                }}
              >
                <Image
                  src={P5}
                  key={"p5"}
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
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: `scale(${newMaskScale})`,
                  transformOrigin: "right bottom",
                }}
              >
                <View className="jinri-right-copyright">
                  {/* 今日水印 右下角背景图 */}
                  {/* {shuiyinxiangjiName.includes("今日水印") ? (
                    <Image src={P2_1}></Image>
                  ) : ( */}
                  <Image src={P2}></Image>
                  {/* )} */}
                  <View className="fw-box">
                    <Image src={Fw} className="fwm"></Image>
                    <Text className="fangweima jrsy">{fangweimaText}</Text>
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
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: `scale(${newMaskScale})`,
                  transformOrigin: "right bottom",
                }}
              >
                <View className="jinri-right-copyright">
                  {/* 今日水印 右下角背景图 */}
                  {shuiyinxiangjiName.includes("今日水印") ? (
                    <Image src={P2_1}></Image>
                  ) : (
                    <Image src={P2}></Image>
                  )}
                  <View className="fw-box">
                    <Image src={Fw} className="fwm"></Image>
                    <Text className="fangweima jrsy">{fangweimaText}</Text>
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
                  transform: `scale(${newMaskScale})`,
                  transformOrigin: "right bottom",
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
    }
  };
  const biliMap = {
    1: 4 / 3,
    2: 16 / 9,
    3: 1 / 1,
  };
  // 相机时 第一个snap 高度3：4 或者按照比例设置
  const height = isCamera
    ? ShuiyinDoms[currentShuiyinIndex].options?.proportion
      ? ShuiyinDoms[currentShuiyinIndex].options?.proportion * screenWidth
      : screenWidth * biliMap[bili]
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
          background:
            selected === "视频水印" && isCamera ? "rgba(0,0,0,.6)" : "auto",
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
            // background: "#000",
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
          {/* <Image
            style={{
              width: "100%",
              height: "100%",
              opacity:.5
            }}
            src={
              "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/p.jpg?t=" +
              new Date()
            }
          ></Image> */}
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
              color: "rgba(0,0,0,.7)",
              fontSize: "20px",
              position: "absolute",
              fontFamily: "NotoSansHans",
              fontWeight: "bold",
              textAlign: "center",
              top: "50%",
              left: "50%",
              width: "100%",
              transform: "translate(-50%, -50%)",
              textShadow:
                "1px 0 0 #fff,0 1px 0 #fff,-1px 0 0 #fff,0 -1px 0 #fff,1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff",
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
            latitude,
            longitude,
            fangdaoShuiyin,
            maskScale,
            editLabel,
            setEditLabel,
          })}
        </View>
        {renderLeftCopyright()}
        {renderRightCopyright()}
      </View>
    </Snapshot>
  );
};

export default RenderWatermark;
