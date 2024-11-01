import React, { useState, useEffect } from 'react';
import { View, Text, Input } from '@tarojs/components';
import './index.scss';

const CustomModal = ({
  visible = false,
  title = '提示',
  content,
  leftButtonText = '取消',
  rightButtonText = '确定',
  onLeftButtonClick,
  onRightButtonClick,
  onClose,
  placeholder = '请输入手机号码',
  showLeftButton = true,
  showRightButton = true,
  phoneValidation = true,
  inputType = 'phone', // 'phone' | 'number' | 'text'
  customInput, // 自定义输入组件
  hideCloseOnConfirm = true,
  onInputChange, // 新增的 prop，用于获取输入值
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 验证手机号码的正则表达式
  const phoneRegex = /^1[3456789]\d{9}$/;

  // 输入验证映射
  const validationMap = {
    phone: {
      regex: phoneRegex,
      errorMsg: '请输入有效的手机号码',
      maxLength: 11
    },
    number: {
      regex: /^\d+$/,
      errorMsg: '请输入有效的数字',
      maxLength: 20
    },
    text: {
      regex: /.+/,
      errorMsg: '输入不能为空',
      maxLength: 200
    }
  };

  // 获取当前验证规则
  const currentValidation = validationMap[inputType] || validationMap.phone;

  // 监听输入值变化并调用 onInputChange 回调
  useEffect(() => {
    if (onInputChange) {
      onInputChange(inputValue);
    }
  }, [inputValue, onInputChange]);

  // 处理输入变化
  const handleInputChange = (e) => {
    let value = e.detail.value;

    // 根据输入类型处理
    switch (inputType) {
      case 'phone':
        value = value.replace(/\D/g, '');
        break;
      case 'number':
        value = value.replace(/\D/g, '');
        break;
      default:
        break;
    }

    setInputValue(value);

    // 实时验证
    if (value.length > 0 && phoneValidation) {
      if (value.length > currentValidation.maxLength) {
        setErrorMessage(`最大长度为${currentValidation.maxLength}位`);
      } else if (!currentValidation.regex.test(value)) {
        setErrorMessage(currentValidation.errorMsg);
      } else {
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  };

  // 处理左侧按钮点击
  const handleLeftClick = () => {
    setInputValue('');
    setErrorMessage('');
    if (onLeftButtonClick) {
      onLeftButtonClick();
    }
    onClose?.();
  };

  // 处理右侧按钮点击
  const handleRightClick = () => {
    // 如果有自定义输入组件，跳过默认验证
    if (customInput) {
      onRightButtonClick?.(inputValue);
      if (hideCloseOnConfirm) {
        onClose?.();
      }
      return;
    }

    if (phoneValidation) {
      if (!inputValue) {
        setErrorMessage('请输入内容');
        return;
      }

      if (!currentValidation.regex.test(inputValue)) {
        setErrorMessage(currentValidation.errorMsg);
        return;
      }
    }

    onRightButtonClick?.(inputValue);
    setInputValue('');
    setErrorMessage('');

    if (hideCloseOnConfirm) {
      onClose?.();
    }
  };

  // 处理输入框聚焦
  const handleInputFocus = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // 计算底部按钮区域的布局
  const getFooterLayout = () => {
    if (showLeftButton && showRightButton) {
      return 'custom-modal-footer-two-buttons';
    } else if (showLeftButton || showRightButton) {
      return 'custom-modal-footer-one-button';
    }
    return 'custom-modal-footer-no-buttons';
  };

  if (!visible) return null;

  return (
    <View className='custom-modal-container'>
      <View className='custom-modal-mask' />
      <View className='custom-modal-content'>
        {/* 标题 */}
        <View className='custom-modal-header'>
          <Text className='custom-modal-title'>{title}</Text>
        </View>

        {/* 内容区域 */}
        <View className='custom-modal-body'>
          {/* 标准内容 */}
          {typeof content === 'string' ? (
            <Text className='custom-modal-text'>{content}</Text>
          ) : (
            content
          )}

          {/* 自定义输入组件 */}
          {customInput ? (
            <View className='custom-modal-custom-input'>
              {customInput}
            </View>
          ) : (
            <View className='custom-modal-input-container'>
              <Input
                className={`custom-modal-input ${errorMessage ? 'custom-modal-input-error' : ''}`}
                type={inputType === 'phone' || inputType === 'number' ? 'number' : 'text'}
                maxlength={currentValidation.maxLength}
                placeholder={placeholder}
                value={inputValue}
                onInput={handleInputChange}
                onFocus={handleInputFocus}
              />
              {errorMessage && (
                <Text className='custom-modal-error-message'>{errorMessage}</Text>
              )}
            </View>
          )}
        </View>

        {/* 按钮区域 */}
        {(showLeftButton || showRightButton) && (
          <View className={`custom-modal-footer ${getFooterLayout()}`}>
            {showLeftButton && (
              <View
                className='custom-modal-button custom-modal-button-left'
                onClick={handleLeftClick}
              >
                {leftButtonText}
              </View>
            )}
            {showRightButton && (
              <View
                className={`custom-modal-button custom-modal-button-right ${
                  phoneValidation && (!inputValue || errorMessage)
                    ? 'custom-modal-button-disabled'
                    : ''
                }`}
                onClick={handleRightClick}
              >
                {rightButtonText}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomModal;
