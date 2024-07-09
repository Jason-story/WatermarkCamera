import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const Marquee = ({ text, speed = 50 }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // 获取窗口宽度
    const res = Taro.getSystemInfoSync();
    setWindowWidth(res.windowWidth);
  }, []);

  return (
    <View className='marquee-container'>
      <View className='marquee-text'>
        {text}
      </View>
    </View>
  );
};

export default Marquee;
