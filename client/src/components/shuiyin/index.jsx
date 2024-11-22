import Shuiyin1 from "./item1";
import Shuiyin2 from "./item2";
import Shuiyin3 from "./item3";
import Shuiyin4 from "./item4";
import Shuiyin5 from "./item5";
import Shuiyin6 from "./item6";
import Shuiyin7 from "./item7";
import Shuiyin8 from "./item8";
import Shuiyin9 from "./item9";
import Shuiyin10 from "./item10";
import Shuiyin11 from "./item11";
import Shuiyin1Cover from "./item1/cover.png";
import Shuiyin2Cover from "./item2/cover.png";
import Shuiyin3Cover from "./item3/cover.png";
import Shuiyin4Cover from "./item4/cover.png";
import Shuiyin5Cover from "./item5/cover.png";
import Shuiyin6Cover from "./item6/cover.png";
import Shuiyin7Cover from "./item7/cover.png";
import Shuiyin8Cover from "./item8/cover.png";
import Shuiyin9Cover from "./item9/cover.png";
import Shuiyin10Cover from "./item10/cover.png";
import Shuiyin11Cover from "./item11/cover.png";
import editLabel from "./label";
const config = [
  {
    // 1
    component: Shuiyin1,
    label: editLabel[0],
    options: {
      title: "今日水印相机-打卡",
      vip: false,
      cover: Shuiyin1Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: true,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: false,
      hasJingWeiDu: false,
      hasRemark: true,
      copyright: "jrsy",
      maskScale: true,
    },
  },
  {
    // 2
    component: Shuiyin2,
    label: editLabel[1],
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
      maskScale: true,
    },
  },
  {
    // 3
    component: Shuiyin3,
    label: editLabel[2],
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
      maskScale: true,
    },
  },
  {
    // 4
    component: Shuiyin4,
    label: editLabel[3],
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
      maskScale: true,
    },
  },
  {
    // 5
    component: Shuiyin5,
    label: editLabel[4],
    options: {
      title: "工程记录",
      id: "gongcheng1",
      vip: false,
      cover: Shuiyin5Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: true,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: false,
      hasRemark: true,
      copyright: "jrsy",
      maskScale: true,
    },
  },
  {
    // 6
    component: Shuiyin6,
    label: editLabel[5],
    options: {
      title: "短黄线 温度",
      vip: false,
      cover: Shuiyin6Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: true,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: true,
      hasRemark: true,
      copyright: "jrsy",
      maskScale: true,
    },
  },
  {
    // 7
    component: Shuiyin7,
    label: editLabel[6],

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
      maskScale: true,
    },
  },
  {
    // 8
    component: Shuiyin8,
    label: editLabel[7],

    options: {
      title: "防盗",
      vip: false,
      cover: Shuiyin8Cover,
      hasDakaLabel: false,
      showRightCopyright: false,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: true,
      hasWeather: false,
      hasJingWeiDu: false,
      hasRemark: false,
      copyright: false,
    },
  },
  {
    // 9
    component: Shuiyin9,
    label: editLabel[8],
    options: {
      title: "定制",
      vip: true,
      cover: Shuiyin9Cover,
      hasDakaLabel: false,
      showRightCopyright: false,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: false,
      hasRemark: false,
      copyright: false,
      finalWidth: 1290,
      finalHeight: 2160,
      proportion: 1.674418,
    },
  },
  {
    // 10
    component: Shuiyin10,
    label: editLabel[9],
    options: {
      title: "工程记录10",
      vip: true,
      cover: Shuiyin10Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: true,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: false,
      hasRemark: true,
      copyright: "jrsy",
      maskScale: true,
    },
  }, {
    // 11
    component: Shuiyin11,
    label: editLabel[10],
    options: {
      title: "短黄线 时间地点经纬度",
      vip: false,
      cover: Shuiyin11Cover,
      hasDakaLabel: false,
      showRightCopyright: true,
      showLeftCopyright: false,
      hasTitle: false,
      hasFangDao: false,
      hasWeather: true,
      hasJingWeiDu: true,
      hasRemark: false,
      copyright: "jrsy",
      maskScale: true,
    },
  },
];
export default config;
