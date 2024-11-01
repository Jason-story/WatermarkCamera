import Shuiyin1 from "./item1";
import Shuiyin2 from "./item2";
import Shuiyin3 from "./item3";
import Shuiyin4 from "./item4";
import Shuiyin5 from "./item5";
import Shuiyin6 from "./item6";
import Shuiyin7 from "./item7";
import Shuiyin1Cover from "./item1/cover.png";
import Shuiyin2Cover from "./item2/cover.png";
import Shuiyin3Cover from "./item3/cover.png";
import Shuiyin4Cover from "./item4/cover.png";
import Shuiyin5Cover from "./item5/cover.png";
import Shuiyin6Cover from "./item6/cover.png";
import Shuiyin7Cover from "./item7/cover.png";
import Shuiyin8Cover from "./item6/cover.png";
import Shuiyin9Cover from "./item6/cover.png";
const config = [
  {
    // 1
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
      hasRemark: true,
      copyright: "jrsy",
    },
  },
  {
    // 2
    component: Shuiyin2,
    options: {
      title: "马克水印相机",
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
    // 3
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
      copyright: "syxj",
    },
  },
  {
    // 4
    component: Shuiyin4,
    options: {
      title: "水印相机",
      vip: false,
      cover: Shuiyin4Cover,
      hasDakaLabel: false,
      showRightCopyright: false,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      copyright: "syxj",
    },
  },
  {
    // 5
    component: Shuiyin5,
    options: {
      title: "工程记录",
      vip: false,
      cover: Shuiyin5Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      hasRemark: true,
      copyright: "jrsy",
    },
  },
  {
    // 6
    component: Shuiyin6,
    options: {
      title: "短黄线 温度",
      vip: false,
      cover: Shuiyin6Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: false,
      hasRemark: true,
      copyright: "jrsy",
    },
  },
  {
    // 7
    component: Shuiyin7,
    options: {
      title: "现场拍照 经纬度",
      vip: false,
      cover: Shuiyin7Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: true,
      hasRemark: true,
      copyright: "jrsy",
    },
  },
];
export default config;
