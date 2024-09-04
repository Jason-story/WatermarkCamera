import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";

const QRCodePage = () => {
  const [qrCodes] = useState([
    {
      url: "https://files-1326662896.cos.ap-beijing.myqcloud.com/jc-1.jpg",
    },
    {
      url: "https://files-1326662896.cos.ap-beijing.myqcloud.com/jc-2.jpg",
    },
    {
      url: "https://files-1326662896.cos.ap-beijing.myqcloud.com/jc-3.jpg",
    },
    {
      url: "https://files-1326662896.cos.ap-beijing.myqcloud.com/jc-4.jpg",
    },
    {
      url: "https://files-1326662896.cos.ap-beijing.myqcloud.com/jc-5.jpg",
    },
  ]);

  return (
    <View className="qr-code-page">
      <View className="qr-code-container">
        {qrCodes.map((qrCode, index) => (
          <View key={index} className="qr-code-item">
            <Image
              src={qrCode.url}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{ width: "calc(45vw)", height: "calc(60vw)", margin: "10px 0" }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default QRCodePage;
