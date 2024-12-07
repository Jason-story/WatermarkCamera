import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  RadioGroup,
  Radio,
  Label,
  Text,
  Button,
} from "@tarojs/components";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import { useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";
import { appConfigs } from "../../appConfig.js";
import Close from "../../images/close.png";
import "./index.scss";
const md5 = require("./md5.js");
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const config = appConfigs[appid];
const app = getApp();
let cloud = "";
let jianmianjiage = 10;
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

function isWithinTimeRanges(serverTime) {
  const hours = String(new Date(serverTime).getHours()).padStart(2, "0");
  const xingqiji = new Date(serverTime).getDay();

  const isNight = hours >= 22 || hours < 7; // 晚上9点到早上8点
  const isZhoumo = xingqiji === 6 || xingqiji === 0; //周六周日优惠
  if (isZhoumo) {
    jianmianjiage = 15;
  }
  return isNight || isZhoumo;
}

function countNumbersEvenOrOdd(str) {
  // 使用正则表达式匹配所有数字
  const numbers = (str || "").match(/\d/g) || [];

  // 返回数字个数是否为偶数
  return numbers.length % 2 === 0;
}
let fuckShenHe = true;

const Index = () => {
  const [userInfo, setUserInfo] = useState("");
  const [price, setPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [vipConfig, setVipConfig] = useState([]);
  const appid = Taro.getAccountInfoSync().miniProgram.appId;
  const config = appConfigs[appid];
  // const [selectedPlan, setSelectedPlan] = useState(2);
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?invite_id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });

  const globalConfig = app.$app.globalData.config;
  let inviteId = app.$app.globalData.invite_id;
  Taro.getStorage({ key: "createVipFromInviteId" }).then((res) => {
    if (res.data) {
      inviteId = res.data;
    }
  });
  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
    const init = async () => {
      if (config.type === "shared") {
        cloud = await new Taro.cloud.Cloud({
          resourceAppid: config.resourceAppid,
          resourceEnv: config.resourceEnv,
        });
        await cloud.init();
      } else {
        await Taro.cloud.init({
          env: config.env,
        });
        cloud = Taro.cloud;
      }

      cloud.callFunction({
        name: "addUser",
        success: async function (res) {
          setLoading(true);
          await setUserInfo(res.result.data);
          cloud.callFunction({
            name: "getPrice",
            success: function (res) {
              setPrice(res.result.data);
              Taro.hideLoading();
            },
          });
        },
      });
    };
    init();
  }, []);

  useEffect(() => {
    if (price?.[config["priceShow"]]) {
      fuckShenHe = app.$app.globalData.fuckShenHe;
    } else {
      fuckShenHe = true;
    }
    price && setSelected(price.current);
    if (price) {
      const data = price?.["jiage"]?.map((item) => {
        let [key, title, totaldays = "", amount] = item.split("|");
        amount =
          countNumbersEvenOrOdd(userInfo.openid) === true
            ? amount * 1 - config.zhekoujiage + 10
            : amount * 1 - config.zhekoujiage;
        // 夜晚减免10元 周末 减免 15元
        amount =
          isWithinTimeRanges(userInfo.serverTimes) === true
            ? amount -
              jianmianjiage -
              (userInfo.youhui !== undefined ? userInfo.youhui * 1 : 0)
            : amount -
              (userInfo.youhui !== undefined ? userInfo.youhui * 1 : 0);
        amount = amount.toFixed(2);

        return {
          key,
          title,
          popular: price.current === key,
          // 根据openid 来定价 偶数 加10  奇数不变
          price: amount,
          text: (amount / totaldays).toFixed(3),
        };
      });
      setVipConfig(data);
    }
  }, [price]);

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
    Taro.getSystemInfo({
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
      notify_url: config["notify_url"],
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

    Taro.navigateToMiniProgram({
      appId: "wx2574b5c5ee8da56b", //支付网关为：https://api.xunhupay.com 跳转小程序APPID：wx2574b5c5ee8da56b，其他支付网关跳转小程序APPID：wx402faa5bd5eda155
      path: "pages/hpj_cashier/cashier", //支付页面 固定值 不可修改
      extraData: data, //携带的参数 参考API文档
      success(res) {},
      fail(res) {},
    });
  }
  useDidShow(() => {
    if (!loading) return;
    const startTime = Date.now();
    let checkTimer = null;
    const check = async () => {
      if (Date.now() - startTime > 60000) {
        clearTimeout(checkTimer);
        return;
      }

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
                  Taro.reLaunch({
                    url: "/pages/index/index",
                  });
                }
              },
            });
          } else {
            checkTimer = setTimeout(check, 2000);
          }
        },
      });
    };
    check();
  });

  return (
    <View className="index">
      {fuckShenHe === false && (
        <View className="header">
          <View className="header-content">
            <View className="vip-title">会员权益</View>
            {globalConfig.hyqy.map((item, index) => {
              return (
                <View className="subtitle" key={index}>
                  {item}
                </View>
              );
            })}
            <View
              className="vip-title"
              style={{ marginBottom: "4px", marginTop: "10px" }}
            >
              注意事项
            </View>
            {globalConfig.jiaochengtext.map((item, index) => {
              return (
                <View className="subtitle" key={index}>
                  • {item}
                </View>
              );
            })}
            <View
              style={{
                color: "#ffed00",
                marginTop: "10px",
                padding: "0 20px",
                textAlign: "left",
              }}
            >
              {globalConfig.yongjinwenan}
            </View>
            <View
              style={{
                color: "#ffed00",
                padding: "0 20px",
                marginTop: "10px",
                textAlign: "left",
                fontSize: "16px",
                fontWeight: "bolder",
              }}
            >
              当前优惠 {userInfo.youhui || 0} 元
            </View>
            <View
              style={{
                color: "#ffed00",
                padding: "0 20px",
                textAlign: "left",
                fontSize: "16px",
                fontWeight: "bolder",
              }}
            >
              当前佣金 {userInfo.yongjin || 0} 元
            </View>
          </View>
          <View className="header-background"></View>
        </View>
      )}
      <View className="user-info">
        {fuckShenHe === false && (
          <View className="plans-container">
            {vipConfig.map((plan) => {
              return (
                <View
                  key={plan.key}
                  className={`plan-card ${
                    plan.key === selected ? "selected" : ""
                  } ${plan.popular ? "popular" : ""}`}
                  onClick={() => setSelected(plan.key)}
                >
                  {plan.popular && (
                    <span className="popular-tag">最多购买</span>
                  )}
                  <View className="h3">{plan.title}</View>
                  <View className="price-container">
                    <Text className="discount-price">¥{plan.price}</Text>
                    <Text className="original-price">
                      ¥{(plan.price * 1.3).toFixed(3)}
                    </Text>
                    {plan.key !== "1day" &&
                      plan.key !== "never" &&
                      plan.key !== "dingzhi" && (
                        <Text
                          className="original-price"
                          style={{
                            textDecoration: "none",
                            color: "#536DFE",
                          }}
                        >
                          {plan.text}元/天
                        </Text>
                      )}
                    {plan.key === "1day" && (
                      <Text
                        className="original-price"
                        style={{
                          textDecoration: "none",
                          color: "#536DFE",
                        }}
                      >
                        不划算
                      </Text>
                    )}
                  </View>
                  <Text className="duration">{plan.duration}</Text>
                </View>
              );
            })}
          </View>
        )}

        <View
          style={{
            width: "100%",
            marginTop: "20px",
            position: "fixed",
            left: 0,
            bottom: 0,
          }}
        >
          {fuckShenHe === false && (
            <View>
              <View
                style={{
                  color: "#f22c",
                  background: "#fff",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                为防止失联，开通会员后，请输入正确的手机号。
              </View>
              <Button
                style={{
                  background: "linear-gradient(45deg, #4b4ef4, #9d00ff)",
                  color: "white",
                  border: "none",
                  borderRadius: 0,
                  fontSize: "48rpx",
                  fontWeight: "bold",
                  padding: "10px 0",
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
          {/* {!fuckShenHe && (
            <Button
              openType="contact"
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
                // console.log("e: ", e);
                setIsShowModal(true);
              }}
            >
              联系客服
            </Button>
          )} */}
        </View>

        {/* {fuckShenHe === false && (
          <View className="user-details" style={{ marginTop: "20px" }}>
            <View>
              <Text style={{ fontWeight: "bold" }}>注意事项</Text>
            </View>
            {globalConfig.jiaochengtext.map((item, index) => {
              console.log("item: ", item);
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
        )} */}
      </View>
    </View>
  );
};

export default Index;
