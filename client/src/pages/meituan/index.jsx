import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import Meituan from "../../images/meituan.jpg"
import Didi from "../../images/didi.jpg"
import Elm from "../../images/elm.jpg"
import Hxz from "../../images/hxz.jpg"
import Df from "../../images/df.jpg"
import Hf from "../../images/hf.jpg"
import "./index.scss";

const QRCodePage = () => {
  const [qrCodes] = useState([
    {
      name: "美团",
      url: Meituan
    },
    {
      name: "饿了么",
      url: Elm,
    },
    {
      name: "滴滴",
      url: Didi,
    },
    {
      name: "花小猪",
      url: Hxz,
    }, {
      name: "电费",
      url: Df,
    }, {
      name: "话费",
      url: Hf,
    },
  ]);

  useLoad(() => {
    console.log("Page loaded.");
  });

  const saveImage = async (imagePath, name) => {
    try {
      await Taro.saveImageToPhotosAlbum({ filePath: imagePath });
      Taro.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("保存失败", error);
      Taro.showToast({
        title: "保存失败",
        icon: "none",
        duration: 2000,
      });
    }
  };

  return (
    <View className="qr-code-page">
      {/* <Text style={{fontSize:'16px'}}>可以长按识别，也可保存本地相册</Text> */}
      <View className="qr-code-container">
        {qrCodes.map((qrCode, index) => (
          <View key={index} className="qr-code-item">
            <Text className="qr-code-name">{qrCode.name}</Text>
            <Image
              src={qrCode.url}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{ width: "150px", height: "150px", margin: "10px 0" }}
            />
            <Button
              onClick={() => saveImage(qrCode.url, qrCode.name)}
              className="save-button"
              style={{ width: "50%" }}
            >
              保存二维码
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QRCodePage;
