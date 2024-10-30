import Shuiyin1 from "./item1";
import Shuiyin2 from "./item2";
import shuiyin1Cover from "./item1/cover.png";
import shuiyin2Cover from "./item2/cover.png";
const config = [
  {
    // 0
    component: Shuiyin2,
    options: {
      title: "今日水印相机-打卡",
      vip: false,
      cover: shuiyin2Cover,
      hasDakaLabel: false,
      showRightCopyright: false,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: 1,
    },
  },
  {
    // 1
    component: Shuiyin1,
    options: {
      title: "水印相机",
      vip: false,
      cover: shuiyin1Cover,
      hasDakaLabel: true,
      showRightCopyright: true,
      showLeftCopyright: true,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: 0,
    },
  },
];
export default config;
