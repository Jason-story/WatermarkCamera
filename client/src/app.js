import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

const systemInfo = Taro.getSystemInfoSync();

const getNewSystems = () => {
  if (wx.canIUse("getUpdateManager")) {
    const updateManager = wx.getUpdateManager(); //管理小程序更新

    updateManager.onCheckForUpdate(function (res) {
      console.log(res);

      if (res.hasUpdate) {
        //res.hasUpdate返回boolean类型

        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: "更新提示",

            content: "新版本已经准备好，是否重启当前应用？",

            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用applyUpdate应用新版本并重启

                updateManager.applyUpdate();
              }
            },
          });
        });

        // 新版本下载失败时执行

        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: "发现新版本",

            content: "请删除当前小程序，重新搜索打开...",
          });
        });
      }
    });
  } else {
    //如果小程序需要在最新的微信版本体验，如下提示

    wx.showModal({
      title: "更新提示",

      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
    });
  }
};
// 字体配置
const FONT_CONFIG = [
  {
    family: "Bebas",
    url: "https://gitee.com/jasonstory/fonts/raw/master/Bebas-regular.ttf",
  },
  {
    family: "NotoSansHans",
    url: "https://gitee.com/jasonstory/fonts/raw/master/NotoSansHans-Bold.ttf",
  },
  {
    family: "Helvetica Neue",
    url: "https://gitee.com/jasonstory/fonts/raw/master/HelveticaNeue.ttf",
  },
  {
    family: "Helvetica Neue Light",
    url: "https://gitee.com/jasonstory/fonts/raw/master/HelveticaNeue-Light.ttf",
  },
  {
    family: "HYQiHei 65J",
    url: "https://gitee.com/jasonstory/fonts/raw/master/hyqhx165.ttf",
  },
  {
    family: "PTMono",
    url: "https://gitee.com/jasonstory/fonts/raw/master/PTMono-Bold.ttf",
  },
  {
    family: "makeNumber",
    url: "https://gitee.com/jasonstory/fonts/raw/master/makeNumber.ttf",
  },
  {
    family: "Monaco",
    url: "https://gitee.com/jasonstory/fonts/raw/master/Monaco.ttf",
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      miSansLoaded: false,
      shouldRerender: false,
    };

    this.globalData = {
      config: {},
      // false 显示 true 隐藏
      // fuckShenHe:false,
      fuckShenHe:
        wx.getAccountInfoSync().miniProgram.envVersion !== "release" &&
        systemInfo.platform !== "devtools",
    };
  }

  // 加载普通字体
  loadNormalFonts() {
    FONT_CONFIG.forEach((font) => {
      wx.loadFontFace({
        family: font.family,
        global: true,
        scopes: ["webview", "native", "skyline"],
        source: `url("${font.url}")`,
        success: () => {
          console.log(`${font.family} 字体加载成功`);
        },
        fail: (err) => {
          console.error(`${font.family} 字体加载失败:`, err);
        },
      });
    });
  }

  async componentDidMount() {
    this.loadNormalFonts();
    getNewSystems();
  }

  componentDidUpdate(prevProps, prevState) {
    // 当MiSans加载完成且需要重新渲染时
    if (this.state.shouldRerender && this.state.miSansLoaded) {
      this.setState({ shouldRerender: false });
      console.log("MiSans 字体已加载，页面重新渲染");
    }
  }

  render() {
    // 根据 MiSans 字体加载状态添加对应的类名
    const containerClass = this.state.miSansLoaded
      ? "app-container misans-loaded"
      : "app-container";

    return <div className={containerClass}>{this.props.children}</div>;
  }
}

export default App;
