import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.scss";
import "taro-ui/dist/style/index.scss";

const systemInfo = Taro.getSystemInfoSync();

const checkForUpdate = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!wx.canIUse("getUpdateManager")) {
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
          showCancel: false,
        });
        resolve(false);
        return;
      }

      const updateManager = wx.getUpdateManager();

      // 检查更新
      updateManager.onCheckForUpdate((res) => {
        console.log("检查更新结果：", res);

        if (!res.hasUpdate) {
          resolve(false);
          return;
        }

        // 监听下载完成
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，重启应用后生效。是否立即重启？",
            success: (modalRes) => {
              if (modalRes.confirm) {
                try {
                  updateManager.applyUpdate();
                } catch (error) {
                  console.error("应用更新失败：", error);
                  reject(error);
                }
              }
              resolve(true);
            },
            fail: (error) => {
              console.error("显示更新弹窗失败：", error);
              reject(error);
            },
            confirmText: "重启应用",
            cancelText: "稍后重启",
          });
        });

        // 监听下载失败
        updateManager.onUpdateFailed((error) => {
          console.error("版本下载失败：", error);
          wx.showModal({
            title: "更新提示",
            content:
              "新版本下载失败，请检查网络后重试。如果问题依然存在，请删除小程序后重新搜索打开。",
            showCancel: false,
            confirmText: "我知道了",
            complete: () => {
              reject(new Error("版本下载失败"));
            },
          });
        });
      });
    } catch (error) {
      console.error("检查更新失败：", error);
      reject(error);
    }
  });
};

// 字体配置
const FONT_CONFIG = [
  {
    family: "waterTop",
    url: "https://gitee.com/jasonstory/fonts/raw/master/water_top.ttf",
  }, {
    family: "waterBottom",
    url: "https://gitee.com/jasonstory/fonts/raw/master/water_bottom.ttf",
  }, {
    family: "MiSans",
    url: "https://gitee.com/jasonstory/fonts/raw/master/subset-MiSans-Bold.ttf",
  },
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
    // 使用示例
    async function initApp() {
      try {
        const hasUpdate = await checkForUpdate();
        console.log("更新检查完成，是否有更新：", hasUpdate);
      } catch (error) {
        console.error("更新检查发生错误：", error);
      }
    }
    initApp()
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
