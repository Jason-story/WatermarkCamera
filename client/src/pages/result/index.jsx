// src/pages/merge/index.jsx
import React, { useEffect, useCallback, useState } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import "./index.scss";
import Close from "../../images/close.png";
import { appConfigs } from "../../appConfig.js";
const appid = Taro.getAccountInfoSync().miniProgram.appId;
const app = getApp();
let cloud = "";
const screenWidth = Taro.getSystemInfoSync().screenWidth;
const MergeCanvas = () => {
  const config = app.$app.globalData.config;
  const ytgConfig = appConfigs[appid];

  Taro.getCurrentInstance().router.params;
  const inviteId = Taro.getCurrentInstance().router.params.id;
  const firstImagePath = Taro.getCurrentInstance().router.params.bg; // 第一张图片的本地路径
  const secondImagePath = Taro.getCurrentInstance().router.params.mask; // 第二张图片的本地路径
  const scale = 1;
  const serverCanvas = Taro.getCurrentInstance().router.params.serverCanvas;
  const isVip = Taro.getCurrentInstance().router.params.vip;
  const realWidth = Taro.getCurrentInstance().router.params.realWidth;
  const realHeight = Taro.getCurrentInstance().router.params.realHeight;

  // 图片水印 or 视频水印
  const isVideo = app.$app.globalData.config.isVideo;
  const videoPath = app.$app.globalData.config.videoPath;
  const [videoModal, setVideoModal] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [img2Info, setImg2Info] = useState({});
  const [imgInfo, setImgInfo] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("图片检测中. . .");
  const [tempPath, setTempPath] = useState("");
  const [currentFileId, setFileId] = useState("");

  const texts = isVideo
    ? ["视频上传中. . .", "视频上传中. . .", "视频上传中. . ."]
    : ["图片检测中. . .", "图片生成中. . .", "图片下载中. . ."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const getInfo = async () => {
      const img2Info = await Taro.getImageInfo({ src: secondImagePath });
      const imgInfo = await Taro.getImageInfo({ src: firstImagePath });
      console.log("imgInfo: ", imgInfo);
      setImg2Info(img2Info);
      setImgInfo(imgInfo);
    };
    getInfo();

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

  async function uploadImage(filePath, fileName = "files/server_temp_images") {
    const cloudPath = `${fileName}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${filePath.match(/\.(\w+)$/)[1]}`;
    const res = await cloud.uploadFile({
      cloudPath,
      filePath,
    });
    return res.fileID;
  }

  async function mergeImages(firstImagePath, secondImagePath, userInfo) {
    try {
      // 上传图片
      const [firstImageFileID, secondImageFileID, logoImageFileId] =
        await Promise.all([
          uploadImage(firstImagePath),
          uploadImage(secondImagePath),
          config?.logoConfig?.path ? uploadImage(config.logoConfig.path) : null,
        ]);
      // 调用云函数

      let res = "";
      // 视频合成
      if (isVideo) {
        let ytg = null;
        if (ytgConfig.type === "shared") {
          ytg = await new Taro.cloud.Cloud({
            resourceAppid: ytgConfig.containerResourceAppid,
            resourceEnv: ytgConfig.containerResourceEnv,
          });
          await ytg.init();
        } else {
          ytg = cloud;
        }
        // 视频合成
        ytg.callContainer({
          config: {
            env: ytgConfig["containerId"],
          },
          path: "/process",
          header: {
            "X-WX-SERVICE": ytgConfig["containerName"],
            "content-type": "application/json",
          },
          method: "POST",
          data: {
            image_file_id: secondImageFileID,
            video_file_id: firstImageFileID,
            logo_file_id: logoImageFileId ? logoImageFileId : null,
            openid: userInfo.openid,
          },
          success: (res) => {
            setLoading(false);
            if (res.data && res.data.taskId) {
              setVideoModal(true);
            } else {
              throw new Error("处理错误");
            }
          },
          fail: (error) => {
            setLoading(false);
            Taro.showToast({
              title: "系统重启，请刷新后重新上传",
              icon: "none",
              duration: 3000,
            });
          },
        });
      } else {
        // 图片合成
        res = await cloud.callFunction({
          name: "mergeImage",
          data: {
            firstImageFileID,
            secondImageFileID,
            logoImageFileId,
            screenWidth,
            logoConfig: config.logoConfig,
            scale,
            userInfo,
          },
        });
        if (res?.result?.success) {
          return res.result;
        } else {
          Taro.showToast({
            title: res.result.error,
            icon: "error",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Taro.showModal({
        title: "处理失败，请联系客服",
        content: JSON.stringify(error),
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success: function (res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
      throw error;
    }
  }

  const saveImage = async (fileID, userInfo) => {
    const save = () => {
      if (isVip === "true" && userInfo.type !== "never") {
        setLoading(false);
        setIsShowModal(true);
        return;
      }
      // 下载云存储中的图片
      cloud.downloadFile({
        fileID: fileID, // 替换为你要下载的图片文件ID
        success: (res) => {
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: async () => {
              await cloud.callFunction({
                name: "addUser",
                data: {
                  remark: "成功使用",
                },
              });
              Taro.showToast({
                title: "已保存到相册",
                icon: "success",
                duration: 2000,
              });
              setLoading(false);

              // if (inviteId) {
              //   await cloud.callFunction({
              //     name: "invite",
              //     data: {
              //       invite_id: inviteId,
              //     },
              //   });
              // }
            },
            fail: (error) => {
              setLoading(false);

              Taro.showToast({
                title: "保存失败",
                icon: "none",
                duration: 2000,
              });
            },
          });
        },
        fail: (err) => {
          console.error(err);
          wx.showToast({
            title: "下载失败",
            icon: "none",
          });
        },
      });
    };
    if (userInfo.vip_count === 0 && !config.isFree) {
      Taro.showToast({
        title: "你的会员额度已经用完，请联系客服购买",
        icon: "none",
        duration: 5000,
      });
      return;
    }

    // 会员直接保存 无广告
    if (userInfo.type !== "default") {
      save();
      return;
    }
    // 激励广告
    // if (
    //   userInfo.todayUsageCount >= 2 &&
    //   userInfo.type === "default" &&
    //   isShare === false
    // ) {
    //   setIsShowModal(true);
    //   return;
    // }
    save();
  };
  // 假设这个函数在成功合并图片后被调用
  async function handleMergedImage(mergedImageFileID, info) {
    await saveImage(mergedImageFileID, info);
  }
  useEffect(() => {
    const init = async () => {
      if (ytgConfig.type === "shared") {
        cloud = await new Taro.cloud.Cloud({
          resourceAppid: ytgConfig.resourceAppid,
          resourceEnv: ytgConfig.resourceEnv,
        });
        await cloud.init();
      } else {
        await Taro.cloud.init({
          env: ytgConfig.env,
        });
        cloud = Taro.cloud;
      }

      await cloud.callFunction({
        name: "addUser",
        success: async function (res) {
          await setUserInfo(res.result.data);
          // 照片换色来的 免费使用
          if (app.$app.globalData.zphsId) {
            cloud.callFunction({
              name: "zphsGetUser",
              data: {
                type: "add",
                zphsId: app.$app.globalData.zphsId,
              },
              success: function (res) {
                config.isFree = true;
              },
            });
          }
          if (res.result.data.invite_count == undefined) {
            res.result.data.invite_count = 0;
          }
          if (config.isFree) {
          } else {
            if (res.result.data.type === "default") {
              setLoading(false);
              return;
            }
            // 免费次数用尽
            // if (
            //   res.result.data.times >=
            //     config.mianfeicishu + res.result.data.invite_count &&
            //   res.result.data.type === "default"
            // ) {
            //   setIsShowModal(true);
            //   setLoading(false);
            //   return;
            // }
          }
          // 服务端合成图片
          if (serverCanvas === "true") {
            console.log("服务端 ");
            const { fileID, width, height } = await mergeImages(
              isVideo ? videoPath : firstImagePath,
              secondImagePath,
              res.result.data
            );
            setImageHeight(height);
            setImageWidth(width);
            // handleMergedImage(fileID, res.result.data);
            setFileId(fileID);
            if (userInfo.type !== "default") {
              // 假设这个函数在成功合并图片后被调用
              handleMergedImage(fileID, res.result.data);
            }
          } else {
            console.log("客户端 ");
            // 本地生成
            drawImages(res.result.data);
          }
        },
      });
    };
    init();
  }, []);
  Taro.useShareAppMessage((res) => {
    return {
      title: "分享你一款可修改时间、位置的水印相机",
      path: "/pages/index/index?id=" + userInfo.openid,
      imageUrl: ShareImg,
    };
  });

  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成
  // ----------------------------客户端合成

  const dpr = Taro.getSystemInfoSync().pixelRatio;
  const drawImages = async (userInfo) => {
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
      let img2Width = canvasWidth;
      let img2Height = img2Width * (info2.height / info2.width);
      // 计算 img2 的位置
      let x = 0;
      let y = canvasHeight - img2Height - 10 * dpr;
      // 绘制第二张图片
      ctx.drawImage(info2.path, x, y, img2Width, img2Height);
      // 绘制logo
      if (config?.logoConfig?.path) {
        ctx.drawImage(
          config.logoConfig.path,
          70,
          canvasHeight -
            config.logoConfig.height * (canvasWidth / screenWidth) -
            50 -
            img2Height,
          config.logoConfig.width * (canvasWidth / screenWidth),
          config.logoConfig.height * (canvasWidth / screenWidth)
        );
      }
      await drawCanvas(ctx);

      setTimeout(async () => {
        try {
          // 根据用户类型决定是否需要额外的缩放
          const finalWidth =
            realWidth !== "undefined" ? realWidth : canvasWidth / 2;
          const finalHeight =
            realHeight !== "undefined" ? realHeight : canvasHeight / 2;
          console.log("finalHeight: ", finalHeight);
          console.log("finalWidth: ", finalWidth);

          const { tempFilePath } = await Taro.canvasToTempFilePath({
            fileType: "jpg",
            quality: 1,
            canvasId: "mergeCanvas",
            width: canvasWidth,
            height: canvasHeight,
            destWidth: finalWidth,
            destHeight: finalHeight,
          });

          setTempPath(tempFilePath);
          setLoading(false);
          if (userInfo.type !== "default") {
            clientCanvasSaveImage(tempFilePath, userInfo);
          }
        } catch (error) {
          console.error("保存图片失败:", error);
        }
      }, 300);
    } catch (err) {
      console.error("绘制图片出错:", err);
    }
  };
  function generateTimestamp(info) {
    const now = new Date();

    // 获取当前时间的时间戳（毫秒）
    const timestamp = now.getTime();

    // 计算北京时间，中国位于 UTC+8 时区
    const beijingTime = new Date(timestamp + 8 * 60 * 60 * 1000);

    // 格式化时间
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(beijingTime.getUTCDate()).padStart(2, "0");
    const hours = String(beijingTime.getUTCHours()).padStart(2, "0");
    const minutes = String(beijingTime.getUTCMinutes()).padStart(2, "0");
    const seconds = String(beijingTime.getUTCSeconds()).padStart(2, "0");
    return `${hours}.${minutes}.${seconds}.${
      info.type !== "default" ? "vip" : ""
    }`;
  }
  const clientCanvasSaveImage = async (tempFilePath, info) => {
    async function uploadImage(filePath) {
      const cloudPath = `files/client/${generateTimestamp(info)}_${
        info.openid
      }.${filePath.match(/\.(\w+)$/)[1]}`;
      const res = await cloud.uploadFile({
        cloudPath,
        filePath,
      });
      return res.fileID;
    }
    const save = () => {
      if (isVip === "true" && info.type !== "never") {
        setLoading(false);
        setIsShowModal(true);
        return;
      }
      Taro.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: async () => {
          setLoading(false);
          uploadImage(tempFilePath);
          await cloud.callFunction({
            name: "addUser",
            data: {
              remark: "成功使用",
            },
          });
          Taro.showToast({
            title: "已保存到相册",
            icon: "success",
            duration: 2000,
          });
          // if (inviteId) {
          //   await cloud.callFunction({
          //     name: "invite",
          //     data: {
          //       invite_id: inviteId,
          //     },
          //   });
          // }
        },
        fail: (error) => {
          setLoading(false);
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
    // 会员直接保存 无广告
    if (userInfo.type !== "default") {
      save();
      return;
    }
    save();
  };
  const chongxinpaishe = useCallback(() => {
    Taro.navigateBack({
      delta: 1,
    });
  }, []);
  const clickBaoCun = useCallback(() => {
    setIsShowModal(true);
    setLoading(false);
  }, []);
  console.log("1222: ", userInfo);
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
        className="result-img-box"
        style={{
          height: `${(imgInfo.height / imgInfo.width) * screenWidth}px`,
          // height: `${(screenWidth / imgInfo.width) * imgInfo.height}px`,
        }}
      >
        {loading && (
          <View
            style={{
              textAlign: "center",
              color: "#17233f",
              fontSize: "14px",
            }}
            className="loading-wrap"
          >
            <View className="loader"></View>
            <Text>{loadingText}</Text>
          </View>
        )}
        <View className="watermark">可修改水印相机</View>

        <Image
          className="result-img"
          mode="scaleToFill"
          src={firstImagePath}
          style={{
            width: `${screenWidth}px`,
            display: "block",
            height: `100%`,
            // minHeight: "50vh",
          }}
        />
        {config?.logoConfig?.path && (
          <Image
            className="result-img2"
            mode="scaleToFill"
            src={config.logoConfig.path}
            style={{
              width: `${config.logoConfig.width}px`,
              display: "block",
              height: `${config.logoConfig.height}px`,
              bottom: "auto",
              left: "10px",
              bottom: `${config.logoConfig.y + 20}px`,
            }}
          />
        )}

        <Image
          className="result-img2"
          mode="scaleToFill"
          src={secondImagePath}
          style={{
            width: `${img2Info?.width / dpr}px`,
            display: "block",
            height: `${img2Info?.height / dpr}px`,
          }}
        />
      </View>
      <View
        className="bottom-btns"
        style={{
          padding: "0 10px",
          marginTop: userInfo.type === "default" ? "10px" : "50px",
        }}
      >
        {/* <Button
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
          <Text>增加次数</Text>
          <View id="container-stars">
            <View id="stars"></View>
          </View>

          <View id="glow">
            <View className="circle"></View>
            <View className="circle"></View>
          </View>
        </Button> */}
        {/* <Button
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
          抖音、小红书取图、去水印
        </Button> */}
        {userInfo.type === "default" && (
          <Button
            className="share-btn"
            onClick={clickBaoCun}
            style={{
              background: "linear-gradient(45deg,#536DFE, #64B5F6)",
              color: "white",
              border: "none",
              borderRadius: "30px",
              padding: "5px 16px",
              fontSize: "32rpx",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              width: "90%",
              height: "46px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            保存图片
          </Button>
        )}
        <Button
          className="share-btn"
          onClick={chongxinpaishe}
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

        <AtModal isOpened={isShowModal} closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text>提示</Text>
          </AtModalHeader>
          <AtModalContent>
            <View className="modal-list">
              <View style={{ lineHeight: 1.6 }}>
                {isVip === "true"
                  ? "该水印为 永久会员 专属，请开通永久会员，会员为"
                  : "无体验次数，请开通会员，会员为"}
                <Text style={{ color: "red" }}>收费服务</Text>
                ，请知悉！！！
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            {/* <Button
              onClick={() => {
                setIsShowModal(false);
              }}
              style={{ flex: 1 }}
            >
              关闭
            </Button> */}
            <Button
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/vip/index?id=" + inviteId,
                });
              }}
              style={{ flex: 1 }}
              type="button"
            >
              <Text>查看会员权益</Text>
            </Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={videoModal} closeOnClickOverlay={true}>
          <AtModalHeader>
            <Text>提示</Text>
            <View
              onClick={() => {
                setVideoModal(false);
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
              <View className="txt1">
                视频生成中，请您2~3分钟后到 首页 - 视频 页面中查看下载。
              </View>
            </View>
          </AtModalContent>
        </AtModal>
      </View>
    </View>
  );
};

export default MergeCanvas;
