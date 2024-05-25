import { useEffect, useState } from "react";
import { View, Camera, Image } from "@tarojs/components";
import { createCameraContext } from "@tarojs/taro";
import { AtIcon, AtDrawer } from "taro-ui";
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
        console.log("path: ", path);
      },
      fail: (error) => {},
    });
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

        <View className="mask-box"></View>
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
        <View className="share-btn">
          分享 <Image src={shareImg}></Image>
        </View>
        <View className="vip-btn">
          高级功能
          <Image src={vipImg}></Image>
        </View>
      </View>

      <AtDrawer show={settingShow} right mask>
        <View className="drawer-item">优先展示items里的数据</View>
        <View className="drawer-item">如果items没有数据就会展示children</View>
        <View className="drawer-item">
          这是自定义内容 <AtIcon value="home" size="20" />
        </View>
        <View className="drawer-item">这是自定义内容</View>
      </AtDrawer>
    </View>
  );
};

export default CameraPage;
