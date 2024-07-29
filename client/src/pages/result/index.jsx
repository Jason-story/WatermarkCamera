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

  const [imagePath, setImagePath] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowTimesModal, setIsShowTimesModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isShare, setShare] = useState(false);

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
      console.log('res: ', res);

      if (res.result.success) {
        return res.result;
      } else {
        throw new Error(res.result.error);
      }
    } catch (error) {
      console.error("合并图片失败:", error);
      throw error;
    }
  }

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
  // 假设这个函数在成功合并图片后被调用
  async function handleMergedImage(mergedImageFileID) {
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
          saveImage(downloadRes.tempFilePath);
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
          setUserInfo(res.result.data);
          const { fileID, width, height } = await mergeImages(
            firstImagePath,
            secondImagePath,
            position,
            res.result.data
          );
          setImageHeight(height);
          setImageWidth(width);
          handleMergedImage(fileID);
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

  return (
    <View className="container result">
      {/* <canvas
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
      /> */}
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
