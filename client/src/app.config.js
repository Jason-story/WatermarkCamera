export default {
  pages: [
    "pages/index/index",
    "pages/result/index",
    "pages/vip/index",
    "pages/me/index",
    "pages/img/index",
    "pages/meituan/index",
  ],
  requiredPrivateInfos: ["getLocation"],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示",
    },
    "scope.writePhotosAlbum": {
      desc: "你的相册权限将用于保存图片",
    },
    "scope.camera": {
      desc: "你的相机权限将用于拍摄图片",
    },
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  cloud: true,
};
