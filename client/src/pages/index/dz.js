import Shuiyinxiangji from "../../images/shuiyinxiangji.png";
import Taro from "@tarojs/taro";

const generateCanvasConfig = ({
  hours,
  minutes,
  year,
  month,
  day,
  weekly,
  weather,
  locationName,
  latitude,
  longitude,
  hideJw,
  dpr,
  title,
  Shuiyin4,
  canvas,
}) => {
  let width = "";
  wx.getSystemInfo({
    success: function (res) {
      width = res.screenWidth;
    },
  });

  return [
    [
      {
        path: [
          // 时间
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `bold ${fontSize}px Pragmatica`;

              // 添加阴影效果
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 4;
              ctx.shadowBlur = 4;

              ctx.fillStyle = color;

              // 获取文本宽度
              const textWidth = ctx.measureText(text).width;

              // 计算居中位置
              const canvasWidth = width - 20; // 假设你知道 canvas 的宽度
              const xPosition = (canvasWidth - textWidth) / 2;
              const yPosition = position[1]; // 保持 y 位置不变

              // 绘制文本
              ctx.fillText(text, xPosition, yPosition);
            },
            args: [
              {
                fontSize: 52,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 58], // position 数组的 x 值在计算居中时被忽略
              },
            ],
          },

          // 日期
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;

              // 分割文本
              const parts = text.split("📍");
              const beforeMarker = parts[0].split(weekly);
              const datePart = beforeMarker[0].trim() + "  ";
              const weeklyPart = weekly + " ";
              const locationName = parts[1].trim();

              // 设置字体和样式
              ctx.font = `${fontSize}px 黑体`;
              ctx.fillStyle = color;

              // 计算各部分的宽度
              const dateWidth = ctx.measureText(datePart).width;
              const weeklyWidth = ctx.measureText(weeklyPart).width;
              const markerWidth = ctx.measureText("📍").width;
              const locationWidth = ctx.measureText(locationName).width;

              // 计算居中位置
              const canvasWidth = width - 20; // 假设你知道 canvas 的宽度
              const totalTextWidth =
                dateWidth + weeklyWidth + markerWidth + locationWidth;
              const xPosition = (canvasWidth - totalTextWidth) / 2;
              const yPosition = position[1]; // 保持 y 位置不变

              // 绘制普通文本的日期部分
              ctx.fillText(datePart, xPosition, yPosition);

              // 设置加粗字体并绘制 weekly 部分
              ctx.font = `bold ${fontSize}px '黑体'`;
              ctx.fillText(weeklyPart, xPosition + dateWidth, yPosition);

              // 恢复普通字体并绘制📍符号
              ctx.font = `bold ${18}px '黑体'`;
              ctx.fillText(
                "📍",
                xPosition + dateWidth + weeklyWidth,
                yPosition + 2
              );

              // 设置加粗字体并绘制 locationName
              ctx.font = `bold ${fontSize}px '黑体'`;
              ctx.fillText(
                locationName,
                xPosition + dateWidth + weeklyWidth + markerWidth + 4,
                yPosition
              );
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: `${year}.${month}.${day}  ${weekly} 📍 ${locationName}`,
                position: [0, 99],
              },
            ],
          },

          // 水印相机
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              // 绘制图片
              Taro.getImageInfo({
                src: "https://fonts-1326883150.cos.ap-beijing.myqcloud.com/shuiyinxiangji.png", // 替换为你的图片路径
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = imgInfo.path;
                  img.onload = () => {
                    const imgWidth = imgInfo.width / dpr + 5;
                    const imgHeight = imgInfo.height / dpr + 5;

                    // 获取画布的宽高
                    const canvasWidth = canvas.width / dpr;
                    const canvasHeight = canvas.height / dpr;

                    // 计算图片绘制的坐标，使其位于右下角
                    const x = canvasWidth - imgWidth;
                    const y = canvasHeight - imgHeight + 14;
                    ctx.drawImage(img, x, y, imgWidth, imgHeight);
                  };
                  img.onerror = (err) => {
                    console.error("图片加载失败", err);
                  };
                },
                fail: (err) => {
                  console.error("获取图片信息失败", err);
                },
              });
            },
            args: [
              {
                fontSize: 15.3,
                color: "rgba(255, 255, 255, 0.8)", // 使用带透明度的白色作为文字颜色
                text: `水印相机`,
                position: [0, 103],
              },
            ],
          },
        ],
        img: Shuiyin4,
        width: width - 20,
        height: 140,
        position: "center",
        vip: true,
      },
    ],
  ];
};
export default generateCanvasConfig;
