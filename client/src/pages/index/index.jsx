import { useEffect, useState } from "react";
import { View, Camera } from "@tarojs/components";
import { createCameraContext } from "@tarojs/taro";
import { AtIcon, AtDrawer } from "taro-ui";
import "./index.scss";

const CameraPage = () => {
  const [cameraContext, setCameraContext] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [settingShow, setSettingShow] = useState(false);

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
  };
  const handleSetting = (event) => {
    console.log('event: ', event);
    setSettingShow(!settingShow);
  };

  return (
    <View className="container">
      <View className="camera-box">
        <Camera
          className="camera"
          devicePosition="back"
          flash="off"
          onError={cameraError}
        />
        <View className="setting-box" onClick={handleSetting}>
          <View className="setting-icon">
            <AtIcon value="settings" size="20" color="#fff"></AtIcon>
          </View>
        </View>
        <View className="zoom-box" >
          <View className="zoom-text" onClick={zoomClick}>
            {zoomLevel}
            <View className="icon-x"></View>
          </View>
        </View>
        <View className="mask-box"></View>
      </View>

      <AtDrawer show={settingShow} right mask>
        {/* <View className="drawer-item">优先展示items里的数据</View>
        <View className="drawer-item">如果items没有数据就会展示children</View>
        <View className="drawer-item">
          这是自定义内容 <AtIcon value="home" size="20" />
        </View>
        <View className="drawer-item">这是自定义内容</View> */}
      </AtDrawer>
    </View>
  );
};

export default CameraPage;
