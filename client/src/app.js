import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

const systemInfo = Taro.getSystemInfoSync();

// 字体配置
const FONT_CONFIG = [
  {
    family: "Bebas",
    url: "https://gitee.com/jasonstory/fonts/raw/master/Bebas-regular.ttf",
  },
  {
    family: "qimiaotype",
    url: "https://gitee.com/jasonstory/fonts/raw/master/qimiaotype-bold.ttf",
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

  // 加载MiSans字体
  loadMiSansFont() {
    return new Promise((resolve, reject) => {
      wx.loadFontFace({
        family: "MiSans",
        global: true,
        scopes: ["webview", "native", "skyline"],
        source:
          'url("https://gitee.com/jasonstory/fonts/raw/master/MiSans-Bold.ttf")',
        success: () => {
          console.log("MiSans 字体加载成功");
          this.setState(
            {
              miSansLoaded: true,
              shouldRerender: true,
            },
            () => {
              resolve(true);
            }
          );
        },
        fail: (err) => {
          console.error("MiSans 字体加载失败:", err);
          reject(err);
        },
      });
    });
  }

  async componentDidMount() {
     // 加载其他字体
     this.loadNormalFonts();
    try {
      // 检查缓存中是否已经加载过MiSans
      const fontCache = wx.getStorageSync("miSansFontCache");
      const now = new Date().getTime();

      if (fontCache && now - fontCache.timestamp < 24 * 60 * 60 * 1000) {
        // 如果缓存存在且未过期，直接标记为已加载
        this.setState({
          miSansLoaded: true,
          shouldRerender: true,
        });
        console.log("使用缓存的 MiSans 字体");
      } else {
        // 否则先加载MiSans字体
        await this.loadMiSansFont();
        // 设置缓存
        wx.setStorageSync("miSansFontCache", {
          timestamp: now,
          family: "MiSans",
        });
      }
    } catch (error) {
      console.error("字体加载错误:", error);
    }
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
