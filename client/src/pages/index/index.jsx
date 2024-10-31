import React, { useEffect, useState } from "react";
import {
  View,
  Camera,
  Button,
  Text,
  Image,
  Snapshot,
  Input,
  Picker,
  Switch,
} from "@tarojs/components";
import Marquee from "../../components/Marquee";
import { createCameraContext, useDidShow } from "@tarojs/taro";
import Close from "../../images/close.png";
import P1 from "../../images/p-1.png";
import P2 from "../../images/p-2.png";
import P3 from "../../images/p-3.png";
import P4 from "../../images/p-4.png";
import P5 from "../../images/p-5.png";
import ShuiyinDoms from "../../components/shuiyin";
import { generateRandomString } from "../../components/utils.js";

import {
  AtModal,
  AtToast,
  AtInput,
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
import KefuIcon from "../../images/kefu.png";
import { appConfigs } from "../../appConfig.js";
import ShuiyinIcon from "../../images/shuiyin.png";
import AddMyApp from "../../images/add-my-app.png";
import VideoImg from "../../images/video.png";
import Jianhao from "../../images/jianhao.png";
import AddPic from "../../images/add-pic.png";
import Icon8 from "../../images/icon-8.jpg";
import Icon2 from "../../images/icon-2.png";
import Mianze from "../../images/mianze.png";
import "./index.scss";
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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [weather, setWeather] = useState({ text: "", temperature: "" });
  const [year, setYear] = useState(yearD);
  const [month, setMonth] = useState(monthD);
  const [day, setDay] = useState(dayD);
  const [hours, setHours] = useState(hoursD);
  const [minutes, setMinutes] = useState(minutesD);
  const [locationName, setLocationName] = useState("");
  app.$app.globalData.zphsId = zphsId;
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(0);
  const [dakaName, setDakaName] = useState("打卡");
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
  const [fangdaoShuiyin, setFangDaoShuiyin] = useState("盗图必究");
  const [cameraTempPath, setCameraTempPath] = useState("");
  const [remark, setRemark] = useState("");

  let fuckShenHe = app.$app.globalData.fuckShenHe;
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
    longitude && latitude && fetchWeather(longitude, latitude);
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
      Taro.showToast({
        title: "点击水印可编辑时间地点",
        icon: "none",
        duration: 3000,
      });
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

  const cameraPathOnload = () => {
    Taro.showLoading({
      title: "图片生成中...",
    });
    Taro.createSelectorQuery()
      .select(".snapshot")
      .node()
      .exec((res) => {
        const node = res[0].node;
        node.takeSnapshot({
          type: "arraybuffer",
          format: "png",
          success: async (res) => {
            const f = `${wx.env.USER_DATA_PATH}/shuiyin.png`;
            const fs = wx.getFileSystemManager();
            await fs.writeFileSync(f, res.data, "binary");
            Taro.hideLoading();
            wx.showToast({
              title: "保存成功",
            });

            setCameraTempPath(undefined);
            wx.saveImageToPhotosAlbum({
              filePath: f,
            });
          },
          fail(res) {
            Taro.hideLoading();
            wx.showToast({
              icon: "error",
              title: "失败，请重试",
            });
            setCameraTempPath(undefined);
          },
        });
      });
  };
  const takePhoto = async (camera = true, path, serverCanvas) => {
    // console.log("canvasImg: ", canvasImg);
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
            weather,
            remark,
            dakaName,
            fangdaoShuiyin,
          },
        },
      });

      cameraContext?.takePhoto({
        zoom: zoomLevel,
        quality: userInfo.type === "default" ? "low" : "original",
        success: async (path) => {
          await setCameraTempPath(path.tempImagePath);
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
          inviteId +
          "&realWidth=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.finalWidth +
          "&realHeight=" +
          canvasConfigState[currentShuiyinIndex]?.[0]?.finalHeight,
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
        fangdaoShuiyin,
        dakaName,
        remark,
      } = userInfo.saveConfig;
      setTimeout(() => {
        setCurrentShuiyinIndex(currentShuiyinIndex);
        setWeather(weather);
        setRemark(remark);
        setLocationName(locationName);
        setLatitude(latitude);
        setLongitude(longitude);
        setShowHasCheck(showHasCheck);
        setShowTrueCode(showTrueCode);
        setShuiyinxiangjiName(shuiyinxiangjiName);
        setDakaName(dakaName);
        setFangDaoShuiyin(fangdaoShuiyin || "盗图必究");
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
        },
      });
    }
  };
  const drawMask = () => {};

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

  const updateShuiyinIndex = (current) => {
    setCurrentShuiyinIndex(current);
  };

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
                  y:
                    typeof canvasConfigState[currentShuiyinIndex]?.[0]
                      .height === "function"
                      ? canvasConfigState[currentShuiyinIndex]?.[0].height()
                      : canvasConfigState[currentShuiyinIndex]?.[0].height,
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
        typeof canvasConfigState[currentShuiyinIndex]?.[0].height === "function"
          ? canvasConfigState[currentShuiyinIndex]?.[0].height()
          : canvasConfigState[currentShuiyinIndex]?.[0].height;
    }
  }, [currentShuiyinIndex]);

  let canvasRealHeight;
  if (
    typeof canvasConfigState[currentShuiyinIndex]?.[0].height === "function"
  ) {
    canvasRealHeight = canvasConfigState[currentShuiyinIndex]?.[0].height();
  } else {
    canvasRealHeight = canvasConfigState[currentShuiyinIndex]?.[0].height;
  }

  const systemInfo = wx.getSystemInfoSync();

  // 判断是否是真机
  const isRealDevice = systemInfo.platform !== "devtools";
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
            style={{
              height:
                (canvasConfigState[currentShuiyinIndex]?.[0].proportion
                  ? canvasConfigState[currentShuiyinIndex]?.[0].proportion *
                    screenWidth
                  : (screenWidth / 3) * 4) + "px",
            }}
          >
            <Marquee />

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

            {allAuth && canvasConfigState[currentShuiyinIndex]?.[0].logoY && (
              <View
                className="logo-wrap"
                style={{
                  bottom:
                    showFloatLayout || showSettingFloatLayout
                      ? (screenWidth / 3) * 4 * 0.5 +
                        (canvasRealHeight + 10) +
                        "px"
                      : canvasRealHeight + 10 + "px",
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
                <Snapshot className="snapshot">
                  <View
                    style={{
                      height: "100%",
                      position: "relative",
                    }}
                    onClick={(e) => {
                      setShowFloatLayout(!showFloatLayout);
                      setEdit(true);
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        widh: "100%",
                        position: "relative",
                        background: "#756666",
                      }}
                    >
                      {isRealDevice && (
                        <Camera
                          className="camera"
                          resolution="high"
                          devicePosition={devicePosition}
                          flash={shanguangflag}
                          frameSize="medium"
                          onError={cameraError}
                        />
                      )}
                      {!isRealDevice && (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            opacity: 0.1,
                          }}
                          src={
                            "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/placeholder.jpg?sign=70c36abd181c0db12cee0f82114561bf&t=1730346325"
                          }
                        ></Image>
                      )}

                      {cameraTempPath && (
                        <Image
                          src={cameraTempPath}
                          onLoad={cameraPathOnload}
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            zIndex: 2,
                            top: "0",
                            left: "0",
                          }}
                        ></Image>
                      )}
                    </View>
                    {userInfo.type === "default" && (
                      <View
                        style={{
                          color: "rgba(0,0,0,.2)",
                          fontSize: "30px",
                          fontWeight: "bold",
                          position: "absolute",
                          fontFamily: "Bebas",
                          textAlign: "center",
                          top: "50%",
                          left: "50%",
                          width: "300px",
                          height: "100px",
                          marginLeft: "-150px",
                          marginTop: "-50px",
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
                        remark,
                      })}
                    </View>
                    {/* 右下角 copyright  水印相机logo */}
                    {ShuiyinDoms[currentShuiyinIndex].options?.copyright ===
                      "syxj" && (
                      <View className="copySYXJ">
                        <Image
                          src={Icon2}
                          style={{
                            width: "52px",
                            height: "14px",
                          }}
                        ></Image>
                      </View>
                    )}
                    {/* 左下角*/}
                    {ShuiyinDoms[currentShuiyinIndex].options?.copyright ===
                      "jrsy" &&
                      showHasCheck &&
                      ShuiyinDoms[currentShuiyinIndex].options
                        ?.showLeftCopyright && (
                        <View
                          style={{ position: "absolute", left: 0, bottom: 0 }}
                        >
                          {/* 如果马克相机则单独处理 其他则是默认加上相机名 */}

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
                      )}
                    {ShuiyinDoms[currentShuiyinIndex].options?.copyright ===
                      "mk" &&
                      showHasCheck && (
                        <View
                          style={{ position: "absolute", left: 0, bottom: 0 }}
                        >
                          <View className="make-left-copyright">
                            <Image src={P1}></Image>
                            <Text>马克相机已验证照片真实性</Text>
                          </View>
                        </View>
                      )}
                    {/* 提示填写水印名字图标 */}
                    {disableTrueCode && showTrueCode && !shuiyinxiangjiName && (
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
                    )}
                    {/*今日水印 右下角*/}
                    {shuiyinxiangjiName &&
                      ShuiyinDoms[currentShuiyinIndex].options?.copyright ===
                        "jrsy" &&
                      showTrueCode && (
                        <View
                          style={{ position: "absolute", right: 0, bottom: 0 }}
                        >
                          <View className="jinri-right-copyright">
                            {/* 今日水印 右下角背景图 */}
                            <Image src={P2}></Image>
                            {/* 右下角今日水印四个字图片 */}
                            {shuiyinxiangjiName.includes("今日水印") && (
                              <Image
                                src={P3}
                                style={{
                                  position: "absolute",
                                  right: "2px",
                                  top: "0px",
                                  width: "56px",
                                  height: "12.3px",
                                }}
                              ></Image>
                            )}
                            {/* 今日水印 防伪码 */}
                            <Text
                              style={{
                                fontSize: "7px",
                                fontFamily: "PTMono",
                                position: "absolute",
                                color: "rgba(255,255,255,.9)",
                                right: "1px",
                                bottom: "-1px",
                              }}
                            >
                              {generateRandomString(4)}
                            </Text>
                            {!shuiyinxiangjiName.includes("今日水印") && (
                              <Text
                                style={{
                                  position: "absolute",
                                  color: "rgba(255, 255, 255,.9)",
                                  right: "3px",
                                  top: "0px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  width: "100rpx",
                                }}
                              >
                                {shuiyinxiangjiName}
                              </Text>
                            )}
                          </View>
                        </View>
                      )}
                    {/* 马克右下角 */}
                    {shuiyinxiangjiName &&
                      ShuiyinDoms[currentShuiyinIndex].options?.copyright ===
                        "mk" &&
                      showTrueCode && (
                        <View
                          style={{ position: "absolute", right: 0, bottom: 0 }}
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
                              }}
                            >
                              防伪
                              <Text
                                style={{
                                  fontSize: "9px",
                                  fontFamily: "Monaco",
                                }}
                              >
                                {" " + generateRandomString(3)}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      )}
                  </View>
                </Snapshot>
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
                style={{
                  marginRight: "auto",
                }}
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
            {/* <View className="tools-bar-inner">

            </View> */}
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
                // className={
                //   "kefu vip xiangce " +
                //   (vipAnimate || addAnimate ? "button-animate " : "")
                // }
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

              {/* <View
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
              </View> */}
            </View>
            {/* <View
              className="shantui-btns"
              style={{ marginLeft: "-50px", width: "230px" }}
            >
              <View style={{ fontSize: "15px" }}>
                微信闪退、图片长时间没有生成，请打开此开关
              </View>
              <Switch
                style={{ transform: "scale(0.7)" }}
                checked={shantuiSwitch}
                onChange={(e) => {
                  setShantuiSwitch(e.detail.value);
                }}
              />
            </View> */}
            {/* <View
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

            </View> */}
          </View>
          {fuckShenHe === false && (
            <View
              className="button-group"
              style={{
                margin: "0px auto 10px auto",
                padding: "0 15px",
                width: "100%",
                boxSizing: "border-box",
                lineHeight: 1,
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
                        height: "67px",
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
          <AtFloatLayout
            isOpened={showSetting}
            title="设置"
            onClose={(e) => {
              setShowSetting(!showSetting);
              setShowSettingFloatLayout(!showSettingFloatLayout);
            }}
          >
            {/* <View className="shuiyin-list shuiyin-list-no-grid">
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
                  地点、标题、水印名称等数据，下次使用时无需再次修改
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
            </View> */}
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
                {ShuiyinDoms.map((item, index) => {
                  return (
                    <View key={index}>
                      <View className="shuiyin-item">
                        <View
                          className="shuiyin-item-img"
                          style={{
                            width: "100%",
                            padding: 0,
                          }}
                          onTouchStart={(e) => {
                            setCurrentShuiyinIndex(index);
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
                              <Image
                                mode="aspectFit"
                                className="vip-arrow"
                                src={VipArrow}
                              ></Image>
                            )}
                            <Image
                              mode="aspectFit"
                              src={item.options.cover}
                            ></Image>
                          </View>
                        </View>
                        {currentShuiyinIndex === index && (
                          <View
                            className="shuiyin-item-cover"
                            onTouchStart={(e) => {
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
              // 编辑页
              <View className="edit-box">
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
                <View className="edit-item">
                  <Picker
                    mode="date"
                    value={`${year}年${month}月${day}日`}
                    onChange={handleDateChange}
                  >
                    <View>选择日期： {`${year}年${month}月${day}日`}</View>
                  </Picker>
                </View>
                <View className="edit-item">
                  <Picker
                    mode="time"
                    value={`${hours}:${minutes}`}
                    onChange={handleTimeChange}
                  >
                    <View>选择时间： {`${hours}:${minutes}`}</View>
                  </Picker>
                </View>
                <View className="edit-item">
                  <View className="picker">
                    <Text>详细地点： </Text>
                    <Input
                      className="input"
                      value={locationName}
                      maxlength={50}
                      clear={true}
                      onInput={(e) => {
                        debounce(setLocationName(e.detail.value), 100);
                      }}
                    ></Input>
                  </View>
                  <View className="input-tips">最多45个字</View>
                </View>
                {ShuiyinDoms[currentShuiyinIndex].options?.hasDakaLabel && (
                  <View className="edit-item flex-row">
                    <View className="picker">
                      <Text
                        style={{
                          color: "f22c3d",
                        }}
                      >
                        打卡标签：{" "}
                      </Text>
                      <Input
                        className="input"
                        value={dakaName}
                        maxlength={2}
                        placeholder="点击添加"
                        clear={true}
                        onInput={(e) => {
                          debounce(
                            setDakaName(e.detail.value.replace(/\s+/g, "")),
                            100
                          );
                        }}
                      ></Input>
                    </View>
                    <View className="input-tips">
                      最多2个字，如打卡、考勤、上班等
                    </View>
                  </View>
                )}
                {ShuiyinDoms[currentShuiyinIndex].options
                  ?.showRightCopyright  && (
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
                    {ShuiyinDoms[currentShuiyinIndex].options
                      ?.showRightCopyright &&
                       (
                        <View className="edit-item flex-row">
                          <View className="picker">
                            <Text
                              style={{
                                color: "f22c3d",
                              }}
                            >
                              右下角水印名称：
                            </Text>
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
                                  100
                                );
                              }}
                            ></Input>
                          </View>
                          <View className="input-tips">
                            自动显示在右下角,最多4个字
                          </View>
                        </View>
                      )}
                  </>
                )}

                {ShuiyinDoms[currentShuiyinIndex].options
                  ?.showLeftCopyright &&  (
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
                {ShuiyinDoms[currentShuiyinIndex].options?.hasTitle && (
                  <View className="edit-item">
                    <View className="picker">
                      <Text>工程标题： </Text>
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
                  </View>
                )}
                {ShuiyinDoms[currentShuiyinIndex].options?.hasFangDao && (
                  <View className="edit-item">
                    <View className="picker">
                      <Text>防盗水印文字： </Text>
                      <Input
                        className="input"
                        value={fangdaoShuiyin}
                        maxlength={8}
                        clear={true}
                        onInput={(e) => {
                          debounce(setFangDaoShuiyin(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                  </View>
                )}
                {ShuiyinDoms[currentShuiyinIndex].options?.hasWeather && (
                  <View className="edit-item">
                    <View className="picker">
                      <Text>天气&温度： </Text>
                      <Input
                        className="input"
                        value={weather}
                        maxlength={8}
                        clear={true}
                        onInput={(e) => {
                          debounce(setWeather(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                  </View>
                )}
                {ShuiyinDoms[currentShuiyinIndex].options?.hasRemark && (
                  <View className="edit-item">
                    <View className="picker">
                      <Text>备注： </Text>
                      <Input
                        className="input"
                        value={remark}
                        maxlength={20}
                        clear={true}
                        onInput={(e) => {
                          debounce(setRemark(e.detail.value), 100);
                        }}
                      ></Input>
                    </View>
                    <View className="input-tips">最多20个字</View>
                  </View>
                )}

                {ShuiyinDoms[currentShuiyinIndex].options?.hasJingWeiDu && (
                  <>
                    <View className="edit-item">
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
                    </View>
                    <View className="edit-item">
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
                    </View>
                    <View className="edit-item">
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
                    </View>
                  </>
                )}
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
          </AtFloatLayout>
          <AtToast isOpened={showToast} text="请输入详细地点"></AtToast>
        </View>
      )}
    </View>
  );
};
export default CameraPage;
