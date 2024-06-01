import { useEffect, useState } from "react";
import { View, Camera, Button, Text, Image, Canvas } from "@tarojs/components";
import { createCameraContext, useDidShow } from "@tarojs/taro";
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
import shareImg from "../../images/share.png";
import vipImg from "../../images/vip.png";
import fanzhuanImg from "../../images/fanzhuan.png";
import shanguangdengImg from "../../images/shan-on.png";
import shanguangdengOffImg from "../../images/shan-off.png";
import "./index.scss";

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

  const [locationName, setLocationName] = useState("");
  const [permissions, setPermissions] = useState({
    camera: false,
    writePhotosAlbum: false,
    userLocation: false,
  });

  const fetchWeather = () => {
    const url =
      "https://api.seniverse.com/v3/weather/now.json?key=S7OyUofVVMeBcrLsC&location=beijing&language=zh-Hans&unit=c";

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
    getLocation();
    fetchWeather();
  }, [allAuth, permissions]);

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

  const takePhoto = () => {
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
  };

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index",
      imageUrl: "https://img2.imgtp.com/2024/05/28/pJCAITAT.jpg",
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
  const drawMask = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

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

    const date = `${year}年${month}月${day}日`;
    const time = `${hours}:${minutes}`;

    const ctx = Taro.createCanvasContext("fishCanvas");

    // 设置黑色背景
    ctx.setFillStyle("rgba(0, 0, 0, 0)");
    ctx.fillRect(0, 0, 280, 120);
    // 绘制时间
    ctx.setFontSize(28); // 设置字体大小
    ctx.setFillStyle("white");
    ctx.fillText(time, 0, 40); // 10, 30 为起始坐标
    // 黄色竖线
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("yellow");
    ctx.beginPath();
    ctx.moveTo(82, 0); // 起点
    ctx.lineTo(82, 55); // 终点，竖线高度为20px
    ctx.stroke();
    // 绘制日期
    ctx.setFontSize(16); // 设置字体大小
    ctx.fillText(date, 88, 20); // 10, 60 为起始坐标
    // 绘制天气
    // ctx.setFontSize(18); // 设置字体大小
    ctx.fillText(
      daysOfWeek[dayIndex] +
        " 天气" +
        weather?.text +
        " " +
        weather?.temperature +
        "℃",
      88,
      50
    ); // 10, 60 为起始坐标
    // 地点
    ctx.fillText(locationName, 0, 90); // 10, 60 为起始坐标
    // 经纬度
    ctx.fillText(
      "经纬度:" + latitude?.toFixed(4) + "," + longitude?.toFixed(4),
      0,
      115
    ); // 10, 60 为起始坐标
    ctx.draw(false, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          canvasId: "fishCanvas",
          success: (res) => {
            setCanvasImg(res.tempFilePath);
            console.log("图片路径：", res.tempFilePath);
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
  console.log("canvasImg: ", canvasImg);

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
            {/* <View className="auth-list">
              <View>
                相机权限：
                {permissions.camera ? (
                  <Text className="hasAuth">已授权</Text>
                ) : (
                  <Text className="noAuth">未授权</Text>
                )}
              </View>
              <View>
                相册权限：
                {permissions.writePhotosAlbum ? (
                  <Text className="hasAuth">已授权</Text>
                ) : (
                  <Text className="noAuth">未授权</Text>
                )}
              </View>
              <View>
                位置权限：
                {permissions.userLocation ? (
                  <Text className="hasAuth">已授权</Text>
                ) : (
                  <Text className="noAuth">未授权</Text>
                )}
              </View>
            </View> */}
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
        {/* <View className="setting-box" onClick={handleSetting}>
          <View className="setting-icon">
            <AtIcon value="settings" size="25" color="#fff"></AtIcon>
          </View>
        </View> */}
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
          <View className={"mask-box "}>
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
      </View>
      <View className="tools-bar">
        <View className="xiangce"></View>
        <View className="shuiyin"></View>
        <View className="take-photo" onClick={takePhoto}>
          <View className="camera-button">
            <View className="camera-button-inner"></View>
          </View>
        </View>
        <View className="qiehuan"></View>
      </View>
      <View className="bottom-btns">
        <Button className="share-btn" openType="share"
         style={{
          background: "linear-gradient(45deg,#ff512f, #dd2476)",
          color: "white",
          border: "none",
          borderRadius: "25px",
          padding: "0 16px",
          fontSize: "30rpx",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          width: "45%",

        }}>
          分享好友
        </Button>

        <Button className="vip-btn" onClick={vipModalCLick}
         style={{
          background: "linear-gradient(45deg,#fc4a1a, #f7b733)",
          color: "white",
          border: "none",
          borderRadius: "25px",
          padding: "0px 20px",
          fontSize: "30rpx",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          width: "45%",
        }}>
          高级功能
        </Button>
      </View>

      {/* <AtDrawer show={settingShow} right mask>
        <View className="drawer-item">优先展示items里的数据</View>
        <View className="drawer-item">如果items没有数据就会展示children</View>
        <View className="drawer-item">
          这是自定义内容 <AtIcon value="home" size="20" />
        </View>
        <View className="drawer-item">这是自定义内容</View>
      </AtDrawer> */}
      <AtModal isOpened={vipModal} closeOnClickOverlay={false}>
        <AtModalHeader>
          高级功能
          {/* (19.9元/月) */}
        </AtModalHeader>
        <AtModalContent>
          <View className="modal-list">
            <View>1、可自定义时间、位置</View>
            <View>2、去掉所有广告</View>
            <View>3、高质量水印图片</View>
            <View>4、每月不限量水印照片生成</View>
            <View className="txt1">
              <View style={{marginBottom:'20px',color:'#000'}}>可点击按钮咨询</View>
              <View>
                <button
                  openType="contact"
                  style={{
                    background: "linear-gradient(45deg,#24c6dc, #514a9d)",
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
      </AtModal>
    </View>
  );
};

export default CameraPage;
