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
import Marquee from "../../components/Marquee";
import { createCameraContext, useDidShow } from "@tarojs/taro";
import Close from "../../images/close.png";

import {
  AtModal,
  AtToast,
  AtInput,
  AtCard,
  AtButton,
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
import { appConfigs } from "../../appConfig.js";
import ShuiyinIcon from "../../images/shuiyin.png";
import Shuiyin1 from "../../images/shuiyin-1.png";
import Shuiyin2 from "../../images/shuiyin-2.png";
import Shuiyin3 from "../../images/shuiyin-3.png";
import Shuiyin4 from "../../images/shuiyin-4.png";
import Shuiyin5 from "../../images/shuiyin-5.png";
import Shuiyin6 from "../../images/shuiyin-6.png";
import AddMyApp from "../../images/add-my-app.png";
import Arrow from "../../images/left-arrow.png";
import VideoImg from "../../images/video.png";
import Jianhao from "../../images/jianhao.png";
import AddPic from "../../images/add-pic.png";
import Icon8 from "../../images/icon-8.jpg";
import Mianze from "../../images/mianze.png";

import "./index.scss";
import generateCanvasConfig from "./generateConfig";
import dingzhi from "./dz";
const app = getApp();
let cloud = "";
const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const inviteId = Taro.getCurrentInstance().router.params.id || "";
const zphsId = Taro.getCurrentInstance().router.params.zphsId || "";
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
  if (totalSize > CACHE_LIMIT) {
    // 如果缓存超过限制，删除缓存
    try {
      fs.rmdirSync(path, true); // 递归删除整个目录
    } catch (error) {
      console.error("清理缓存失败:", error);
    }
  }
}

const CameraPage = () => {
  const [shuiyinNameModal, setShuiyinNameModal] = useState(false);
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
  app.$app.globalData.zphsId = zphsId;
  // 水印选择
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(0);
  // const [price, setPrice] = useState({});
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
  const [videoModal, setVideoModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState("");
  const [addAnimate, setAddAnimate] = useState(false);
  const [vipAnimate, setVipAnimate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showHasCheck, setShowHasCheck] = useState(undefined);
  const [showTrueCode, setShowTrueCode] = useState(undefined);
  const [disableTrueCode, setdisableTrueCode] = useState(null);
  const [showSettingFloatLayout, setShowSettingFloatLayout] = useState(false);
  const [logoPath, setLogoPath] = useState("");
  const [logoWidth, setLogoWidth] = useState(0);
  const [logoHeight, setLogoHeight] = useState(0);
  const [rateModal, setRateModal] = useState(false);
  const [shuiyinxiangjiName, setShuiyinxiangjiName] = useState("");

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
    const phoneInputed = Taro.getStorageSync("phoneInputed");
    const showRateModalStorage = Taro.getStorageSync("showRateModalStorage");
    if (phoneInputed && !showRateModalStorage) {
      setRateModal(true);
    }
  }, []);
  useEffect(() => {
    // 小程序启动时调用此函数
    clearCacheIfNeeded(wx.env.USER_DATA_PATH);
    const init = async () => {
      const appid = Taro.getAccountInfoSync().miniProgram.appId;
      const config = appConfigs[appid];
      if (config.type === "shared") {
        cloud = await new Taro.cloud.Cloud({
          resourceAppid: config.resourceAppid,
          resourceEnv: config.resourceEnv,
        });
        await cloud.init();
      } else {
        await Taro.cloud.init({
          env: config.env,
        });
        cloud = Taro.cloud;
      }

      console.log('config.userToApp: ', config.userToApp);
      cloud.callFunction({
        name: "addUser",
        data: {
          userToApp: config.userToApp,
        },
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
                setQrCodePath(res.tempFilePath);
              }
            },
            fail(err) {},
          });
        },
      });
    };
    init();
    // 邀请存档
    if (inviteId) {
      Taro.setStorage({ key: "createVipFromInviteId", data: inviteId });
      // cloud.callFunction({
      //   name: "invite",
      //   data: {
      //     invite_id: inviteId,
      //   },
      // });
    }
    // cloud.callFunction({
    //   name: "getPrice",
    //   success: function (res) {
    //     setPrice(res.result.data);
    //   },
    // });
    wx.getSystemInfo({
      success: function (res) {
        setScreenWidth(res.screenWidth); // 输出屏幕宽度
      },
    });
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
  const [selected, setSelected] = useState("图片水印");

  const handleSelect = (option) => {
    if (option === "图片水印") {
      app.$app.globalData.config.isVideo = false;
    }
    setSelected(option);

    if (
      option === "视频水印" &&
      userInfo.type !== "halfYearMonth" &&
      userInfo.type !== "year" &&
      userInfo.type !== "never"
    ) {
      Taro.showToast({
        title: "此功能只对半年及以上会员开放,最大支持50M视频",
        icon: "none",
        duration: 5000,
      });
    }
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

          } catch (error) {
            console.error(`${scope} 权限被拒绝`, error);
            setPermissions({
              [scope.split(".")[1]]: false,
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
    checkPermissions();
    setCameraContext(context);
    getAuth();
  }, [
    allAuth,
    permissions.camera,
    permissions.userLocation,
    permissions.writePhotosAlbum,
  ]);

  const refreshCurrentPage = () => {
    const currentPages = Taro.getCurrentPages();
    const currentPage = currentPages[currentPages.length - 1];
    const { route, options } = currentPage;

    // 构建带参数的路径
    const params = Object.keys(options)
      .map((key) => `${key}=${options[key]}`)
      .join("&");
    const url = params ? `/${route}?${params}` : `/${route}`;
    Taro.setStorageSync("noReload", "true");
    const result = Taro.getStorageSync("noReload");
    // 重定向到当前页面，保留参数
    Taro.redirectTo({
      url: url,
    });
  };
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
        const result = Taro.getStorageSync("noReload");
        if (!result) {
          // 在需要刷新的地方调用这个函数
          refreshCurrentPage();
        }
      } else {
        setAllAuth(false);
      }
    });
  };

  useEffect(() => {
    if (allAuth) {
      setTimeout(() => {
        Taro.showToast({
          title: "点击水印可编辑时间地点",
          icon: "none",
          duration: 4000,
        });
      }, 500);
    }
  }, [allAuth]);

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
    // Taro.saveImageToPhotosAlbum({
    //   filePath: canvasImg,
    //   success: async () => {
    //     Taro.showToast({
    //       title: "已保存到相册",
    //       icon: "success",
    //       duration: 2000,
    //     });
    //   },
    // });
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }

    console.log("userInfo: ", userInfo);
    if (
      selected === "视频水印" &&
      userInfo.type !== "halfYearMonth" &&
      userInfo.type !== "year" &&
      userInfo.type !== "never"
    ) {
      Taro.showToast({
        title: "此功能只对半年及以上会员开放,最大支持50M视频",
        icon: "none",
        duration: 5000,
      });
      return;
    }
    if (selected === "视频水印") {
      setVideoModal(true);
      return;
    }

    if (
      !shuiyinxiangjiName &&
      showTrueCode &&
      canvasConfigState[currentShuiyinIndex]?.[0]?.right
    ) {
      setShuiyinNameModal(true);
      return;
    }

    // 相机
    if (camera) {
      // 上传时间位置 保存
      console.log("cloud: ", cloud);
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
            shuiyinxiangjiName,
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
      app.$app.globalData.config.isVideo = false;
      Taro.navigateTo({
        url:
          "/pages/result/index?bg=" +
          path +
          "&mask=" +
          canvasImg +
          "&serverCanvas=" +
          (shantuiSwitch || serverCanvas) +
          "&vip=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.vip +
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
        shuiyinxiangjiName,
      } = userInfo.saveConfig;
      setTimeout(() => {
        setCurrentShuiyinIndex(currentShuiyinIndex);
        setWeather(weather);
        setLocationName(locationName);
        setLatitude(latitude);
        setLongitude(longitude);
        setShowHasCheck(showHasCheck);
        setShowTrueCode(showTrueCode);
        setShuiyinxiangjiName(shuiyinxiangjiName);
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
        drawMask();
      },
      fail: (err) => {
        console.log("err: ", err);
      },
    });
  }, []);
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setUpdate((prev) => !prev); // 这里是为了每次赋不同的值
      count++;
      if (count === 4) {
        clearInterval(interval); // 执行两次后清除定时器
      }
    }, 2000);

    return () => clearInterval(interval); // 清除副作用
  }, []);
  const selectImg = () => {
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }

    if (
      selected === "视频水印" &&
      userInfo.type !== "halfYearMonth" &&
      userInfo.type !== "year" &&
      userInfo.type !== "never"
    ) {
      Taro.showToast({
        title: "此功能只对半年及以上会员开放,最大支持50M视频",
        icon: "none",
        duration: 5000,
      });
      return;
    }
    // 显示填写水印弹出提示
    if (
      !shuiyinxiangjiName &&
      showTrueCode &&
      canvasConfigState[currentShuiyinIndex]?.[0]?.right
    ) {
      setShuiyinNameModal(true);
      return;
    }
    if (selected === "图片水印") {
      Taro.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album"],

        success: function (res) {
          const data = res.tempFiles[0];
          const filePath = data.tempFilePath;

          Taro.getFileInfo({
            filePath,
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
      // 视频水印
      Taro.chooseMedia({
        count: 1,
        mediaType: ["video"],
        sourceType: ["album"],
        success: function (res) {
          const data = res.tempFiles[0];
          const path = data.tempFilePath;
          const bg = data.thumbTempFilePath;
          const fileSizeInMB = data.size / (1024 * 1024); // 将文件大小转换为 MB
          if (fileSizeInMB > 50) {
            Taro.showModal({
              title: "提示",
              content: "视频过大(大于50M)，请重新选择",
              showCancel: false,
            });
            return;
          }

          app.$app.globalData.config.isVideo = true;
          app.$app.globalData.config.videoPath = path;
          Taro.navigateTo({
            url:
              "/pages/result/index?bg=" +
              bg +
              "&mask=" +
              canvasImg +
              "&serverCanvas=true" +
              "&vip=" +
              canvasConfigState[currentShuiyinIndex]?.[0]?.vip +
              "&id=" +
              inviteId,
          });

          // takePhoto(false, filePath, true);
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
              shuiyinxiangjiName,
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
              shuiyinxiangjiName,
            });
            canvasConfig.push(...canvasConfigDz);
            // 设置canvas宽高
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            // 设置边框样式
            // canvas.addEventListener("touchstart", () => {
            //   console.log(4444)
            //   setEdit(true);
            // });
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
    if (app.$app.globalData.config.showTrueCode !== undefined) {
      setShowTrueCode(app.$app.globalData.config.showTrueCode);
    }
  }, [app.$app.globalData.config.showTrueCode]);

  useEffect(() => {
    setdisableTrueCode(app.$app.globalData.config.disableTrueCode);
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
    shuiyinxiangjiName,
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
    Taro.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      success: function (res) {
        const data = res.tempFiles[0];
        const filePath = data.tempFilePath;

        Taro.getFileInfo({
          filePath,
          success: async function (info) {
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
                height = 100;
                width = (info.width / info.height) * 100;
                if (
                  info.height / info.width > 2.5 ||
                  info.height / info.width < 0.4
                ) {
                  width = 150;
                  height = (info.height / info.width) * 150;
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

  // useEffect(() => {
  //   if (
  //     !shuiyinxiangjiName.includes("今日") ||
  //     !shuiyinxiangjiName.includes("马克")
  //   )
  //     Taro.showToast({
  //       title: "名称请填写 衿日水印相机 或者 码可水印相机",
  //       icon: "error",
  //     });
  // }, [shuiyinxiangjiName]);

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
                <View style={{ marginBottom: "30px" }}>
                  小程序支持用户自定义水印时间、地点、经纬度等信息。同时也支持给视频添加水印。
                </View>
                <View>
                  需要相机、相册、位置权限(需要开启手机系统定位)才可以正常运行。{" "}
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
                  onTouchStart={(e) => {
                    setShowFloatLayout(!showFloatLayout);
                    setEdit(true);
                  }}
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
              <View
                className={
                  "camera-button" +
                  (selected === "视频水印" ? " camera-button-video" : "")
                }
              >
                <View
                  className={
                    "camera-button-inner" +
                    (selected === "视频水印"
                      ? " camera-button-inner-video"
                      : "")
                  }
                ></View>
              </View>
            </View>
            <View className="tools-bar-inner">
              {
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
              }
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
                  src={Mianze}
                  className="xiangceIcon"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/mianze/index",
                    });
                  }}
                ></Image>
                <Text>声明</Text>
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

            <View
              className="tools-bar-inner"
              style={{
                position: "absolute",
                left: "48%",
                transform: "translateX(-50%)",
                width: "auto !important",
                padding: 0,
              }}
            >
              <View>
                <Image
                  src={Arrow}
                  className="leftArrow"
                  style={{ width: "25px", height: "25px" }}
                ></Image>
              </View>
              <View style={{ fontSize: "12px", marginLeft: "5px" }}>
                <View>微信闪退？</View>
                <View>保存数据？</View>
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
            <View className="tools-bar-inner">
              <View
                className={
                  "kefu vip xiangce " +
                  (vipAnimate || addAnimate ? "button-animate " : "")
                }
              >
                <Image
                  src={VideoImg}
                  className="xiangceIcon"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/video/index",
                    });
                  }}
                ></Image>
                <Text>视频</Text>
              </View>
            </View>
          </View>
          {fuckShenHe === false && (
            <View
              className="button-group"
              style={{
                margin: "0px auto 10px auto",
                padding: "0 15px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {["图片水印", "视频水印"].map((option, index) => {
                return (
                  <AtButton
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={{
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      padding: "0 20px",
                      fontSize: "30rpx",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    className={`button-group__button ${
                      selected === option
                        ? "button-group__button--selected selected_" + index
                        : ""
                    }`}
                  >
                    {option.slice(0, 2) + "加" + option.slice(2)}
                  </AtButton>
                );
              })}
            </View>
          )}
          <View
            className="bottom-btns"
            style={{ marginTop: "5px", paddingBottom: "20px" }}
          >
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
                padding: "0 20px",
                fontSize: "28rpx",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "39px",
                marginTop: "10px",
              }}
            >
              使用教程
            </Button>
          </View>
          <AtModal isOpened={shuiyinNameModal} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text>提示</Text>
              <View
                onClick={() => {
                  setShowFloatLayout(!showFloatLayout);
                }}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  width: "20px",
                  height: "20px",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  src={Close}
                ></Image>
              </View>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="">
                  <View
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <View>请先填写水印名称后再拍照或相册选图，如下图所示</View>
                    <Image
                      src={Icon8}
                      style={{
                        marginTop: "10px",
                        width: "280px",
                        height: "68px",
                      }}
                    ></Image>
                  </View>
                </View>
              </View>
            </AtModalContent>
            <AtModalAction>
              <Button
                onClick={() => {
                  setShuiyinNameModal(false);
                }}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  setShowFloatLayout(!showFloatLayout);
                  setShuiyinNameModal(false);
                  setEdit(true);
                }}
              >
                去填写
              </Button>
            </AtModalAction>
          </AtModal>

          <AtModal isOpened={videoModal} closeOnClickOverlay={true}>
            <AtModalHeader>
              <Text>提示</Text>
              <View
                onClick={() => {
                  setVideoModal(false);
                }}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  width: "20px",
                  height: "20px",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  src={Close}
                ></Image>
              </View>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  请您用手机的 原相机
                  拍摄一段视频后，然后再从相册选择即可。目前最大支持50M以内视频，请控制视频时长。
                </View>
              </View>
            </AtModalContent>
          </AtModal>

          {/* 评价提示 开始 */}
          <AtModal isOpened={rateModal} closeOnClickOverlay={false}>
            <AtModalHeader>
              <Text>提示</Text>
              <View
                onClick={() => {
                  setRateModal(false);
                  Taro.setStorage({
                    key: "showRateModalStorage",
                    data: "true",
                  });
                }}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  width: "20px",
                  height: "20px",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  src={Close}
                ></Image>
              </View>
            </AtModalHeader>
            <AtModalContent>
              <View className="modal-list">
                <View className="txt1">
                  尊敬的会员，为了更好的服务，麻烦您点击 右上角 - 体验评分
                  给一个 文字 + 五星好评，感谢！
                </View>
              </View>
            </AtModalContent>
          </AtModal>
          {/* 评价提示结束 */}
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

          {addPhoneNumber && (
            <AtModal isOpened={addPhoneNumber} closeOnClickOverlay={false}>
              <AtModalHeader>
                <Text style={{ color: "#ffaa00" }}>提示</Text>
              </AtModalHeader>
              <AtModalContent>
                <View className="modal-list">
                  <View className="txt1">
                    尊敬的会员，为防止失联，请填一定填写正确手机号，如有变动第一时间通知您！如果填写错误请联系客服修改。
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
                  style={{ flex: 1 }}
                  onClick={async () => {
                    const validatePhone = (phoneNumber) => {
                      // 中国大陆手机号的正则
                      const phoneRegex = /^1[3-9]\d{9}$/;
                      return phoneRegex.test(phoneNumber);
                    };
                    if (!validatePhone(phone)) {
                      Taro.showToast({
                        title: "手机号格式不正确",
                        icon: "none",
                        duration: 2000,
                      });
                      return;
                    }
                    setAddPhoneNumber(false);

                    await cloud.callFunction({
                      name: "addUser",
                      data: {
                        phone,
                      },
                    });
                    Taro.setStorage({ key: "phoneInputed", data: true });
                  }}
                >
                  提交
                </Button>
              </AtModalAction>
            </AtModal>
          )}
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
            <View className="shuiyin-list shuiyin-list-no-grid">
              <View className="shantui-btns" style={{ marginBottom: "10px" }}>
                <View style={{ marginRight: "10px" }}>
                  微信闪退、保存失败请打开此开关
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
                  保存位置、标题、相机名称等数据，下次使用时无需再次修改
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
            </View>
          </AtFloatLayout>
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
                    <View key={index}>
                      <View className="shuiyin-item">
                        <View
                          className="shuiyin-item-img"
                          onTouchStart={(e) => {
                            setCurrentShuiyinIndex(index);
                          }}
                        >
                          <Image mode="aspectFit" src={item[0].img}></Image>
                        </View>
                        {currentShuiyinIndex === index && (
                          <View
                            className="shuiyin-item-cover"
                            onTouchStart={(e) => {
                              console.log(111, e);
                              setEdit(true);
                              updateShuiyinIndex(index);
                            }}
                          >
                            <Button>编辑</Button>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="shuiyin-list shuiyin-list-no-grid edit-box">
                <View className="input-item">
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
                  {
                    <View className="syxjName-box">
                      <AtCard title="水印相机名称，自动显示在左右下角">
                        <View
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          填写需要的水印名称，最多4个字
                          <Text
                            style={{
                              color: "#f22c3d",
                            }}
                          >
                            （岑曰水印、马可水印）
                          </Text>
                        </View>
                        <View className="picker">
                          <Text>水印相机名称： </Text>
                          <Input
                            className="input"
                            value={shuiyinxiangjiName}
                            maxlength={4}
                            clear={true}
                            placeholder="点击添加"
                            onInput={(e) => {
                              debounce(
                                setShuiyinxiangjiName(
                                  e.detail.value.replace(/\s+/g, "")
                                ),
                                10
                              );
                            }}
                          ></Input>
                        </View>
                      </AtCard>
                    </View>
                  }
                  {disableTrueCode &&
                    canvasConfigState[currentShuiyinIndex]?.[0]?.right && (
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
                              !canvasConfigState[currentShuiyinIndex]?.[0]
                                ?.right
                            }
                            onChange={(e) => {
                              setShowTrueCode(e.detail.value);
                            }}
                          />
                        </View>
                      </AtCard>
                    )}

                  {disableTrueCode &&
                    canvasConfigState[currentShuiyinIndex]?.[0]?.left && (
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
                            onChange={(e) => {
                              setShowHasCheck(e.detail.value);
                            }}
                          />
                        </View>
                      </AtCard>
                    )}

                  {canvasConfigState[currentShuiyinIndex]?.[0]?.title && (
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
                  )}
                  {canvasConfigState[currentShuiyinIndex]?.[0]?.weather && (
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
                  )}

                  {canvasConfigState[currentShuiyinIndex]?.[0]?.jingweidu && (
                    <>
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
                    </>
                  )}
                </View>
              </View>
            )}
            {!edit && (
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                更多水印样式开发中...
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
