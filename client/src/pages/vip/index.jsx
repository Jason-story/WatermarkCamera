import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  RadioGroup,
  Radio,
  Label,
  Ad,
  Text,
  Button,
} from "@tarojs/components";
import {
  AtButton,
  AtModal,
  AtToast,
  AtCard,
  AtSwitch,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtFloatLayout,
} from "taro-ui";
import { useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";
import Close from "../../images/close.png";
import "./index.scss";
const md5 = require("./md5.js");
import { appConfigs } from "../../appConfig.js";
const app = getApp();

let cloud = "";
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const getCloud = async () => {
  const config = appConfigs[appid] || appConfigs.defaultApp;
  if (config.type === "shared") {
    cloud = await new Taro.cloud.Cloud({
      resourceAppid: config.resourceAppid,
      resourceEnv: config.resourceEnv,
    });
    await cloud.init();
  } else {
    cloud = await Taro.cloud.init({
      env: config.env,
    });
  }
  return cloud;
};

const inviteId = Taro.getCurrentInstance().router.params.id || "";
const UserInfo = ({ userInfo, price }) => {
  console.log("price: ", price);
  if (!price) {
    return;
  }
  let fuckShenHe = app.$app.globalData.fuckShenHe;
  const config = app.$app.globalData.config;

  let inviteId = Taro.getCurrentInstance().router.params.id || "";
  Taro.getStorage({ key: "createVipFromInviteId" }).then((res) => {
    if (res.data) {
      inviteId = res.data;
    }
  });

  const [selected, setSelected] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    price && setSelected(price.current);
  }, [price]);
  const vipConfig = price?.jiage2?.map((item) => {
    const [key, title, amount, text = ""] = item.split("|");
    return {
      key,
      title: `${title}会员${amount}元`,
      price: amount,
      text,
    };
  });

  console.log(111, vipConfig);
  const getRandomNumber = (minNum = 1000000000, maxNum = 99999999999999) =>
    parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

  /**
   *
   * @param {微信支付签名} params
   * @param {*} key
   */
  function wxPaySign(params, key) {
    const paramsArr = Object.keys(params);
    paramsArr.sort();
    const stringArr = [];
    paramsArr.map((key) => {
      stringArr.push(key + "=" + params[key]);
    });
    // 最后加上 商户Key
    let paramStr = stringArr.join("&");
    paramStr = paramStr + key;
    return md5.md5(paramStr).toString().toLowerCase();
  }

  /**
   * 生成订单号
   * @param {订单号前缀} str
   */
  function getOrderNo(str) {
    let outTradeNo = ""; //订单号
    for (
      var i = 0;
      i < 6;
      i++ //6位随机数，用以加在时间戳后面。
    ) {
      outTradeNo += Math.floor(Math.random() * 10);
    }
    outTradeNo = str + new Date().getTime() + outTradeNo; //时间戳，用来生成订单号。
    return outTradeNo;
  }

  /**
   *
   * @param {金额} long_data
   * @param { 可选,格式化金额精度, 即小数点位数. 如: 3 标示保留小数点后三位, 默认为2位} length
   */
  function formatMoney(long_data, length) {
    length = length > 0 && length <= 20 ? length : 2;
    long_data =
      parseFloat((long_data + "").replace(/[^\d\.-]/g, "")).toFixed(length) +
      "";
    let l = long_data.split(".")[0].split("").reverse();
    let r = long_data.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  }
  /**
   * 发起小程序支付
   */
  function toPay() {
    if (!userInfo.openid) {
      Taro.showModal({
        title: "提示",
        content: "请重新进入小程序后再购买",
        showCancel: false,
      });
      return;
    }
    const price = vipConfig.find((item) => item.key === selected).price;
    let plateform = "无";
    wx.getSystemInfo({
      success: function (res) {
        plateform = res.platform;
      },
    });
    //需要加密的参数
    let data = {
      version: "1.1",
      appid: "201906166942", // 这是虎皮椒的APPID
      trade_order_id: +new Date() + "",
      total_fee: price,
      title: "水印相机会员",
      notify_url: "https://1326662896-fn1j227njy-sh.scf.tencentcs.com",
      time: Math.round(new Date() / 1000),
      nonce_str: getRandomNumber(),
      type: "JSAPI",
      attach:
        "openid=" +
        userInfo.openid +
        "&type=" +
        selected +
        "&inviteId=" +
        inviteId +
        "&price=" +
        price +
        "&plateform=" +
        plateform,
      wap_url: "https://api.xunhupay.com", //填写支付网关
    };
    let sign = wxPaySign(data, "93417b6135b9f85bf14700c4d957aa6e");
    //最后我们把签名加入进去
    data.hash = sign;
    //下面开始执行小程序支付
    //支付流程：小程序A 点击付款->跳转到 “迅虎支付” 小程序 -> 自动发起微信支付 ->支付成功后携带支付结果返回小程序A

    wx.navigateToMiniProgram({
      appId: "wx2574b5c5ee8da56b", //支付网关为：https://api.xunhupay.com 跳转小程序APPID：wx2574b5c5ee8da56b，其他支付网关跳转小程序APPID：wx402faa5bd5eda155
      path: "pages/hpj_cashier/cashier", //支付页面 固定值 不可修改
      extraData: data, //携带的参数 参考API文档
      success(res) {},
      fail(res) {},
    });
  }

  return (
    <View className="user-info">
      {fuckShenHe === false ? (
        <View className="user-details" style={{ marginBottom: "20px" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>会员权益</Text>
          </View>
          <View>• 无限使用次数</View>
          <View>• 解锁视频水印功能(需半年及以上会员)</View>
          <View>• 高清水印图片</View>
          <View>• 去掉除封面广告之外的一切广告</View>
          <View>• 添加微信，随时提供客服支持</View>
        </View>
      ) : (
        "暂无"
      )}

      {fuckShenHe === false ? (
        <View style={{ width: "100%" }}>
          <RadioGroup
            onChange={(e) => {
              setSelected(e.detail.value);
            }}
          >
            {vipConfig.map((item) => {
              return (
                <Label className="vip-item" key={item.key}>
                  <View>
                    <Radio
                      value={item.key}
                      checked={price.current === item.key}
                    />
                  </View>
                  <View
                    className="vip-title"
                    style={{
                      color: item.key === price.current ? "#f22c3d" : "",
                    }}
                  >
                    <Text>{item.title}</Text>
                    {item.text && (
                      <Text
                        style={{
                          fontSize: "15px",
                          fontStyle: "italic",
                        }}
                      >
                        {item.key !== "1day" &&
                          item.key !== "never" &&
                          "，平均每月" +
                            item.text +
                            "元" +
                            (item.key === "year" ? "，推荐" : "")}
                      </Text>
                    )}
                  </View>
                </Label>
              );
            })}
          </RadioGroup>
        </View>
      ) : null}
      <View style={{ width: "100%", marginTop: "20px" }}>
        {fuckShenHe === false && (
          <View>
            <View
              style={{
                color: "#f22c",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              为防止失联，开通会员后，请输入正确的手机号。
            </View>
            <Button
              style={{
                background: "linear-gradient(45deg,#536DFE, #64B5F6)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "0 20px",
                fontSize: "30rpx",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s, box-shadow 0.2s",
                marginBottom: "10px",
              }}
              type="default"
              className="guide-btn"
              onClick={() => {
                toPay(selected);
              }}
            >
              去付款
            </Button>
          </View>
        )}
        {!fuckShenHe && (
          <Button
            // openType="contact"
            style={{
              background: "linear-gradient(45deg,#fc4a1a, #f7b733)",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "0 20px",
              fontSize: "30rpx",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginBottom: "20px",
            }}
            type="default"
            className="guide-btn"
            onClick={(e) => {
              console.log("e: ", e);
              setIsShowModal(true);
            }}
          >
            联系客服
          </Button>
        )}
      </View>
      <AtModal
        isOpened={isShowModal}
        closeOnClickOverlay={true}
        onClose={() => {
          setIsShowModal(false);
        }}
      >
        <AtModalHeader>
          <Text>提示</Text>
          <View
            onClick={() => {
              setIsShowModal(false);
            }}
            style={{
              position: "absolute",
              right: "15px",
              top: "10px",
              width: "20px",
              height: "20px",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              src={Close}
            ></Image>
          </View>
        </AtModalHeader>

        <AtModalContent>
          <View className="modal-list">
            <View style={{ lineHeight: 1.6 }}>
              使用问题请先查看教程，如仍然无法解决请联系客服。
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => {
              setIsShowModal(false);
              Taro.navigateTo({
                url: "/pages/jiaocheng/index",
              });
            }}
          >
            查看教程
          </Button>
          <Button openType="contact" type="default" className="guide-btn">
            联系客服
          </Button>
        </AtModalAction>
      </AtModal>
      {fuckShenHe === false && (
        <View className="user-details" style={{ marginTop: "20px" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>注意事项</Text>
          </View>
          {config.jiaochengtext.map((item, index) => {
            return (
              <View
                style={{
                  color: index === 0 ? "#f22c3d" : "#000",
                }}
                key={index}
              >
                • {item}
              </View>
            );
          })}
        </View>
      )}
      {userInfo.type === "default" && (
        // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
        // wxml文件
        <ad
          unit-id="adunit-a6a297a8f2347f9d"
          ad-type="video"
          ad-theme="white"
        ></ad>
      )}
    </View>
  );
};

const Index = () => {
  const [userInfo, setUserInfo] = useState({});

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });
  const [price, setPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  useDidShow(() => {
    if (!loading) return;
    const check = async () => {
      await getCloud();
      cloud.callFunction({
        name: "addUser",
        success: function (res) {
          if (
            res.result.data.type !== "default" &&
            +new Date() - res.result.data.pay_time < 30000
          ) {
            Taro.showModal({
              title: "提示",
              content: "购买成功",
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.reLaunch({
                    url: "/pages/index/index",
                  });
                }
              },
            });
          } else {
            setTimeout(check, 3000);
          }
        },
      });
    };
    check();
  });
  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
    const init = async () => {
      await getCloud();
      cloud.callFunction({
        name: "addUser",
        success: function (res) {
          setLoading(true);
          setUserInfo(res.result.data);
        },
      });
      cloud.callFunction({
        name: "getPrice",
        success: function (res) {
          Taro.hideLoading();
          setPrice(res.result.data);
        },
      });
    };
    init();
  }, []);
  return (
    <View className="index">
      <UserInfo userInfo={userInfo} price={price} />
    </View>
  );
};

export default Index;
