// index.jsx
import React, { useEffect, useState } from "react";
import { View, Button, Text, Image, ScrollView } from "@tarojs/components";
import { createCameraContext, useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";

// 自定义组件导入
import Marquee from "../../components/Marquee";
import CustomModal from "../../components/modal";
import RenderWatermark from "./renderWatermark.js";
import ShuiyinDoms from "../../components/shuiyin";
import EditMark from "./editMask.js";

// 工具函数导入
import {
  generateRandomString,
  getEditItem,
  parseDateString,
  mergeArrays,
  clearCacheIfNeeded,
} from "../../components/utils.js";

// 第三方库导入
import QQMapWX from "qqmap-wx-jssdk";

// 图片资源导入
import Touming from "../../images/touming.png";
import ShareImg from "../../images/logo.jpg";
import VipImg from "../../images/vip.png";
import fanzhuanImg from "../../images/fanzhuan.png";
import shanguangdengImg from "../../images/shan-on.png";
import shanguangdengOffImg from "../../images/shan-off.png";
import XiangceIcon from "../../images/xiangce.png";
import KefuIcon from "../../images/kefu.png";
import ShuiyinIcon from "../../images/shuiyin.png";
import AddMyApp from "../../images/add-my-app.png";
import VideoImg from "../../images/video.png";
import Fankui from "../../images/fankui.png";
import Icon8 from "../../images/icon-8.jpg";
import DakaIcon from "../../images/dakaIcon.png";
import Mianze from "../../images/mianze.png";

// 配置文件和样式导入
import { appConfigs } from "../../appConfig.js";
import "./index.scss";

// 全局变量初始化
let interstitialAd = null;
const app = getApp();
let cloud = "";

// 当前时间相关常量
const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0");
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");
const fs = wx.getFileSystemManager();

// 路由参数获取
const inviteId = Taro.getCurrentInstance().router.params.id || "";
const zphsId = Taro.getCurrentInstance().router.params.zphsId || "";

// 文件系统配置

// 防伪码生成
let fangweimaText = generateRandomString(4);
let makefangweimaText = generateRandomString(3);

// 小程序配置
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const config = appConfigs[appid];

// 缓存处理工具函数

//===== Part 2: 组件定义和状态管理 =====
const CameraPage = () => {
  // ===== 状态声明 =====
  // 模态框状态
  const [shuiyinNameModal, setShuiyinNameModal] = useState(false);
  const [vipClosedModal, setVipClosedModal] = useState(false);
  const [addPhoneNumber, setAddPhoneNumber] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [tiyanModalShow, setTiYanModalShow] = useState(false);
  const [dakaModal, setDakeModal] = useState(false);

  // 相机相关状态
  const [cameraContext, setCameraContext] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [devicePosition, setDevicePosition] = useState("back");
  const [shanguangflag, setShanguangFlag] = useState("off");
  const [cameraTempPath, setCameraTempPath] = useState("");
  const [xiangceTempPath, setXiangceTempPath] = useState("");

  // 权限相关状态
  const [allAuth, setAllAuth] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    writePhotosAlbum: false,
    userLocation: false,
  });

  // 基础状态
  const [latitude, setLatitude] = useState(0);
  const [screenWidth, setScreenWidth] = useState("");
  const [snapshotHeight, setSnapshotHeight] = useState("");
  const [showHasCheck, setShowHasCheck] = useState(undefined);
  const [showTrueCode, setShowTrueCode] = useState(undefined);
  const [selected, setSelected] = useState("图片水印");
  const [userInfo, setUserInfo] = useState({});
  const [phone, setPhone] = useState("");

  // 水印相关状态
  const [currentShuiyinIndex, setCurrentShuiyinIndex] = useState(0);
  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showAddMyApp, setAddMyAppShow] = useState(true);
  const [isShuiyinSaved, saveIsShuiyinSaved] = useState(false);
  const [maskScale, setMaskScale] = useState(1);
  const [editLabel, setEditLabel] = useState(
    ShuiyinDoms[currentShuiyinIndex].label
  );
  const [commonEditLabel, setCommonEditLabel] = useState([]);

  // 视频相关状态
  const [videoPath, setVideoPath] = useState("");
  const [videoMaskPath, setVideoMaskPath] = useState("");

  // 全局状态
  app.$app.globalData.zphsId = zphsId;
  let fuckShenHe = app.$app.globalData.fuckShenHe;

  // ===== 核心功能函数 =====
  // 天气获取
  const fetchWeather = (longitude, latitude) => {
    const url = `https://api.seniverse.com/v3/weather/now.json?key=S7OyUofVVMeBcrLsC&location=${latitude}:${longitude}&language=zh-Hans&unit=c`;

    Taro.request({
      url,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          const weatherData = res.data.results[0]?.now;
          mergeEditLabel(
            "tianqi",
            `${weatherData.text} ${weatherData.temperature}`
          );
        }
      },
      fail: (err) => {
        console.error("获取天气失败:", err);
      },
    });
  };

  // 地理位置编码
  const reverseGeocode = (lat, lng) => {
    const qqmapsdk = new QQMapWX({
      key: "JDRBZ-63BCV-YGNPG-5KPDI-PEAH5-ADBOB",
    });

    qqmapsdk.reverseGeocoder({
      location: { latitude: lat, longitude: lng },
      success: (res) => {
        const addr = res.result.formatted_addresses.recommend;
        mergeEditLabel("didian", addr);
      },
      fail: (err) => {
        console.error("地理编码失败:", err);
      },
    });
  };

  // 获取位置信息
  const getLocation = () => {
    if (latitude || !permissions.userLocation) return;

    Taro.getLocation({
      type: "gcj02",
      isHighAccuracy: true,
      success: (res) => {
        mergeEditLabel("weidu", (res.latitude * 1).toFixed(6));
        mergeEditLabel("jingdu", (res.longitude * 1).toFixed(6));
        reverseGeocode(res.latitude, res.longitude);
        fetchWeather(res.longitude, res.latitude);
      },
      fail: () => {
        Taro.showToast({
          title: "无法获取位置信息，请检查权限设置",
          icon: "none",
        });
      },
    });
  };

  // 水印选择处理
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
        duration: 3000,
      });
    }
  };

  // 合并编辑标签
  const mergeEditLabel = (key, value, type) => {
    setCommonEditLabel((prev) => {
      const had = prev.find((value1) => value1.key === key);
      if (!had) return [...prev, { key, value }];
      return prev;
    });

    const index = editLabel.findIndex((item) => item.key === key);
    if (index === -1) return;

    if (key === "shijian") {
      const currentValue = editLabel[index].value || "";
      let [datePart = "", timePart = ""] = currentValue.split(" ");

      if (type === "riqi") {
        datePart = value;
        if (!timePart && currentValue) {
          timePart = currentValue.split(" ")[1] || "";
        }
        if (!timePart) {
          const now = new Date();
          timePart = `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`;
        }
      } else if (type === "shijian") {
        timePart = value;
        if (!datePart && currentValue) {
          datePart = currentValue.split(" ")[0] || "";
        }
        if (!datePart) {
          const today = new Date();
          datePart = `${today.getFullYear()}-${String(
            today.getMonth() + 1
          ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        }
      }

      const combinedValue = `${datePart} ${timePart}`;
      setEditLabel((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, value: combinedValue } : item
        )
      );
    } else {
      setEditLabel((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, value: value || item.value } : item
        )
      );
    }
  };

  // 更新水印索引
  const updateShuiyinIndex = async (current) => {
    const newEditLabel = [...ShuiyinDoms[current].label];
    setEditLabel(mergeArrays(newEditLabel, editLabel, commonEditLabel));
    setCurrentShuiyinIndex(current);
  };
  // ===== 权限处理函数 =====
  // 检查权限状态
  const checkPermissions = async () => {
    const res = await Taro.getSetting();
    setPermissions({
      camera: !!res.authSetting["scope.camera"],
      writePhotosAlbum: !!res.authSetting["scope.writePhotosAlbum"],
      userLocation: !!res.authSetting["scope.userLocation"],
    });
  };

  // 请求权限
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
            setPermissions({ [scope.split(".")[1]]: true });
          } catch (error) {
            console.error(`${scope} 权限被拒绝`, error);
            setPermissions({ [scope.split(".")[1]]: false });
          }
        }
      } catch (error) {
        console.error(`获取 ${scope} 权限设置时出错`, error);
      }
    }
    getAuth();
  };

  // 获取授权状态
  const getAuth = () => {
    Taro.getSetting().then((res) => {
      const authSetting = res.authSetting;
      if (
        authSetting["scope.camera"] &&
        authSetting["scope.writePhotosAlbum"] &&
        authSetting["scope.userLocation"]
      ) {
        setAllAuth(true);
        const result = Taro.getStorageSync("noReload");
        if (!result) {
          refreshCurrentPage();
        }
      } else {
        setAllAuth(false);
      }
    });
  };

  // 页面刷新
  const refreshCurrentPage = () => {
    const currentPages = Taro.getCurrentPages();
    const currentPage = currentPages[currentPages.length - 1];
    const { route, options } = currentPage;

    const params = Object.keys(options)
      .map((key) => `${key}=${options[key]}`)
      .join("&");
    const url = params ? `/${route}?${params}` : `/${route}`;

    Taro.setStorageSync("noReload", "true");
    Taro.redirectTo({ url });
  };

  // ===== 相机操作函数 =====
  // 拍照核心函数
  const takePhoto = async (camera = true) => {
    // 权限检查
    if (!allAuth) {
      Taro.showToast({
        title: "请先授权相机、相册、位置权限",
        icon: "none",
      });
      return;
    }

    // 会员权限检查
    if (
      selected === "视频水印" &&
      userInfo.type !== "halfYearMonth" &&
      userInfo.type !== "year" &&
      userInfo.type !== "never"
    ) {
      Taro.showToast({
        title: "此功能只对半年及以上会员开放,最大支持50M视频",
        icon: "none",
        duration: 3000,
      });
      return;
    }

    // 视频模式处理
    if (selected === "视频水印") {
      setVideoModal(true);
      return;
    }

    // 打卡标签检查
    if (
      getEditItem(editLabel, "daka")?.value === "修改" &&
      getEditItem(editLabel, "daka")?.visible
    ) {
      setDakeModal(true);
      return;
    }

    // 水印名称检查
    if (
      userInfo.type !== "default" &&
      !getEditItem(editLabel, "shuiyinmingcheng")?.value &&
      getEditItem(editLabel, "shuiyinmingcheng")?.visible &&
      showTrueCode
    ) {
      setShuiyinNameModal(true);
      return;
    }

    // VIP水印检查
    if (
      userInfo.type !== "halfYearMonth" &&
      userInfo.type !== "year" &&
      userInfo.type !== "never" &&
      ShuiyinDoms[currentShuiyinIndex].options.vip
    ) {
      Taro.showModal({
        title: "提示",
        content: "此款水印为半年及以上会员专属，请开通会员后使用",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: "/pages/vip/index",
            });
          }
        },
      });
      return;
    }

    // 相机拍照
    if (camera) {
      const proportion = ShuiyinDoms[currentShuiyinIndex].options?.proportion
        ? ShuiyinDoms[currentShuiyinIndex].options?.proportion * screenWidth
        : (screenWidth / 3) * 4;

      await setSnapshotHeight(proportion);

      cameraContext?.takePhoto({
        zoom: zoomLevel,
        quality: userInfo.type === "default" ? "low" : "original",
        success: async (path) => {
          await setCameraTempPath(path.tempImagePath);
        },
      });
    }
  };

  // 图片保存处理
  const handleSaveToAlbum = async (filePath) => {
    await wx.saveImageToPhotosAlbum({
      filePath,
      success: async () => {
        Taro.showLoading({ title: "处理中..." });

        // 更新用户信息
        const { result } = await cloud.callFunction({
          name: "addUser",
          data: { remark: "成功使用" },
        });

        setUserInfo(result.data);

        // 保存配置
        const newEditLabel = editLabel.filter((item) => item.key !== "shijian");
        await cloud.callFunction({
          name: "updateSavedConfig",
          data: {
            saveConfig: {
              isSaved: isShuiyinSaved,
              currentShuiyinIndex,
              label: [...newEditLabel],
            },
          },
        });

        // 上传到云存储
        try {
          const cloudPath = `files/${dayD}/${hoursD}.${minutesD}.${secondsD}_${
            userInfo.type === "default" ? "" : "vip"
          }_${userInfo.openid}.png`;

          await cloud.uploadFile({
            cloudPath,
            filePath,
          });

          wx.showToast({
            title: "已保存到相册",
            icon: "success",
          });

          // 显示广告
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (interstitialAd && userInfo.type === "default") {
            interstitialAd.show().catch((err) => {
              console.error("插屏广告显示失败", err);
            });
          }
        } catch (error) {
          console.error("文件上传失败：", error);
        }
      },
      fail: (error) => {
        console.error("保存到相册失败:", error);
        wx.showToast({
          icon: "error",
          title: "保存失败，请重试",
        });
      },
    });
  };
  // ===== 照片处理函数 =====
  // 处理快照
  const handleSnapshot = async ({
    type = "camera",
    containerSelector = ".snapshot",
    imageSelector = ".cameraSelectedImage",
    setTempPath = setCameraTempPath,
  }) => {
    // 更新防伪码
    fangweimaText = generateRandomString(4);
    makefangweimaText = generateRandomString(3);

    requestAnimationFrame(async () => {
      try {
        // 检查免费体验次数
        if (
          userInfo.times >= app.$app.globalData.config.mianfeicishu &&
          userInfo.type === "default"
        ) {
          setTempPath(undefined);
          setTiYanModalShow(true);
          setTimeout(() => {
            setTiYanModalShow(false);
            Taro.navigateTo({ url: "/pages/vip/index" });
          }, 2500);
          return;
        }

        Taro.showLoading({ title: "处理中..." });

        // 确保图片完全加载
        const ensureImageLoaded = () => {
          return new Promise((resolve, reject) => {
            const query = Taro.createSelectorQuery();
            query
              .select(`${containerSelector} ${imageSelector}`)
              .fields({ node: true, size: true })
              .exec((res) => {
                const image = res[0];
                if (!image || !image.width) {
                  reject(new Error("找不到图片节点"));
                  return;
                }

                if (image.width > 0 && image.height > 0) {
                  resolve();
                } else {
                  image.onload = resolve;
                  image.onerror = () => reject(new Error("图片加载失败"));
                }
              });
          });
        };

        // 等待图片加载
        await new Promise((resolve) =>
          setTimeout(resolve, type === "camera" ? 100 : 200)
        );
        await new Promise((resolve) => setTimeout(resolve, 50));
        await ensureImageLoaded();

        // 执行截图
        const [res] = await new Promise((resolve, reject) => {
          Taro.createSelectorQuery()
            .select(containerSelector)
            .node()
            .exec((res) => {
              if (!res[0] || !res[0].node) {
                reject(new Error("找不到截图节点"));
                return;
              }
              resolve(res);
            });
        });

        const node = res.node;
        const snapshotResult = await new Promise((resolve, reject) => {
          node.takeSnapshot({
            type: "arraybuffer",
            format: "png",
            success: resolve,
            fail: reject,
          });
        });

        // 保存图片到本地文件系统
        const filePath = `${wx.env.USER_DATA_PATH}/${+new Date()}.png`;
        fs.writeFileSync(filePath, snapshotResult.data, "binary");
        setTempPath(undefined);

        if (selected === "视频水印") {
          setVideoMaskPath(filePath);
          return;
        }

        // 保存到相册并处理后续操作
        await handleSaveToAlbum(filePath);
      } catch (error) {
        console.error("处理失败:", error);
        wx.showToast({
          icon: "error",
          title: "失败，请重试",
        });
        setTempPath(undefined);
      } finally {
        Taro.hideLoading();
      }
    });
  };

  // 从相册选择图片
  const selectImgFromXiangce = async () => {
    try {
      // 权限检查
      if (!allAuth) {
        const missingPermissions = [];
        try {
          const res = await Taro.getSetting();
          !res.authSetting["scope.camera"] && missingPermissions.push("相机");
          !res.authSetting["scope.writePhotosAlbum"] &&
            missingPermissions.push("相册");
          !res.authSetting["scope.userLocation"] &&
            missingPermissions.push("位置");

          if (missingPermissions.length > 0) {
            Taro.showToast({
              title: `请授权以下权限：${missingPermissions.join("、")}`,
              icon: "none",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("权限检查失败:", error);
        }
        return;
      }

      // 会员权限检查
      if (selected === "视频水印") {
        const validMemberTypes = ["halfYearMonth", "year", "never"];
        if (!validMemberTypes.includes(userInfo.type)) {
          Taro.showToast({
            title: "此功能只对半年及以上会员开放,最大支持50M视频",
            icon: "none",
            duration: 3000,
          });
          return;
        }
      }

      // 打卡检查
      if (
        getEditItem(editLabel, "daka")?.value === "修改" &&
        getEditItem(editLabel, "daka")?.visible
      ) {
        setDakeModal(true);
        return;
      }

      // 水印名称检查
      if (
        userInfo.type !== "default" &&
        showTrueCode &&
        !getEditItem(editLabel, "shuiyinmingcheng")?.value &&
        getEditItem(editLabel, "shuiyinmingcheng")?.visible
      ) {
        setShuiyinNameModal(true);
        return;
      }

      // 处理图片选择
      if (selected === "图片水印") {
        const res = await Taro.chooseMedia({
          count: 1,
          mediaType: ["image"],
          sourceType: ["album"],
        });

        if (!res.tempFiles?.[0]) {
          throw new Error("未获取到图片文件");
        }

        const { tempFilePath: filePath, size } = res.tempFiles[0];

        // 文件大小检查
        const fileSizeInMB = size / (1024 * 1024);
        if (fileSizeInMB > 20) {
          Taro.showModal({
            title: "提示",
            content: "图片过大，请选择小于20M的图片",
            showCancel: false,
          });
          return;
        }

        // 获取图片信息
        const info = await Taro.getImageInfo({ src: filePath });

        // 尺寸检查
        if (info.width < 100 || info.height < 100) {
          Taro.showModal({
            title: "提示",
            content: "图片尺寸过小，请选择更大的图片",
            showCancel: false,
          });
          return;
        }
        // 设置截图高度
        const calculatedHeight =
          info.orientation === "right"
            ? (info.width / info.height) * screenWidth
            : (info.height / info.width) * screenWidth;

        if (info.width / info.height > 1) {
          setMaskScale(info.height / info.width);
        }

        await setSnapshotHeight(calculatedHeight);
        await setXiangceTempPath(filePath);
      } else {
        // 处理视频选择
        const res = await Taro.chooseMedia({
          count: 1,
          mediaType: ["video"],
          sourceType: ["album"],
        });

        if (!res.tempFiles?.[0]) {
          throw new Error("未获取到视频文件");
        }

        const { tempFilePath: path, size } = res.tempFiles[0];
        const fileSizeInMB = size / (1024 * 1024);

        if (fileSizeInMB > 50) {
          Taro.showModal({
            title: "提示",
            content: `视频大小为${fileSizeInMB.toFixed(2)}MB，超过50MB限制`,
            showCancel: false,
          });
          return;
        }

        await setVideoPath(path);
      }
    } catch (error) {
      console.error("选择媒体失败:", error);
    }
  };

  // ===== 事件处理函数 =====
  // 相机错误处理
  const cameraError = (e) => {
    console.error("Camera error:", e.detail);
  };

  // 缩放控制
  const zoomClick = () => {
    setZoomLevel((prev) => (prev === 1 ? 3 : prev === 3 ? 5 : 1));
  };

  // 相机翻转
  const fanzhuanClick = () => {
    setDevicePosition((prev) => (prev === "back" ? "front" : "back"));
  };

  // 闪光灯控制
  const shanguangClick = () => {
    setShanguangFlag((prev) => (prev === "off" ? "on" : "off"));
  };

  // 照片加载处理
  const cameraPathOnload = () =>
    handleSnapshot({
      type: "camera",
      containerSelector: ".snapshot",
      imageSelector: ".cameraSelectedImage",
      setTempPath: setCameraTempPath,
    });

  const xiangcePathOnload = () =>
    handleSnapshot({
      type: "xiangce",
      containerSelector: ".snapshot-outside",
      imageSelector: ".xiangceSelectedImage",
      setTempPath: setXiangceTempPath,
    });
  // ===== 生命周期钩子 =====
  // 初始化加载
  useEffect(() => {
    // 清理缓存
    clearCacheIfNeeded(wx.env.USER_DATA_PATH);

    // 初始化函数
    const init = async () => {
      // 初始化广告
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: config.ad,
        });
        interstitialAd.onLoad(() => {});
        interstitialAd.onError((err) => console.error("插屏广告加载失败", err));
        interstitialAd.onClose(() => {});
      }

      // 初始化云环境
      if (config.type === "shared") {
        cloud = await new Taro.cloud.Cloud({
          resourceAppid: config.resourceAppid,
          resourceEnv: config.resourceEnv,
        });
        await cloud.init();
      } else {
        await Taro.cloud.init({ env: config.env });
        cloud = Taro.cloud;
      }

      // 添加用户信息
      cloud.callFunction({
        name: "addUser",
        data: { userToApp: config.userToApp },
        success: function (res) {
          setUserInfo(res.result.data);

          // 会员手机号处理
          if (
            !res.result.data.phone &&
            res.result.data.pay_time &&
            res.result.data.end_time
          ) {
            setAddPhoneNumber(true);
          }

          // 会员到期处理
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

      // 获取配置信息
      cloud.callFunction({
        name: "getConfig",
        success: function (res) {
          app.$app.globalData.config = res.result.data;
          setCurrentShuiyinIndex(res.result.data.shuiyinindex);
        },
      });
    };

    init();

    // 处理邀请存档
    if (inviteId) {
      Taro.setStorage({ key: "createVipFromInviteId", data: inviteId });
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        setScreenWidth(res.screenWidth);
        setSnapshotHeight(
          ShuiyinDoms[currentShuiyinIndex].options?.proportion
            ? ShuiyinDoms[currentShuiyinIndex].options?.proportion *
                res.screenWidth
            : (res.screenWidth / 3) * 4
        );
      },
    });
  }, []);

  // 视频路径变化处理
  useEffect(() => {
    if (!videoPath) return;
    setXiangceTempPath(Touming);
    setSnapshotHeight((screenWidth / 720) * 1280);
  }, [videoPath]);

  // 视频水印路径变化处理
  useEffect(() => {
    if (!videoMaskPath) return;
    // @@保存cover图片
    // Taro.saveImageToPhotosAlbum({
    //   filePath:videoMaskPath,
    // });

    const processVideo = async () => {
      Taro.showLoading({ title: "上传中..." });

      try {
        const [videoFileId, videoMaskFileId, logoImageFileId] =
          await Promise.all([
            uploadImage(videoPath),
            uploadImage(videoMaskPath),
            config?.logoConfig?.path
              ? uploadImage(config.logoConfig.path)
              : null,
          ]);

        let ytg = null;
        if (config.type === "shared") {
          ytg = await new Taro.cloud.Cloud({
            resourceAppid: config.containerResourceAppid,
            resourceEnv: config.containerResourceEnv,
          });
          await ytg.init();
        } else {
          ytg = cloud;
        }

        ytg.callContainer({
          config: { env: config["containerId"] },
          path: "/process",
          header: {
            "X-WX-SERVICE": config["containerName"],
            "content-type": "application/json",
          },
          method: "POST",
          data: {
            image_file_id: videoMaskFileId,
            video_file_id: videoFileId,
            logo_file_id: logoImageFileId,
            openid: userInfo.openid,
          },
          success: (res) => {
            Taro.hideLoading();
            if (res.data?.taskId) {
              Taro.showModal({
                title: "视频生成中",
                content:
                  "视频生成中，请您2~3分钟后到 首页 - 视频 页面中查看下载。",
                confirmText: "确认",
              });
            } else {
              throw new Error("处理错误");
            }
          },
          fail: () => {
            Taro.hideLoading();
            Taro.showToast({
              title: "系统重启，请刷新后重新上传",
              icon: "none",
              duration: 3000,
            });
          },
        });
      } catch (error) {
        console.error("视频处理失败:", error);
        Taro.hideLoading();
      }
    };

    processVideo();
  }, [videoMaskPath]);

  // 权限和位置相关
  useEffect(() => {
    allAuth && permissions.userLocation && getLocation();
  }, [allAuth, permissions.userLocation]);

  // 初始权限检查
  useEffect(() => {
    checkPermissions();
    requestPermission();
  }, []);

  // 页面显示处理
  useDidShow(() => {
    checkPermissions();
    getAuth();
  });

  // 相机上下文初始化
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

  // 权限获取提示
  useEffect(() => {
    if (allAuth) {
      Taro.showToast({
        title: "点击水印可编辑时间地点",
        icon: "none",
        duration: 3000,
      });
    }
  }, [allAuth]);

  // 相机缩放设置
  useEffect(() => {
    cameraContext?.setZoom({
      zoom: zoomLevel,
      success: () => console.log(`设置缩放级别成功: ${zoomLevel}`),
      fail: (error) => console.error(`设置缩放级别失败: ${error}`),
    });
  }, [zoomLevel]);

  // 配置状态同步
  useEffect(() => {
    if (userInfo?.saveConfig?.isSaved) {
      saveIsShuiyinSaved(true);
      setCurrentShuiyinIndex(userInfo.saveConfig.currentShuiyinIndex);

      const newEditLabel = [
        ...ShuiyinDoms[userInfo.saveConfig.currentShuiyinIndex].label,
      ];

      const index = newEditLabel.findIndex((item) => item.key === "shijian");
      newEditLabel[index].value = `${parseDateString().year}-${
        parseDateString().month
      }-${parseDateString().day} ${parseDateString().hours}:${
        parseDateString().minutes
      }`;

      setTimeout(() => {
        setEditLabel(mergeArrays(newEditLabel, userInfo.saveConfig.label));
      }, 2000);
    }
  }, [userInfo.type]);

  // 全局配置状态同步
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

  // ===== 分享配置 =====
  Taro.useShareAppMessage(() => ({
    title: "分享你一款可修改时间、位置的水印相机",
    path: "/pages/index/index?id=" + userInfo.openid,
    imageUrl: ShareImg,
  }));

  // 上传图片
  const uploadImage = async (filePath) => {
    const cloudPath = `files/${dayD}/${hoursD}.${minutesD}.${secondsD}_${
      userInfo.type === "default" ? "" : "vip"
    }_${userInfo.openid}.${filePath.match(/\.(\w+)$/)[1]}`;

    const res = await cloud.uploadFile({
      cloudPath,
      filePath,
    });
    return res.fileID;
  };
  // ===== 组件渲染 =====
  return (
    <ScrollView scroll-y={true} type="list" className="container">
      {userInfo.black ? (
        "您存在违规操作，无法使用小程序"
      ) : (
        <View
          style={{ position: "relative", minHeight: "100vh", width: "100%" }}
        >
          {/* 相机区域 */}
          <View
            className="camera-box"
            style={{
              height: ShuiyinDoms[currentShuiyinIndex].options?.proportion
                ? ShuiyinDoms[currentShuiyinIndex].options?.proportion *
                  screenWidth
                : (screenWidth / 3) * 4,
            }}
          >
            <Marquee />

            {/* 未授权提示 */}
            {!allAuth && (
              <View className="auth-box">
                <View style={{ marginBottom: "30px" }}>
                  小程序支持用户自定义水印时间、地点、经纬度等信息。同时也支持给视频添加水印。
                </View>
                <View>
                  需要相机、相册、位置权限(需要开启手机系统定位)才可以正常运行。
                </View>
                <Button
                  className="share-btn"
                  onClick={() => Taro.openSetting()}
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

            {/* 相机主体区域 */}
            {allAuth && (
              <View
                className="mask-box"
                style={{
                  bottom: showFloatLayout
                    ? ShuiyinDoms[currentShuiyinIndex].options.proportion
                      ? "65%"
                      : "55%"
                    : "0",
                }}
              >
                {/* 相机模式水印 */}
                <RenderWatermark
                  type="camera"
                  tempPath={cameraTempPath}
                  onLoadHandler={cameraPathOnload}
                  currentShuiyinIndex={currentShuiyinIndex}
                  devicePosition={devicePosition}
                  shanguangflag={shanguangflag}
                  screenWidth={screenWidth}
                  selected={selected}
                  showTrueCode={showTrueCode}
                  showHasCheck={showHasCheck}
                  userInfo={userInfo}
                  showFloatLayout={showFloatLayout}
                  fangweimaText={fangweimaText}
                  makefangweimaText={makefangweimaText}
                  cameraError={cameraError}
                  snapshotHeight={snapshotHeight}
                  setEdit={setEdit}
                  setShowFloatLayout={setShowFloatLayout}
                  maskScale={maskScale}
                  editLabel={editLabel}
                />

                {/* 相册模式水印 */}
                <RenderWatermark
                  type="xiangce"
                  tempPath={xiangceTempPath}
                  onLoadHandler={xiangcePathOnload}
                  currentShuiyinIndex={currentShuiyinIndex}
                  devicePosition={devicePosition}
                  shanguangflag={shanguangflag}
                  screenWidth={screenWidth}
                  selected={selected}
                  showTrueCode={showTrueCode}
                  showHasCheck={showHasCheck}
                  userInfo={userInfo}
                  showFloatLayout={showFloatLayout}
                  fangweimaText={fangweimaText}
                  makefangweimaText={makefangweimaText}
                  cameraError={cameraError}
                  snapshotHeight={snapshotHeight}
                  setEdit={setEdit}
                  setShowFloatLayout={setShowFloatLayout}
                  maskScale={maskScale}
                  editLabel={editLabel}
                />

                {/* 相机控制按钮 */}
                <View className="camera-btns">
                  <View className="zoom-box">
                    <View className="zoom-text" onClick={zoomClick}>
                      {zoomLevel}
                      <View className="icon-x" />
                    </View>
                  </View>
                  <View className="fanzhuan-icon" onClick={fanzhuanClick}>
                    <Image src={fanzhuanImg} />
                  </View>
                  <View className="shanguangdeng-icon" onClick={shanguangClick}>
                    <Image
                      src={
                        shanguangflag === "off"
                          ? shanguangdengOffImg
                          : shanguangdengImg
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* 添加到我的小程序提示 */}
          {showAddMyApp && (
            <View className="add-my-app" onClick={() => setAddMyAppShow(false)}>
              <Image src={AddMyApp} />
            </View>
          )}
          {/* 工具箱区域 */}
          <View
            className="tools-box-wrapper"
            style={{
              minHeight: `calc(100vh-${(screenWidth / 3) * 4})`,
            }}
          >
            {/* 顶部工具栏 */}
            <View className="tools-bar">
              <View className="tools-bar-inner">
                <View className="xiangce">
                  <Image
                    src={XiangceIcon}
                    className="xiangceIcon"
                    onClick={selectImgFromXiangce}
                  />
                  <Text>相册</Text>
                </View>
                <View className="shuiyin">
                  <Image
                    src={VideoImg}
                    className="xiangceIcon"
                    onClick={() => {
                      Taro.navigateTo({
                        url: "/pages/video/index",
                      });
                    }}
                  />
                  <Text>视频</Text>
                </View>
              </View>

              {/* 拍照按钮 */}
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
                  />
                </View>
              </View>

              {/* 右侧工具栏 */}
              <View className="tools-bar-inner">
                {/* 会员按钮 */}
                <View className="xiangce kefu vip">
                  <Button
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/pages/vip/index?type=${userInfo.type}&id=${inviteId}`,
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
                    <Image src={VipImg} className="xiangceIcon" />
                  </Button>
                  <Text>会员</Text>
                </View>
                {/* 我的按钮 */}
                <View className="xiangce kefu" style={{ marginRight: "auto" }}>
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
                    <Image src={KefuIcon} className="xiangceIcon" />
                  </Button>
                  <Text>我的</Text>
                </View>
              </View>
            </View>

            {/* 底部工具栏 */}
            <View className="tools-bar">
              <View className="tools-bar-inner">
                {/* 声明按钮 */}
                <View className="xiangce">
                  <Image
                    src={Mianze}
                    className="xiangceIcon"
                    onClick={() => {
                      Taro.navigateTo({
                        url: "/pages/mianze/index",
                      });
                    }}
                  />
                  <Text>声明</Text>
                </View>
                {/* 客服按钮 */}
                <View className="xiangce">
                  <Button
                    className="xiangce kefu vip"
                    openType="contact"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <Image className="xiangceIcon" src={Fankui} />
                    <Text>客服</Text>
                  </Button>
                </View>
              </View>

              {/* 中间水印编辑按钮 */}
              <View
                className="xiangce"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%) scale(1.15)",
                  bottom: "0",
                }}
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
                />
                <Text>修改</Text>
              </View>
            </View>

            {/* 水印类型选择 */}
            {fuckShenHe === false && (
              <View
                className="button-group"
                style={{
                  padding: "0 15px",
                  width: "100%",
                  boxSizing: "border-box",
                  lineHeight: 1,
                }}
              >
                {["图片水印", "视频水印"].map((option, index) => (
                  <Button
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={{
                      border: "none",
                      borderRadius: "25px",
                      padding: "0 20px",
                      fontSize: "28rpx",
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
                    {option?.slice(0, 2) + "加" + option?.slice(2)}
                  </Button>
                ))}
              </View>
            )}

            {/* 底部教程按钮 */}
            <View className="bottom-btns">
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
                  fontWeight: "500",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  height: "40px",
                }}
              >
                使用教程
              </Button>
            </View>
          </View>

          {/* 各种模态框 */}
          <CustomModal
            visible={tiyanModalShow}
            title="提示"
            phoneValidation={false}
            customInput={
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                体验次数已用尽，请购买会员后使用
              </View>
            }
            rightButtonText="去查看"
            showLeftButton={false}
            onRightButtonClick={() => setTiYanModalShow(false)}
          />

          <CustomModal
            visible={dakaModal}
            title="提示"
            phoneValidation={false}
            customInput={
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "100%", textAlign: "center" }}>
                  是否修改打卡标签名？
                </View>
                <Image
                  src={DakaIcon}
                  style={{
                    marginTop: "10px",
                    width: "250px",
                    height: "130px",
                  }}
                />
              </View>
            }
            rightButtonText="去修改"
            onRightButtonClick={() => {
              setShowFloatLayout(!showFloatLayout);
              setDakeModal(false);
              setEdit(true);
            }}
            onLeftButtonClick={() => setDakeModal(false)}
          />

          <CustomModal
            visible={shuiyinNameModal}
            title="提示"
            phoneValidation={false}
            customInput={
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "100%" }}>
                  请先填写水印名称后再拍照或相册选图，如下图所示
                </View>
                <Image
                  src={Icon8}
                  style={{
                    marginTop: "10px",
                    width: "300px",
                    height: "52px",
                  }}
                />
              </View>
            }
            rightButtonText="去填写"
            onRightButtonClick={() => {
              setShowFloatLayout(!showFloatLayout);
              setShuiyinNameModal(false);
              setEdit(true);
            }}
            onLeftButtonClick={() => setShuiyinNameModal(false)}
          />

          <CustomModal
            visible={videoModal}
            title="提示"
            phoneValidation={false}
            customInput={
              <View style={{ width: "100%" }}>
                请用手机的 原相机
                拍摄一段视频，然后再从相册选择。最大支持50M以内视频，请控制视频时长。
              </View>
            }
            rightButtonText="确定"
            onRightButtonClick={() => setVideoModal(false)}
            showLeftButton={false}
          />

          <CustomModal
            visible={vipClosedModal}
            phoneValidation={false}
            title="提示"
            customInput={
              <View style={{ width: "100%" }}>
                您的会员已到期,继续使用请重新开通会员
              </View>
            }
            showLeftButton={false}
            rightButtonText="重新开通"
          />

          <CustomModal
            visible={addPhoneNumber}
            title="请输入手机号"
            content="为防止失联，请一定填写正确手机号，如有变动第一时间通知"
            placeholder="请输入手机号码"
            onInputChange={(e) => setPhone(e)}
            onClose={async () => {
              cloud.callFunction({
                name: "addUser",
                data: { phone },
              });
              setAddPhoneNumber(false);
              Taro.setStorage({ key: "phoneInputed", data: true });
            }}
            onLeftButtonClick={() => console.log("取消")}
            showLeftButton={false}
          />

          {/* 水印编辑组件 */}
          <EditMark
            showFloatLayout={showFloatLayout}
            edit={edit}
            currentShuiyinIndex={currentShuiyinIndex}
            setShowFloatLayout={setShowFloatLayout}
            setEdit={setEdit}
            updateShuiyinIndex={updateShuiyinIndex}
            isShuiyinSaved={isShuiyinSaved}
            saveIsShuiyinSaved={saveIsShuiyinSaved}
            userInfo={userInfo}
            showTrueCode={showTrueCode}
            setShowTrueCode={setShowTrueCode}
            showHasCheck={showHasCheck}
            setShowHasCheck={setShowHasCheck}
            maskScale={1}
            setMaskScale={setMaskScale}
            editLabel={editLabel}
            setEditLabel={setEditLabel}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default CameraPage;
