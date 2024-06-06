import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import 'taro-ui/dist/style/index.scss'
import uma from './uma';

Taro.uma = uma;

class App extends Component {
  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init({
        // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        env: "cloud1-4gs2sadtf9393fd1",
        // 是否在将用户访问记录到用户管理中，在控制台中可见，默认为false
        traceUser: false,
      });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
