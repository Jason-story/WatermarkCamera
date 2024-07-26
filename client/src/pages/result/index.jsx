// src/pages/merge/index.jsx
import React, { useEffect, useState } from "react";
import { View, Button, Image, Canvas, Text } from "@tarojs/components";
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

  const dpr = Taro.getSystemInfoSync().pixelRatio;
  //  **********************************
  const drawImages = async () => {
    try {
      console.log("开始绘制图片");

      // 使用 Promise.all 并行获取图片信息
      const [info1, info2] = await Promise.all([
        Taro.getImageInfo({ src: firstImagePath }),
        Taro.getImageInfo({ src: secondImagePath }),
      ]);
      console.log("图片信息获取成功:", { info1, info2 });

      const img1Width = info1.width;
      const img1Height = info1.height;
      setImageWidth(img1Width);
      setImageHeight(img1Height);
      console.log("设置图片尺寸:", { img1Width, img1Height });

      // 根据用户类型预先计算最终尺寸
      const finalWidth =
        userInfo.type === "default" ? img1Width : Math.floor(img1Width / 2);
      const finalHeight =
        userInfo.type === "default" ? img1Height : Math.floor(img1Height / 2);
      console.log("计算最终尺寸:", { finalWidth, finalHeight });

      // 获取 Canvas 对象和上下文
      console.log("开始获取Canvas对象和上下文");
      const { canvas, ctx } = await getCanvasContext(finalWidth, finalHeight);

      // 绘制第一张图片
      console.log("开始绘制第一张图片");
      await drawImageOnCanvas(
        canvas,
        ctx,
        info1.path,
        0,
        0,
        finalWidth,
        finalHeight
      );

      // 计算 img2 的新尺寸和位置
      const img2Width =
        position === "center"
          ? Math.floor(finalWidth * 0.75)
          : Math.floor(info2.width * 0.35);
      const img2Height = Math.floor(img2Width * (info2.height / info2.width));
      const x =
        position === "center" ? Math.floor((finalWidth - img2Width) / 2) : 10;
      const y = finalHeight - img2Height - 10;
      console.log("计算第二张图片参数:", { img2Width, img2Height, x, y });

      // 绘制第二张图片
      console.log("开始绘制第二张图片");
      await drawImageOnCanvas(
        canvas,
        ctx,
        info2.path,
        x,
        y,
        img2Width,
        img2Height
      );

      // 将 canvas 转换为图片
      console.log("开始将Canvas转换为图片");
      const tempFilePath = await canvasToTempFilePath(
        canvas,
        userInfo.type === "default" ? 0.3 : 1
      );

      setImagePath(tempFilePath);
      console.log("设置图片路径:", tempFilePath);

      if (userInfo.todayUsageCount >= 2 && userInfo.type === "default") {
        setIsShowModal(true);
        console.log("显示模态框");
        return;
      }
      console.log("开始保存图片");
      saveImage(tempFilePath);
    } catch (err) {
      console.error("绘制图片出错:", err);
      // 在这里添加错误处理逻辑，例如显示错误消息给用户
    }
  };

  // 辅助函数：获取Canvas上下文
  const getCanvasContext = (width, height) => {
    return new Promise((resolve, reject) => {
      Taro.createSelectorQuery()
        .select("#mergeCanvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0] && res[0].node) {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            const dpr = Taro.getSystemInfoSync().pixelRatio;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            resolve({ canvas, ctx });
          } else {
            reject(new Error("未找到Canvas元素"));
          }
        });
    });
  };

  // 辅助函数：在Canvas上绘制图片
  const drawImageOnCanvas = (canvas, ctx, src, x, y, width, height) => {
    return new Promise((resolve, reject) => {
      const img = canvas.createImage();
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // 辅助函数：将Canvas转换为临时文件路径
  const canvasToTempFilePath = (canvas, quality) => {
    return new Promise((resolve, reject) => {
      Taro.canvasToTempFilePath({
        canvas: canvas,
        fileType: "jpg",
        quality: quality,
        success: (res) => resolve(res.tempFilePath),
        fail: reject,
      });
    });
  };
  // ________________________________
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
      <Canvas
        id="mergeCanvas"
        type="2d"
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
