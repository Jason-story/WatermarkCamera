import React, { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const ImageCompare = ({
  beforeImage = "https://fonts-1326883150.cos.ap-beijing.myqcloud.com/2871721203290_.pic.jpg",
  afterImage = "https://fonts-1326883150.cos.ap-beijing.myqcloud.com/2881721203291_.pic_hd.jpg",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query
      .select(".image-compare")
      .boundingClientRect()
      .exec((res) => {
        if (res[0]) {
          setContainerWidth(res[0].width);
          console.log("Container width:", res[0].width);
        }
      });
  }, []);

  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const newPosition = (touch.clientX / containerWidth) * 100;
    const clampedPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(clampedPosition);
  };

  return (
    <View
      className="image-compare"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <Image className="image before" src={beforeImage} mode="aspectFit" />
      <View
        className="image-wrapper after"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image className="image" src={afterImage} mode="aspectFit" />
      </View>
      <View className="slider" style={{ left: `${sliderPosition}%` }}>
        <View className="slider-line"></View>
        <View className="slider-button"></View>
      </View>
    </View>
  );
};

export default ImageCompare;
