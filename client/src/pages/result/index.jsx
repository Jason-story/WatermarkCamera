// src/pages/merge/index.jsx
import React, { useEffect, useState } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
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

const MergeCanvas = () => {
  Taro.getCurrentInstance().router.params;
  const firstImagePath = Taro.getCurrentInstance().router.params.bg; // 第一张图片的本地路径
  const secondImagePath = Taro.getCurrentInstance().router.params.mask; // 第二张图片的本地路径

  const [imagePath, setImagePath] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);

  const drawCanvas = (ctx) => {
    return new Promise((resolve, reject) => {
      ctx.draw(false, () => {
        resolve();
      });
    });
  };

  const drawImages = async () => {
    try {
      // 获取第一张图片的信息
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      const ctx = Taro.createCanvasContext("mergeCanvas");

      const info1 = await Taro.getImageInfo({
        src: firstImagePath,
      });
      const img1Path = info1.path;
      const img1Width = info1.width;
      const img1Height = info1.height;
      setImageWidth(img1Width);
      setImageHeight(img1Height);

      const info2 = await Taro.getImageInfo({
        src: secondImagePath,
      });

      const img2Path = info2.path;
      const img2Width = info2.width;
      const img2Height = info2.height;
      const canvasHeight = (screenWidth / img1Width) * img1Height;
      // 设置画布大小
      ctx.width = screenWidth;
      ctx.height = canvasHeight;
      ctx.drawImage(img1Path, 0, 0, screenWidth, canvasHeight);
      // 绘制第二张图片在左下角
      const x = 10;
      const y = canvasHeight - img2Height / dpr - 10;
      ctx.drawImage(img2Path, x, y, img2Width / dpr, img2Height / dpr);

      await drawCanvas(ctx);

      setTimeout(async () => {
        try {
          const { tempFilePath } = await Taro.canvasToTempFilePath({
            fileType: "jpg",
            quality: 0.5, // 设置图片质量为30%
            canvasId: "mergeCanvas",
          });
          saveImage(tempFilePath);
        } catch (error) {
          console.error("保存图片失败:", error);
        }
      }, 300); // 延迟100毫秒
      saveImage(tempFilePath);
    } catch (err) {
      // console.error("绘制图片出错:", error);
    }
  };
  let videoAd = null;

  const saveImage = async (tempFilePath) => {
    setImagePath(tempFilePath);

    const userData = await Taro.cloud.callFunction({
      name: "addUser",
      // data: {
      // remark: "成功使用",
      // },
    });
    // 激励广告
    if (userData.result.data.todayUsageCount >= 5) {
      setIsShowModal(true);
      return;
    }

    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-16f07f02a3feec0a",
      });
      interstitialAd.onLoad(() => {
        console.log(333)
      });
      interstitialAd.onError((err) => {
        console.error("插屏广告加载失败", err);
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
      });
      interstitialAd.onClose(() => {
        console.log(3333333)
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
      });
    }

    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error("插屏广告显示失败", err);
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
      });
    }
  };
  useEffect(() => {
    drawImages();
  }, []);

  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index",
      imageUrl: ShareImg,
    };
  });

  return (
    <View className="container">
      <canvas
        canvas-id="mergeCanvas"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: `${screenWidth}px`,
          height: `${(screenWidth / imageWidth) * imageHeight}px`,
        }}
      />
      <View
        className={!imagePath ? "hasLoading" : ""}
        style={{
          width: `${screenWidth}px`,
          height: `${(screenWidth / imageWidth) * imageHeight}px`,
        }}
      >
        {imagePath ? (
          <Image
            className="result-img"
            mode="scaleToFill"
            src={imagePath}
            style={{
              width: `100%`,
              height: `100%`,
            }}
          />
        ) : (
          <View className="loader"></View>
        )}
      </View>
      <ad-custom unit-id="adunit-400b4fabebcc3e5d"></ad-custom>
      <View
        className="bottom-btns"
        style={{
          padding: "0 10px",
          marginTop: "10px",
        }}
      >
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
            marginRight: "10px",
          }}
        >
          重新拍摄
        </Button>

        <Button openType="share" className="share-btn" type="button">
          <Text> 分享好友</Text>
          <View id="container-stars">
            <View id="stars"></View>
          </View>

          <View id="glow">
            <View className="circle"></View>
            <View className="circle"></View>
          </View>
        </Button>
        <AtModal isOpened={isShowModal} closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text>提示</Text>
          </AtModalHeader>
          <AtModalContent>
            <View className="modal-list">
              <View>
                {" "}
                您今日已使用5次，需要观看广告之后才可保存，或者联系客服开通会员免广告。
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
            <Button
              onClick={() => {
                if (wx.createRewardedVideoAd) {
                  videoAd = wx.createRewardedVideoAd({
                    adUnitId: "adunit-8e7c0d51dd273cd1",
                  });
                  videoAd.onLoad(() => {});
                  videoAd.onError((err) => {
                    console.error("激励视频光告加载失败", err);
                  });
                  videoAd.onClose((res) => {
                    console.log("res: ", res);
                    if (res.isEnded === true) {
                      Taro.saveImageToPhotosAlbum({
                        filePath: imagePath,
                        success: async () => {
                          setIsShowModal(false);
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
                    }
                  });
                }

                // 用户触发广告后，显示激励视频广告
                if (videoAd) {
                  videoAd.show().catch(() => {
                    // 失败重试
                    videoAd
                      .load()
                      .then(() => videoAd.show())
                      .catch((err) => {
                        console.error("激励视频 广告显示失败", err);
                      });
                  });
                }
              }}
              style={{ flex: 1 }}
            >
              观看广告
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    </View>
  );
};

export default MergeCanvas;
