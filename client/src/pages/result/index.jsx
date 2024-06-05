// src/pages/merge/index.jsx
import React, { useEffect, useState } from "react";
import { View, Button, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ShareImg from "../../images/logo.jpg";

import "./index.scss";
import restart from "../../images/restart.png";

const screenWidth = Taro.getSystemInfoSync().screenWidth;

const MergeCanvas = () => {
  const [imagePath, setImagePath] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  Taro.getCurrentInstance().router.params;
  const firstImagePath = Taro.getCurrentInstance().router.params.bg; // 第一张图片的本地路径
  const secondImagePath = Taro.getCurrentInstance().router.params.mask; // 第二张图片的本地路径

  const drawImages = () => {
    // 获取第一张图片的信息
    const dpr = Taro.getSystemInfoSync().pixelRatio;
    Taro.getImageInfo({
      src: firstImagePath,
      success: (res1) => {
        const img1Path = res1.path;
        const img1Width = res1.width;
        const img1Height = res1.height;
        setImageWidth(img1Width);
        setImageHeight(img1Height);

        // 获取第二张图片的信息
        Taro.getImageInfo({
          src: secondImagePath,
          success: (res2) => {
            const img2Path = res2.path;
            const img2Width = res2.width;
            const img2Height = res2.height;

            const ctx = Taro.createCanvasContext("mergeCanvas");

            // 绘制第一张图片作为背景
            ctx.drawImage(img1Path, 0, 0, img1Width, img1Height);

            ctx.drawImage(
              img1Path,
              0,
              0,
              screenWidth,
              (screenWidth / img1Width) * img1Height
            );

            // 绘制第二张图片在左下角
            const x = 10;
            const y =
              (screenWidth / img1Width) * img1Height - img2Height / dpr - 10;
            ctx.drawImage(img2Path, x, y, img2Width / dpr, img2Height / dpr);

            // 完成绘制
            ctx.draw(false, () => {
              Taro.canvasToTempFilePath({
                canvasId: "mergeCanvas",
                success: (res) => {
                  saveImage(res.tempFilePath);
                  Taro.showToast({
                    title: "图片生成成功",
                    icon: "success",
                    duration: 2000,
                  });
                },
                fail: (err) => {
                  Taro.showToast({
                    title: "图片生成失败",
                    icon: "none",
                    duration: 2000,
                  });
                },
              });
            });
          },
          fail: (err) => {
            console.error(err);
            Taro.showToast({
              title: "加载第二张图片失败",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
      fail: (err) => {
        console.error(err);
        Taro.showToast({
          title: "加载第一张图片失败",
          icon: "none",
          duration: 2000,
        });
      },
    });
  };

  const saveImage = (tempFilePath) => {
    setImagePath(tempFilePath);
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
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
  console.log("333: ", screenWidth / imageWidth);
  console.log("screenWidth: ", screenWidth);
  console.log("imageWidth: ", imageWidth);
  console.log("222: ", imageHeight);
  console.log("imagePath: ", imagePath);

  return (
    <View className="container">
      <canvas
        canvas-id="mergeCanvas"
        style={{
          width: `${screenWidth}px`,
          height: `${(screenWidth / imageWidth) * imageHeight}px`,
        }}
      />
      {imagePath && (
        <Image
          className="result-img"
          mode="scaleToFill"
          src={imagePath}
          style={{
            width: `${screenWidth}px`,
            height: `${(screenWidth / imageWidth) * imageHeight}px`,
          }}
        />
      )}
      <View className="bottom-btns">
      <Button
          className="share-btn"
          openType="share"
          style={{
            background: "linear-gradient(45deg,#ff512f, #dd2476)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "0 16px",
            fontSize: "30rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "45%",
          }}
        >
          分享好友
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
            borderRadius: "25px",
            padding: "0 16px",
            fontSize: "30rpx",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "45%",
          }}
        >
          重新拍摄
        </Button>


      </View>
    </View>
  );
};

export default MergeCanvas;
