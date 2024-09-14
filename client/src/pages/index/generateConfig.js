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
  title,
  canvas,
  dpr,
  Shuiyin1,
  Shuiyin2,
  Shuiyin3,
  showTrueCode,
  disableTrueCode,
}) => {
  function generateRandomString() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 大写字母
    const numbers = "0123456789"; // 数字
    let result = [];
    // 随机选取10个大写字母
    for (let i = 0; i < 11; i++) {
      const randomLetter = letters.charAt(
        Math.floor(Math.random() * letters.length)
      );
      result.push(randomLetter);
    }

    // 随机选取4个数字
    for (let i = 0; i < 4; i++) {
      const randomNumber = numbers.charAt(
        Math.floor(Math.random() * numbers.length)
      );
      result.push(randomNumber);
    }

    // 将字母和数字随机打乱顺序
    result = result.sort(() => Math.random() - 0.5);

    // 确保第一个字符是字母
    while (numbers.includes(result[0])) {
      result = result.sort(() => Math.random() - 0.5); // 重新打乱顺序，直到字母在开头
    }

    // 返回字符串
    return result.join("");
  }

  return [
    [
      {
        path: [
          {
            draw: (ctx, backgroundConfig) => {
              const { color, rect } = backgroundConfig;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = color;
              ctx.fillRect(rect[0] - 5, rect[1] + 3, rect[2], rect[3]);
              if (disableTrueCode && showTrueCode) {
                // 防伪图标
                Taro.getImageInfo({
                  src: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-10/17411725974764701_1.png?sign=4777daa729f670031bf698914738576e&t=1725974766",
                  success: (imgInfo) => {
                    const img = canvas.createImage();
                    img.src = imgInfo.path;
                    img.onload = () => {
                      const imgWidth = imgInfo.width / 3 + 5;
                      const imgHeight = imgInfo.height / 3 + 5;

                      // 获取画布的宽高
                      const canvasWidth = canvas.width / dpr;
                      const canvasHeight = canvas.height / dpr;

                      // 计算图片绘制的坐标，使其位于右下角
                      const x = canvasWidth - imgWidth - 20;
                      const y = canvasHeight - imgHeight - 5;
                      ctx.clearRect(x + 40, y + 16, imgWidth, imgHeight);

                      ctx.drawImage(
                        img,
                        x + 40,
                        y + 16,
                        imgWidth * 0.7,
                        imgHeight * 0.7
                      );
                      //  绘制时间
                      ctx.font = "bold 6px NotoSansMono"; // 加粗并放大时间文字
                      ctx.fillStyle = "#fff";
                      ctx.fillText(generateRandomString(), x + 56, y + 47);
                    };
                    img.onerror = (err) => {
                      console.error("Background image loading failed", err);
                    };
                  },
                  fail: (err) => {
                    console.error("Failed to get background image info", err);
                  },
                });
              }
            },
            args: [
              {
                color: "rgba(0, 0, 0, 0)",
                rect: [20 - 5, 0 + 3, 280.5, 102], // Adjusted position
              },
            ],
          },
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0] - 5, position[1] + 3);
            },
            args: [
              {
                fontSize: 25,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [20 - 5, 34 + 3], // Adjusted position
              },
            ],
          },
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0] - 5, position[1] + 3);
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: `${year}年${month}月${day}日`,
                position: [102 - 5, 19 + 3], // Adjusted position
              },
            ],
          },
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0] - 5, position[1] + 3);
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: `${weekly} ${weather || "刷新重试"}℃`,
                position: [102 - 5, 42 + 3], // Adjusted position
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

              ctx.fillText(firstLine, position[0] - 5, position[1] + 3);
              if (secondLine) {
                ctx.fillText(secondLine, position[0] - 5, position[1] + 19 + 3);
              }
            },
            args: [
              {
                fontSize: 13.6,
                color: "white",
                text: locationName,
                position: [20 - 5, 66 + 3], // Adjusted position
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0] - 5, position[1] + 19 + 3];
              } else {
                position = [position[0] - 5, position[1] + 3];
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
                position: [20 - 5, 87 + 3], // Adjusted position
              },
            ],
          },
          {
            draw: (ctx, lineConfig) => {
              const { lineWidth, color, start, end } = lineConfig;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(start[0] - 5, start[1] + 3);
              ctx.lineTo(end[0] - 5, end[1] + 3);
              ctx.stroke();
            },
            args: [
              {
                lineWidth: 2.5,
                color: "#fec52e",
                start: [94 - 5, 5 + 3], // Adjusted position
                end: [94 - 5, 44 + 3], // Adjusted position
              },
            ],
          },
        ],
        img: Shuiyin1,
        right: true,
        logoY: 0.65,

        name: "免费-时间天气-1",
        height: locationName.length > 16 ? 120 : 110,
      },
    ],

    [
      {
        path: [
          {
            draw: (ctx, rectConfig) => {
              const { width, height, color } = rectConfig;
              ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                ctx.fillText(secondLine, position[0], position[1] + 20);
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
        // vip: true,
        logoY: 0.6,

        name: "免费-打卡-2",
        height: locationName.length > 16 ? 130 : 110,
      },
    ],
    [
      {
        path: [
          // 背景
          {
            draw: (ctx, rectConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              const { width, color, text } = rectConfig;
              const height = rectConfig.height();
              // 设置矩形的颜色
              ctx.fillStyle = color;
              // 绘制一个带7.5px圆角的指定宽高和颜色的矩形
              const radius = 7.5; // 10 * 0.75 圆角半径
              ctx.beginPath();
              ctx.moveTo(radius + 10, 5);
              ctx.lineTo(width - radius + 10, 5);
              ctx.arcTo(width + 10, 5, width + 10, radius + 5, radius);
              ctx.lineTo(width + 10, height - radius + 5);
              ctx.arcTo(
                width + 10,
                height + 5,
                width - radius + 10,
                height + 5,
                radius
              );
              ctx.lineTo(radius + 10, height + 5);
              ctx.arcTo(10, height + 5, 10, height - radius + 5, radius);
              ctx.lineTo(10, radius + 5);
              ctx.arcTo(10, 5, radius + 10, 5, radius);
              ctx.closePath();
              ctx.fill();
              // 绘制顶部带圆角的蓝色背景
              ctx.fillStyle = "rgb(10, 55, 132)";
              ctx.beginPath();
              ctx.moveTo(radius + 10, 5);
              ctx.lineTo(width - radius + 10, 5);
              ctx.arcTo(width + 10, 5, width + 10, radius + 5, radius);
              ctx.lineTo(width + 10, 35); // 40 * 0.75 + 5
              ctx.lineTo(10, 35); // 40 * 0.75 + 5
              ctx.lineTo(10, radius + 5);
              ctx.arcTo(10, 5, radius + 10, 5, radius);
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景上绘制黄色小圆点
              ctx.fillStyle = "rgb(246, 196, 44)";
              const centerX = 25; // 20 * 0.75 + 15 - 5
              const centerY = 20; // 20 * 0.75 + 5
              ctx.beginPath();
              ctx.arc(centerX, centerY, 3, 0, Math.PI * 2); // 4 * 0.75
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景中居中显示文字
              ctx.fillStyle = "white";
              ctx.font = "bold 15px fzlt";
              const textWidth = ctx.measureText(text).width;
              const textX = (width - textWidth + 7.5) / 2 + 10; // 10 * 0.75 + 15 - 5
              const textY = 26.75; // 29 * 0.75 + 5
              ctx.fillText(text, textX, textY);
            },
            args: [
              {
                width: 190, // 250 * 0.75
                height: () => {
                  const baseHeight = 100; // 减小20px
                  const lineHeight = 20;
                  const maxLines = 3;
                  const charsPerLine = 15;

                  const getLocationLines = (text) => {
                    const words = text.split("");
                    let lines = 1;
                    let currentLineLength = 0;
                    for (const word of words) {
                      if (currentLineLength + 1 > charsPerLine) {
                        lines++;
                        currentLineLength = 1;
                      } else {
                        currentLineLength++;
                      }
                      if (lines === maxLines) break;
                    }
                    return lines;
                  };

                  const lines = getLocationLines(locationName);
                  let height = baseHeight + (lines - 1) * lineHeight + 5;
                  return height;
                },
                color: "rgba(121, 121, 122, .8)",
                text: title, // 替换为需要显示的文字
              },
            ],
          },
          // 时间
          {
            draw: (ctx, config) => {
              let { fontSize, color, text, position } = config;
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.5, // 18 * 0.75
                color: "#000",
                text: `时   间: ${year}.${month}.${day}  ${hours}:${minutes}`,
                position: [21.25, 53.75], // 15 * 0.75 + 15 - 5, 65 * 0.75 + 5
              },
            ],
          },
          // 天气
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 13.5, // 18 * 0.75
                color: "#000",
                text: "天   气: " + (weather ? weather + "℃" : "刷新重试"),
                position: [21.25, 72.5], // 15 * 0.75 + 15 - 5, 90 * 0.75 + 5
              },
            ],
          },
          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;

              const maxCharsPerLine = 9;
              const lines = [];
              for (let i = 0; i < text.length; i += maxCharsPerLine) {
                lines.push(text.slice(i, i + maxCharsPerLine));
              }

              const maxLines = 4;
              lines.slice(0, maxLines).forEach((line, index) => {
                ctx.fillText(
                  index === 0 ? "地   点: " + line : line,
                  position[0] + (index === 0 ? 0 : 52), // 65 * 0.75
                  position[1] + index * (fontSize * 1.2)
                );
              });
            },
            args: [
              {
                fontSize: 13.5,
                color: "#000",
                text: locationName,
                position: [21.25, 91.25], // 11.25 + 15 - 5, 86.25 + 5
              },
            ],
          },
        ],
        img: Shuiyin3,
        vip: true,
        logoY: 0.6,

        name: "免费-工程记录-3",
        width: 225, // 280 * 0.75 + 15 - 5
        height: (locationName) => {
          const baseHeight = 115; // 110 + 5
          const lineHeight = 20;
          const maxLines = 3;
          const charsPerLine = 15;

          const getLocationLines = (text) => {
            const words = text.split("");
            let lines = 1;
            let currentLineLength = 0;
            for (const word of words) {
              if (currentLineLength + 1 > charsPerLine) {
                lines++;
                currentLineLength = 1;
              } else {
                currentLineLength++;
              }
              if (lines === maxLines) break;
            }
            return lines;
          };

          const lines = getLocationLines(locationName);
          let height = baseHeight + (lines - 1) * lineHeight + 5;
          return height;
        },
      },
    ],
  ];
};

export default generateCanvasConfig;
