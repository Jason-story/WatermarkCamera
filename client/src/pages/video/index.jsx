import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Button, Video } from "@tarojs/components";
import "./index.scss";
const app = getApp();
let cloud = "";

const QRCodePage = () => {
  const [files, setFiles] = useState([
    "cloud://sy-4gecj2zw90583b8b.7379-sy-4gecj2zw90583b8b-1326662896/kit-cms-upload/1727530025982__output.mp4",
  ]);

  useEffect(() => {
    Taro.showLoading();

    const init = async () => {
      cloud = await app.$app.globalData.getCloud();
      await cloud.init();
      cloud.callFunction({
        name: "getMyVideos",
        success: function (res) {
          Taro.hideLoading();
          if (res.result?.data?.length > 0) {
            setFiles(res.result.data);
          }
        },
      });
    };
    init();
  }, []);

  const [videoAspectRatio, setVideoAspectRatio] = useState({});

  useEffect(() => {
    files.forEach((item, index) => {
      Taro.getVideoInfo({
        src: item,
        success: (res) => {
          setVideoAspectRatio((prev) => ({
            ...prev,
            [index]: res.width / res.height,
          }));
        },
      });
    });
  }, [files]);

  const downloadVideo = (fileID) => {
    console.log("fileID: ", fileID);
    Taro.showLoading({
      title: "下载中...",
      mask: true,
    });
    cloud.downloadFile({
      fileID: fileID, // 替换为你要下载的图片文件ID
      success: (res) => {
        console.log("res: ", res);
        Taro.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success: async () => {
            Taro.hideLoading();
            Taro.showToast({
              title: "已保存到相册",
              icon: "success",
              duration: 2000,
            });
          },
          fail: (error) => {
            Taro.hideLoading();
            Taro.showToast({
              title: "保存失败",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
      fail: (err) => {
        wx.showToast({
          title: "下载失败",
          icon: "none",
        });
      },
    });
  };
  return (
    <View className="qr-code-page">
      <View className="user-details">
        <View>为了保护隐私，所有视频都会在每天0点清空，请及时下载</View>
        <View style={{ marginTop: "15px" }}>
          视频上传后，请稍等2~3分钟后，您的水印视频会显示在这里，您可以下载。
        </View>
      </View>
      <View>
        <View className="video-grid">
          {files.map((item, index) => {
            return (
              <View key={index} className="video-item">
                <Video
                  src={item}
                  className="video-player"
                  style={{
                    borderRadius: "10px",
                    aspectRatio: videoAspectRatio[index] || "9 / 16", // 默认16:9
                  }}
                  objectFit="contain"
                />
                <Button
                  onClick={() => downloadVideo(item)}
                  style={{
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "0 20px",
                    fontSize: "26rpx",
                    marginTop: "10px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  下载
                </Button>
                {item ===
                "cloud://sy-4gecj2zw90583b8b.7379-sy-4gecj2zw90583b8b-1326662896/kit-cms-upload/1727530025982__output.mp4" ? (
                  <View
                    style={{
                      textAlign: "center",
                      marginTop: "5px",
                    }}
                  >
                    样例
                  </View>
                ) : (
                  ""
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
export default QRCodePage;
