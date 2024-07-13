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
      // 获取第一张图片的信息
      const ctx = Taro.createCanvasContext("mergeCanvas");

      const info1 = await Taro.getImageInfo({
        src: firstImagePath,
      });
      const img1Path = info1.path;
      const img1Width = info1.width;
      const img1Height = info1.height;
      setImageWidth(img1Width);
      setImageHeight(img1Height / dpr);

      const info2 = await Taro.getImageInfo({
        src: secondImagePath,
      });

      const img2Path = info2.path;
      const img2Width = info2.width;
      const img2Height = info2.height;
      // 设置画布大小
      ctx.width = screenWidth * dpr;
      ctx.height = img1Height * dpr;
      ctx.drawImage(img1Path, 0, 0, screenWidth, img1Height);
      // 绘制第二张图片在左下角
      const x = 10;
      const y = img1Height - img2Height - 10;
      ctx.drawImage(img2Path, x, y, img2Width / dpr, img2Height);

      await drawCanvas(ctx);

      setTimeout(async () => {
        try {
          const { tempFilePath } = await Taro.canvasToTempFilePath({
            fileType: "jpg",
            quality: userInfo.type === "default" ? 0.1 : 1, // 设置图片质量为30%
            canvasId: "mergeCanvas",
            width: screenWidth,
            height: img1Height,
            destWidth: screenWidth * dpr,
            destHeight: img1Height,
          });
          setImagePath(tempFilePath);
          if (
            userInfo.todayUsageCount >= 3 + (userInfo.invite_count || 0) &&
            userInfo.type === "default"
          ) {
            setIsShowModal(true);
            return;
          }
          saveImage(tempFilePath);
        } catch (error) {
          console.error("保存图片失败:", error);
        }
      }, 300); // 延迟100毫秒
      setImagePath(tempFilePath);
      if (
        userInfo.todayUsageCount >= 3 + (userInfo.invite_count || 0) &&
        userInfo.type === "default"
      ) {
        setIsShowModal(true);
        return;
      }
      saveImage(tempFilePath);
    } catch (err) {
      // console.error("绘制图片出错:", error);
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
          await Taro.cloud.callFunction({
            name: "invite",
            data: {
              invite_id: inviteId,
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
    if (
      userInfo.times >= 30 + (userInfo.invite_count || 0) &&
      userInfo.type === "default"
    ) {
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
      userInfo.todayUsageCount >= 3 + (userInfo.invite_count || 0) &&
      userInfo.type === "default" &&
      isShare === false
    ) {
      setIsShowModal(true);
      return;
    }
    save();

    // if (wx.createInterstitialAd && userInfo.type === "default") {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: "adunit-16f07f02a3feec0a",
    //   });
    //   interstitialAd.onLoad(() => {
    //     console.log(333);
    //   });
    //   interstitialAd.onError((err) => {
    //     console.error("插屏广告加载失败", err);
    //     save();
    //   });
    //   interstitialAd.onClose(() => {
    //     save();
    //   });
    // }

    // if (interstitialAd && userInfo.type === "default") {
    //   interstitialAd.show().catch((err) => {
    //     console.error("插屏广告显示失败", err);
    //     save();
    //   });
    // }
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
          width: `${screenWidth * dpr}px`,
          height: `${imageHeight * dpr}px`,
        }}
      />
      <View
        className={!imagePath ? "hasLoading" : ""}
        style={{
          width: `100%`,
          minWidth: "100%",
          minHeight: "60vh",
          height: `${imageHeight}px`,
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
                width: `100%`,
                height: `100%`,
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
          <Text>邀好友得次数</Text>
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
              {userInfo.share ? (
                <View>
                  {" "}
                  您今日已使用3次，需要邀请好友才可继续使用，或者联系客服开通会员。
                  <View style={{ marginTop: "10px" }}>
                    邀请好友<Text style={{color:"#ff4d4f"}}>成功拍照</Text>1次，赠送您2次(同一好友每日最多赠送4次)
                  </View>
                </View>
              ) : (
                <View>
                  {" "}
                  您今日已使用3次，需要观看广告之后才可保存，或者联系客服开通会员免广告。
                </View>
              )}
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
            {userInfo.share ? (
              <Button
                openType="share"
                style={{ flex: 1 }}
                type="button"
                onClick={() => {
                  setIsShowModal(false);
                  setShare(true);
                }}
              >
                <Text>邀好友得次数</Text>
              </Button>
            ) : (
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
            )}
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
