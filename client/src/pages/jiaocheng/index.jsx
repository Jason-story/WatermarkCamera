import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";

const QRCodePage = () => {
  const [qrCodes] = useState([
    {
      url: "https://s1.imagehub.cc/images/2024/09/04/5e23fc54e70422ff66aed9b9f9bab744.jpg",
    },
    {
      url: "https://s1.imagehub.cc/images/2024/09/04/f36e095e610b43ce4c8e3c1bb7e21558.jpg",
    },
    {
      url: "https://s1.imagehub.cc/images/2024/09/04/62c1bcdbb6bffa2daf34871c3c7bfcc9.jpg",
    },
    {
      url: "https://s1.imagehub.cc/images/2024/09/04/d3046b1a7d420f74e1d1051e151415e3.jpg",
    },
    {
      url: "https://s1.imagehub.cc/images/2024/09/04/772e965c9fc4733ff0626b9519b1bd2f.jpg",
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
