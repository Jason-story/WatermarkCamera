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
  const serverCanvas = Taro.getCurrentInstance().router.params.serverCanvas;

  const [imagePath, setImagePath] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isShare, setShare] = useState(false);
  const [loadingText, setLoadingText] = useState("图片检测中. . .");
  const texts = ["图片检测中. . .", "图片生成中. . .", "图片下载中. . ."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIndex((prevIndex) => {
          if (prevIndex < texts.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return 2; // Reset to '图片检测中'
          }
        });
      },
      serverCanvas ? 3000 : 1500
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoadingText(texts[index]);
  }, [index]);

  const drawCanvas = (ctx) => {
    return new Promise((resolve, reject) => {
      ctx.draw(false, () => {
        resolve();
      });
    });
  };

  async function uploadImage(filePath) {
    const cloudPath = `temp_images/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${filePath.match(/\.(\w+)$/)[1]}`;
    const res = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    });
    return res.fileID;
  }
  async function mergeImages(
    firstImagePath,
    secondImagePath,
    position,
    userInfo
  ) {
    try {
      // 上传图片
      const [firstImageFileID, secondImageFileID] = await Promise.all([
        uploadImage(firstImagePath),
        uploadImage(secondImagePath),
      ]);

      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: "mergeImage",
        data: {
          firstImageFileID,
          secondImageFileID,
          position,
          userInfo,
        },
      });
      console.log("res: ", res);

      if (res.result.success) {
        return res.result;
      } else {
        Taro.showToast({
          title: res.result.error,
          icon: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("合并图片失败:", error);
      throw error;
    }
  }

  const saveImage = async (tempFilePath, userInfo) => {
    setImagePath(tempFilePath);
    console.log("userInfo: ", userInfo);
    if (userInfo.todayUsageCount >= 2 && userInfo.type === "default") {
      setIsShowModal(true);
      return;
    }
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
      setIsShowModal(true);
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
  // 假设这个函数在成功合并图片后被调用
  async function handleMergedImage(mergedImageFileID, info) {
    try {
      const imageInfo = await wx.cloud.getTempFileURL({
        fileList: [mergedImageFileID],
      });

      if (
        imageInfo.fileList &&
        imageInfo.fileList[0] &&
        imageInfo.fileList[0].tempFileURL
      ) {
        const tempFilePath = imageInfo.fileList[0].tempFileURL;

        // 下载图片
        const downloadRes = await new Promise((resolve, reject) => {
          wx.downloadFile({
            url: tempFilePath,
            success: resolve,
            fail: reject,
          });
        });

        if (downloadRes.statusCode === 200) {
          setImagePath(downloadRes.tempFilePath);
          saveImage(downloadRes.tempFilePath, info);
        } else {
          throw new Error("下载图片失败");
        }
      } else {
        throw new Error("获取图片地址失败");
      }
    } catch (error) {
      console.error("保存图片失败:", error);
    }
  }

  useEffect(() => {
    const getData = async () => {
      await Taro.cloud.callFunction({
        name: "addUser",
        success: async function (res) {
          await setUserInfo(res.result.data);

          // 服务端合成图片
          if (serverCanvas === "true") {
            const { fileID, width, height } = await mergeImages(
              firstImagePath,
              secondImagePath,
              position,
              res.result.data
            );
            setImageHeight(height);
            setImageWidth(width);
            handleMergedImage(fileID, res.result.data);
          } else {
            // 本地生成
            drawImages(res.result.data);
          }
        },
      });
    };
    getData();
  }, []);
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });

  // ----------------------------客户端合成

  const dpr = Taro.getSystemInfoSync().pixelRatio;
  const drawImages = async (userInfo) => {
    console.log("客户端合成: ");
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
        position === "center" ? canvasWidth * 0.95 : info2.width * dpr * 0.8;
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

          setImagePath(tempFilePath);
          if (userInfo.todayUsageCount >= 2 && userInfo.type === "default") {
            setIsShowModal(true);
            return;
          }
          clientCanvasSaveImage(tempFilePath);
        } catch (error) {
          console.error("保存图片失败:", error);
        }
      }, 300);
    } catch (err) {
      console.error("绘制图片出错:", err);
    }
  };
  const clientCanvasSaveImage = async (tempFilePath) => {
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
      setIsShowModal(true);
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

  // ----------------------客户端合成结束
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
          <View
            style={{
              textAlign: "center",
              color: "#17233f",
              fontSize: "14px",
            }}
          >
            <View className="loader"></View>
            <Text>{loadingText}</Text>
          </View>
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
          className="share-btn"
          type="button"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/vip/index",
            });
          }}
          style={{
            width: "90%",
            height: "46px",
            marginBottom: "10px",
          }}
        >
          <Text>图片不清晰？</Text>
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
                您免费次数用完，请联系客服开通会员，会员为收费服务，请知悉。
              </View>
              <Button
                style={{
                  background: "linear-gradient(45deg, #ff512f, #dd2476)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  padding: "0",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginBottom: "0px",
                  width: "100%",
                  marginTop: "10px",
                }}
                onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/vip/index",
                  });
                }}
              >
                会员页面
              </Button>
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
      </View>
    </View>
  );
};

export default MergeCanvas;
