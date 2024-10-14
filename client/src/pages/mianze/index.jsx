import React, { useState } from "react";
import { View } from "@tarojs/components";

import "./index.scss";
const app = getApp();

const QRCodePage = () => {
  return (
    <View className="qr-code-page">
      <View className="user-details" style={{
        color:'#545050',
        padding:'20px 20px',
        boxSizing:'border-box'
      }}>
        <View>
          感谢您使用本小程序。在使用本小程序之前，请仔细阅读并透彻理解本声明。如果您不同意本声明的任何内容，建议您立即停止使用本小程序。一旦您使用本小程序，即视为您已充分理解并同意本声明的所有条款。
        </View>
        <View>
          1.
          本小程序仅提供基础的拍摄与水印添加功能，不包含任何第三方相机应用的元素。所有生成的照片内容均为用户自行拍摄或编辑，水印样式由用户自主输入和选择。若因生成的照片与其他应用生成的内容相似而导致任何经济损失或纠纷，相关责任由用户自行承担。
        </View>
        <View>
          2.
          本小程序的功能仅限于拍摄、编辑和拼图处理，旨在为用户提供简单的照片处理工具。用户在使用过程中产生的任何风险、损失或责任，均由用户自行承担，本小程序不对此承担任何形式的责任。
        </View>
        <View>
          3.
          用户在使用本小程序时，必须遵守相关法律法规。用户对通过本小程序拍摄、编辑、分享的照片及内容负有完全的法律责任。若因用户违反法律法规导致的任何纠纷、损失或法律责任，本小程序及其开发者概不负责。
        </View>
        <View>
          4. 本声明的解释权及对本小程序使用的最终解释权归本小程序开发者所有。
        </View>
      </View>
    </View>
  );
};

export default QRCodePage;
