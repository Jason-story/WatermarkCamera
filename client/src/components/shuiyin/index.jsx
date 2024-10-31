import Shuiyin1 from "./item1";
import Shuiyin2 from "./item2";
import Shuiyin3 from "./item3";
import Shuiyin1Cover from "./item1/cover.png";
import Shuiyin2Cover from "./item2/cover.png";
import Shuiyin3Cover from "./item3/cover.png";
const config = [
  {
    // 0
    component: Shuiyin1,
    options: {
      title: "今日水印相机-打卡",
      vip: false,
      cover: Shuiyin1Cover,
      hasDakaLabel: true,
      showRightCopyright: true,
      showLeftCopyright: true,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: "jrsy",
    },
  },
  {
    // 1
    component: Shuiyin2,
    options: {
      title: "今日水印相机-打卡",
      vip: false,
      cover: Shuiyin2Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: true,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: "mk",
    },
  },
  {
    // 2
    component: Shuiyin3,
    options: {
      title: "水印相机",
      vip: false,
      cover: Shuiyin3Cover,
      hasDakaLabel: false,
      showRightCopyright: false,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: false,
    },
  },
];
export default config;
