const appConfigs = {
  wx785efc584be4265b: {
    // 可修改水印相机 主小程序
    type: "normal",
    env: "sy-4gecj2zw90583b8b",
    priceShow: "isMainShow",
    priceMap: "jiage",
    notify_url: "https://1326662896-fn1j227njy-sh.scf.tencentcs.com",
    containerId: "prod-9g5wnloybe56625b",
    containerName: "express-loc1",
  },
  // 可修改定位水印相机 被共享
  wxb5e2af22e727269d: {
    type: "shared",
    resourceAppid: "wx785efc584be4265b",
    resourceEnv: "sy-4gecj2zw90583b8b",
    priceShow: "isSecondShow",
    priceMap: "jiage2",
    notify_url: "https://1326662896-fn1j227njy-sh.scf.tencentcs.com",
    containerId: "prod-9g5wnloybe56625b",
    containerResourceAppid: "wx785efc584be4265b",
    containerResourceEnv: "prod-9g5wnloybe56625b",
    containerName: "express-loc1",
    userToApp: "子小程序",
  },

  wx8d21222bcb51c801: {
    // 字定义水印相机 ly 主小程序
    type: "normal",
    env: "ly-9gjnymq6d9d7ca23",
    priceShow: "isMainShow",
    priceMap: "jiage",
    notify_url: "https://1330414900-iztv1ielys.ap-shanghai.tencentscf.com",
    containerId: "prod-5gzgeq4v5542b918",
    containerName: "express-ptcb",
  },
};

export { appConfigs };
