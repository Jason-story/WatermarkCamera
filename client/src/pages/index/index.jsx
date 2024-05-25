import { useEffect, useState } from "react";
import { View, Camera, Button, Image, Canvas } from "@tarojs/components";
import { createCameraContext } from "@tarojs/taro";
import {
  AtIcon,
  AtDrawer,
  AtModal,
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
  const [devicePosition, setDevicePosition] = useState("back");
  const [shanguangflag, setShanguangFlag] = useState("off");
  const [vipModal, setVipModal] = useState(false);
  // const [maskTempPath, setMaskTempPath] = useState("");

  useEffect(() => {
    const context = createCameraContext();
    setCameraContext(context);

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
                "/pages/result/index?bg=" +  path.tempImagePath  + "&mask=" + res.tempFilePath ,
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
    const ctx = Taro.createCanvasContext("fishCanvas");
    ctx.setFillStyle("rgba(0, 0, 0, 0.5)");
    ctx.fillRect(0, 0, 300, 300);

    // 绘制红色圆
    ctx.beginPath();
    ctx.arc(150, 150, 50, 0, 2 * Math.PI);
    ctx.setFillStyle("red");
    ctx.fill();

    ctx.draw();
  };
  useEffect(() => {
    drawMask()
  }, []);
  return (
    <View className="container">
      <View className="camera-box">
        <Camera
          className="camera"
          devicePosition={devicePosition}
          flash={shanguangflag}
          onError={cameraError}
        />
        {/* <View className="setting-box" onClick={handleSetting}>
          <View className="setting-icon">
            <AtIcon value="settings" size="25" color="#fff"></AtIcon>
          </View>
        </View> */}
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

        <View className="mask-box">
          {/* ****************** */}
          <Canvas
            canvas-id="fishCanvas"
            style={{ width: "300px", height: "300px" }}
          />
        </View>
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
        <AtModalHeader>高级功能(19.9元/月)</AtModalHeader>
        <AtModalContent>
          <View className="modal-list">
            <View>1、可自定义时间、位置</View> <View>2、高质量水印图片</View>{" "}
            <View>3、每月不限量水印照片生成</View>
            <View className="txt1">
              可添加 <View>jason_story</View> 了解详情
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
