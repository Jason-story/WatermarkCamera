import { View } from '@tarojs/components'
import { useState, useEffect,useRef } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

const CustomSlider = ({ min = 0, max = 100, step = 1, onChange }) => {
  const initialValue = (min + max) / 2
  const [sliderValue, setSliderValue] = useState(initialValue)
  const [sliderWidth, setSliderWidth] = useState(0)
  const [sliderLeft, setSliderLeft] = useState(0)
  const isDragging = useRef(false)

  // 组件挂载时获取滑动区域的尺寸和位置信息
  useEffect(() => {
    const query = Taro.createSelectorQuery()
    query.select('.slider').boundingClientRect(rect => {
      setSliderWidth(rect.width)
      setSliderLeft(rect.left)
    }).exec()
  }, [])

  // 计算新的滑动值
  const calculateNewValue = (touchX) => {
    const offsetX = touchX - sliderLeft
    const ratio = Math.min(Math.max(offsetX / sliderWidth, 0), 1)
    const rawValue = ratio * (max - min) + min
    const steppedValue = Math.round(rawValue / step) * step
    return Math.min(Math.max(steppedValue, min), max)
  }

  // 触摸开始
  const handleTouchStart = (e) => {
    isDragging.current = true
    const touchX = e.touches[0].clientX
    const newValue = calculateNewValue(touchX)
    if (!isNaN(newValue)) {
      setSliderValue(newValue)
      onChange?.(newValue)
    }
  }

  // 触摸移动
  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    const touchX = e.touches[0].clientX
    const newValue = calculateNewValue(touchX)
    if (!isNaN(newValue)) {
      setSliderValue(newValue)
      onChange?.(newValue)
    }
  }

  // 触摸结束
  const handleTouchEnd = () => {
    isDragging.current = false
  }

  // 计算滑块位置
  const sliderPosition = `${((sliderValue - min) / (max - min)) * 100}%`

  return (
    <View className='slider-container'>
      <View
        className='slider'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <View className='slider-track'>
          <View
            className='slider-progress'
            style={{ width: sliderPosition }}
          />
        </View>
        <View
          className='slider-thumb'
          style={{ left: sliderPosition }}
        />
      </View>
    </View>
  )
}

export default CustomSlider
