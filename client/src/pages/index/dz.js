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
      console.log("res.screenWidth: ", res.screenWidth);
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
              ctx.font = `normal 200 ${fontSize}px Arial Light`;
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
              ctx.setFontSize(fontSize);
              ctx.setFillStyle(color);

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
                text: `${year}.${month}.${day} ${weekly} 📍 ${locationName}`,
                position: [0, 100],
              },
            ],
          },
          // 星期
          // {
          //   draw: (ctx, weatherConfig) => {
          //     const { fontSize, color, text, position } = weatherConfig;
          //     ctx.setFontSize(fontSize);
          //     ctx.setFillStyle(color);
          //     ctx.fillText(text, ...position);
          //   },
          //   args: [
          //     {
          //       fontSize: 15.3,
          //       color: "white",
          //       text: `${weekly}`,
          //       position: [74.8, 42.5],
          //     },
          //   ],
          // },
          // 地址
          // {
          //   draw: (ctx, locationConfig) => {
          //     const { fontSize, color, text, position } = locationConfig;
          //     ctx.setFontSize(fontSize);
          //     ctx.setFillStyle(color);

          //     const maxLength = 16;
          //     const firstLine = text.slice(0, maxLength);
          //     const secondLine =
          //       text.length > maxLength ? text.slice(maxLength) : "";

          //     ctx.fillText(firstLine, ...position);
          //     if (secondLine) {
          //       ctx.fillText(secondLine, position[0], position[1] + 21.25);
          //     }
          //   },
          //   args: [
          //     {
          //       fontSize: 13.6,
          //       color: "white",
          //       text: locationName,
          //       position: [0, 68],
          //     },
          //   ],
          // },
        ],
        img: Shuiyin1,
        width: width - 20,
        height: 160,
      },
    ],
  ];
};

export default generateCanvasConfig;
