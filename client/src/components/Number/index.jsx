import React, { useState, useEffect } from "react";
import { View, Input, Text } from "@tarojs/components";
import "./index.scss";

const CustomInputNumber = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  placeholder = "请输入数字",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 验证输入值是否在范围内
  const validateNumber = (num) => {
    let validNum = Number(num);
    if (isNaN(validNum)) return min;
    if (validNum < min) return min;
    if (validNum > max) return max;
    return validNum;
  };

  // 处理手动输入
  const handleInput = (e) => {
    const newValue = e.detail.value;
    if (newValue === "") {
      setInputValue("");
      onChange && onChange(min);
      return;
    }

    const validValue = validateNumber(newValue);
    setInputValue(validValue);
    onChange && onChange(validValue);
  };

  // 处理加减按钮点击
  const handleStep = (type) => {
    const currentValue = Number(inputValue) || 0;
    let newValue;

    if (type === "minus") {
      newValue = validateNumber(currentValue - step);
    } else {
      newValue = validateNumber(currentValue + step);
    }

    setInputValue(newValue);
    onChange && onChange(newValue);
  };

  // 判断按钮是否禁用
  const isMinusDisabled = inputValue <= min;
  const isPlusDisabled = inputValue >= max;

  return (
    <View className="custom-input-number">
      <View
        className={`number-btn minus ${isMinusDisabled ? "disabled" : ""}`}
        onClick={() => !isMinusDisabled && handleStep("minus")}
      >
        <Text>-</Text>
      </View>

      <Input
        className="number-input"
        type="number"
        value={String(inputValue)}
        onInput={handleInput}
        placeholder={placeholder}
      />

      <View
        className={`number-btn plus ${isPlusDisabled ? "disabled" : ""}`}
        onClick={() => !isPlusDisabled && handleStep("plus")}
      >
        <Text>+</Text>
      </View>
    </View>
  );
};

export default CustomInputNumber;
