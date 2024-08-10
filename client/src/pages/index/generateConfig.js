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
  return [

    [
      {
        path: [
          {
            draw: (ctx, backgroundConfig) => {
              const { color, rect } = backgroundConfig;
              ctx.fillStyle = color;
              ctx.fillRect(...rect);
            },
            args: [
              {
                color: "rgba(0, 0, 0, 0)",
                rect: [0, 0, 280.5, 102],
              },
            ],
          },
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 25,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 34],
              },
            ],
          },
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: `${year}年${month}月${day}日`,
                position: [82, 19],
              },
            ],
          },
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: `${weekly} ${weather?.text} ${weather?.temperature}℃`,
                position: [82, 42],
              },
            ],
          },
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;

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
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 21.25];
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.6,
                color: "white",
                text: hideJw
                  ? "经纬度: " +
                    ((latitude * 1)?.toFixed(5) +
                      ", " +
                      (longitude * 1)?.toFixed(5))
                  : "",
                position: [0, 89.25],
              },
            ],
          },

          {
            draw: (ctx, lineConfig) => {
              const { lineWidth, color, start, end } = lineConfig;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(...start);
              ctx.lineTo(...end);
              ctx.stroke();
            },
            args: [
              {
                lineWidth: 2.5,
                color: "#fec52e",
                start: [74, 5],
                end: [74, 44],
              },
            ],
          },
        ],
        img: Shuiyin1,
        width: 238,
        scale:0.5,
        name:'免费-时间天气-1',
        height: locationName.length > 16 ? 119 : 100,
      },
    ],
    [
      {
        path: [
          {
            draw: (ctx, rectConfig) => {
              const { width, height, color } = rectConfig;

              ctx.fillStyle = color;

              const radius = 4.25;
              ctx.beginPath();
              ctx.moveTo(8.5 + radius, 0);
              ctx.lineTo(8.5 + width - radius, 0);
              ctx.arcTo(8.5 + width, 0, 8.5 + width, radius, radius);
              ctx.lineTo(8.5 + width, height - radius);
              ctx.arcTo(
                8.5 + width,
                height,
                8.5 + width - radius,
                height,
                radius
              );
              ctx.lineTo(8.5 + radius, height);
              ctx.arcTo(8.5, height, 8.5, height - radius, radius);
              ctx.lineTo(8.5, radius);
              ctx.arcTo(8.5, 0, 8.5 + radius, 0, radius);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = "#fec52e";
              ctx.fillRect(11.05, 2.55, 42.5, 28.05);

              ctx.fillStyle = "black";
              ctx.font = "15.3px fzlt";
              ctx.fillText("打卡", 17, 23);
            },
            args: [
              {
                width: 127.5,
                height: 34,
                color: "white",
              },
            ],
          },
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 22,
                color: "#1895e6",
                text: `${hours}:${minutes}`,
                position: [65, 25],
              },
            ],
          },
          {
            draw: (ctx, config) => {
              let { fontSize, color, text, position } = config;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 17];
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.6,
                color: "white",
                text: `${year}年${month}月${day}日 ${weekly}`,
                position: [18.7, 78.2],
              },
            ],
          },
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;

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
                position: [18.7, 55.25],
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 22.95];
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.6,
                color: "white",
                text: hideJw
                  ? "经纬度: " +
                    ((latitude * 1)?.toFixed(5) +
                      ", " +
                      (longitude * 1)?.toFixed(5))
                  : "",
                position: [8.5, 100],
              },
            ],
          },
          {
            draw: (ctx, lineConfig) => {
              let { lineWidth, color, start, end } = lineConfig;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(...start);
              if (locationName.length > 16) {
                end = [end[0], end[1] + 17];
              }
              ctx.lineTo(...end);
              ctx.stroke();
            },
            args: [
              {
                lineWidth: 2.55,
                color: "#fec52e",
                start: [11.9, 42.5],
                end: [11.9, 80.75],
              },
            ],
          },
        ],
        img: Shuiyin2,
        width: 255,
        scale:0.5,
        name:'免费-打卡-2',

        height: locationName.length > 16 ? 129 : 102,
      },
    ],
    // 333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333
    [
      {
        path: [
          // 背景
          {
            draw: (ctx, rectConfig) => {
              const { width, height, color, text } = rectConfig;

              // 设置矩形的颜色
              ctx.fillStyle = color;

              // 绘制一个带7.5px圆角的指定宽高和颜色的矩形
              const radius = 7.5; // 10 * 0.75 圆角半径
              ctx.beginPath();
              ctx.moveTo(radius, 0);
              ctx.lineTo(width - radius, 0);
              ctx.arcTo(width, 0, width, radius, radius);
              ctx.lineTo(width, height - radius);
              ctx.arcTo(width, height, width - radius, height, radius);
              ctx.lineTo(radius, height);
              ctx.arcTo(0, height, 0, height - radius, radius);
              ctx.lineTo(0, radius);
              ctx.arcTo(0, 0, radius, 0, radius);
              ctx.closePath();
              ctx.fill();

              // 绘制顶部带圆角的蓝色背景
              ctx.fillStyle = "rgb(10, 55, 132)";
              ctx.beginPath();
              ctx.moveTo(radius, 0);
              ctx.lineTo(width - radius, 0);
              ctx.arcTo(width, 0, width, radius, radius);
              ctx.lineTo(width, 30); // 40 * 0.75
              ctx.lineTo(0, 30); // 40 * 0.75
              ctx.lineTo(0, radius);
              ctx.arcTo(0, 0, radius, 0, radius);
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景上绘制黄色小圆点
              ctx.fillStyle = "rgb(246, 196, 44)";
              const centerX = 15; // 20 * 0.75
              const centerY = 15; // 20 * 0.75 蓝色背景高度的一半
              ctx.beginPath();
              ctx.arc(centerX, centerY, 3, 0, Math.PI * 2); // 4 * 0.75
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景中居中显示文字
              ctx.fillStyle = "white";
              ctx.font = "15px fzlt";
              const textWidth = ctx.measureText(text).width;
              const textX = (width - textWidth + 7.5) / 2; // 10 * 0.75
              const textY = 21.75; // 29 * 0.75 文字居中显示
              ctx.fillText(text, textX, textY);
            },
            args: [
              {
                width: 190, // 250 * 0.75
                height: locationName.length > 9 ? 120 : 105, // 180 * 0.75
                color: "rgba(121, 121, 122, .8)",
                text: title, // 替换为需要显示的文字
              },
            ],
          },
          // 时间
          {
            draw: (ctx, config) => {
              let { fontSize, color, text, position } = config;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.5, // 18 * 0.75
                color: "#000",
                text: `时   间：${year}.${month}.${day}  ${hours}:${minutes}`,
                position: [11.25, 48.75], // 15 * 0.75, 65 * 0.75
              },
            ],
          },
          // 天气
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.5, // 18 * 0.75
                color: "#000",
                text:
                  "天   气：" +
                  weather?.text +
                  " " +
                  weather?.temperature +
                  "℃",
                position: [11.25, 67.5], // 15 * 0.75, 90 * 0.75
              },
            ],
          },
          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position, positionSecond } =
                locationConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;

              const maxLength = 9;
              const firstLine = text.slice(0, maxLength);
              const secondLine =
                text.length > maxLength ? text.slice(maxLength) : "";

              ctx.fillText("地   点：" + firstLine, ...position);
              if (secondLine) {
                ctx.fillText(
                  secondLine,
                  positionSecond[0],
                  positionSecond[1] + 18.75
                ); // 25 * 0.75
              }
            },
            args: [
              {
                fontSize: 13.5, // 18 * 0.75
                color: "#000",
                text: locationName,
                position: [11.25, 86.25], // 15 * 0.75, 115 * 0.75
                positionSecond: [60, 86.25], // 80 * 0.75, 115 * 0.75
              },
            ],
          },
        ],
        img: Shuiyin3,
        scale:0.4,
        name:'免费-工程记录-3',
        width: 190, // 280 * 0.75
        height: locationName.length > 9 ? 120 : 105, // 180 * 0.75
      },
    ],
  ];
};

export default generateCanvasConfig;
