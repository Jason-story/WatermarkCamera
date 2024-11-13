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
        'url("https://gitee.com/jasonstory/fonts/raw/master/hyqhx165.ttf")',
    });
    wx.loadFontFace({
      family: "number",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://gitee.com/jasonstory/fonts/raw/master/Bebas-regular.ttf")',
    });
    // 马克相机数字
    wx.loadFontFace({
      family: "makeNumber",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://gitee.com/jasonstory/fonts/raw/master/makeNumber.ttf")',
    });
    wx.loadFontFace({
      family: "Monaco",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://gitee.com/jasonstory/fonts/raw/master/Hack-Regular.ttf")',
    });
    wx.loadFontFace({
      family: "MiSans",
      global: true,
      scopes: ["webview", "native"],
      source:
        // 数字
        'url("https://gitee.com/jasonstory/fonts/raw/master/MiSans-Bold.ttf")',
    });
    wx.loadFontFace({
      family: "huakangjingangheiRegular",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://gitee.com/jasonstory/fonts/raw/master/huakangjingangheiRegular.ttf")',
    });
    wx.loadFontFace({
      family: "InsideOutCow3",
      global: true,
      scopes: ["webview", "native"],
      source:
        'url("https://gitee.com/jasonstory/fonts/raw/master/InsideOutCow3.ttf")',
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
