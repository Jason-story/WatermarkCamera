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
  title,
  Shuiyin1,
  Shuiyin2,
  Shuiyin3,
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
              ctx.font = `normal ${fontSize}px ArialLight`;
              ctx.fillStyle = color;
              // 获取文本宽度
              const textWidth = ctx.measureText(text).width;

              // 计算居中位置
              const canvasWidth = width - 20; // 假设你知道 canvas 的宽度
              const xPosition = (canvasWidth - textWidth) / 2;
              console.log("xPosition: ", xPosition);
              const yPosition = position[1]; // 保持 y 位置不变

              // 绘制文本
              ctx.fillText(text, xPosition, yPosition);
            },
            args: [
              {
                fontSize: 70,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 60], // position 数组的 x 值在计算居中时被忽略
              },
            ],
          },

          // 日期
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `500 ${fontSize}px sans-serif`;
              ctx.fillStyle = color;

              const textWidth = ctx.measureText(text).width;

              // 计算居中位置
              const canvasWidth = width - 20; // 假设你知道 canvas 的宽度
              const xPosition = (canvasWidth - textWidth) / 2;
              const yPosition = position[1]; // 保持 y 位置不变
              ctx.fillText(text, xPosition, yPosition);
            },
            args: [
              {
                fontSize: 15.3,
                color: "white",
                text: `${year}.${month}.${day}  ${weekly} 📍 ${locationName}`,
                position: [0, 100],
              },
            ],
          },
          // 水印相机
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `500 ${fontSize}px sans-serif`;
              ctx.fillStyle = color;

              const textWidth = ctx.measureText(text).width;

              // 计算右下角位置
              const canvasWidth = width - 40; // 假设你知道 canvas 的宽度
              const xPosition = canvasWidth - textWidth ;
              const yPosition = position[1] + 40; // 将 y 位置向下偏移 20px
              ctx.globalAlpha = 0.7; // 设置文字透明度为 0.5，略带虚化效果
              ctx.fillText(text, xPosition, yPosition);
              ctx.globalAlpha = 1; // 恢复默认透明度
            },
            args: [
              {
                fontSize: 15.3,
                color: "rgba(255, 255, 255, 0.8)", // 使用带透明度的白色作为文字颜色
                text: `水印相机`,
                position: [0, 100],
              },
            ],
          },
        ],
        img: Shuiyin1,
        width: width - 20,
        height: 160,
      },
    ],
  ];
};

export default generateCanvasConfig;
