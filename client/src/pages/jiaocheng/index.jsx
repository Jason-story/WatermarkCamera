import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";
const app = getApp();

const QRCodePage = () => {
  const config = app.$app.globalData.config;
  console.log('config: ', config);

  const [qrCodes] = useState([
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-08/10361725795221943_4741725794808_.pic.jpg?sign=1fd7a9f345c5f08096bd0fea657a4396&t=1725795222",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-08/13161725795221944_4751725794811_.pic.jpg?sign=3da8b40e9b34f7dd17fdc80820a635df&t=1725795222",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-08/13851725795221945_4761725794812_.pic.jpg?sign=fd3f970ec326f274ad5bd6d6994e3536&t=1725795222",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-08/16391725795221946_4771725794813_.pic.jpg?sign=9199076e0e44e467c24dfa2c802f2b30&t=1725795222",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-08/10541725795221947_4781725794814_.pic_hd.jpg?sign=5a28635dbaddcc9433299f123c8c4416&t=1725795222",
    },
  ]);
  return (
    <View className="qr-code-page">
      <View className="user-details" >
        {config.jiaochengtext.map((item, index) => {
          return <View key={index}>• {item}</View>;
        })}
      </View>
      <View className="qr-code-container">
        {config.jiaocheng_image.map((item,index) => (
          <View key={index} className="qr-code-item">
            <Image
              src={item}
              className="qr-code-image"
              showMenuByLongpress={true}
              style={{
                width: "calc(45vw)",
                height: "calc(60vw)",
                margin: "10px 0",
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default QRCodePage;
