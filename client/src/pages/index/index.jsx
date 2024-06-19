import React, { useEffect, useState } from "react";
import {
  View,
  Camera,
  Button,
  Text,
  Image,
  Canvas,
  Switch,
  Picker,
  Input,
  Ad,
  AdCustom,
} from "@tarojs/components";

import { createCameraContext, useDidShow } from "@tarojs/taro";
import {
  AtButton,
  AtModal,
  AtToast,
  AtCard,
  AtSwitch,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtFloatLayout,
} from "taro-ui";
import Taro from "@tarojs/taro";
import QQMapWX from "qqmap-wx-jssdk";
import ShareImg from "../../images/logo.jpg";
import VipImg from "../../images/vip.png";
import fanzhuanImg from "../../images/fanzhuan.png";
import shanguangdengImg from "../../images/shan-on.png";
import shanguangdengOffImg from "../../images/shan-off.png";
import XiangceIcon from "../../images/xiangce.png";
import KefuIcon from "../../images/kefu.png";
import ShuiyinIcon from "../../images/shuiyin.png";
import Shuiyin1 from "../../images/shuiyin-1.png";
import Shuiyin2 from "../../images/shuiyin-2.png";
import AddMyApp from "../../images/add-my-app.png";

// import canvasConfig from "./canvasConfig";
import "./index.scss";

const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");

const maxDate = new Date("2030-01-01");

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
  const [locationName, setLocationName] = useState("");
  // 水印选择
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(0);
  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [canvasConfigState, setCanvasConfigState] = useState([]);
  const [city, setCity] = useState("");
  const [edit, setEdit] = useState(false);
  const [editCity, setEditCity] = useState("");
  const [showToast, setToast] = useState(false);
  const [weekly, setWeekly] = useState(getWeekday(year, month, day));
  const [showAddMyApp, setAddMyAppShow] = useState(true);
  const [firstModal, setShowFirstModal] = useState(false);
  const [hideJw, setHideJw] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  var cloud = "";
  // 根据年月日计算星期几的函数
  function getWeekday(year, month, day) {
    const weekDays = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const date = new Date(year, month - 1, day); // 月份从0开始，所以需要减去1
    const weekday = date.getDay(); // 获取星期几的数字表示，0代表星期日，1代表星期一，依此类推
    return weekDays[weekday];
  }

  useEffect(() => {
    const init = async () => {
      await Taro.cloud.init({
        env: "sy-4gecj2zw90583b8b",
      });

      Taro.cloud.callFunction({
        name: "addUser",
        success: function (res) {
          setUserInfo(res.result.data);
          console.log("res.result.data: ", res.result.data);
        },
      });
    };
    init();
  }, []);

  const handleDateChange = (e) => {
    const [year, month, day] = e.detail.value.split("-");

    setWeekly(getWeekday(year, month, day));
    setYear(year);
    setMonth(month);
    setDay(day);
  };
  const handleTimeChange = (e) => {
    const [hours, minutes] = e.detail.value.split(":");
    setHours(hours);
    setMinutes(minutes);
  };

  const handleCityChange = (e) => {
    geocoder(e.detail.value);
    setEditCity(e.detail.value);
  };

  const [permissions, setPermissions] = useState({
    camera: false,
    writePhotosAlbum: false,
    userLocation: false,
  });
  const fetchWeather = (longitude, latitude) => {
    // https://www.seniverse.com/
    const url =
      "https://api.seniverse.com/v3/weather/now.json?key=S7OyUofVVMeBcrLsC&location=" +
      `${latitude}:${longitude}` +
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
    longitude && latitude && fetchWeather(longitude, latitude);
  }, [allAuth, permissions.userLocation, city, longitude, latitude]);

  const getLocation = () => {
    if (!permissions.userLocation) return;
    Taro.getLocation({
      type: "gcj02",
      isHighAccuracy: true,
      success: (res) => {
        console.log("res: ", res);
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

  const geocoder = (addr) => {
    const qqmapsdk = new QQMapWX({
      key: "JDRBZ-63BCV-YGNPG-5KPDI-PEAH5-ADBOB",
    });
    qqmapsdk.geocoder({
      address: addr,
      success: (res) => {
        const { lat, lng } = res.result.location;
        setLatitude(lat);
        setLongitude(lng);
      },
      fail: (err) => {
        console.error("Failed to reverse geocode:", err);
      },
    });
  };
  // 防抖函数
  function debounce(func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }
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
        const district = res.result.address_component.district;

        const province = res.result.address_component.province;

        setCity(city);
        setEditCity(province + city + district);

        // 拼接市以下的地址信息，不包括门牌号
        const detailedAddress = `${addr}`;
        setLocationName(detailedAddress);
      },
      fail: (err) => {
        console.error("Failed to reverse geocode:", err);
      },
    });
  };
  let interstitialAd = null;
  useEffect(() => {
    // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
    // 在页面中定义插屏广告

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-39ab5f712a4521b4",
      });
      interstitialAd.onLoad(() => {});
      interstitialAd.onError((err) => {
        console.error("插屏广告加载失败", err);
      });
      interstitialAd.onClose(() => {});
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error("插屏广告显示失败", err);
      });
    }

    checkPermissions();
    requestPermission();
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
  const requestPermission = async () => {
    const scopes = [
      "scope.userLocation",
      "scope.camera",
      "scope.writePhotosAlbum",
    ];

    for (const scope of scopes) {
      try {
        const res = await Taro.getSetting();
        if (!res.authSetting[scope]) {
          try {
            await Taro.authorize({ scope });
            setPermissions({
              [scope.split(".")[1]]: true,
            });
            await Taro.cloud.callFunction({
              name: "addUser",
            });
          } catch (error) {
            console.error(`${scope} 权限被拒绝`, error);
            setPermissions({
              [scope.split(".")[1]]: false,
            });
            await Taro.cloud.callFunction({
              name: "addUser",
            });
          }
        }
      } catch (error) {
        console.error(`获取 ${scope} 权限设置时出错`, error);
      }
    }

    // 执行权限检查后的后续操作
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

  const takePhoto = async (camera = true, path) => {
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }
    if (camera) {
      cameraContext?.takePhoto({
        zoom: zoomLevel,
        quality: "low",
        success: (path) => {
          setTimeout(() => {
            Taro.navigateTo({
              url:
                "/pages/result/index?bg=" +
                path.tempImagePath +
                "&mask=" +
                canvasImg,
            });
          }, 200);
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
  const selectImg = () => {
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }
    Taro.chooseImage({
      count: 1,
      success: function (res) {
        takePhoto(false, res.tempFilePaths[0]);
      },
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
              args: [
                {
                  color: "rgba(0, 0, 0, 0)",
                  rect: [0, 0, 330, 120],
                },
              ],
            },
            // 时间
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
            // 日期
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
            // 天气
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
                    weekly +
                    " " +
                    weather?.text +
                    " " +
                    weather?.temperature +
                    "℃",
                  position: [88, 50],
                },
              ],
            },
            // 位置
            {
              draw: (ctx, locationConfig) => {
                const { fontSize, color, text, position } = locationConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);

                const maxLength = 16;
                const firstLine = text.slice(0, maxLength);
                const secondLine =
                  text.length > maxLength ? text.slice(maxLength) : "";

                ctx.fillText(firstLine, ...position);
                if (secondLine) {
                  ctx.fillText(secondLine, position[0], position[1] + 25); // 15是行高，可以根据需要调整
                }
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text: locationName,
                  position: [0, 80],
                },
              ],
            },
            // 经纬度
            {
              draw: (ctx, coordinateConfig) => {
                let { fontSize, color, text, position } = coordinateConfig;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 25];
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text:
                    hideJw === true
                      ? "经纬度: " +
                        (latitude?.toFixed(5) + ", " + longitude?.toFixed(5))
                      : "",
                  position: [0, 105],
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
          ],
          img: Shuiyin1,
          width: 280,
          // height: 110,
          height: locationName.length > 16 ? 140 : 110,
        },
      ],
      [
        {
          path: [
            // 背景
            {
              draw: (ctx, rectConfig) => {
                const { width, height, color } = rectConfig;

                // 设置矩形的颜色
                ctx.setFillStyle(color);

                // 绘制一个带5px圆角的指定宽高和颜色的矩形
                const radius = 5; // 圆角半径
                ctx.beginPath();
                ctx.moveTo(10 + radius, 0);
                ctx.lineTo(10 + width - radius, 0);
                ctx.arcTo(10 + width, 0, 10 + width, radius, radius);
                ctx.lineTo(10 + width, height - radius);
                ctx.arcTo(
                  10 + width,
                  height,
                  10 + width - radius,
                  height,
                  radius
                );
                ctx.lineTo(10 + radius, height);
                ctx.arcTo(10, height, 10, height - radius, radius);
                ctx.lineTo(10, radius);
                ctx.arcTo(10, 0, 10 + radius, 0, radius);
                ctx.closePath();
                ctx.fill();
                // 设置黄色矩形背景
                ctx.setFillStyle("yellow");
                ctx.fillRect(13, 3, 50, 33);

                // 写入"打卡"文字
                ctx.setFillStyle("black");
                ctx.setFontSize(18);
                ctx.fillText("打卡", 20, 28);
              },
              args: [
                {
                  width: 150,
                  height: 40,
                  color: "white",
                },
              ],
            },
            // 时间
            {
              draw: (ctx, textConfig) => {
                const { fontSize, color, text, position } = textConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 24,
                  color: "#1895e6",
                  text: `${hours}:${minutes}`,
                  position: [82, 30],
                },
              ],
            },
            // 日期
            {
              draw: (ctx, config) => {
                let { fontSize, color, text, position } = config;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 20];
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text: `${year}年${month}月${day}日 ${weekly}`,
                  position: [22, 92],
                },
              ],
            },
            // 地址
            {
              draw: (ctx, locationConfig) => {
                const { fontSize, color, text, position } = locationConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);

                const maxLength = 16;
                const firstLine = text.slice(0, maxLength);
                const secondLine =
                  text.length > maxLength ? text.slice(maxLength) : "";

                ctx.fillText(firstLine, ...position);
                if (secondLine) {
                  ctx.fillText(secondLine, position[0], position[1] + 25); // 15是行高，可以根据需要调整
                }
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text: locationName,
                  position: [22, 65],
                },
              ],
            },
            // 经纬度
            {
              draw: (ctx, coordinateConfig) => {
                let { fontSize, color, text, position } = coordinateConfig;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 27];
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 16,
                  color: "white",
                  text:
                    hideJw === true
                      ? "经纬度: " +
                        (latitude?.toFixed(5) + ", " + longitude?.toFixed(5))
                      : "",
                  position: [10, 115],
                },
              ],
            },
            // 黄色线
            {
              draw: (ctx, lineConfig) => {
                let { lineWidth, color, start, end } = lineConfig;
                ctx.setLineWidth(lineWidth);
                ctx.setStrokeStyle(color);
                ctx.beginPath();
                ctx.moveTo(...start);
                if (locationName.length > 16) {
                  end = [end[0], end[1] + 20];
                }
                ctx.lineTo(...end);
                ctx.stroke();
              },

              args: [
                {
                  lineWidth: 3,
                  color: "yellow",
                  start: [14, 50],
                  end: [14, 95],
                },
              ],
            },
          ],
          img: Shuiyin2,
          width: 280,
          height: locationName.length > 16 ? 150 : 120,
        },
      ],
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // -----------------------------------------
      // []
      // [
      //   {
      //     path: [
      //       // 背景

      //       {
      //         draw: (ctx, rectConfig) => {
      //           const { width, height, color } = rectConfig;

      //           // 设置矩形的颜色
      //           ctx.setFillStyle(color);

      //           // 绘制一个带5px圆角的指定宽高和颜色的矩形
      //           const radius = 5; // 圆角半径
      //           ctx.beginPath();
      //           ctx.moveTo(10 + radius, 0);
      //           ctx.lineTo(10 + width - radius, 0);
      //           ctx.arcTo(10 + width, 0, 10 + width, radius, radius);
      //           ctx.lineTo(10 + width, height - radius);
      //           ctx.arcTo(
      //             10 + width,
      //             height,
      //             10 + width - radius,
      //             height,
      //             radius
      //           );
      //           ctx.lineTo(10 + radius, height);
      //           ctx.arcTo(10, height, 10, height - radius, radius);
      //           ctx.lineTo(10, radius);
      //           ctx.arcTo(10, 0, 10 + radius, 0, radius);
      //           ctx.closePath();
      //           ctx.fill();
      //           // 设置黄色矩形背景
      //           ctx.setFillStyle("yellow");
      //           ctx.fillRect(13, 3, 50, 33);

      //           // 写入"打卡"文字
      //           ctx.setFillStyle("black");
      //           ctx.setFontSize(18);
      //           ctx.fillText("打卡", 20, 28);
      //         },
      //         args: [
      //           {
      //             width: 150,
      //             height: 40,
      //             color: "white",
      //           },
      //         ],
      //       },
      //       // {
      //       //   draw: (ctx, backgroundConfig) => {
      //       //     const { color, rect } = backgroundConfig;
      //       //     ctx.setFillStyle(color);
      //       //     ctx.fillRect(...rect);
      //       //   },
      //       //   args: [{ color: "rgba(0, 0, 0, 0)", rect: [0, 0, 330, 120] }],
      //       // },
      //       // 时间
      //       {
      //         draw: (ctx, textConfig) => {
      //           const { fontSize, color, text, position } = textConfig;
      //           ctx.setFontSize(fontSize);
      //           ctx.setFillStyle(color);
      //           ctx.fillText(text, ...position);
      //         },
      //         args: [
      //           {
      //             fontSize: 24,
      //             color: "#1895e6",
      //             text: `${hours}:${minutes}`,
      //             position: [82, 30],
      //           },
      //         ],
      //       },
      //       // 日期
      //       {
      //         draw: (ctx, config) => {
      //           const { fontSize, color, text, position } = config;
      //           ctx.setFontSize(fontSize);
      //           ctx.setFillStyle(color);
      //           ctx.fillText(text, ...position);
      //         },
      //         args: [
      //           {
      //             fontSize: 16,
      //             color: "white",
      //             text: `${year}年${month}月${day}日 ${weekly}`,
      //             position: [22, 92],
      //           },
      //         ],
      //       },
      //       // 地址
      //       {
      //         draw: (ctx, locationConfig) => {
      //           const { fontSize, color, text, position } = locationConfig;
      //           ctx.setFontSize(fontSize);
      //           ctx.setFillStyle(color);
      //           ctx.fillText(text, ...position);
      //         },
      //         args: [
      //           {
      //             fontSize: 16,
      //             color: "white",
      //             text: locationName,
      //             position: [22, 65],
      //           },
      //         ],
      //       },
      //       // 经纬度
      //       {
      //         draw: (ctx, coordinateConfig) => {
      //           const { fontSize, color, text, position } = coordinateConfig;
      //           ctx.setFontSize(fontSize);
      //           ctx.setFillStyle(color);
      //           ctx.fillText(text, ...position);
      //         },
      //         args: [
      //           {
      //             fontSize: 16,
      //             color: "white",
      //             text:
      //               "经纬度: " +
      //               (latitude??.toFixed(4) + ", " + longitude??.toFixed(4)),
      //             position: [10, 115],
      //           },
      //         ],
      //       },
      //       // 黄色线
      //       {
      //         draw: (ctx, lineConfig) => {
      //           const { lineWidth, color, start, end } = lineConfig;
      //           ctx.setLineWidth(lineWidth);
      //           ctx.setStrokeStyle(color);
      //           ctx.beginPath();
      //           ctx.moveTo(...start);
      //           ctx.lineTo(...end);
      //           ctx.stroke();
      //         },

      //         args: [
      //           {
      //             lineWidth: 3,
      //             color: "yellow",
      //             start: [14, 50],
      //             end: [14, 95],
      //           },
      //         ],
      //       },
      //     ],
      //     img: Shuiyin2,
      //     width: 330,
      //     height: 200,
      //   },
      // ],
    ];
    const ctx = Taro.createCanvasContext("fishCanvas");

    setCanvasConfigState(canvasConfig);
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
  }, [hideJw]);
  useEffect(() => {
    weather && minutes && hours && year && month && day && drawMask();
  }, [
    locationName,
    weather,
    latitude,
    longitude,
    minutes,
    hours,
    year,
    month,
    day,
    currentShuiyinIndex,
    canvasConfigState.length,
  ]);
  const updateShuiyinIndex = (current) => {
    setCurrentShuiyinIndex(current);
  };
  useEffect(() => {
    if (allAuth) {
      Taro.getStorage({ key: "hasVisited" })
        .then(() => {
          // 用户已经访问过小程序，不显示弹窗
          setShowFirstModal(false);
        })
        .catch(() => {
          // 用户第一次访问小程序，显示弹窗
          setShowFirstModal(true);
          // 设置标志位，表示用户已经访问过小程序
          Taro.setStorage({ key: "hasVisited", data: true });
        });
    }
  }, [allAuth]);
  // console.log("canvasConfigState[currentShuiyinIndex][0]: ", canvasConfigState);
  return (
    <View className="container">
      <View className="camera-box">
        {permissions.camera && (
          <Camera
            className="camera"
            resolution="high"
            devicePosition={devicePosition}
            flash={shanguangflag}
            onError={cameraError}
          />
        )}

        {!allAuth && (
          <View className="auth-box">
            <View>
              需要相机、相册、位置权限(需要开启手机系统定位)才可以正常运行，请在底部授权弹窗选择同意或者点击右上角-设置授权后刷新即可
            </View>
            <Button
              className="share-btn"
              onClick={() => {
                Taro.openSetting();
              }}
              style={{
                background: "linear-gradient(45deg,#ff6ec4, #FF5722)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                marginLeft: "0",
                fontSize: "30rpx",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                width: "50%",
                margin: "0 5px 0 0",
              }}
            >
              去授权
            </Button>
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
      {showAddMyApp && (
        <View
          className="add-my-app"
          onClick={() => {
            setAddMyAppShow(false);
          }}
        >
          <Image src={AddMyApp}></Image>
        </View>
      )}
      {userInfo.type === "default" && (
        <ad-custom unit-id="adunit-ba74b4bc4303c143"></ad-custom>
      )}
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
                if (!allAuth) {
                  Taro.showToast({
                    title: "请先授权相机、相册、位置权限",
                    icon: "none",
                  });
                  return;
                }
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
          <View className="xiangce kefu vip">
            <Button
              onClick={() => {
                setVipModal(!vipModal);
              }}
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
              <Image src={VipImg} className="xiangceIcon"></Image>
            </Button>
            <Text>定制</Text>
          </View>
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
          onClick={() => {
            wx.navigateToMiniProgram({
              appId: "wxaea1e208fcacb4d5", // 目标小程序的AppID
              path: "pages/index/index",
            });
          }}
          style={{
            background: "linear-gradient(45deg,#ff6ec4, #7873f5)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            marginLeft: "0",
            fontSize: "30rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "50%",
            margin: "0 5px 0 0",
          }}
        >
          抖音去水印
        </Button>
        <Button openType="share" className="share-btn" type="button">
          <Text> 分享好友</Text>
          <View id="container-stars">
            <View id="stars"></View>
          </View>

          <View id="glow">
            <View className="circle"></View>
            <View className="circle"></View>
          </View>
        </Button>
      </View>
      <View></View>
      {allAuth && (
        <View className={"mask-box" + (showFloatLayout ? " top" : "")}>
          <Canvas
            canvas-id="fishCanvas"
            className={canvasImg ? "hideCanvas" : ""}
            style={{
              width:
                canvasConfigState.length > 0 &&
                canvasConfigState[currentShuiyinIndex][0].width + "px",
              height:
                canvasConfigState.length > 0 &&
                canvasConfigState[currentShuiyinIndex][0].height + "px",
            }}
          />
          {canvasImg && (
            <Image
              src={canvasImg}
              style={{
                width:
                  canvasConfigState.length > 0 &&
                  canvasConfigState[currentShuiyinIndex][0].width + "px",
                height:
                  canvasConfigState.length > 0 &&
                  canvasConfigState[currentShuiyinIndex][0].height + "px",
              }}
            ></Image>
          )}
        </View>
      )}
      <AtModal isOpened={vipModal} closeOnClickOverlay={false}>
        <AtModalHeader>
          <Text style={{ color: "#ffaa00" }}>高级功能</Text>
        </AtModalHeader>
        <AtModalContent>
          <View className="modal-list">
            <View>
              • 定制您专属的水印样式，1:1完美复刻，解决您的考勤打卡难题
            </View>
            <View>• 无广告</View>
            <View>• 高清图片</View>
            <View>• 无限生成水印图片</View>
            <View className="txt1">详细信息请咨询客服</View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={vipModalCLick} style={{ flex: 1 }}>
            关闭
          </Button>
          <Button openType="contact" style={{ flex: 1 }}>
            咨询客服
          </Button>
        </AtModalAction>
      </AtModal>
      <AtModal isOpened={firstModal} closeOnClickOverlay={false}>
        <AtModalHeader>隐私通知</AtModalHeader>
        <AtModalContent className="yinsiModal">
          <View
            className="modal-list"
            style={{
              height: "70px",
              display: "flex",
              alignItems: "center",
            }}
          >
            小程序不会上传您的照片，不会有任何隐私问题，请您放心使用
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => {
              setShowFirstModal(false);
            }}
          >
            关闭
          </Button>{" "}
        </AtModalAction>
      </AtModal>

      <AtFloatLayout
        isOpened={showFloatLayout}
        title="水印选择、修改"
        onClose={(e) => {
          setEdit(false);
          setShowFloatLayout(!showFloatLayout);
        }}
      >
        {!edit ? (
          <View className="shuiyin-list">
            {canvasConfigState.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {/* 会员免广告 */}
                  {index === 1 && userInfo.type === "default" && (
                    <View className="extra-view">
                      <AdCustom
                        unitId="adunit-d0875afa048b3342"
                        style={{ width: "90%!important" }}
                      />
                    </View>
                  )}
                  <View
                    className="shuiyin-item"
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
                            updateShuiyinIndex(index);
                          }}
                        >
                          编辑
                        </Button>
                      </View>
                    )}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        ) : (
          <View className="shuiyin-list">
            <View className="input-item">
              <Text className="tips red">
                只有点击右上角-重新进入小程序，才会恢复默认正确的时间位置等信息
              </Text>
              <Text className="tips">
                星期、天气、经纬度会自动计算,无需修改
              </Text>
              {/* <Switch checked={showInput} onChange={handleSwitchChange} /> */}
              {/* {showInput && <Input placeholder="请输入内容" />} */}
              <AtCard title="时间">
                <Picker
                  mode="date"
                  value={`${year}年${month}月${day}日`}
                  onChange={handleDateChange}
                >
                  <View>选择日期： {`${year}年${month}月${day}日`}</View>
                </Picker>
                <Picker
                  mode="time"
                  value={`${hours}:${minutes}`}
                  onChange={handleTimeChange}
                >
                  <View>选择时间： {`${hours}:${minutes}`}</View>
                </Picker>
              </AtCard>
              <AtCard title="地点">
                <Picker
                  mode="region"
                  value={editCity}
                  onChange={handleCityChange}
                >
                  <View className="input-picker">选择城市： {editCity}</View>
                </Picker>
                <View className="picker">
                  <Text>详细地点： </Text>
                  <Input
                    className="input"
                    value={locationName}
                    maxlength={30}
                    clear={true}
                    onInput={(e) => {
                      debounce(setLocationName(e.detail.value), 100);
                    }}
                  ></Input>
                </View>
              </AtCard>
              <AtCard title="经纬度">
                <View className="picker" style={{ height: "50px" }}>
                  <Text>是否显示： </Text>

                  <Switch
                    checked={hideJw}
                    onChange={(e) => {
                      setHideJw(e.detail.value);
                    }}
                  />
                </View>
              </AtCard>
            </View>
          </View>
        )}
        {!edit && (
          <Text style={{ display: "block", textAlign: "center" }}>
            更多样式开发中...
          </Text>
        )}
      </AtFloatLayout>
      <AtToast isOpened={showToast} text="请输入详细地点"></AtToast>
    </View>
  );
};
export default CameraPage;
