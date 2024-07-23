// src/pages/merge/index.jsx
import React, { useEffect, useState } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useDidShow } from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";
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
import "./index.scss";
import restart from "../../images/restart.png";

const screenWidth = Taro.getSystemInfoSync().screenWidth;
let interstitialAd = null;
const inviteId = Taro.getCurrentInstance().router.params.id;

const MergeCanvas = () => {
  Taro.getCurrentInstance().router.params;
  const firstImagePath = Taro.getCurrentInstance().router.params.bg; // 第一张图片的本地路径
  const secondImagePath = Taro.getCurrentInstance().router.params.mask; // 第二张图片的本地路径
  const position = Taro.getCurrentInstance().router.params.position;
  console.log("position: ", position);

  const [imagePath, setImagePath] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowTimesModal, setIsShowTimesModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isShare, setShare] = useState(false);

  const drawCanvas = (ctx) => {
    return new Promise((resolve, reject) => {
      ctx.draw(false, () => {
        resolve();
      });
    });
  };

  // useDidShow(() => {
  //   if (isShare === true) {
  //     setTimeout(() => {
  //       saveImage(imagePath);
  //     }, 400);
  //   }
  // });

  const dpr = Taro.getSystemInfoSync().pixelRatio;
  const drawImages = async () => {
    try {
      const ctx = Taro.createCanvasContext("mergeCanvas");

      const info1 = await Taro.getImageInfo({ src: firstImagePath });
      const img1Width = info1.width;
      const img1Height = info1.height;
      setImageWidth(img1Width);
      setImageHeight(img1Height);

      const info2 = await Taro.getImageInfo({ src: secondImagePath });

      // 设置画布大小，使用物理像素
      const canvasWidth = img1Width * dpr;
      const canvasHeight = img1Height * dpr;

      // 设置画布尺寸
      ctx.width = canvasWidth;
      ctx.height = canvasHeight;

      // 绘制第一张图片，缩放以填满画布
      ctx.drawImage(info1.path, 0, 0, canvasWidth, canvasHeight);

      // 计算 img2 的新尺寸
      let img2Width =
        position === "center" ? canvasWidth * 0.8 : info2.width * dpr * 0.8;
      let img2Height = img2Width * (info2.height / info2.width);

      // 计算 img2 的位置
      let x = position === "center" ? (canvasWidth - img2Width) / 2 : 10 * dpr;
      let y = canvasHeight - img2Height - 10 * dpr;

      // 绘制第二张图片
      ctx.drawImage(info2.path, x, y, img2Width, img2Height);

      console.log("Canvas dimensions:", canvasWidth, canvasHeight);
      console.log("img1 dimensions:", img1Width, img1Height);
      console.log("img2 dimensions:", img2Width, img2Height);
      console.log("img2 position:", x, y);

      await drawCanvas(ctx);

      setTimeout(async () => {
        try {
          // 根据用户类型决定是否需要额外的缩放
          const scaleFactor = userInfo.type === "default" ? 1 / 1.7 : 1;
          const finalWidth = Math.round(canvasWidth * scaleFactor);
          const finalHeight = Math.round(canvasHeight * scaleFactor);

          const { tempFilePath } = await Taro.canvasToTempFilePath({
            fileType: "jpg",
            quality: userInfo.type === "default" ? 0.5 : 1,
            canvasId: "mergeCanvas",
            width: canvasWidth,
            height: canvasHeight,
            destWidth: finalWidth,
            destHeight: finalHeight,
          });

          console.log("Final image dimensions:", finalWidth, finalHeight);

          setImagePath(tempFilePath);
          if (userInfo.todayUsageCount >= 2 && userInfo.type === "default") {
            setIsShowModal(true);
            return;
          }
          saveImage(tempFilePath);
        } catch (error) {
          console.error("保存图片失败:", error);
        }
      }, 300);
    } catch (err) {
      console.error("绘制图片出错:", err);
    }
  };
  let videoAd = null;

  const saveImage = async (tempFilePath) => {
    setImagePath(tempFilePath);
    const save = () => {
      Taro.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: async () => {
          await Taro.cloud.callFunction({
            name: "addUser",
            data: {
              remark: "成功使用",
            },
          });
          // await Taro.cloud.callFunction({
          //   name: "invite",
          //   data: {
          //     invite_id: inviteId,
          //   },
          // });
          Taro.showToast({
            title: "保存成功",
            icon: "success",
            duration: 2000,
          });
        },
        fail: (error) => {
          console.log("保存失败", error);
          Taro.showToast({
            title: "保存失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
    };
    if (userInfo.vip_count === 0) {
      Taro.showToast({
        title: "你的会员额度已经用完，请联系客服购买",
        icon: "none",
        duration: 5000,
      });
      return;
    }
    if (userInfo.times >= 10 && userInfo.type === "default") {
      setIsShowTimesModal(true);
      return;
    }

    // 会员直接保存 无广告
    if (userInfo.type !== "default") {
      save();
      return;
    }
    // 激励广告
    if (
      userInfo.todayUsageCount >= 2 &&
      userInfo.type === "default" &&
      isShare === false
    ) {
      setIsShowModal(true);
      return;
    }
    save();
  };
  useEffect(() => {
    const getData = async () => {
      await Taro.cloud.callFunction({
        name: "addUser",
        success: function (res) {
          setUserInfo(res.result.data);
        },
      });
    };
    getData();
  }, []);
  useEffect(() => {
    userInfo.type && drawImages();
  }, [userInfo]);

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });

  return (
    <View className="container result">
      <canvas
        canvas-id="mergeCanvas"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          minWidth: "100%",
          minHeight: "50%",
          width: `${imageWidth * dpr}px`,
          height: `${imageHeight * dpr}px`,
        }}
      />
      <View
        className={!imagePath ? "hasLoading" : ""}
        style={{
          width: `100%`,
          minWidth: "100%",
          minHeight: "60vh",
        }}
      >
        {imagePath ? (
          <View className="result-img-box">
            <View className="watermark">可修改水印相机</View>
            <Image
              className="result-img"
              mode="scaleToFill"
              src={imagePath}
              style={{
                width: `${screenWidth}px`,
                display: "block",
                height: `${(screenWidth / imageWidth) * imageHeight}px`,
              }}
            />
          </View>
        ) : (
          <View className="loader"></View>
        )}
      </View>
      {userInfo.type === "default" && (
        <ad-custom unit-id="adunit-400b4fabebcc3e5d"></ad-custom>
      )}
      <View
        className="bottom-btns"
        style={{
          padding: "0 10px",
          marginTop: userInfo.type === "default" ? "10px" : "50px",
        }}
      >
        <Button
          openType="share"
          className="share-btn"
          type="button"
          style={{
            width: "90%",
            height: "46px",
            marginBottom: "10px",
          }}
        >
          <Text>分享群聊</Text>
          <View id="container-stars">
            <View id="stars"></View>
          </View>

          <View id="glow">
            <View className="circle"></View>
            <View className="circle"></View>
          </View>
        </Button>
        <Button
          className="share-btn"
          onClick={() => {
            Taro.navigateBack({
              delta: 1, // delta 参数表示需要返回的页面数，默认为1
            });
          }}
          style={{
            background: "linear-gradient(45deg,#ff6ec4, #7873f5)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "5px 16px",
            fontSize: "32rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "90%",
            height: "46px",
          }}
        >
          重新拍摄
        </Button>
        <Button
          className="share-btn"
          onClick={() => {
            wx.navigateToMiniProgram({
              appId: "wxaea1e208fcacb4d5", // 目标小程序的AppID
              path: "pages/index/index",
            });
          }}
          style={{
            background: "linear-gradient(45deg, #ff512f, #dd2476)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "5px 16px",
            fontSize: "32rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            marginBottom: "10px",
            width: "90%",
            height: "46px",
            marginTop: "10px",
          }}
        >
          抖音去水印
        </Button>

        <AtModal isOpened={isShowModal} closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text>提示</Text>
          </AtModalHeader>
          <AtModalContent>
            <View className="modal-list">
              <View>
                您今日已免费次数用完，请联系客服开通会员。
                {/* <View style={{ marginTop: "10px" }}>
                    邀请好友<Text style={{ color: "#ff4d4f" }}>成功拍照</Text>
                    1次，赠送您2次(同一好友每日最多赠送4次)
                  </View> */}
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                setIsShowModal(false);
              }}
              style={{ flex: 1 }}
            >
              关闭
            </Button>
            <Button openType="contact" style={{ flex: 1 }} type="button">
              <Text>联系客服</Text>
            </Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={isShowTimesModal} closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text>提示</Text>
          </AtModalHeader>
          <AtModalContent style={{ minHeight: "auto" }}>
            <View>
              <View>免费额度已用完，请联系客服开通会员</View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                setIsShowTimesModal(false);
              }}
              style={{ flex: 1 }}
            >
              关闭
            </Button>
            <Button openType="contact" style={{ flex: 1 }}>
              客服
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    </View>
  );
};

export default MergeCanvas;
