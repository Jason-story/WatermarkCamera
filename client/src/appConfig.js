const appConfigs = {
  wx785efc584be4265b: {
    // 可修改水印相机 主小程序
    type: "normal",
    env: "sy-4gecj2zw90583b8b",
    priceShow: "isMainShow",
    notify_url: "https://1326662896-fn1j227njy-sh.scf.tencentcs.com",
    containerId: "prod-9g5wnloybe56625b",
    containerName: "express-loc1",
    ad: "adunit-39ab5f712a4521b4",
    zhekoujiage: 0,
  },
  // 可修改定位水印相机 被共享
  wxb5e2af22e727269d: {
    type: "shared",
    resourceAppid: "wx785efc584be4265b",
    resourceEnv: "sy-4gecj2zw90583b8b",
    priceShow: "isSecondShow",
    notify_url: "https://1326662896-fn1j227njy-sh.scf.tencentcs.com",
    containerId: "prod-9g5wnloybe56625b",
    containerResourceAppid: "wx785efc584be4265b",
    containerResourceEnv: "prod-9g5wnloybe56625b",
    containerName: "express-loc1",
    userToApp: "子小程序",
    ad: "adunit-58e7bd94d036305e",
    zhekoujiage: 0.01,
  },

  wx8d21222bcb51c801: {
    // 字定义水印相机 ly 主小程序
    type: "normal",
    env: "ly-9gjnymq6d9d7ca23",
    priceShow: "isMainShow",
    notify_url: "https://1330414900-iztv1ielys.ap-shanghai.tencentscf.com",
    containerId: "prod-5gzgeq4v5542b918",
    containerName: "express-ptcb",
    zhekoujiage: 0.02,
  },
  wx66918b8c0abc4288: {
    // 自定义水印照片 ly 主小程序
    type: "shared",
    resourceAppid: "wx8d21222bcb51c801",
    resourceEnv: "ly-9gjnymq6d9d7ca23",
    priceShow: "isSecondShow",
    notify_url: "https://1330414900-iztv1ielys.ap-shanghai.tencentscf.com",
    containerId: "prod-5gzgeq4v5542b918",
    containerResourceAppid: "wx8d21222bcb51c801",
    containerResourceEnv: "prod-5gzgeq4v5542b918",
    containerName: "express-ptcb",
    userToApp: "子小程序",
    zhekoujiage: 0.03,
  },
};

export { appConfigs };
