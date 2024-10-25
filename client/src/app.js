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
      // fuckShenHe: false,
      fuckShenHe:
        wx.getAccountInfoSync().miniProgram.envVersion !== "release" &&
        systemInfo.platform !== "devtools",
    };
  }

  componentDidMount() {
    wx.loadFontFace({
      family: "hyqh",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 汉仪旗黑x165
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/hyqhx165.ttf")',
    });
    wx.loadFontFace({
      family: "number",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/Bebas-regular.ttf")',
    });
    // 马克相机数字
    wx.loadFontFace({
      family: "makeNumber",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/makeNumber.ttf")',
    });
    wx.loadFontFace({
      family: "Monaco",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/Hack-Regular.ttf")',
    });
    wx.loadFontFace({
      family: "MiSans",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/MiSans-Bold.ttf")',
    });
    wx.loadFontFace({
      family: "huakangjingangheiRegular",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/huakangjingangheiRegular.ttf")',
    });
    wx.loadFontFace({
      family: "InsideOutCow3",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/do-not-delete/InsideOutCow3.ttf")',
    });
  }



  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
