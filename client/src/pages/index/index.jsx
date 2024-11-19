import React, { useEffect, useState, useRef } from "react";
import { View, Button, Text, Image, ScrollView } from "@tarojs/components";
import Marquee from "../../components/Marquee";
import CustomModal from "../../components/modal";
import { createCameraContext, useDidShow } from "@tarojs/taro";
import RenderWatermark from "./renderWatermark.js";
import Touming from "../../images/touming.png";
import ShuiyinDoms from "../../components/shuiyin";
import {
  generateRandomString,
  formatDateTime,
  mergeArrays,
} from "../../components/utils.js";
import Taro from "@tarojs/taro";
import QQMapWX from "qqmap-wx-jssdk";
import ShareImg from "../../images/logo.jpg";
import VipImg from "../../images/vip.png";
import fanzhuanImg from "../../images/fanzhuan.png";
import shanguangdengImg from "../../images/shan-on.png";
import shanguangdengOffImg from "../../images/shan-off.png";
import XiangceIcon from "../../images/xiangce.png";
import KefuIcon from "../../images/kefu.png";
import { appConfigs } from "../../appConfig.js";
import ShuiyinIcon from "../../images/shuiyin.png";
import AddMyApp from "../../images/add-my-app.png";
import VideoImg from "../../images/video.png";
import Fankui from "../../images/fankui.png";
import Icon8 from "../../images/icon-8.jpg";
import Mianze from "../../images/mianze.png";
import EditMark from "./editMask.js";
import "./index.scss";
let interstitialAd = null;
const app = getApp();
let cloud = "";
const now = new Date();
const yearD = now.getFullYear();
const monthD = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
const dayD = String(now.getDate()).padStart(2, "0");
const hoursD = String(now.getHours()).padStart(2, "0");
const minutesD = String(now.getMinutes()).padStart(2, "0");
const secondsD = String(now.getSeconds()).padStart(2, "0");
const inviteId = Taro.getCurrentInstance().router.params.id || "";
const zphsId = Taro.getCurrentInstance().router.params.zphsId || "";
const fs = wx.getFileSystemManager();
const CACHE_LIMIT = 30 * 1024; // 设置缓存限制为 50MB（以 KB 为单位）
let fangweimaText = generateRandomString(4);
let makefangweimaText = generateRandomString(3);
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
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const config = appConfigs[appid];
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
  // 向上弹出修改
  const [showFloatLayout, setShowFloatLayout] = useState(false);
  const [edit, setEdit] = useState(false);
  const [weekly, setWeekly] = useState(getWeekday(year, month, day));
  const [showAddMyApp, setAddMyAppShow] = useState(true);
  const [isShuiyinSaved, saveChange] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [title, setTitle] = useState("工程记录");
  const [vipClosedModal, setVipClosedModal] = useState(false);
  const [addPhoneNumber, setAddPhoneNumber] = useState(false);
  const [phone, setPhone] = useState("");
  const [videoModal, setVideoModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState("");
  const [showHasCheck, setShowHasCheck] = useState(undefined);
  const [showTrueCode, setShowTrueCode] = useState(undefined);
  const [shuiyinxiangjiName, setShuiyinxiangjiName] = useState("");
  const [fangdaoShuiyin, setFangDaoShuiyin] = useState("盗图必究");
  const [cameraTempPath, setCameraTempPath] = useState("");
  const [xiangceTempPath, setXiangceTempPath] = useState("");
  const [tiyanModalShow, setTiYanModalShow] = useState(false);
  const [snapshotHeight, setSnapshotHeight] = useState("");
  const [maskScale, setMaskScale] = useState(1);
  const [editLabel, setEditLabel] = useState(
    ShuiyinDoms[currentShuiyinIndex].label
  );
  const [commonEditLabel, setCommonEditLabel] = useState([]);
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
  // useEffect(() => {
  //   // console.log("editLabel2233: ", editLabel);
  // }, [editLabel]);
  useEffect(() => {
    // 小程序启动时调用此函数
    clearCacheIfNeeded(wx.env.USER_DATA_PATH);
    // 在页面中定义插屏广告
    const init = async () => {
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: config.ad,
        });

        interstitialAd.onLoad(() => {});
        interstitialAd.onError((err) => {
          console.error("插屏广告加载失败", err);
        });
        interstitialAd.onClose(() => {});
      }
      // 在页面onLoad回调事件中创建插屏广告实例
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
    }
    wx.getSystemInfo({
      success: function (res) {
        setScreenWidth(res.screenWidth); // 输出屏幕宽度
        setSnapshotHeight(
          ShuiyinDoms[currentShuiyinIndex].options?.proportion
            ? ShuiyinDoms[currentShuiyinIndex].options?.proportion * screenWidth
            : (screenWidth / 3) * 4
        );
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
          mergeEditLabel(
            "tianqi",
            res.data.results[0]?.now.text +
              " " +
              res.data.results[0]?.now.temperature
          );

          // setWeather(
          //   res.data.results[0]?.now.text +
          //     " " +
          //     res.data.results[0]?.now.temperature
          // );
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
    allAuth && permissions.userLocation && getLocation();
  }, [allAuth, permissions.userLocation]);

  const getLocation = () => {
    if (latitude) return;
    if (!permissions.userLocation) return;
    Taro.getLocation({
      type: "gcj02",
      isHighAccuracy: true,
      success: (res) => {
        mergeEditLabel("weidu", (res.latitude * 1).toFixed(6));
        mergeEditLabel("jingdu", (res.longitude * 1).toFixed(6));

        // setLatitude((res.latitude * 1).toFixed(6));
        // setLongitude((res.longitude * 1).toFixed(6));
        reverseGeocode(res.latitude, res.longitude);
        fetchWeather(res.longitude, res.latitude);
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
        duration: 3000,
      });
    }
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
        const district = res.result.address_component.district;

        const province = res.result.address_component.province;

        // 拼接市以下的地址信息，不包括门牌号
        const detailedAddress = `${addr}`;
        setLocationName(detailedAddress);

        mergeEditLabel("didian", detailedAddress);
      },
      fail: (err) => {
        console.error("Failed to reverse geocode:", err);
      },
    });
  };
  // 更新editlabel 主要是请求之后合并更新
  const mergeEditLabel = (key, value, type) => {
    setCommonEditLabel((prev) => {
      const had = prev.find((value1) => value1.key === key);
      if (!had) {
        return [...prev, { key, value }];
      }
      return prev;
    });
    // 找到要更新的项的索引
    const index = editLabel.findIndex((item) => item.key === key);
    if (index === -1) return;

    // 处理时间类型
    if (key === "shijian") {
      const currentValue = editLabel[index].value || "";
      let [datePart = "", timePart = ""] = currentValue.split(" ");

      // 根据 type 判断更新日期还是时间
      if (type === "riqi") {
        datePart = value;
        // 如果时间为空，保持原来的时间部分
        if (!timePart && currentValue) {
          timePart = currentValue.split(" ")[1] || "";
        }
        // 如果还是空，才设置默认时间
        if (!timePart) {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          timePart = `${hours}:${minutes}`;
        }
      } else if (type === "shijian") {
        timePart = value;
        // 如果日期为空，保持原来的日期部分
        if (!datePart && currentValue) {
          datePart = currentValue.split(" ")[0] || "";
        }
        // 如果还是空，才设置默认日期
        if (!datePart) {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          datePart = `${year}-${month}-${day}`;
        }
      }

      // 组合日期和时间
      const combinedValue = `${datePart} ${timePart}`;

      // 只更新当前项的 value
      setEditLabel((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, value: combinedValue } : item
        )
      );
    } else {
      // 非时间类型的处理，只更新当前项的 value

      setEditLabel((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, value: value || item.value } : item
        )
      );
    }
  };

  const updateShuiyinIndex = async (current) => {
    const newEditLabel = [...ShuiyinDoms[current].label];
    setEditLabel(mergeArrays(newEditLabel, editLabel, commonEditLabel));
    setCurrentShuiyinIndex(current);
  };

  // 统一设置默认值
  useEffect(() => {
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
  /**
   * 统一的截图处理函数
   * @param {Object} options 配置选项
   * @param {string} options.type 截图类型：'camera' 或 'xiangce'
   * @param {string} options.containerSelector 截图容器选择器
   * @param {string} options.imageSelector 图片节点选择器
   * @param {Function} options.setTempPath 设置临时路径的函数
   */
  const handleSnapshot = ({
    type = "camera",
    containerSelector = ".snapshot",
    imageSelector = ".cameraSelectedImage",
    setTempPath = setCameraTempPath,
  }) => {
    fangweimaText = generateRandomString(4);
    makefangweimaText = generateRandomString(4);
    console.log('makefangweimaText: ', makefangweimaText);
    requestAnimationFrame(async () => {
      try {
        // 免费体验次数检查
        if (
          userInfo.times >= app.$app.globalData.config.mianfeicishu &&
          userInfo.type === "default"
        ) {
          setTempPath(undefined);
          setTiYanModalShow(true);
          setTimeout(() => {
            setTiYanModalShow(false);
            Taro.navigateTo({
              url: "/pages/vip/index",
            });
          }, 2500);
          return;
        }
        Taro.showLoading({
          title: "处理中...",
        });

        // 确保图片完全加载
        const ensureImageLoaded = () => {
          return new Promise((resolve, reject) => {
            const query = Taro.createSelectorQuery();
            query
              .select(`${containerSelector} ${imageSelector}`)
              .fields({
                node: true,
                size: true,
              })
              .exec((res) => {
                const image = res[0];
                if (!image || !image.width) {
                  reject(new Error("找不到图片节点1"));
                  return;
                }

                if (image.width > 0 && image.height > 0) {
                  console.log("image: ", image);

                  resolve();
                } else {
                  image.onload = resolve;
                  image.onerror = () => reject(new Error("图片加载失败"));
                }
              });
          });
        };
        await new Promise((resolve) =>
          setTimeout(resolve, type === "camera" ? 100 : 200)
        );
        await new Promise((resolve) => setTimeout(resolve, 50));
        console.log(3333);

        // 等待图片加载完成
        await ensureImageLoaded();

        // 执行截图
        const [res] = await new Promise((resolve, reject) => {
          Taro.createSelectorQuery()
            .select(containerSelector)
            .node()
            .exec((res) => {
              if (!res[0] || !res[0].node) {
                reject(new Error("找不到截图节点2"));
                return;
              }
              resolve(res);
            });
        });

        const node = res.node;

        // 执行截图操作
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
        const fs = wx.getFileSystemManager();
        fs.writeFileSync(filePath, snapshotResult.data, "binary");
        // 清空临时地址
        // 更新配置

        setTempPath(undefined);

        if (selected === "视频水印") {
          setVideoMaskPath(filePath);
          return;
        }
        // 保存到相册
        await wx.saveImageToPhotosAlbum({
          filePath,
          success: async () => {
            Taro.showLoading({
              title: "处理中...",
            });
            // 更新用户信息
            const { result } = await cloud.callFunction({
              name: "addUser",
              data: {
                remark: "成功使用",
              },
            });

            setUserInfo(result.data);
            await cloud.callFunction({
              name: "updateSavedConfig",
              data: {
                saveConfig: {
                  isSaved: isShuiyinSaved,
                  label: {
                    ...editLabel,
                  },
                },
              },
            });
            try {
              // 上传到云存储
              const cloudPath = `files/client/${hoursD}.${minutesD}.${secondsD}_${
                userInfo.type === "default" ? "" : "vip"
              }_${userInfo.openid}.png`;

              console.log("cloudPath: ", cloudPath);
              await cloud.uploadFile({
                cloudPath,
                filePath,
              });

              // 上传成功后弹出提示
              wx.showToast({
                title: "已保存到相册",
                icon: "success",
              });
            } catch (error) {
              console.error("文件上传失败：", error);
              // wx.showToast({
              //   title: "上传失败，请重试",
              //   icon: "error",
              // });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // 显示广告
            if (interstitialAd && userInfo.type === "default") {
              interstitialAd.show().catch((err) => {
                console.error("插屏广告显示失败", err);
              });
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

  // 相机拍照 onload 后执行
  const cameraPathOnload = () =>
    handleSnapshot({
      type: "camera",
      containerSelector: ".snapshot",
      imageSelector: ".cameraSelectedImage",
      setTempPath: setCameraTempPath,
    });

  // 相册选图 onload 离屏
  const xiangcePathOnload = () => {
    handleSnapshot({
      type: "xiangce",
      containerSelector: ".snapshot-outside",
      imageSelector: ".xiangceSelectedImage",
      setTempPath: setXiangceTempPath,
    });
  };

  const takePhoto = async (camera = true) => {
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
        duration: 3000,
      });
      return;
    }
    if (selected === "视频水印") {
      setVideoModal(true);
      return;
    }
    // 弹出水印名字提示弹窗
    if (
      userInfo.type !== "default" &&
      !shuiyinxiangjiName &&
      showTrueCode &&
      ShuiyinDoms[currentShuiyinIndex].options.showRightCopyright
    ) {
      setShuiyinNameModal(true);
      return;
    }
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
    // 相机
    if (camera) {
      // 保存位置

      cameraContext?.takePhoto({
        zoom: zoomLevel,
        quality: userInfo.type === "default" ? "low" : "original",
        success: async (path) => {
          // 获取图片信息
          // 拍照时宽高比例固定 默认4:3 特殊情况按照比例设置
          await setSnapshotHeight(
            ShuiyinDoms[currentShuiyinIndex].options?.proportion
              ? ShuiyinDoms[currentShuiyinIndex].options?.proportion *
                  screenWidth
              : (screenWidth / 3) * 4
          );
          await setCameraTempPath(path.tempImagePath);
        },
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
      mergeArrays(editLabel, userInfo.saveConfig.label);
      // const {
      //   currentShuiyinIndex,
      //   weather,
      //   locationName,
      //   latitude,
      //   longitude,
      //   showTrueCode,
      //   showHasCheck,
      //   shuiyinxiangjiName,
      //   fangdaoShuiyin,
      //   dakaName,
      // } = userInfo.saveConfig.label;
      // setTimeout(() => {
      //   setCurrentShuiyinIndex(
      //     // 去掉
      //     currentShuiyinIndex >= 9 ? 0 : currentShuiyinIndex
      //   );
      //   setWeather(weather);
      //   setLocationName(locationName);
      //   setLatitude(latitude);
      //   setLongitude(longitude);
      //   setShowHasCheck(showHasCheck);
      //   setShowTrueCode(showTrueCode);
      //   setShuiyinxiangjiName(shuiyinxiangjiName);
      //   setDakaName(dakaName);
      //   setFangDaoShuiyin(fangdaoShuiyin || "盗图必究");
      // }, 1000);
    }
    // saveChange(userInfo?.saveConfig?.isSaved);
  }, [userInfo.type]);
  // let isUseServerData = "";
  // // 检测本地和服务端数据是否一致 不一致则用服务端数据
  // useEffect(() => {
  //   if (userInfo?.saveConfig?.isSaved && !edit) {
  //     if (locationName !== userInfo.saveConfig.locationName) {
  //       setTimeout(() => {
  //         setLocationName(userInfo.saveConfig.locationName);
  //         isUseServerData = true;
  //       }, 1000);
  //     }
  //   }
  // }, [locationName]);

  const selectImgFromXiangce = async () => {
    try {
      // 1. 权限检查
      if (!allAuth) {
        // 检查具体是哪个权限没有获取
        try {
          const cameraAuth = await Taro.getSetting({
            scope: "scope.camera",
          });
          const albumAuth = await Taro.getSetting({
            scope: "scope.album",
          });
          const locationAuth = await Taro.getSetting({
            scope: "scope.userLocation",
          });

          let missingPermissions = [];
          !cameraAuth && missingPermissions.push("相机");
          !albumAuth && missingPermissions.push("相册");
          !locationAuth && missingPermissions.push("位置");

          Taro.showToast({
            title: `请授权以下权限：${missingPermissions.join("、")}`,
            icon: "none",
            duration: 3000,
          });
        } catch (error) {
          Taro.showToast({
            title: "权限检查失败，请重试",
            icon: "none",
          });
        }
        return;
      }

      // 2. 会员权限检查
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

      // 3. 水印名称检查
      if (
        userInfo.type !== "default" &&
        !shuiyinxiangjiName &&
        showTrueCode &&
        ShuiyinDoms[currentShuiyinIndex]?.options?.showRightCopyright
      ) {
        setShuiyinNameModal(true);
        return;
      }

      // 4. 选择媒体处理
      if (selected === "图片水印") {
        try {
          const res = await Taro.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sourceType: ["album"],
          });

          if (!res.tempFiles || !res.tempFiles.length) {
            throw new Error("未获取到图片文件");
          }

          const data = res.tempFiles[0];
          const filePath = data.tempFilePath;

          // 检查文件大小
          const fileSizeInMB = data.size / (1024 * 1024);
          if (fileSizeInMB > 20) {
            // 假设限制20MB
            Taro.showModal({
              title: "提示",
              content: "图片过大，请选择小于20M的图片",
              showCancel: false,
            });
            return;
          }

          // 获取图片信息
          try {
            const info = await new Promise((resolve, reject) => {
              Taro.getImageInfo({
                src: filePath,
                success: resolve,
                fail: reject,
              });
            });

            // 验证图片尺寸
            if (info.width < 100 || info.height < 100) {
              Taro.showModal({
                title: "提示",
                content: "图片尺寸过小，请选择更大的图片",
                showCancel: false,
              });
              return;
            }

            // 计算并设置截图高度
            const calculatedHeight =
              info.orientation === "right"
                ? (info.width / info.height) * screenWidth
                : (info.height / info.width) * screenWidth;

            await setSnapshotHeight(calculatedHeight);
            await setXiangceTempPath(filePath);

            console.log("图片处理成功:", {
              width: info.width,
              height: info.height,
              orientation: info.orientation,
              calculatedHeight,
            });
          } catch (error) {
            console.error("获取图片信息失败:", error);
            Taro.showModal({
              title: "错误",
              content: "获取图片信息失败，请重试",
              showCancel: false,
            });
          }
        } catch (error) {}
      } else {
        // 视频水印处理
        try {
          const res = await Taro.chooseMedia({
            count: 1,
            mediaType: ["video"],
            sourceType: ["album"],
          });

          if (!res.tempFiles || !res.tempFiles.length) {
            throw new Error("未获取到视频文件");
          }

          const data = res.tempFiles[0];
          const path = data.tempFilePath;
          const fileSizeInMB = data.size / (1024 * 1024);

          // 视频大小检查
          if (fileSizeInMB > 50) {
            Taro.showModal({
              title: "提示",
              content: `视频大小为${fileSizeInMB.toFixed(
                2
              )}MB，超过50MB限制，请重新选择`,
              showCancel: false,
            });
            return;
          }
          await setVideoPath(path);
        } catch (error) {}
      }
    } catch (error) {}
  };
  const [videoPath, setVideoPath] = useState("");
  const [videoMaskPath, setVideoMaskPath] = useState("");

  useEffect(() => {
    if (!videoPath) {
      return;
    }
    setXiangceTempPath(Touming);
    // 配合merge-video云函数 720 是视频宽度 9:16  720 : 1280
    setSnapshotHeight((screenWidth / 720) * 1280);
  }, [videoPath]);
  const uploadImage = async (filePath) => {
    const cloudPath = `files/client/${hoursD}.${minutesD}.${secondsD}_${
      userInfo.type === "default" ? "" : "vip"
    }_${userInfo.openid}.${filePath.match(/\.(\w+)$/)[1]}`;
    const res = await cloud.uploadFile({
      cloudPath,
      filePath,
    });
    return res.fileID;
  };

  useEffect(() => {
    if (!videoMaskPath) {
      return;
    }

    const fn = async () => {
      // 上传图片和视频
      Taro.showLoading({
        title: "上传中...",
      });

      const [videoFileId, videoMaskFileId, logoImageFileId] = await Promise.all(
        [
          uploadImage(videoPath),
          uploadImage(videoMaskPath),
          config?.logoConfig?.path ? uploadImage(config.logoConfig.path) : null,
        ]
      );
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
      // 视频合成
      ytg.callContainer({
        config: {
          env: config["containerId"],
        },
        path: "/process",
        header: {
          "X-WX-SERVICE": config["containerName"],
          "content-type": "application/json",
        },
        method: "POST",
        data: {
          image_file_id: videoMaskFileId,
          video_file_id: videoFileId,
          logo_file_id: logoImageFileId ? logoImageFileId : null,
          openid: userInfo.openid,
        },
        success: (res) => {
          Taro.hideLoading();
          if (res.data && res.data.taskId) {
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
        fail: (error) => {
          Taro.hideLoading();
          Taro.showToast({
            title: "系统重启，请刷新后重新上传",
            icon: "none",
            duration: 3000,
          });
        },
      });
    };
    fn();
  }, [videoMaskPath]);
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

  return (
    <ScrollView
      scroll-y={true}
      type="list"
      className={
        "container "
        // (showFloatLayout && ShuiyinDoms[currentShuiyinIndex].options.proportion
        //   ? " open"
        //   : "")
      }
    >
      {userInfo.black ? (
        "您存在违规操作，无法使用小程序"
      ) : (
        <View
          style={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
          }}
        >
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
              <View
                className={"mask-box"}
                style={{
                  bottom: showFloatLayout
                    ? ShuiyinDoms[currentShuiyinIndex].options.proportion
                      ? "65%"
                      : "55%"
                    : "0",
                }}
              >
                {/* 渲染相机模式的水印 */}
                <RenderWatermark
                  type={"camera"}
                  tempPath={cameraTempPath}
                  onLoadHandler={cameraPathOnload}
                  currentShuiyinIndex={currentShuiyinIndex}
                  devicePosition={devicePosition}
                  shanguangflag={shanguangflag}
                  screenWidth={screenWidth}
                  selected={selected}
                  showTrueCode={showTrueCode}
                  showHasCheck={showHasCheck}
                  shuiyinxiangjiName={shuiyinxiangjiName}
                  userInfo={userInfo}
                  showFloatLayout={showFloatLayout}
                  hours={hours}
                  minutes={minutes}
                  day={day}
                  month={month}
                  year={year}
                  weekly={weekly}
                  locationName={locationName}
                  dakaName={dakaName}
                  title={title}
                  weather={weather}
                  latitude={latitude}
                  longitude={longitude}
                  fangdaoShuiyin={fangdaoShuiyin}
                  fangweimaText={fangweimaText}
                  makefangweimaText={makefangweimaText}
                  cameraError={cameraError}
                  snapshotHeight={snapshotHeight}
                  setEdit={setEdit}
                  setShowFloatLayout={setShowFloatLayout}
                  maskScale={maskScale}
                  editLabel={editLabel}
                  setEditLabel={setEditLabel}
                />
                <RenderWatermark
                  type={"xiangce"}
                  tempPath={xiangceTempPath}
                  onLoadHandler={xiangcePathOnload}
                  currentShuiyinIndex={currentShuiyinIndex}
                  devicePosition={devicePosition}
                  shanguangflag={shanguangflag}
                  screenWidth={screenWidth}
                  selected={selected}
                  showTrueCode={showTrueCode}
                  showHasCheck={showHasCheck}
                  shuiyinxiangjiName={shuiyinxiangjiName}
                  userInfo={userInfo}
                  showFloatLayout={showFloatLayout}
                  hours={hours}
                  minutes={minutes}
                  day={day}
                  month={month}
                  year={year}
                  weekly={weekly}
                  locationName={locationName}
                  dakaName={dakaName}
                  title={title}
                  weather={weather}
                  latitude={latitude}
                  longitude={longitude}
                  fangdaoShuiyin={fangdaoShuiyin}
                  fangweimaText={fangweimaText}
                  makefangweimaText={makefangweimaText}
                  cameraError={cameraError}
                  snapshotHeight={snapshotHeight}
                  setEdit={setEdit}
                  setShowFloatLayout={setShowFloatLayout}
                  maskScale={maskScale}
                  editLabel={editLabel}
                  setEditLabel={setEditLabel}
                />
                {/* 渲染相册模式的水印 */}
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
          <View
            className="tools-box-wrapper"
            style={{
              minHeight: `calc(100vh-${(screenWidth / 3) * 4})`,
            }}
          >
            <View className="tools-bar">
              <View className="tools-bar-inner">
                <View className={"xiangce "}>
                  <Image
                    src={XiangceIcon}
                    className="xiangceIcon"
                    onClick={selectImgFromXiangce}
                  ></Image>
                  <Text>相册</Text>
                </View>
                <View className={"shuiyin "}>
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
                  <View className={"xiangce kefu vip "}>
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
                  className={"xiangce kefu "}
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
            <View className="tools-bar">
              {/* <View className="tools-bar-inner">

            </View> */}
              <View className="tools-bar-inner">
                <View className={"xiangce "}>
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
                <View className={"xiangce "}>
                  <Button
                    className={"xiangce kefu vip"}
                    openType="contact"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <Image className="xiangceIcon" src={Fankui}></Image>
                    <Text>客服</Text>
                  </Button>
                </View>
              </View>
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
                ></Image>
                <Text>修改</Text>
              </View>
              <View className="tools-bar-inner">
                {/* <Button
                  className={"xiangce kefu vip"}
                  openType="contact"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <Image className="xiangceIcon" src={Fankui}></Image>
                  <Text>客服</Text>
                </Button> */}
                <View className={"xiangce "}>
                  {/* <Image
                    src={VideoImg}
                    className="xiangceIcon"
                    onClick={() => {
                      Taro.navigateTo({
                        url: "/pages/video/index",
                      });
                    }}
                  ></Image>
                  <Text>视频</Text> */}
                </View>
              </View>
            </View>

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
                {["图片水印", "视频水印"].map((option, index) => {
                  return (
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
                  );
                })}
              </View>
            )}
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
            onRightButtonClick={() => {
              setTiYanModalShow(false);
              // Taro.navigateTo({
              //   url: "/pages/vip/index",
              // });
            }}
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
                <View
                  style={{
                    width: "100%",
                  }}
                >
                  请先填写水印名称后再拍照或相册选图，如下图所示
                </View>
                <Image
                  src={Icon8}
                  style={{
                    marginTop: "10px",
                    width: "300px",
                    height: "52px",
                  }}
                ></Image>
              </View>
            }
            rightButtonText="去填写"
            onRightButtonClick={() => {
              setShowFloatLayout(!showFloatLayout);
              setShuiyinNameModal(false);
              setEdit(true);
            }}
            onLeftButtonClick={() => {
              setShuiyinNameModal(false);
            }}
          />
          <CustomModal
            visible={videoModal}
            title="提示"
            phoneValidation={false}
            customInput={
              <View
                style={{
                  width: "100%",
                }}
              >
                请用手机的 原相机
                拍摄一段视频，然后再从相册选择。最大支持50M以内视频，请控制视频时长。
              </View>
            }
            rightButtonText="确定"
            onRightButtonClick={() => {
              setVideoModal(false);
            }}
            showLeftButton={false}
          />

          {/* 到期提示 开始 */}
          <CustomModal
            visible={vipClosedModal}
            phoneValidation={false}
            title="提示"
            customInput={
              <View
                style={{
                  width: "100%",
                }}
              >
                您的会员已到期,继续使用请重新开通会员
              </View>
            }
            showLeftButton={false}
            rightButtonText="重新开通"
          />
          {/* 填写手机号弹窗 */}
          <CustomModal
            visible={addPhoneNumber}
            title="请输入手机号"
            content="为防止失联，请一定填写正确手机号，如有变动第一时间通知"
            placeholder="请输入手机号码"
            onInputChange={(e) => {
              setPhone(e);
            }}
            onClose={async () => {
              cloud.callFunction({
                name: "addUser",
                data: {
                  phone,
                },
              });
              setAddPhoneNumber(false);
              Taro.setStorage({ key: "phoneInputed", data: true });
            }}
            onLeftButtonClick={() => console.log("取消")}
            showLeftButton={false}
          />
          {/* 替换原来的 Popup 部分为: */}
          <EditMark
            showFloatLayout={showFloatLayout}
            edit={edit}
            currentShuiyinIndex={currentShuiyinIndex}
            setShowFloatLayout={setShowFloatLayout}
            setEdit={setEdit}
            updateShuiyinIndex={updateShuiyinIndex}
            // 日期时间
            year={year}
            month={month}
            day={day}
            hours={hours}
            minutes={minutes}
            handleDateChange={handleDateChange}
            handleTimeChange={handleTimeChange}
            // 位置信息
            locationName={locationName}
            setLocationName={setLocationName}
            // 水印保存设置
            isShuiyinSaved={isShuiyinSaved}
            saveChange={saveChange}
            // 用户信息
            userInfo={userInfo}
            // 水印防伪
            showTrueCode={showTrueCode}
            setShowTrueCode={setShowTrueCode}
            shuiyinxiangjiName={shuiyinxiangjiName}
            setShuiyinxiangjiName={setShuiyinxiangjiName}
            // 验证标记
            showHasCheck={showHasCheck}
            setShowHasCheck={setShowHasCheck}
            // 其他信息
            title={title}
            setTitle={setTitle}
            fangdaoShuiyin={fangdaoShuiyin}
            setFangDaoShuiyin={setFangDaoShuiyin}
            weather={weather}
            setWeather={setWeather}
            longitude={longitude}
            latitude={latitude}
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            dakaName={dakaName}
            setDakaName={setDakaName}
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
