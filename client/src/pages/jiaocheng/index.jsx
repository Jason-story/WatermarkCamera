import React, { useState } from "react";
import { View, Image, Button, Text } from "@tarojs/components";

import "./index.scss";

const QRCodePage = () => {
  const [qrCodes] = useState([
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-05/14561725541359861_jc-1.jpg?sign=91bd0fcdb28d78f18cb79eb70341c904&t=1725541360",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-05/14181725541359863_jc-2.jpg?sign=d4bbd554b16d91816bbb820dffa14c91&t=1725541360",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-05/17651725541359864_jc-3.jpg?sign=3bc67fab5f26eefea5b4aadbee658376&t=1725541360",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-05/19601725541359865_jc-4.jpg?sign=e29c6a99010a588508f81ac26fdaf3f9&t=1725541360",
    },
    {
      url: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-05/11311725541359866_jc-5.jpg?sign=5d4170d3d96e2fccab688eb8e70c3ded&t=1725541360",
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
