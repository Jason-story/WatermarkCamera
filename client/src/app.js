import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

class App extends Component {
  constructor() {
    super();
    // 手动定义 globalData
    this.globalData = {
      config: {},
      fuckShenHe : wx.getAccountInfoSync().miniProgram.envVersion == "release",
      }
  }

  componentDidMount() {
    Taro.cloud.init({
      env: "ly-9gjnymq6d9d7ca23",
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
