import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

const systemInfo = Taro.getSystemInfoSync();

class App extends Component {
  constructor() {
    super();
    this.globalData = {
      config: {},
      // false 显示  true隐藏
      fuckShenHe: false,
      // fuckShenHe:
      //   wx.getAccountInfoSync().miniProgram.envVersion !== "release" &&
      //   systemInfo.platform !== "devtools",
    };
  }

  componentDidMount() {
    wx.loadFontFace({
      family: "Helvetica Neue",
      global: true,
      scopes: ["webview", "native", "skyline"],

      source:
        'url("https://fonts-1326662896.cos.ap-guangzhou.myqcloud.com/HelveticaNeue.ttf")',
    });
    wx.loadFontFace({
      family: "Helvetica Neue Light",
      global: true,
      scopes: ["webview", "native", "skyline"],

      source:
        'url("https://fonts-1326662896.cos.ap-guangzhou.myqcloud.com/HelveticaNeue-Light.ttf")',
    });

    wx.loadFontFace({
      family: "HYQiHei 65J",
      global: true,
      scopes: ["webview", "native", "skyline"],

      source:
        // 汉仪旗黑x165
        'url("https://fonts-1326662896.cos.ap-guangzhou.myqcloud.com/hyqhx165.ttf")',
    });
    wx.loadFontFace({
      family: "Bebas",
      global: true,
      scopes: ["webview", "native", "skyline"],
      source:
        // 数字
        'url("https://fonts-1326662896.cos.ap-guangzhou.myqcloud.com/Bebas-regular.ttf")',
    });
    wx.loadFontFace({
      family: "MiSans",
      global: true,
      scopes: ["webview", "native", "skyline"],
      success: console.log("MiSans 字体加载成功"),
      source:
        'url("https://fonts-1326662896.cos.ap-guangzhou.myqcloud.com/MiSans-Bold.ttf")',
    });
    // // 马克相机数字
    // wx.loadFontFace({
    //   family: "makeNumber",
    //   global: true,
    //         scopes: ["webview", "native", "skyline"],

    //   source:
    //     // 数字
    //     'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/makeNumber.ttf")',
    // });
    // wx.loadFontFace({
    //   family: "Monaco",
    //   global: true,
    //         scopes: ["webview", "native", "skyline"],

    //   source:
    //     // 数字
    //     'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/Hack-Regular.ttf")',
    // });

    // wx.loadFontFace({
    //   family: "huakangjingangheiRegular",
    //   global: true,
    //         scopes: ["webview", "native", "skyline"],

    //   source:
    //     'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/huakangjingangheiRegular.ttf")',
    // });
    // wx.loadFontFace({
    //   family: "InsideOutCow3",
    //   global: true,
    //         scopes: ["webview", "native", "skyline"],

    //   source:
    //     'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/InsideOutCow3.ttf")',
    // });
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
