import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const Marquee = ({ text, speed = 50 }) => {
  const [translateX, setTranslateX] = useState(0);
  const [width, setWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // 获取窗口宽度
    const res = Taro.getSystemInfoSync();
    setWindowWidth(res.windowWidth);
  }, []);

  useEffect(() => {
    // 获取文本宽度
    const query = Taro.createSelectorQuery();
    query.select('.marquee-text').boundingClientRect(rect => {
      setWidth(rect.width);
    }).exec();
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTranslateX(prev => {
        if (prev <= -width) {
          return windowWidth;
        } else {
          return prev - 1;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [width, speed, windowWidth]);

  return (
    <View className='marquee-container'>
      <View
        className='marquee-text'
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {text}
      </View>
    </View>
  );
};

export default Marquee;
