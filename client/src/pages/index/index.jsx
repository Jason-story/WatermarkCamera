import { useEffect, useState } from "react";
import { View, Camera, Button, Image, Canvas } from "@tarojs/components";
import { createCameraContext } from "@tarojs/taro";
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
  // const [maskTempPath, setMaskTempPath] = useState("");

  useEffect(() => {
    const context = createCameraContext();
    setCameraContext(context);

    Taro.getSetting().then((res) => {
      const authSetting = res.authSetting;

      // 是否完全授权
      if (
        authSetting["scope.camera"] &&
        authSetting["scope.userLocation"] &&
        authSetting["scope.writePhotosAlbum"]
      ) {
        setAllAuth(true);
      } else {
        setAllAuth(false);
      }
    });
  }, []);
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
        Taro.canvasToTempFilePath({
          canvasId: "fishCanvas",
          success: (res) => {
            console.log("res.tempFilePath: ", res.tempFilePath);
            Taro.navigateTo({
              url:
                "/pages/result/index?bg=" +
                path.tempImagePath +
                "&mask=" +
                res.tempFilePath,
            });
          },
          fail: (err) => {
            console.error(err);
            Taro.showToast({
              title: "图片生成失败,请重新启动小程序",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
      fail: (error) => {},
    });
  };

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index",
    };
  });
  const vipModalCLick = () => {
    setVipModal(!vipModal);
  };
  const copyWx = () => {
    setVipModal(!vipModal);
    Taro.setClipboardData({
      data: "jason_story",
      success: () => {
        Taro.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
    });
  };
  const drawMask = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const date =  `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`

    const ctx = Taro.createCanvasContext("fishCanvas");

    // 设置黑色背景
    ctx.setFillStyle("rgba(0, 0, 0, 0.3)");
    ctx.fillRect(0, 0, 150, 150);

    // 绘制白色文字 "hello"
    ctx.setFontSize(16); // 设置字体大小
    ctx.setFillStyle("white");
    ctx.fillText(date, 10, 30); // 10, 30 为起始坐标

    ctx.setFontSize(15); // 设置字体大小
    // 绘制红色文字 "你好"
    ctx.fillText(time, 10, 60); // 10, 60 为起始坐标

    ctx.draw();
  };
  useEffect(() => {
    drawMask();
  }, []);
  const openSetting = () => {
    Taro.openSetting();
  };

  return (
    <View className="container">
      <View className="camera-box">
        <Camera
          className="camera"
          devicePosition={devicePosition}
          flash={shanguangflag}
          onError={cameraError}
        />
        {!allAuth && (
          <View className="auth-box">
            <View>
              小程序需要相机、相册、位置权限才可以正常运行，请您点击按钮授权后重启小程序
            </View>
            <AtButton type="primary" size="normal" circle onClick={openSetting}>
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
          <View className="mask-box">
            {/* ******************************* */}
            <Canvas
              canvas-id="fishCanvas"
              style={{ width: "150px", height: "150px" }}
            />
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
        <Button className="share-btn" openType="share">
          分享 <Image src={shareImg}></Image>
        </Button>
        <Button className="vip-btn" onClick={vipModalCLick}>
          高级功能
          <Image src={vipImg}></Image>
        </Button>
      </View>

      <AtDrawer show={settingShow} right mask>
        <View className="drawer-item">优先展示items里的数据</View>
        <View className="drawer-item">如果items没有数据就会展示children</View>
        <View className="drawer-item">
          这是自定义内容 <AtIcon value="home" size="20" />
        </View>
        <View className="drawer-item">这是自定义内容</View>
      </AtDrawer>
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
              可添加 <View>jason_story</View> 了解详情或提出建议
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={copyWx}>关闭并复制客服微信</Button>{" "}
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default CameraPage;
