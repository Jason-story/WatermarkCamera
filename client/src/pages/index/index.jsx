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
  RadioGroup,
  Radio,
  Label,
  Input,
  Ad,
  AdCustom,
} from "@tarojs/components";
import Marquee from "../../components/Marquee";
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
import VipArrow from "../../images/vip-arrow.png";
import XiangceIcon from "../../images/xiangce.png";
import KefuIcon from "../../images/kefu.png";
import ShuiyinIcon from "../../images/shuiyin.png";
import Shuiyin1 from "../../images/shuiyin-1.png";
import Shuiyin2 from "../../images/shuiyin-2.png";
import Shuiyin3 from "../../images/shuiyin-3.png";
import Shuiyin4 from "../../images/shuiyin-4.png";
import Shuiyin5 from "../../images/shuiyin-5.png";
import AddMyApp from "../../images/add-my-app.png";
import { appConfigs } from "../../appConfig.js";
import "./index.scss";
import generateCanvasConfig from "./generateConfig";
import dingzhi from "./dz";
const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");
const maxDate = new Date("2030-01-01");
const inviteId = Taro.getCurrentInstance().router.params.id || "";

// const date = `${year}年${month}月${day}日`;
// const time = `${hours}:${minutes}`;
let cloud = "";
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const getCloud = async () => {
  const config = appConfigs[appid] || appConfigs.defaultApp;
  if (config.type === "shared") {
    cloud = await new Taro.cloud.Cloud({
      resourceAppid: config.resourceAppid,
      resourceEnv: config.resourceEnv,
    });
    await cloud.init();
  } else {
    cloud = await Taro.cloud.init({
      env: config.env,
    });
  }
  return cloud;
};
let canTakePhotoFlag = false;

const CameraPage = () => {
  const [cameraContext, setCameraContext] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [settingShow, setSettingShow] = useState(false);
  const [allAuth, setAllAuth] = useState(false);
  const [devicePosition, setDevicePosition] = useState("back");
  const [shanguangflag, setShanguangFlag] = useState("off");
  // const [vipModal, setVipModal] = useState(false);
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
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(0);
  const [price, setPrice] = useState({});
  const [shuiyinTypeSelect, setShuiyinTypeSelected] = useState("img");

  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [canvasConfigState, setCanvasConfigState] = useState([]);
  const [city, setCity] = useState("");
  const [edit, setEdit] = useState(false);
  const [editCity, setEditCity] = useState("");
  const [showToast, setToast] = useState(false);
  const [weekly, setWeekly] = useState(getWeekday(year, month, day));
  const [showAddMyApp, setAddMyAppShow] = useState(true);
  const [hideJw, setHideJw] = useState(true);
  const [shantuiSwitch, setShantuiSwitch] = useState(false);
  const [isShuiyinSaved, saveChange] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [title, setTitle] = useState("工程记录");
  const [vipClosedModal, setVipClosedModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState("");
  const [addAnimate, setAddAnimate] = useState(false);
  const [vipAnimate, setVipAnimate] = useState(false);
  const [inviteModalShow, setInviteModalShow] = useState(false);
  const [update, setUpdate] = useState(false);

  let isWeatherEdited = false;
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
      await getCloud();
      await cloud.init({
        env: "sy-4gecj2zw90583b8b",
      });

      cloud.callFunction({
        name: "addUser",
        success: function (res) {
          setUserInfo(res.result.data);
          if (res.result.data.end_time) {
            Taro.getStorage({ key: "hasVipClosedModalShow" })
              .then(() => {})
              .catch(() => {
                if (Date.now() > res.result.data.end_time) {
                  setVipClosedModal(true);
                  Taro.setStorage({ key: "hasVipClosedModalShow", data: true });
                }
              });
          }
        },
      });
      cloud.callFunction({
        name: "getPrice",
        success: function (res) {
          setPrice(res.result.data);
        },
      });
    };
    wx.getSystemInfo({
      success: function (res) {
        setScreenWidth(res.screenWidth); // 输出屏幕宽度
      },
    });
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
          setWeather(
            res.data.results[0]?.now.text +
              " " +
              res.data.results[0]?.now.temperature
          );
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
    longitude &&
      latitude &&
      !isWeatherEdited &&
      fetchWeather(longitude, latitude);
  }, [allAuth, permissions, city, longitude, latitude]);

  const getLocation = () => {
    if (latitude) return;
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
    // if (city) {
    //   return;
    // }
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
        console.log("detailedAddress: ", detailedAddress);
        // setLocationName("东园宾馆(教育路店)");
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
    if (userInfo.type === "default") {
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: "adunit-58e7bd94d036305e",
        });
        interstitialAd.onLoad(() => {});
        interstitialAd.onError((err) => {
          console.error("插屏广告加载失败", err);
        });
        interstitialAd.onClose(() => {
          setAddAnimate(true);
        });
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error("插屏广告显示失败", err);
        });
      }
    }
    checkPermissions();
    requestPermission();
  }, []);
  useEffect(() => {
    if (allAuth && userInfo.type === "default") {
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: "adunit-58e7bd94d036305e",
        });
        interstitialAd.onLoad(() => {});
        interstitialAd.onError((err) => {
          console.error("插屏广告加载失败", err);
        });
        interstitialAd.onClose(() => {
          setAddAnimate(true);
        });
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error("插屏广告显示失败", err);
        });
      }
    }
  }, [userInfo.type, allAuth]);
  useEffect(() => {
    setVipAnimate(true);
  }, [userInfo.type]);
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
  const takePhoto = async (camera = true, path, serverCanvas) => {
    console.log("canvasImg: ", canvasImg);

    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }
    if (shuiyinTypeSelect === "video" && typeof camera === "object") {
      selectImg();
      return;
    }

    // 相机
    if (camera) {
      // 上传时间位置 保存
      cloud.callFunction({
        name: "updateSavedConfig",
        data: {
          saveConfig: {
            isSaved: isShuiyinSaved,
            currentShuiyinIndex,
            locationName,
            latitude,
            longitude,
          },
        },
      });

      cameraContext?.takePhoto({
        zoom: zoomLevel,
        quality:
          userInfo.type === "default"
            ? "low"
            : shantuiSwitch || serverCanvas
            ? "normal"
            : "original",
        success: (path) => {
          setTimeout(() => {
            Taro.navigateTo({
              url:
                "/pages/result/index?bg=" +
                path.tempImagePath +
                "&mask=" +
                canvasImg +
                "&serverCanvas=" +
                (shantuiSwitch || serverCanvas) +
                "&position=" +
                canvasConfigState[currentShuiyinIndex]?.[0]?.position +
                "&scale=" +
                canvasConfigState[currentShuiyinIndex]?.[0]?.scale +
                "&vip=" +
                canvasConfigState[currentShuiyinIndex]?.[0]?.vip +
                "&id=" +
                inviteId,
            });
          }, 200);
        },
        fail: (error) => {},
      });
    } else {
      // 相册
      Taro.navigateTo({
        url:
          "/pages/result/index?bg=" +
          path +
          "&mask=" +
          canvasImg +
          "&serverCanvas=" +
          (shantuiSwitch || serverCanvas) +
          "&position=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.position +
          "&scale=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.scale +
          "&vip=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.vip +
          "&shuiyinTypeSelect=" +
          shuiyinTypeSelect +
          "&id=" +
          inviteId,
      });
    }
  };

  Taro.useShareAppMessage((res) => {
    console.log("userInfo.openid: ", userInfo.openid);
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });
  // useEffect(() => {
  //   if (
  //     userInfo.type === "buyout" &&
  //     (userInfo.hasDingZhi || userInfo.hasDingZhi === 0)
  //   ) {
  //     setCurrentShuiyinIndex(userInfo.hasDingZhi);
  //     setTimeout(() => {
  //       setLocationName(userInfo.dingZhiLoca || "");
  //       drawMask();
  //     }, 1500);
  //   }
  // }, [userInfo.hasDingZhi]);
  // 判断是否使用服务端保存的数据生成图片
  useEffect(() => {
    if (userInfo?.saveConfig?.isSaved) {
      const {
        currentShuiyinIndex,
        weather,
        locationName,
        latitude,
        longitude,
      } = userInfo.saveConfig;
      setTimeout(() => {
        setCurrentShuiyinIndex(currentShuiyinIndex);
        setWeather(weather);
        setLocationName(locationName);
        setLatitude(latitude);
        setLongitude(longitude);
      }, 1000);
    }
    saveChange(userInfo?.saveConfig?.isSaved);
  }, [userInfo.type, isUseServerData]);
  let isUseServerData = "";
  // 检测本地和服务端数据是否一致 不一致则用服务端数据
  useEffect(() => {
    if (userInfo?.saveConfig?.isSaved && !edit) {
      if (locationName !== userInfo.saveConfig.locationName) {
        setTimeout(() => {
          console.log(
            "userInfo.saveConfig.locationName: ",
            userInfo.saveConfig.locationName
          );
          setLocationName(userInfo.saveConfig.locationName);
          isUseServerData = true;
        }, 1000);
      }
    }
  }, [locationName]);
  useEffect(() => {
    wx.loadFontFace({
      family: "fzlt",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://files-1326662896.cos.ap-beijing.myqcloud.com/fzlt.ttf")',
      success: (res) => {
        drawMask();
      },
      fail: (err) => {},
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(true)
    }, 8000);
  }, []);
  const selectImg = () => {
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }
    if (shuiyinTypeSelect === "img") {
      Taro.chooseImage({
        count: 1,
        success: function (res) {
          const filePath = res.tempFilePaths[0];

          Taro.getFileInfo({
            filePath: filePath,
            success: async function (info) {
              const fileSizeInMB = info.size / (1024 * 1024); // 将文件大小转换为 MB

              if (fileSizeInMB > 3) {
                Taro.showModal({
                  title: "提示",
                  content: "图片体积过大，请重新选择",
                  showCancel: false,
                });
              } else if (fileSizeInMB > 1 && fileSizeInMB < 3) {
                takePhoto(false, filePath, true);
              } else {
                takePhoto(false, filePath);
              }
            },
          });
        },
      });
    } else {
      Taro.chooseMedia({
        count: 1,
        mediaType: "video",
        sourceType: "album",
        success: function (res) {
          const data = res.tempFiles[0];
          const filePath = data.tempFilePath;
          const fileSizeInMB = data.size / (1024 * 1024); // 将文件大小转换为 MB
          if (fileSizeInMB > 50) {
            Taro.showModal({
              title: "提示",
              content: "视频过大(大于50M)，请重新选择",
              showCancel: false,
            });
          }
          takePhoto(false, filePath, true);
        },
      });
    }
  };
  let rafId = "";
  const drawMask = () => {
    if (!locationName) {
      return;
    }
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const query = Taro.createSelectorQuery();
      query
        .select("#fishCanvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0]) {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 首先重置所有可能的阴影属性
            ctx.shadowColor = "rgba(0,0,0,0)";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            const dpr = wx.getSystemInfoSync().pixelRatio;
            const canvasConfig = dingzhi({
              hours,
              minutes,
              year,
              month,
              day,
              weekly,
              weather,
              locationName,
              latitude,
              longitude,
              hideJw,
              title,
              Shuiyin1,
              Shuiyin2,
              Shuiyin3,
              Shuiyin4,
              Shuiyin5,
              dpr,
              canvas,
            });

            const canvasConfigDz = generateCanvasConfig({
              hours,
              minutes,
              year,
              month,
              day,
              weekly,
              weather,
              locationName,
              latitude,
              longitude,
              hideJw,
              title,
              Shuiyin1,
              Shuiyin2,
              Shuiyin3,
              Shuiyin5,
            });
            canvasConfig.push(...canvasConfigDz);
            // 设置canvas宽高
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            // 设置边框样式

            ctx.scale(dpr, dpr);
            setCanvasConfigState(canvasConfig);

            // if (wx.getAccountInfoSync().miniProgram.envVersion !== "release") {
            //   ctx.strokeStyle = "black";
            //   ctx.lineWidth = 1 / dpr; // 确保边框宽度为1像素，考虑设备像素比
            // }
            try {
              canvasConfig[currentShuiyinIndex]?.[0]?.path.forEach(
                (item, index) => {
                  const { draw, args } = item;
                  draw(ctx, ...args);
                }
              );

              // if (wx.getAccountInfoSync().miniProgram.envVersion !== "release") {
              //   // 绘制边框
              //   ctx.strokeRect(0, 0, canvas.width - 2, canvas.height);
              // }

              ctx.restore();
              // 等待绘制完成后获取图像数据
              setTimeout(() => {
                const imageData = canvas.toDataURL("image/png"); // 获取 base64 数据
                const base64Data = imageData.replace(
                  /^data:image\/\w+;base64,/,
                  ""
                ); // 去掉前缀

                // 将 base64 数据转换为二进制数据
                const binaryData = wx.base64ToArrayBuffer(base64Data);

                // 生成唯一的文件名
                const uniqueFileName = `${Date.now()}.png`;
                const tempFilePath = `${wx.env.USER_DATA_PATH}/${uniqueFileName}`;

                // 写入文件系统生成临时文件路径
                const fsm = wx.getFileSystemManager();
                fsm.writeFile({
                  filePath: tempFilePath,
                  data: binaryData,
                  encoding: "binary",
                  success: () => {
                    // 在这里可以使用临时文件路径
                    setCanvasImg(tempFilePath);
                    // console.log("tempFilePath: ", tempFilePath);
                  },
                  fail: (err) => {
                    console.error("写入文件失败：", err);
                  },
                });
              }, 1000); // 延迟执行以确保绘制完成
            } catch (error) {
              console.log("error: ", error);
            }
          }
        });
    });
  };
  let canTakePhotoFlag = false;

  // useEffect(() => {
  //   let count = 0;
  //   const intervalId = setInterval(() => {
  //     if (count < 6) {
  //       setCanTakePhoto(true);
  //       drawMask();
  //       canTakePhotoFlag = true;
  //       count++;
  //     } else {
  //       clearInterval(intervalId);
  //     }
  //   }, 3000);

  //   // 清理函数
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    console.log('update: ', update);

    drawMask();
  }, [
    title,
    weather,
    hideJw,
    latitude,
    longitude,
    minutes,
    locationName,
    hours,
    year,
    month,
    day,
    currentShuiyinIndex,
    canvasConfigState.length,
    update
  ]);
  const updateShuiyinIndex = (current) => {
    setCurrentShuiyinIndex(current);
  };
  // useEffect(() => {
  //   if (allAuth) {
  //     Taro.getStorage({ key: "hasVisited" })
  //       .then(() => {
  //         // 用户已经访问过小程序，不显示弹窗
  //         setShowFirstModal(false);
  //       })
  //       .catch(() => {
  //         // 用户第一次访问小程序，显示弹窗
  //         setShowFirstModal(true);
  //         // 设置标志位，表示用户已经访问过小程序
  //         Taro.setStorage({ key: "hasVisited", data: true });
  //       });
  //   }
  // }, [allAuth]);

  return (
    <View className="container">
      {userInfo.black ? (
        "您存在违规操作，无法使用小程序"
      ) : (
        <View
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            className="camera-box"
            style={{ height: (screenWidth / 3) * 4 + "px" }}
          >
            <Marquee />
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
                {/* <View className="red-envelope-container">
            <Image
              className="red-envelope-image"
              src={Hongbaoicon} // 替换为您的实际图片URL
              onClick={() => {
                Taro.navigateTo({ url: "/pages/meituan/index" });
              }}
            />
          </View> */}

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
            {allAuth && (
              <View className={"mask-box" + (showFloatLayout ? " top" : "")}>
                <Canvas
                  id="fishCanvas"
                  type="2d"
                  // className={canvasImg ? "hideCanvas" : ""}
                  style={{
                    width:
                      canvasConfigState.length > 0 &&
                      canvasConfigState[currentShuiyinIndex]?.[0].width + "px",
                    height:
                      canvasConfigState[currentShuiyinIndex]?.[0].height &&
                      typeof canvasConfigState[currentShuiyinIndex]?.[0]
                        .height === "number"
                        ? canvasConfigState[currentShuiyinIndex]?.[0].height +
                          "px"
                        : canvasConfigState[currentShuiyinIndex]?.[0].height(
                            locationName
                          ) + "px",
                  }}
                />
                {canvasImg && (
                  <Image
                    src={canvasImg}
                    className={canvasImg ? "hideCanvas" : ""}
                    style={{
                      width:
                        canvasConfigState.length > 0 &&
                        canvasConfigState[currentShuiyinIndex]?.[0].width +
                          "px",
                      height:
                        canvasConfigState[currentShuiyinIndex]?.[0].height &&
                        typeof canvasConfigState[currentShuiyinIndex]?.[0]
                          .height === "number"
                          ? canvasConfigState[currentShuiyinIndex]?.[0].height +
                            "px"
                          : canvasConfigState[currentShuiyinIndex]?.[0].height(
                              locationName
                            ) + "px",
                    }}
                  ></Image>
                )}
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
          {/* {userInfo.type === "default" && (
      <ad-custom
        unit-id="adunit-ba74b4bc4303c143"
        style={{ width: "100%" }}
      ></ad-custom>
    )} */}
          {/* JSX 结构 */}
          <View className="tools-bar">
            <View className="tools-bar-inner">
              <View
                className={
                  "xiangce " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Image
                  src={XiangceIcon}
                  className="xiangceIcon"
                  onClick={selectImg}
                ></Image>
                <Text>相册</Text>
              </View>
              <View
                className={
                  "shuiyin " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
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
              <View
                className={
                  "xiangce kefu vip " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Button
                  onClick={() => {
                    Taro.navigateTo({
                      url:
                        "/pages/vip/index?type=" +
                        userInfo.type +
                        "&id=" +
                        inviteId,
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
                  <Image src={VipImg} className="xiangceIcon"></Image>
                </Button>
                <Text>会员</Text>
              </View>
              <View
                className={
                  "xiangce kefu " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Button
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

          {/* {price.show && (
      <View className="shantui-btns" style={{ marginTop: "5px" }}>
        <RadioGroup
          onChange={(e) => {
            setShuiyinTypeSelected(e.detail.value);
          }}
        >
          <View className="imgVideoShuiyin">
            <Label className="vip-item">
              <View>
                <Radio value="img" checked={true} />
              </View>
              <View className="vip-title">图片水印</View>
            </Label>
            <Label className="vip-item video-item">
              <View>
                <Radio value="video" />
              </View>
              <View className="vip-title">
                视频水印
                <Text style={{ color: "gray" }}>（仅支持永久会员使用）</Text>
              </View>
            </Label>
          </View>
        </RadioGroup>
      </View>
    )} */}

          <View className="shantui-btns">
            <View style={{ marginRight: "10px" }}>微信闪退请打开此开关</View>
            <Switch
              checked={shantuiSwitch}
              style={{ transform: "scale(0.7)" }}
              onChange={(e) => {
                setShantuiSwitch(e.detail.value);
              }}
            />
          </View>
          <View className="shantui-btns">
            <View style={{ marginRight: "10px" }}>
              保存位置等数据，下次使用时无需再次修改
            </View>
            <Switch
              disabled={!locationName}
              checked={isShuiyinSaved}
              style={{ transform: "scale(0.7)" }}
              onChange={(e) => {
                saveChange(e.detail.value);
              }}
            />
          </View>
          <View className="bottom-btns" style={{ marginTop: "5px" }}>
            <Button
              className="share-btn"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/jiaocheng/index",
                });
              }}
              style={{
                background: "linear-gradient(45deg, #ff512f, #dd2476)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                padding: "5px 16px",
                fontSize: "32rpx",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                marginBottom: "10px",
                height: "46px",
                marginTop: "10px",
              }}
            >
              使用教程
            </Button>
            {price.show && (
              <Button
                // openType="share"
                onClick={() => {
                  setInviteModalShow(true);
                  // wx.navigateToMiniProgram({
                  //   appId: "wxaea1e208fcacb4d5", // 目标小程序的AppID
                  //   path: "pages/index/index",
                  // });
                }}
                className="share-btn"
                type="button"
              >
                <Text>邀好友得次数</Text>
                <View id="container-stars">
                  <View id="stars"></View>
                </View>

                <View id="glow">
                  <View className="circle"></View>
                  <View className="circle"></View>
                </View>
              </Button>
            )}
          </View>

          <AtModal isOpened={inviteModalShow} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text>提示</Text>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  好友通过您的邀请链接成功使用一次，则您获得一次免费次数，每个好友仅限一次，每天累计最多获赠三次。
                  {/* 好友通过您的邀请链接开通会员，您将获得他付费的20%作为返现，邀请成功请到【我的】页面查看，并联系客服提现。 */}
                </View>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button
                onClick={() => {
                  setInviteModalShow(false);
                }}
                style={{ flex: 1 }}
              >
                关闭
              </Button>
              <Button openType="share" type="button" style={{ flex: 1 }}>
                去邀请
              </Button>
            </AtModalAction>
          </AtModal>
          <AtModal isOpened={vipClosedModal} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text style={{ color: "#ffaa00" }}>提示</Text>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  您的会员已到期,继续使用请重新开通会员
                </View>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button
                onClick={() => {
                  setVipClosedModal(false);
                }}
                style={{ flex: 1 }}
              >
                关闭
              </Button>
              <Button openType="contact" style={{ flex: 1 }}>
                重新开通
              </Button>
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
                          {item[0].vip && (
                            <Image
                              mode="aspectFit"
                              className="vip-arrow"
                              src={VipArrow}
                            ></Image>
                          )}
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
                        <View
                          className="extra-view"
                          style={{ width: "100%!important" }}
                        >
                          <AdCustom
                            unitId="adunit-d0875afa048b3342"
                            style={{ width: "100%!important" }}
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
                      <View className="input-picker">
                        选择城市： {editCity}
                      </View>
                    </Picker>
                    <View className="picker">
                      <Text>详细地点： </Text>
                      <Input
                        className="input"
                        value={locationName}
                        maxlength={30}
                        clear={true}
                        onInput={(e) => {
                          console.log("e: ", e);
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
                        maxlength={8}
                        clear={true}
                        onInput={(e) => {
                          debounce(setTitle(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                  </AtCard>
                  <AtCard title="天气">
                    <View className="picker">
                      <Text>天气&温度： </Text>
                      <Input
                        className="input"
                        value={weather}
                        maxlength={8}
                        clear={true}
                        onInput={(e) => {
                          isWeatherEdited = true;
                          debounce(setWeather(e.detail.value), 100);
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
                  <AtCard title="经度">
                    <View className="picker">
                      <Text>经度： </Text>
                      <Input
                        className="input"
                        value={longitude}
                        maxlength={14}
                        clear={true}
                        type="number"
                        onInput={(e) => {
                          debounce(setLongitude(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                  </AtCard>
                  <AtCard title="纬度">
                    <View className="picker">
                      <Text>纬度： </Text>
                      <Input
                        className="input"
                        value={latitude}
                        type="number"
                        maxlength={14}
                        clear={true}
                        onInput={(e) => {
                          debounce(setLatitude(e.detail.value), 100);
                        }}
                      ></Input>
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
      )}
    </View>
  );
};
export default CameraPage;
