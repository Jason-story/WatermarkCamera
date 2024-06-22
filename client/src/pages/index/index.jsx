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
import Shuiyin3 from "../../images/shuiyin-3.png";
import AddMyApp from "../../images/add-my-app.png";
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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [weather, setWeather] = useState({ text: "", temperature: "" });
  const [canvasImg, setCanvasImg] = useState("");
  const [year, setYear] = useState(yearD);
  const [month, setMonth] = useState(monthD);
  const [day, setDay] = useState(dayD);
  const [hours, setHours] = useState(hoursD);
  const [minutes, setMinutes] = useState(minutesD);
  const [locationName, setLocationName] = useState("");
  // 水印选择
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(2);
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
  const [title, setTitle] = useState("工程记录");
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
  }, [allAuth, permissions, city, longitude, latitude]);

  const getLocation = () => {
    if (!permissions.userLocation) return;
    Taro.getLocation({
      type: "gcj02",
      isHighAccuracy: true,
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
            // await Taro.cloud.callFunction({
            //   name: "addUser",
            // });
          } catch (error) {
            console.error(`${scope} 权限被拒绝`, error);
            setPermissions({
              [scope.split(".")[1]]: false,
            });
            // await Taro.cloud.callFunction({
            //   name: "addUser",
            // });
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
    checkPermissions();
    setCameraContext(context);
    getAuth();
  }, [
    allAuth,
    permissions.camera,
    permissions.userLocation,
    permissions.writePhotosAlbum,
  ]);

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
    // Taro.saveImageToPhotosAlbum({
    //   filePath: canvasImg,
    //   success: async () => {

    //     Taro.showToast({
    //       title: "保存成ww功",
    //       icon: "success",
    //       duration: 2000,
    //     });
    //   },
    // });
    // return

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
        quality: userInfo.type === "default" ? "low" : "original",
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
            // 背景
            {
              draw: (ctx, backgroundConfig) => {
                const { color, rect } = backgroundConfig;
                ctx.setFillStyle(color);
                ctx.fillRect(...rect);
              },
              args: [
                {
                  color: "rgba(0, 0, 0, 0)",
                  rect: [0, 0, 280.5, 102], // 330 * 0.85, 120 * 0.85
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
                  fontSize: 23.8, // 28 * 0.85
                  color: "white",
                  text: `${hours}:${minutes}`,
                  position: [0, 34], // 40 * 0.85
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
                  fontSize: 15.3, // 18 * 0.85
                  color: "white",
                  text: `${year}年${month}月${day}日`,
                  position: [74.8, 17], // 88 * 0.85, 20 * 0.85
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
                  fontSize: 15.3, // 18 * 0.85
                  color: "white",
                  text: `${weekly} ${weather?.text} ${weather?.temperature}℃`,
                  position: [74.8, 42.5], // 88 * 0.85, 50 * 0.85
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
                  ctx.fillText(secondLine, position[0], position[1] + 21.25); // 25 * 0.85
                }
              },
              args: [
                {
                  fontSize: 13.6, // 16 * 0.85
                  color: "white",
                  text: locationName,
                  position: [0, 68], // 80 * 0.85
                },
              ],
            },
            // 经纬度
            {
              draw: (ctx, coordinateConfig) => {
                let { fontSize, color, text, position } = coordinateConfig;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 21.25]; // 25 * 0.85
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 13.6, // 16 * 0.85
                  color: "white",
                  text:
                    hideJw === true
                      ? "经纬度: " +
                        (latitude?.toFixed(5) + ", " + longitude?.toFixed(5))
                      : "",
                  position: [0, 89.25], // 105 * 0.85
                },
              ],
            },
            // 黄色线
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
                  lineWidth: 3.4, // 4 * 0.85
                  color: "yellow",
                  start: [69.7, 0], // 82 * 0.85
                  end: [69.7, 46.75], // 55 * 0.85
                },
              ],
            },
          ],
          img: Shuiyin1,
          width: 238, // 280 * 0.85
          height: locationName.length > 16 ? 119 : 93.5, // 140 * 0.85, 110 * 0.85
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

                // 绘制一个带4.25px圆角的指定宽高和颜色的矩形
                const radius = 4.25; // 5 * 0.85 圆角半径
                ctx.beginPath();
                ctx.moveTo(8.5 + radius, 0); // 10 * 0.85
                ctx.lineTo(8.5 + width - radius, 0);
                ctx.arcTo(8.5 + width, 0, 8.5 + width, radius, radius);
                ctx.lineTo(8.5 + width, height - radius);
                ctx.arcTo(
                  8.5 + width,
                  height,
                  8.5 + width - radius,
                  height,
                  radius
                );
                ctx.lineTo(8.5 + radius, height);
                ctx.arcTo(8.5, height, 8.5, height - radius, radius);
                ctx.lineTo(8.5, radius);
                ctx.arcTo(8.5, 0, 8.5 + radius, 0, radius);
                ctx.closePath();
                ctx.fill();
                // 设置黄色矩形背景
                ctx.setFillStyle("yellow");
                ctx.fillRect(11.05, 2.55, 42.5, 28.05); // 13 * 0.85, 3 * 0.85, 50 * 0.85, 33 * 0.85

                // 写入"打卡"文字
                ctx.setFillStyle("black");
                ctx.setFontSize(15.3); // 18 * 0.85
                ctx.fillText("打卡", 17, 23.8); // 20 * 0.85, 28 * 0.85
              },
              args: [
                {
                  width: 127.5, // 150 * 0.85
                  height: 34, // 40 * 0.85
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
                  fontSize: 20.4, // 24 * 0.85
                  color: "#1895e6",
                  text: `${hours}:${minutes}`,
                  position: [69.7, 25.5], // 82 * 0.85, 30 * 0.85
                },
              ],
            },
            // 日期
            {
              draw: (ctx, config) => {
                let { fontSize, color, text, position } = config;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 17]; // 20 * 0.85
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 13.6, // 16 * 0.85
                  color: "white",
                  text: `${year}年${month}月${day}日 ${weekly}`,
                  position: [18.7, 78.2], // 22 * 0.85, 92 * 0.85
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
                  ctx.fillText(secondLine, position[0], position[1] + 21.25); // 25 * 0.85
                }
              },
              args: [
                {
                  fontSize: 13.6, // 16 * 0.85
                  color: "white",
                  text: locationName,
                  position: [18.7, 55.25], // 22 * 0.85, 65 * 0.85
                },
              ],
            },
            // 经纬度
            {
              draw: (ctx, coordinateConfig) => {
                let { fontSize, color, text, position } = coordinateConfig;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 22.95]; // 27 * 0.85
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 13.6, // 16 * 0.85
                  color: "white",
                  text:
                    hideJw === true
                      ? "经纬度: " +
                        (latitude?.toFixed(5) + ", " + longitude?.toFixed(5))
                      : "",
                  position: [8.5, 97.75], // 10 * 0.85, 115 * 0.85
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
                  end = [end[0], end[1] + 17]; // 20 * 0.85
                }
                ctx.lineTo(...end);
                ctx.stroke();
              },
              args: [
                {
                  lineWidth: 2.55, // 3 * 0.85
                  color: "yellow",
                  start: [11.9, 42.5], // 14 * 0.85, 50 * 0.85
                  end: [11.9, 80.75], // 14 * 0.85, 95 * 0.85
                },
              ],
            },
          ],
          img: Shuiyin2,
          width: 238, // 280 * 0.85
          height: locationName.length > 16 ? 127.5 : 102, // 150 * 0.85, 120 * 0.85
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
      [
        {
          path: [
            // 背景
            {
              draw: (ctx, rectConfig) => {
                const { width, height, color, text } = rectConfig;

                // 设置矩形的颜色
                ctx.setFillStyle(color);

                // 绘制一个带7.5px圆角的指定宽高和颜色的矩形
                const radius = 7.5; // 10 * 0.75 圆角半径
                ctx.beginPath();
                ctx.moveTo(radius, 0);
                ctx.lineTo(width - radius, 0);
                ctx.arcTo(width, 0, width, radius, radius);
                ctx.lineTo(width, height - radius);
                ctx.arcTo(width, height, width - radius, height, radius);
                ctx.lineTo(radius, height);
                ctx.arcTo(0, height, 0, height - radius, radius);
                ctx.lineTo(0, radius);
                ctx.arcTo(0, 0, radius, 0, radius);
                ctx.closePath();
                ctx.fill();

                // 绘制顶部带圆角的蓝色背景
                ctx.setFillStyle("rgb(10, 55, 132)");
                ctx.beginPath();
                ctx.moveTo(radius, 0);
                ctx.lineTo(width - radius, 0);
                ctx.arcTo(width, 0, width, radius, radius);
                ctx.lineTo(width, 30); // 40 * 0.75
                ctx.lineTo(0, 30); // 40 * 0.75
                ctx.lineTo(0, radius);
                ctx.arcTo(0, 0, radius, 0, radius);
                ctx.closePath();
                ctx.fill();

                // 在蓝色背景上绘制黄色小圆点
                ctx.setFillStyle("rgb(246, 196, 44)");
                const centerX = 15; // 20 * 0.75
                const centerY = 15; // 20 * 0.75 蓝色背景高度的一半
                ctx.beginPath();
                ctx.arc(centerX, centerY, 3, 0, Math.PI * 2); // 4 * 0.75
                ctx.closePath();
                ctx.fill();

                // 在蓝色背景中居中显示文字
                ctx.setFillStyle("white");
                ctx.font = "bolder 13.5px sans-serif"; // 18 * 0.75
                const textWidth = ctx.measureText(text).width;
                const textX = (width - textWidth + 7.5) / 2; // 10 * 0.75
                const textY = 21.75; // 29 * 0.75 文字居中显示
                ctx.fillText(text, textX, textY);
              },
              args: [
                {
                  width: 187.5, // 250 * 0.75
                  height: locationName.length > 16 ? 135 : 100, // 180 * 0.75
                  color: "rgba(121, 121, 122, .8)",
                  text: title, // 替换为需要显示的文字
                },
              ],
            },
            // 时间
            {
              draw: (ctx, config) => {
                let { fontSize, color, text, position } = config;
                if (locationName.length > 16) {
                  position = [position[0], position[1] + 15]; // 20 * 0.75
                }
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);
                ctx.fillText(text, ...position);
              },
              args: [
                {
                  fontSize: 13.5, // 18 * 0.75
                  color: "#000",
                  text: `时   间：${year}.${month}.${day}  ${hours}:${minutes}`,
                  position: [11.25, 48.75], // 15 * 0.75, 65 * 0.75
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
                  fontSize: 13.5, // 18 * 0.75
                  color: "#000",
                  text:
                    "天   气：" +
                    weather?.text +
                    " " +
                    weather?.temperature +
                    "℃",
                  position: [11.25, 67.5], // 15 * 0.75, 90 * 0.75
                },
              ],
            },
            // 地址
            {
              draw: (ctx, locationConfig) => {
                const { fontSize, color, text, position, positionSecond } =
                  locationConfig;
                ctx.setFontSize(fontSize);
                ctx.setFillStyle(color);

                const maxLength = 9;
                const firstLine = text.slice(0, maxLength);
                const secondLine =
                  text.length > maxLength ? text.slice(maxLength) : "";

                ctx.fillText("地   点：" + firstLine, ...position);
                if (secondLine) {
                  ctx.fillText(
                    secondLine,
                    positionSecond[0],
                    positionSecond[1] + 18.75
                  ); // 25 * 0.75
                }
              },
              args: [
                {
                  fontSize: 13.5, // 18 * 0.75
                  color: "#000",
                  text: locationName,
                  position: [11.25, 86.25], // 15 * 0.75, 115 * 0.75
                  positionSecond: [60, 86.25], // 80 * 0.75, 115 * 0.75
                },
              ],
            },
          ],
          img: Shuiyin3,
          width: 190, // 280 * 0.75
          height: locationName.length > 16 ? 135 : 110, // 180 * 0.75
        },
      ],
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
    title,
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
            frameSize="large"
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
        <ad-custom
          unit-id="adunit-ba74b4bc4303c143"
          style={{ width: "100%" }}
        ></ad-custom>
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
              // openType="contact"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/me/index",
                });
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
              <Image src={KefuIcon} className="xiangceIcon"></Image>
            </Button>
            <Text>我的</Text>
          </View>
        </View>
      </View>
      <View className="bottom-btns">
        {/* <Button
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
        </Button> */}
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
            <View>• 无广告（封面广告除外）</View>
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
                  {index === 1 && userInfo.type === "default" && (
                    <View className="extra-view">
                      <AdCustom
                        unitId="adunit-d0875afa048b3342"
                        style={{ width: "90%!important" }}
                      />
                    </View>
                  )}
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
                    maxlength={9}
                    clear={true}
                    onInput={(e) => {
                      debounce(setLocationName(e.detail.value), 100);
                    }}
                  ></Input>
                </View>
              </AtCard>
              <AtCard title="标题">
                <View className="picker">
                  <Text>标题： </Text>
                  <Input
                    className="input"
                    value={title}
                    maxlength={18}
                    clear={true}
                    onInput={(e) => {
                      debounce(setTitle(e.detail.value), 100);
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
