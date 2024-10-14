import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";
import { appConfigs } from "./appConfig";

let cloud = null;
let cloudInitPromise = null;
const initCloud = async () => {
  if (cloudInitPromise) return cloudInitPromise; // Return if already initializing
  cloudInitPromise = (async () => {
    const appid = Taro.getAccountInfoSync().miniProgram.appId;
    const config = appConfigs[appid];
    if (config.type === "shared") {
      await new Taro.cloud.Cloud({
        resourceAppid: config.resourceAppid,
        resourceEnv: config.resourceEnv,
      });
      await Taro.cloud.init();
      cloud = Taro.cloud;
    } else {
      await Taro.cloud.init({
        env: config.env,
      });
      cloud = Taro.cloud;
    }
    return cloud;
  })();
  return cloudInitPromise;
};

let ytg = null;
let ytgInitPromise = null;
const initContainer = async () => {
  if (ytgInitPromise) return ytgInitPromise; // Return if already initializing
  ytgInitPromise = (async () => {
    const appid = Taro.getAccountInfoSync().miniProgram.appId;
    const config = appConfigs[appid];
    if (config.type === "shared") {
      ytg = await new Taro.cloud.Cloud({
        resourceAppid: config["containerResourceAppid"],
        resourceEnv: config["containerResourceEnv"],
      });
      await ytg.init();
    } else {
      await Taro.cloud.init({
        env: config.env,
      });
      ytg = Taro.cloud;
    }

    return ytg;
  })();
  return ytgInitPromise;
};

const systemInfo = Taro.getSystemInfoSync();
if (systemInfo.platform === "devtools") {
  console.log("当前在开发者工具中运行");
} else {
  console.log("当前在真机中运行");
}

class App extends Component {
  constructor() {
    super();
    // 手动定义 globalData
    this.globalData = {
      config: {},
      cloud,
      ytg,
      getCloud: async () => {
        if (!cloud) {
          await initCloud();
        }
        return cloud;
      },
      getContainer: async () => {
        if (!ytg) {
          await initContainer();
        }
        return ytg;
      },
      // false 显示  true隐藏
      fuckShenHe: false,
      // fuckShenHe:
      //   wx.getAccountInfoSync().miniProgram.envVersion !== "release" &&
      //   systemInfo.platform !== "devtools",
    };
  }

  async componentDidMount() {
    await initCloud();
    await initContainer();
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
