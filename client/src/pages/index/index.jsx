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
import Shuiyin4 from "../../images/shuiyin-4.png";
import AddMyApp from "../../images/add-my-app.png";
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

// const date = `${year}年${month}月${day}日`;
// const time = `${hours}:${minutes}`;

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
  const [vipClosedModal, setVipClosedModal] = useState(false);
  const [screenWidth, setScreenWidth] = useState("");
  const [isShowDD, setIsShowDD] = useState(false);

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
      // 是否滚动DD字幕
      Taro.cloud.callFunction({
        name: "getDD",
        success: function (res) {
          setIsShowDD(res.result.data.open);
        },
      });

      Taro.cloud.callFunction({
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
    };
    wx.getSystemInfo({
      success: function (res) {
        setScreenWidth(res.screenWidth); // 输出屏幕宽度
        console.log("res.screenWidth: ", res.screenWidth);
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
  useEffect(() => {
    // wx.loadFontFace({
    //   family: "Pragmatica",
    //   global: true,
    //   scopes: ["webview", "native"],
    //   source:
    //     'url("https://fonts-1326883150.cos.ap-beijing.myqcloud.com/fonnts.com-Pragmatica_Light.otf")',
    //   success: (res) => {
    //     console.log("Font loaded successfully:", res);
    //     drawMask();
    //   },
    //   fail: (err) => {
    //     console.error("Font load failed:", err);
    //   },
    // });
    // wx.loadFontFace({
    //   family: "PragmaticaBold",
    //   global: true,
    //   scopes: ["webview", "native"],
    //   source:
    //     'url("https://fonts-1326883150.cos.ap-beijing.myqcloud.com/fonnts.com-Pragmatica_Ext_Book.otf")',
    //   success: (res) => {
    //     console.log("Font loaded successfully:", res);
    //     drawMask();
    //   },
    //   fail: (err) => {
    //     console.error("Font load failed:", err);
    //   },
    // });
  }, []);

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
    const canvasConfig = generateCanvasConfig({
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
    });

    const query = Taro.createSelectorQuery();
    query
      .select("#fishCanvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res && res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const dpr = wx.getSystemInfoSync().pixelRatio;
          // 设置canvas宽高
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;

          ctx.scale(dpr, dpr);
          if (
            userInfo.type === "buyout" &&
            (userInfo.hasDingZhi || userInfo.hasDingZhi === 0)
          ) {
            canvasConfig.unshift(
              dingzhi({
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
                dpr,
                canvas,
              })[userInfo.hasDingZhi]
            );
          }

          setCanvasConfigState(canvasConfig);
          canvasConfig[currentShuiyinIndex][0].path.forEach((item, index) => {
            const { draw, args } = item;
            draw(ctx, ...args);
          });

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
          }, 300); // 延迟执行以确保绘制完成
        }
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
      <View
        className="camera-box"
        style={{ height: (screenWidth / 3) * 4 + "px" }}
      >
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
        {allAuth && (
          <View className={"mask-box" + (showFloatLayout ? " top" : "")}>
            {isShowDD && (
              <Marquee
                text="DD打卡可以联系客服，支持修改定位和扫脸等功能"
                speed={10}
              />
            )}
            <Canvas
              id="fishCanvas"
              type="2d"
              // className={canvasImg ? "hideCanvas" : ""}
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
                className={canvasImg ? "hideCanvas" : ""}
                style={{
                  width:
                    canvasConfigState.length > 0 &&
                    canvasConfigState[currentShuiyinIndex][0].width + "px",
                  height:
                    canvasConfigState.length > 0 &&
                    canvasConfigState[currentShuiyinIndex][0].height + "px",
                  // display: "block",
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
                Taro.navigateTo({
                  url: "/pages/vip/index?type=" + userInfo.type,
                });
                // setVipModal(!vipModal);
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
          <Text> 分享群聊</Text>
          <View id="container-stars">
            <View id="stars"></View>
          </View>

          <View id="glow">
            <View className="circle"></View>
            <View className="circle"></View>
          </View>
        </Button>
      </View>

      <AtModal isOpened={vipClosedModal} closeOnClickOverlay={false}>
        <AtModalHeader>
          <Text style={{ color: "#ffaa00" }}>提示</Text>
        </AtModalHeader>
        <AtModalContent>
          <View className="modal-list">
            <View className="txt1">
              您的会员已到期,如需要继续使用请联系客服重新开通
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
                    maxlength={30}
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
                    maxlength={8}
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
