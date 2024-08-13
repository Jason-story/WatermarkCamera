import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

class App extends Component {
  componentDidMount() {
    Taro.cloud.init({
      env: "sy-4gecj2zw90583b8b",
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
