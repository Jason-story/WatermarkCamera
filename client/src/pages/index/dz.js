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
  let width = '';
  wx.getSystemInfo({
    success: function (res) {
       width = res.screenWidth;
       console.log('res.screenWidth: ', res.screenWidth);
    },
  })

  return [
    [
      {
        path: [
          // 时间
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.setFontSize(fontSize);
              ctx.setFillStyle(color);
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 23.8,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 34],
              },
            ],
          },
          // 日期
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.setFontSize(fontSize);
              ctx.setFillStyle(color);
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 15.3,
                color: "white",
                text: `${year}年${month}月${day}日`,
                position: [74.8, 17],
              },
            ],
          },
          // 星期
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.setFontSize(fontSize);
              ctx.setFillStyle(color);
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 15.3,
                color: "white",
                text: `${weekly}`,
                position: [74.8, 42.5],
              },
            ],
          },
          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.setFontSize(fontSize);
              ctx.setFillStyle(color);

              const maxLength = 16;
              const firstLine = text.slice(0, maxLength);
              const secondLine =
                text.length > maxLength ? text.slice(maxLength) : "";

              ctx.fillText(firstLine, ...position);
              if (secondLine) {
                ctx.fillText(secondLine, position[0], position[1] + 21.25);
              }
            },
            args: [
              {
                fontSize: 13.6,
                color: "white",
                text: locationName,
                position: [0, 68],
              },
            ],
          },
        ],
        img: Shuiyin1,
        width,
        height: 200,
      },
    ],
  ];
};

export default generateCanvasConfig;
