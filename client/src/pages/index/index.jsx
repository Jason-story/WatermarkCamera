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
  AtModal,
  AtToast,
  AtInput,
  AtCard,
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
import Setting from "../../images/setting.png";
import Jiaocheng from "../../images/jiaocheng.png";
import KefuIcon from "../../images/kefu.png";
import ShuiyinIcon from "../../images/shuiyin.png";
import Shuiyin1 from "../../images/shuiyin-1.png";
import Shuiyin2 from "../../images/shuiyin-2.png";
import Shuiyin3 from "../../images/shuiyin-3.png";
import Shuiyin4 from "../../images/shuiyin-4.png";
import Shuiyin5 from "../../images/shuiyin-5.png";
import Shuiyin6 from "../../images/shuiyin-6.png";
import AddMyApp from "../../images/add-my-app.png";
import { appConfigs } from "../../appConfig.js";
import Arrow from "../../images/left-arrow.png";
import AddPic from "../../images/add-pic.png";
import Jianhao from "../../images/jianhao.png";

import "./index.scss";
import generateCanvasConfig from "./generateConfig";
import dingzhi from "./dz";
const app = Taro.getApp();
const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");
const maxDate = new Date("2030-01-01");
const inviteId = Taro.getCurrentInstance().router.params.id || "";

const fs = wx.getFileSystemManager();
const CACHE_LIMIT = 30 * 1024; // 设置缓存限制为 50MB（以 KB 为单位）

function getCacheSize(path) {
  let totalSize = 0;
  try {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach((file) => {
        totalSize += getCacheSize(`${path}/${file}`);
      });
    } else {
      totalSize += stats.size / 1024; // 将字节转换为 KB
    }
  } catch (error) {
    console.error("获取缓存大小失败:", error);
  }
  return totalSize;
}

function clearCacheIfNeeded(path) {
  const totalSize = getCacheSize(path);
  console.log("缓存大小:", totalSize + "KB");
  if (totalSize > CACHE_LIMIT) {
    // 如果缓存超过限制，删除缓存
    try {
      fs.rmdirSync(path, true); // 递归删除整个目录
      console.log("缓存已清理");
    } catch (error) {
      console.error("清理缓存失败:", error);
    }
  }
}

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
  const [qrCodePath, setQrCodePath] = useState("");

  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
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
  const [addPhoneNumber, setAddPhoneNumber] = useState(false);
  const [phone, setPhone] = useState("");

  const [screenWidth, setScreenWidth] = useState("");
  const [addAnimate, setAddAnimate] = useState(false);
  const [vipAnimate, setVipAnimate] = useState(false);
  const [inviteModalShow, setInviteModalShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showHasCheck, setShowHasCheck] = useState(undefined);
  const [showTrueCode, setShowTrueCode] = useState(undefined);
  const [disableTrueCode, setDisableTrueCode] = useState(null);
  const [showSettingFloatLayout, setShowSettingFloatLayout] = useState(false);
  const [logoPath, setLogoPath] = useState("");
  const [logoWidth, setLogoWidth] = useState(0);
  const [logoHeight, setLogoHeight] = useState(0);
  let fuckShenHe = app.$app.globalData.fuckShenHe;

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
    // 小程序启动时调用此函数
    clearCacheIfNeeded(wx.env.USER_DATA_PATH);
    const init = async () => {
      await getCloud();
      await cloud.init({
        env: "sy-4gecj2zw90583b8b",
      });

      cloud.callFunction({
        name: "addUser",
        success: function (res) {
          setUserInfo(res.result.data);
          // 会员填写手机号
          if (
            !res.result.data.phone &&
            res.result.data.pay_time &&
            res.result.data.end_time
          ) {
            setAddPhoneNumber(true);
          }
          // 有付费时间 没有到期时间 则到期
          if (res.result.data.pay_time && !res.result.data.end_time) {
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
        name: "getConfig",
        success: function (res) {
          app.$app.globalData.config = res.result.data;
          setCurrentShuiyinIndex(res.result.data.shuiyinindex);

          wx.downloadFile({
            url: app.$app.globalData.config.gzh, // 你的二维码图片地址
            success(res) {
              if (res.statusCode === 200) {
                // 成功下载，设置图片路径到本地路径
                console.log("res.tempFilePath: ", res.tempFilePath);
                setQrCodePath(res.tempFilePath);
              }
            },
            fail(err) {
              console.log("二维码下载失败：", err);
            },
          });
        },
      });
      // 邀请存档
      // if (inviteId) {
      //   Taro.setStorage({ key: "createVipFromInviteId", data: inviteId });

      //   cloud.callFunction({
      //     name: "invite",
      //     data: {
      //       invite_id: inviteId,
      //     },
      //   });
      // }
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
        // setLocationName("东园宾馆(教育路店)");
      },
      fail: (err) => {
        console.error("Failed to reverse geocode:", err);
      },
    });
  };
  let interstitialAd = null;
  useEffect(() => {
    checkPermissions();
    requestPermission();
  }, []);
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
            showTrueCode,
            showHasCheck,
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
        showTrueCode,
        showHasCheck,
      } = userInfo.saveConfig;
      setTimeout(() => {
        setCurrentShuiyinIndex(currentShuiyinIndex);
        setWeather(weather);
        setLocationName(locationName);
        setLatitude(latitude);
        setLongitude(longitude);
        setShowHasCheck(showHasCheck);
        setShowTrueCode(showTrueCode);
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
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-16/13611726462007499_fzlt.ttf?sign=4958a39f2e580a185a5952b7771b509f&t=1726462008")',
      success: (res) => {
        drawMask();
      },
      fail: (err) => {},
    });

    wx.loadFontFace({
      family: "NotoSansMono",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-13/16741726192400525_NotoSansMono.ttf?sign=e538c8b4afae718262ea3eb01d7fc9f1&t=1726192401")',
      success: (res) => {
        console.log("res: ", res);
        drawMask();
      },
      fail: (err) => {
        console.log("err: ", err);
      },
    });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(true);
    }, 4000);
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
              Shuiyin6,
              dpr,
              canvas,
              showHasCheck,
              showTrueCode,
              disableTrueCode,
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
              canvas,
              dpr,
              showHasCheck,
              showTrueCode,
              disableTrueCode,
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
  useEffect(() => {
    if (app.$app.globalData.config.showHasCheck !== undefined) {
      setShowHasCheck(app.$app.globalData.config.showHasCheck);
    }
  }, [app.$app.globalData.config.showHasCheck]);

  useEffect(() => {
    if (app.$app.globalData.config.showHasCheck !== undefined) {
      setShowHasCheck(app.$app.globalData.config.showHasCheck);
    }
  }, [app.$app.globalData.config.showHasCheck]);

  useEffect(() => {
    if (app.$app.globalData.config.showTrueCode !== undefined) {
      setShowTrueCode(app.$app.globalData.config.showTrueCode);
    }
  }, [app.$app.globalData.config.showTrueCode]);

  useEffect(() => {
    setDisableTrueCode(app.$app.globalData.config.disableTrueCode);
  }, [app.$app.globalData.config.disableTrueCode]);

  useEffect(() => {
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
    update,
    // 已验证下标
    showHasCheck,
    // 右下角防伪码
    showTrueCode,
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

  const uploadLogo = () => {
    Taro.chooseImage({
      count: 1,
      success: function (res) {
        const filePath = res.tempFilePaths[0];

        Taro.getFileInfo({
          filePath: filePath,
          success: async function (info) {
            console.log("info: ", info);
            const fileSizeInMB = info.size / (1024 * 1024); // 将文件大小转换为 MB

            if (fileSizeInMB > 2) {
              Taro.showModal({
                title: "提示",
                content: "Logo体积过大，请重新选择",
                showCancel: false,
              });
              return;
            }
            Taro.getImageInfo({
              src: filePath,
              success: async function (info) {
                let height, width;
                height = 70;
                width = (info.width / info.height) * 70;
                if (
                  info.height / info.width > 2.5 ||
                  info.height / info.width < 0.4
                ) {
                  width = 140;
                  height = (info.height / info.width) * 140;
                }
                setLogoWidth(width);
                setLogoHeight(height);
                setLogoPath(filePath);
                app.$app.globalData.config.logoConfig = {
                  width,
                  height,
                  path: filePath,
                  x: 20,
                  y: canvasConfigState[currentShuiyinIndex]?.[0].logoY,
                };
              },
            });
          },
        });
      },
    });
  };

  useEffect(() => {
    if (app.$app.globalData.config.logoConfig) {
      app.$app.globalData.config.logoConfig.y =
        canvasConfigState[currentShuiyinIndex]?.[0].logoY;
    }
  }, [currentShuiyinIndex]);
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
              <View
                className="logo-wrap"
                style={{
                  top:
                    showFloatLayout || showSettingFloatLayout
                      ? (canvasConfigState[currentShuiyinIndex]?.[0].logoY -
                          0.45) *
                          ((screenWidth / 3) * 4) +
                        "px"
                      : canvasConfigState[currentShuiyinIndex]?.[0].logoY *
                          ((screenWidth / 3) * 4) +
                        "px",
                }}
                onClick={() => {
                  uploadLogo();
                }}
              >
                {logoPath && (
                  <Image
                    src={Jianhao}
                    onClick={(e) => {
                      setLogoPath("");
                      app.$app.globalData.config.logoConfig = null;
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    style={{
                      position: "absolute",
                      right: "-13px",
                      top: "-13px",
                      width: "26px",
                      height: "26px",
                    }}
                  ></Image>
                )}
                {logoPath ? (
                  <Image
                    className="logo"
                    src={logoPath}
                    style={{
                      height: logoHeight + "px",
                      width: logoWidth + "px",
                    }}
                  ></Image>
                ) : (
                  <View className="add-pic-wrap">
                    <Image
                      className="add-pic"
                      src={AddPic}
                      style={{ width: "50px", height: "50px" }}
                    ></Image>
                    <Text>上传logo</Text>
                  </View>
                )}
              </View>
            )}
            {allAuth && (
              <View
                className={
                  "mask-box" +
                  (showFloatLayout || showSettingFloatLayout ? " top" : "")
                }
              >
                <Canvas
                  id="fishCanvas"
                  type="2d"
                  // className={canvasImg ? "hideCanvas" : ""}
                  style={{
                    width: screenWidth,
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
                      width: "100%",
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
          {/* ------- */}
          <View className="tools-bar" style={{ marginTop: "-15px" }}>
            <View className="tools-bar-inner">
              <View
                className={
                  "xiangce " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Image
                  src={Jiaocheng}
                  className="xiangceIcon"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/jiaocheng/index",
                    });
                  }}
                ></Image>
                <Text>教程</Text>
              </View>
              <View
                className={
                  "xiangce " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Image
                  src={Setting}
                  className="xiangceIcon"
                  onClick={() => {
                    setShowSetting(!showSetting);
                    setShowSettingFloatLayout(!showSettingFloatLayout);
                  }}
                ></Image>
                <Text>设置</Text>
              </View>
            </View>
            <View className="tools-bar-inner" style={{ marginLeft: "-90px" }}>
              <View>
                <Image
                  src={Arrow}
                  className="leftArrow"
                  style={{ width: "50px", height: "50px" }}
                ></Image>
              </View>
              <View style={{ fontSize: "14px" }}>
                <View>微信闪退？</View>
                <View>保存数据？</View>
                {/* <View>隐藏防伪下标？</View> */}
                <View>请点击设置</View>
              </View>
              {/* {!fuckShenHe && (
                <Image
                  src={qrCodePath}
                  onClick={() => {
                    wx.previewImage({
                      current: qrCodePath, // 当前显示图片的http链接
                      urls: [qrCodePath], // 需要预览的图片http链接列表
                    });
                  }}
                  style={{
                    marginLeft: "30px",
                    position: "absolute",
                    right: "-7px",
                    width: "60px",
                    height: "74px",
                  }}
                ></Image>
              )} */}
            </View>
          </View>
          <View className="bottom-btns" style={{ marginTop: "5px" }}>
            {!fuckShenHe && (
              <Button
                // openType="share"
                onClick={() => {
                  // setInviteModalShow(true);
                  Taro.navigateTo({
                    url: "/pages/vip/index",
                  });
                }}
                className="share-btn"
                type="button"
              >
                <Text>增加次数</Text>
                <View id="container-stars">
                  <View id="stars"></View>
                </View>
                <View id="glow">
                  <View className="circle"></View>
                  <View className="circle"></View>
                </View>
              </Button>
            )}
            {/* <Button
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
            </Button> */}
          </View>
          {/* <AtModal isOpened={inviteModalShow} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text>提示</Text>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  好友打开您的分享链接，则您获得一次免费次数，每个好友仅限一次，每天累计最多获赠三次。
                  <View style={{ color: "#f22c3d" }}>
                    如果您已经开通会员，好友通过您的分享开通会员，将获得他开通额度的20%（可提现），如果您未开通会员，则只能获得5%
                  </View>
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
                去群聊邀请
              </Button>
            </AtModalAction>
          </AtModal> */}
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
              <Button
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/vip/index",
                  });
                }}
                style={{ flex: 1 }}
              >
                重新开通
              </Button>
            </AtModalAction>
          </AtModal>
          {/* 会员填写手机号 防失联 */}
          <AtModal isOpened={addPhoneNumber} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text style={{ color: "#ffaa00" }}>提示</Text>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  尊敬的会员，为防止失联，请填写您的手机号，如有变动第一时间通知您！
                </View>
                <View>
                  <AtInput
                    title="手机号"
                    type="number"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e);
                    }}
                  />
                </View>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button
                onClick={() => {
                  setAddPhoneNumber(false);
                }}
                style={{ flex: 1 }}
              >
                关闭
              </Button>
              <Button
                style={{ flex: 1 }}
                onClick={() => {
                  cloud.callFunction({
                    name: "addUser",
                    data: {
                      phone,
                    },
                  });
                  setAddPhoneNumber(false);
                }}
              >
                提交
              </Button>
            </AtModalAction>
          </AtModal>
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          {/*  -----------------------  */}
          <AtFloatLayout
            isOpened={showSetting}
            title="设置"
            onClose={(e) => {
              setShowSetting(!showSetting);
              setShowSettingFloatLayout(!showSettingFloatLayout);
            }}
          >
            <View className="shuiyin-list">
              <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                <View style={{ marginRight: "10px" }}>
                  微信闪退请打开此开关
                </View>
                <Switch
                  style={{ transform: "scale(0.7)" }}
                  checked={shantuiSwitch}
                  onChange={(e) => {
                    setShantuiSwitch(e.detail.value);
                  }}
                />
              </View>
              <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                <View style={{ marginRight: "10px" }}>
                  保存位置、标题等数据，下次使用时无需再次修改
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
              {/* {disableTrueCode && (
                <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                  <View style={{ marginRight: "10px" }}>
                    是否需要左下角已验证下标
                  </View>
                  <Switch
                    style={{
                      transform: "scale(0.7)",
                      opacity: !canvasConfigState[currentShuiyinIndex]?.[0]
                        ?.left
                        ? 0.2
                        : 1,
                    }}
                    checked={showHasCheck}
                    disabled={
                      !canvasConfigState[currentShuiyinIndex]?.[0]?.left
                    }
                    onChange={(e) => {
                      setShowHasCheck(e.detail.value);
                    }}
                  />
                </View>
              )}
              {disableTrueCode && (
                <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                  <View style={{ marginRight: "10px" }}>
                    是否需要右下角防伪码下标
                  </View>
                  <Switch
                    style={{
                      transform: "scale(0.7)",
                      opacity: !canvasConfigState[currentShuiyinIndex]?.[0]
                        ?.right
                        ? 0.2
                        : 1,
                    }}
                    checked={showTrueCode}
                    disabled={
                      !canvasConfigState[currentShuiyinIndex]?.[0]?.right
                    }
                    onChange={(e) => {
                      setShowTrueCode(e.detail.value);
                    }}
                  />
                </View>
              )} */}
              <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                <View style={{ marginRight: "10px", color: "#f22c3d" }}>
                  所有水印都无法验真，只是样子比较像，请注意使用风险！
                </View>
              </View>
            </View>
          </AtFloatLayout>
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
          {/*  +++++++++++++++++++++++  */}
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
                          debounce(setLocationName(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                  </AtCard>
                  {disableTrueCode && (
                    <AtCard title="左下角已验证下标">
                      <View className="picker" style={{ height: "50px" }}>
                        <Text>是否显示： </Text>

                        <Switch
                          style={{
                            transform: "scale(0.7)",
                            opacity: !canvasConfigState[
                              currentShuiyinIndex
                            ]?.[0]?.left
                              ? 0.2
                              : 1,
                          }}
                          checked={showHasCheck}
                          disabled={
                            !canvasConfigState[currentShuiyinIndex]?.[0]?.left
                          }
                          onChange={(e) => {
                            setShowHasCheck(e.detail.value);
                          }}
                        />
                      </View>
                    </AtCard>
                  )}
                  {disableTrueCode && (
                    <AtCard title="右下角防伪下标">
                      <View className="picker" style={{ height: "50px" }}>
                        <Text>是否显示： </Text>
                        <Switch
                          style={{
                            transform: "scale(0.7)",
                            opacity: !canvasConfigState[
                              currentShuiyinIndex
                            ]?.[0]?.right
                              ? 0.2
                              : 1,
                          }}
                          checked={showTrueCode}
                          disabled={
                            !canvasConfigState[currentShuiyinIndex]?.[0]?.right
                          }
                          onChange={(e) => {
                            setShowTrueCode(e.detail.value);
                          }}
                        />
                      </View>
                    </AtCard>
                  )}
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
                        style={{ transform: "scale(0.7)" }}
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
