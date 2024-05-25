// src/pages/merge/index.jsx
import React, { useEffect, useState } from 'react';
import { View, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const MergeCanvas = () => {
  const [imagePath, setImagePath] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  Taro.getCurrentInstance().router.params
  const firstImagePath = Taro.getCurrentInstance().router.params.bg; // 第一张图片的本地路径
  const secondImagePath = Taro.getCurrentInstance().router.params.mask;// 第二张图片的本地路径

  const drawImages = () => {
    // 获取第一张图片的信息
    Taro.getImageInfo({
      src: firstImagePath,
      success: (res1) => {
        const img1Path = res1.path;
        const img1Width = res1.width;
        const img1Height = res1.height;
        setImageWidth(img1Width);
        console.log('img1Width: ', img1Width);
        setImageHeight(img1Height);
        console.log('img1Height: ', img1Height);

        // 获取第二张图片的信息
        Taro.getImageInfo({
          src: secondImagePath,
          success: (res2) => {
            const img2Path = res2.path;
            const img2Width = res2.width;
            console.log('img2Width: ', img2Width);
            const img2Height = res2.height;
            console.log('img2Height: ', img2Height);

            const ctx = Taro.createCanvasContext('mergeCanvas');

            // 绘制第一张图片作为背景
            ctx.drawImage(img1Path, 0, 0, img1Width, img1Height);

            // 绘制第二张图片在左下角
            const x = 10;
            const y = img1Height - img2Height -10;
            ctx.drawImage(img2Path, x, y, img2Width, img2Height);

            // 完成绘制
            ctx.draw(false, () => {
              Taro.canvasToTempFilePath({
                canvasId: 'mergeCanvas',
                success: (res) => {
                  setImagePath(res.tempFilePath);
                  console.log('res.tempFilePath: ', res.tempFilePath);
                  Taro.showToast({
                    title: '图片生成成功',
                    icon: 'success',
                    duration: 2000
                  });
                },
                fail: (err) => {
                  console.error(err);
                  Taro.showToast({
                    title: '图片生成失败',
                    icon: 'none',
                    duration: 2000
                  });
                }
              });
            });
          },
          fail: (err) => {
            console.error(err);
            Taro.showToast({
              title: '加载第二张图片失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      fail: (err) => {
        console.error(err);
        Taro.showToast({
          title: '加载第一张图片失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  };

  useEffect(() => {
    drawImages();
  }, []);

  return (
    <View className='container'>
      <canvas canvas-id='mergeCanvas' style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }} />
      {/* {imagePath && <Image src={imagePath} style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }} />} */}
    </View>
  );
};

export default MergeCanvas;
