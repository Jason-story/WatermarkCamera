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
import { useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";
import Head from "../../images/head.jpg";
import "./index.scss";
const md5 = require("./md5.js");
// const md5 = require("md5");

const inviteId = Taro.getCurrentInstance().router.params.id || "";
const UserInfo = ({ userInfo, price = { show: false } }) => {
  const [selected, setSelected] = useState("halfYearMonth");

  const vipConfig = [
    {
      key: "month",
      title: "包月会员 " + price["month"] + "元",
      price: price.month,
    },
    {
      key: "threeMonth",
      title: "三月会员 " + price["threeMonth"] + "元",
      price: price.threeMonth,
    },
    {
      key: "halfYearMonth",
      checked: true,
      title: "半年会员 " + price["halfYearMonth"] + "元",
      price: price.halfYearMonth,
    },
    {
      key: "year",
      title: "包年会员 " + price["year"] + "元",
      price: price.year,
    },
    {
      key: "never",
      title: "永久会员 " + price["never"] + "元",
      price: price.never,
    },
  ];

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
        price,
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
      {price.show === true ? (
        <View className="user-details" style={{ marginBottom: "40px" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>会员权益</Text>
          </View>
          <View>• 无限使用次数</View>
          <View>• 解锁会员专属水印</View>
          <View>• 高清水印图片</View>
          <View>• 去掉除封面广告之外的一切广告</View>
          <View>• 客服支持（开通会员后联系客服获取微信号）</View>
        </View>
      ) : (
        "暂无"
      )}
      {!price.showPrice ? (
        ""
      ) : (
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
                    <Radio value={item.key} checked={item.checked} />
                  </View>
                  <View className="vip-title">{item.title}</View>
                </Label>
              );
            })}
          </RadioGroup>
          <View
            className="user-details"
            style={{ marginTop: "20px", fontWeight: "bold" }}
          >
            定制水印请咨询客服
          </View>
        </View>
      )}
      <View style={{ width: "100%", marginTop: "20px" }}>
        {price.show && (
          <View>
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
        >
          联系客服
        </Button>
      </View>
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
    const check = () => {
      Taro.cloud.callFunction({
        name: "addUser",
        success: function (res) {
          if (
            res.result.data.type !== "default" &&
            +new Date() - res.result.data.pay_time < 30000
          ) {
            Taro.showModal({
              title: "提示",
              content: "购买成功，请重新进入小程序，客服微信 Jason_sory",
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
    Taro.cloud.callFunction({
      name: "addUser",
      success: function (res) {
        setLoading(true);
        setUserInfo(res.result.data);
      },
    });
    Taro.cloud.callFunction({
      name: "getPrice",
      success: function (res) {
        setPrice(res.result.data);
      },
    });
  }, []);
  return (
    <View className="index">
      <UserInfo userInfo={userInfo} price={price} />
    </View>
  );
};

export default Index;
