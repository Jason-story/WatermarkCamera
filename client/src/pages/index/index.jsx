import { useEffect, useState } from "react";
import { View, Camera, Button, Text, Image, Canvas } from "@tarojs/components";
import { createCameraContext, useDidShow } from "@tarojs/taro";
import { AtFloatLayout } from "taro-ui";
import {
  AtIcon,
  AtDrawer,
  AtModal,
  AtButton,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from "taro-ui";
import Taro from "@tarojs/taro";
import QQMapWX from "qqmap-wx-jssdk";
import ShareImg from "../../images/logo.jpg";
import vipImg from "../../images/vip.png";
import fanzhuanImg from "../../images/fanzhuan.png";
import shanguangdengImg from "../../images/shan-on.png";
import shanguangdengOffImg from "../../images/shan-off.png";
import XiangceIcon from "../../images/xiangce.png";
import KefuIcon from "../../images/kefu.png";
import ShuiyinIcon from "../../images/shuiyin.png";
import Shuiyin1 from "../../images/shuiyin-1.png";

// import canvasConfig from "./canvasConfig";
import "./index.scss";

const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");

const daysOfWeek = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const today = new Date();
const dayIndex = today.getDay();

// const date = `${year}年${month}月${day}日`;
// const time = `${hours}:${minutes}`;

const CameraPage = () => {
  const [cameraContext, setCameraContext] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [settingShow, setSettingShow] = useState(false);
  const [allAuth, setAllAuth] = useState(false);
  const [devicePosition, setDevicePosition] = useState("back");
  const [shanguangflag, setShanguangFlag] = useState("off");
  const [vipModal, setVipModal] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weather, setWeather] = useState(null);
  const [canvasImg, setCanvasImg] = useState("");
  const [year, setYear] = useState(yearD);
  const [month, setMonth] = useState(monthD);
  const [day, setDay] = useState(dayD);
  const [hours, setHours] = useState(hoursD);
  const [minutes, setMinutes] = useState(minutesD);
  const [seconds, setSeconds] = useState(secondsD);
  const [locationName, setLocationName] = useState("");
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(1);
  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [canvasConfigState, setCanvasConfigState] = useState([]);
  const [city, setCity] = useState("");
  const [edit, setEdit] = useState(false);

  const [permissions, setPermissions] = useState({
    camera: false,
    writePhotosAlbum: false,
    userLocation: false,
  });

  const fetchWeather = (cityName) => {
    const url =
      "https://api.seniverse.com/v3/weather/now.json?key=S7OyUofVVMeBcrLsC&location=" +
      cityName +
      "&language=zh-Hans&unit=c";

    Taro.request({
      url,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          setWeather(res.data.results[0]?.now);
        } else {
          setError(`Error: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        console.error("Failed to fetch weather:", err);
        setError("Failed to fetch weather");
      },
    });
  };
  useEffect(() => {
    allAuth && permissions.userLocation && !city && getLocation();
    city && fetchWeather(city);
  }, [allAuth, permissions.userLocation, city]);

  const getLocation = () => {
    if (!permissions.userLocation) return;
    Taro.getLocation({
      type: "wgs84",
      success: (res) => {
        setLatitude(res.latitude);
        setLongitude(res.longitude);
        reverseGeocode(res.latitude, res.longitude);
      },
      fail: (err) => {
        Taro.showToast({
          title: "无法获取位置信息，请检查权限设置",
          icon: "none",
        });
      },
    });
  };

  const reverseGeocode = (lat, lng) => {
    const qqmapsdk = new QQMapWX({
      key: "JDRBZ-63BCV-YGNPG-5KPDI-PEAH5-ADBOB",
    });
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng,
      },
      success: (res) => {
        const addressComponent = res.result.formatted_addresses;
        const addr = addressComponent.recommend;
        const city = res.result.address_component.city;
        setCity(city);

        // 拼接市以下的地址信息，不包括门牌号
        const detailedAddress = `${addr}`;
        setLocationName(detailedAddress);
      },
      fail: (err) => {
        console.error("Failed to reverse geocode:", err);
      },
    });
  };
  useEffect(() => {
    checkPermissions();
    requestPermissions();
  }, []);

  useDidShow(() => {
    checkPermissions();
    getAuth();
  });

  const checkPermissions = async () => {
    const res = await Taro.getSetting();
    setPermissions({
      camera: !!res.authSetting["scope.camera"],
      writePhotosAlbum: !!res.authSetting["scope.writePhotosAlbum"],
      userLocation: !!res.authSetting["scope.userLocation"],
    });
  };

  const requestPermissions = async () => {
    try {
      await requestPermission("scope.camera");
      await requestPermission("scope.writePhotosAlbum");
      await requestPermission("scope.userLocation");
    } catch (error) {
      console.log("error: ", error);

      // Taro.showModal({
      //   title: "权限不足",
      //   content: "请在设置中打开相机、相册和位置权限",
      //   showCancel: false,
      //   success: (res) => {
      //     if (res.confirm) {
      //       Taro.openSetting();
      //     }
      //   },
      // });
    }
  };

  const requestPermission = async (scope) => {
    const res = await Taro.getSetting();
    if (!res.authSetting[scope]) {
      try {
        await Taro.authorize({ scope });
      } catch (error) {
        console.error(`${scope} 权限被拒绝`, error);
        throw error;
      }
    }
    checkPermissions();
    getAuth();
  };

  useEffect(() => {
    const context = createCameraContext();
    setCameraContext(context);
    getAuth();
  }, [allAuth, permissions]);
  const getAuth = () => {
    Taro.getSetting().then((res) => {
      const authSetting = res.authSetting;

      // 是否完全授权
      if (
        authSetting["scope.camera"] &&
        authSetting["scope.writePhotosAlbum"] &&
        authSetting["scope.userLocation"]
      ) {
        setAllAuth(true);
      } else {
        setAllAuth(false);
      }
    });
  };
  useEffect(() => {
    cameraContext?.setZoom({
      zoom: zoomLevel,
      success: () => {
        console.log(`设置缩放级别成功: ${zoomLevel}`);
      },
      fail: (error) => {
        console.error(`设置缩放级别失败: ${error}`);
      },
    });
  }, [zoomLevel]);

  const cameraError = (e) => {
    console.error("Camera error:", e.detail);
  };
  const zoomClick = () => {
    setZoomLevel((prevValue) => {
      if (prevValue === 1) {
        return 3;
      } else if (prevValue === 3) {
        return 5;
      } else {
        return 1;
      }
    });
    setSettingShow(false);
  };
  const handleSetting = (event) => {
    setSettingShow(!settingShow);
  };
  const fanzhuanClick = (event) => {
    setDevicePosition((prevvalue) => {
      if (prevvalue === "back") {
        return "front";
      } else {
        return "back";
      }
    });
  };
  const shanguangClick = (event) => {
    setShanguangFlag((prevvalue) => {
      if (prevvalue === "off") {
        return "on";
      } else {
        return "off";
      }
    });
  };

  const takePhoto = (camera = true, path) => {
    if (camera) {
      cameraContext?.takePhoto({
        zoom: zoomLevel,
        success: (path) => {
          Taro.navigateTo({
            url:
              "/pages/result/index?bg=" +
              path.tempImagePath +
              "&mask=" +
              canvasImg,
          });
        },
        fail: (error) => {},
      });
    } else {
      Taro.navigateTo({
        url: "/pages/result/index?bg=" + path + "&mask=" + canvasImg,
      });
    }
  };

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index",
      imageUrl: ShareImg,
    };
  });
  const vipModalCLick = () => {
    setVipModal(!vipModal);
  };
  const copyWx = () => {
    setVipModal(!vipModal);
    // Taro.setClipboardData({
    //   data: "jason_story",
    //   success: () => {
    //     Taro.showToast({
    //       title: "复制成功",
    //       icon: "success",
    //     });
    //   },
    // });
  };
  const selectImg = () => {
    Taro.chooseImage({
      count: 1,
      success: function (res) {
        takePhoto(false, res.tempFilePaths[0]);
        // Taro.getFileSystemManager().getFileInfo({
        //   filePath: res.tempFilePaths[0],
        //   success(info) {

        //   },
        // });
      },
    });
  };
  // const drawCanvas = (ctx, config) => {
  //   config.forEach((item) => {
  //     const { draw, args } = item;
  //     draw(ctx, ...args);
  //   });
  // };
  const drawCanvas = () => {
    config.forEach((item, index) => {
      const { draw, args } = item;
      draw(ctx, ...args[index]);
    });
  };

  const drawMask = () => {
    const canvasConfig = [
      [
        {
          path: [
            {
              draw: (ctx, backgroundConfig) => {
                const { color, rect } = backgroundConfig;
                ctx.setFillStyle(color);
                ctx.fillRect(...rect);
              },
              args: [{ color: "rgba(0, 0, 0, 0)", rect: [0, 0, 280, 120] }],
            },
            {
              draw: (ctx, textConfig) => {
                const { fontSize, color, text, position } = textConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 28,
                  color: "white",
                  text: `${hours}:${minutes}`,
                  position: [0, 40],
                },
              ],
            },
            {
              draw: (ctx, lineConfig) => {
                const { lineWidth, color, start, end } = lineConfig;
                ctx.setLineWidth(lineWidth);
                ctx.setStrokeStyle(color);
                ctx.beginPath();
                ctx.moveTo(...start);
                ctx.lineTo(...end);
                ctx.stroke();
              },
              args: [
                {
                  lineWidth: 4,
                  color: "yellow",
                  start: [82, 0],
                  end: [82, 55],
                },
              ],
            },
            {
              draw: (ctx, config) => {
                const { fontSize, color, text, position } = config;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 18,
                  color: "white",
                  text: `${year}年${month}月${day}日`,
                  position: [88, 20],
                },
              ],
            },
            {
              draw: (ctx, weatherConfig) => {
                const { fontSize, color, text, position } = weatherConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 18,
                  color: "white",
                  text:
                    daysOfWeek[dayIndex] +
                    " " +
                    weather?.text +
                    " " +
                    weather?.temperature +
                    "℃",
                  position: [88, 50],
                },
              ],
            },
            {
              draw: (ctx, locationConfig) => {
                const { fontSize, color, text, position } = locationConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text: locationName,
                  position: [0, 90],
                },
              ],
            },
            {
              draw: (ctx, coordinateConfig) => {
                const { fontSize, color, text, position } = coordinateConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text:
                    "经纬度: " +
                    (latitude?.toFixed(4) + ", " + longitude?.toFixed(4)),
                  position: [0, 115],
                },
              ],
            },
          ],
          img: Shuiyin1,
        },
      ],
      [
        {
          path: [
            {
              draw: (ctx, backgroundConfig) => {
                const { color, rect } = backgroundConfig;
                ctx.setFillStyle(color);
                ctx.fillRect(...rect);
              },
              args: [{ color: "rgba(0, 0, 0, 0)", rect: [0, 0, 280, 120] }],
            },
            {
              draw: (ctx, textConfig) => {
                const { fontSize, color, text, position } = textConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 28,
                  color: "white",
                  text: `${hours}:${minutes}`,
                  position: [0, 40],
                },
              ],
            },
            {
              draw: (ctx, lineConfig) => {
                const { lineWidth, color, start, end } = lineConfig;
                ctx.setLineWidth(lineWidth);
                ctx.setStrokeStyle(color);
                ctx.beginPath();
                ctx.moveTo(...start);
                ctx.lineTo(...end);
                ctx.stroke();
              },
              args: [
                {
                  lineWidth: 4,
                  color: "yellow",
                  start: [82, 0],
                  end: [82, 55],
                },
              ],
            },
            {
              draw: (ctx, config) => {
                const { fontSize, color, text, position } = config;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 18,
                  color: "white",
                  text: `${year}年${month}月${day}日`,
                  position: [88, 20],
                },
              ],
            },
            {
              draw: (ctx, weatherConfig) => {
                const { fontSize, color, text, position } = weatherConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 18,
                  color: "white",
                  text:
                    daysOfWeek[dayIndex] +
                    " " +
                    weather?.text +
                    " " +
                    weather?.temperature +
                    "℃",
                  position: [88, 50],
                },
              ],
            },
            {
              draw: (ctx, locationConfig) => {
                const { fontSize, color, text, position } = locationConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text: locationName,
                  position: [0, 90],
                },
              ],
            },
            {
              draw: (ctx, coordinateConfig) => {
                const { fontSize, color, text, position } = coordinateConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text:
                    "经纬度: " +
                    (latitude?.toFixed(4) + ", " + longitude?.toFixed(4)),
                  position: [0, 115],
                },
              ],
            },
          ],
          img: Shuiyin1,
        },
      ],
    ];

    setCanvasConfigState(canvasConfig);
    const ctx = Taro.createCanvasContext("fishCanvas");

    // 绘制
    canvasConfig[currentShuiyinIndex][0].path.forEach((item, index) => {
      const { draw, args } = item;
      draw(ctx, ...args);
    });

    ctx.draw(false, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          canvasId: "fishCanvas",
          success: (res) => {
            setCanvasImg(res.tempFilePath);
            // console.log("图片路径：", res.tempFilePath);
            // 这里可以将图片路径保存或用于展示
          },
          fail: (err) => {
            console.error("转换图片失败：", err);
          },
        });
      }, 300); // 延迟执行以确保绘制完成
    });
  };
  useEffect(() => {
    drawMask();
  }, [locationName, weather, latitude]);
  // console.log("canvasImg: ", canvasImg);

  const editShuiyin = () => {
    // currentShuiyinIndex
    console.log("currentShuiyinIndex: ", currentShuiyinIndex);
  };
  return (
    <View className="container">
      <View className="camera-box">
        {permissions.camera && (
          <Camera
            className="camera"
            devicePosition={devicePosition}
            flash={shanguangflag}
            onError={cameraError}
          />
        )}

        {!allAuth && (
          <View className="auth-box">
            <View>
              小程序需要相机、相册、位置权限才可以正常运行，请点击右上角-设置授权后刷新
            </View>

            <AtButton
              type="primary"
              size="normal"
              circle
              onClick={() => {
                Taro.openSetting();
              }}
            >
              去授权
            </AtButton>
          </View>
        )}

        {allAuth && (
          <View className="camera-btns">
            <View className="zoom-box">
              <View className="zoom-text" onClick={zoomClick}>
                {zoomLevel}
                <View className="icon-x"></View>
              </View>
            </View>
            <View className="fanzhuan-icon" onClick={fanzhuanClick}>
              <Image src={fanzhuanImg}></Image>
            </View>
            <View className="shanguangdeng-icon" onClick={shanguangClick}>
              {shanguangflag === "off" ? (
                <Image src={shanguangdengOffImg}></Image>
              ) : (
                <Image src={shanguangdengImg}></Image>
              )}
            </View>
          </View>
        )}
      </View>
      <View className="tools-bar">
        <View className="tools-bar-inner">
          <View className="xiangce">
            <Image
              src={XiangceIcon}
              className="xiangceIcon"
              onClick={selectImg}
            ></Image>
            <Text>相册</Text>
          </View>
          <View className="shuiyin">
            <Image
              src={ShuiyinIcon}
              className="shuiyinIcon"
              onClick={() => {
                setShowFloatLayout(!showFloatLayout);
              }}
            ></Image>
            <Text>修改</Text>
          </View>
        </View>
        <View className="take-photo" onClick={takePhoto}>
          <View className="camera-button">
            <View className="camera-button-inner"></View>
          </View>
        </View>
        <View className="tools-bar-inner">
          <View className="xiangce kefu">
            <Button
              openType="contact"
              style={{
                background: "none",
                color: "inherit",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                outline: "none",
                height: "39px",
              }}
            >
              <Image src={KefuIcon} className="xiangceIcon"></Image>
            </Button>
            <Text>客服</Text>
          </View>
        </View>
      </View>
      <View className="bottom-btns">
        <Button
          className="share-btn"
          openType="share"
          style={{
            background: "linear-gradient(45deg,#ff512f, #dd2476)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            marginLeft: "0",
            fontSize: "30rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "80%",
            margin: "0",
          }}
        >
          分享好友
        </Button>

        {/* <Button
          className="vip-btn"
          onClick={vipModalCLick}
          style={{
            background: "linear-gradient(45deg,#fc4a1a, #f7b733)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            marginRight: "0",
            fontSize: "30rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "45%",
          }}
        >
          高级功能
        </Button> */}
      </View>
      {allAuth && (
        <View className={"mask-box" + (showFloatLayout ? " top" : "")}>
          {/* ******************************* */}
          <Canvas
            canvas-id="fishCanvas"
            className={canvasImg ? "hideCanvas" : ""}
            style={{
              width: "280px",
              height: "120px",
            }}
          />
          {canvasImg && (
            <Image
              src={canvasImg}
              style={{ width: "280px", height: "120px" }}
            ></Image>
          )}
        </View>
      )}
      {/* <AtModal isOpened={vipModal} closeOnClickOverlay={false}>
        <AtModalHeader>
          高级功能
        </AtModalHeader>
        <AtModalContent>
          <View className="modal-list">
            <View>1、可自定义时间、位置</View>
            <View>2、去掉所有广告</View>
            <View>3、高质量水印图片</View>
            <View>4、每月不限量水印照片生成</View>
            <View className="txt1">
              <View style={{ marginBottom: "20px", color: "#000" }}>
                可点击按钮咨询
              </View>
              <View>
                <button
                  openType="contact"
                  style={{
                    background: "linear-gradient(45deg,#2e8b57, #9932cc)",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "0 16px",
                    fontSize: "30rpx",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    width: "100%",
                  }}
                  type="default"
                  className="guide-btn"
                >
                  咨询反馈
                </button>
              </View>
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={copyWx}>关闭</Button>{" "}
        </AtModalAction>
      </AtModal> */}
      <AtFloatLayout
        isOpened={showFloatLayout}
        title="水印选择、修改"
        onClose={() => {
          setShowFloatLayout(!showFloatLayout);
          setEdit(false);
        }}
      >
        {!edit ? (
          <View className="shuiyin-list">
            {canvasConfigState.map((item, index) => {
              return (
                <View
                  className="shuiyin-item"
                  key={index}
                  onClick={() => {
                    setCurrentShuiyinIndex(index);
                  }}
                >
                  <View className="shuiyin-item-img">
                    <Image mode="aspectFit" src={item[0].img}></Image>
                  </View>
                  {currentShuiyinIndex === index && (
                    <View className="shuiyin-item-cover">
                      <Button
                        onClick={() => {
                          setEdit(true);
                          editShuiyin();
                        }}
                      >
                        编辑
                      </Button>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View className="shuiyin-list">ddd</View>
        )}
      </AtFloatLayout>
    </View>
  );
};

export default CameraPage;
