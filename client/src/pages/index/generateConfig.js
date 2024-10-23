import Taro from "@tarojs/taro";

import Dunpai2 from "../../images/dunpai-2.png";
import Icon2Back from "../../images/icon-2-back.png";
import Icon5 from "../../images/icon-5.png";
import Icon6 from "../../images/icon-6.png";
import Shuiyin9 from "../../images/shuiyin-9.png";
import Icon7 from "../../images/icon-7.png";
import Mk2Back from "../../images/mk-2-back.png";
const lineWidth = 0.1;
const strokeStyle = "#5d5d5d";

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
  showHasCheck,
  showTrueCode,
  disableTrueCode,
  shuiyinxiangjiName,
  drawMask,
}) => {
  function generateRandomString(length) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 大写字母
    const numbers = "0123456789"; // 数字
    let result = [];
    // 随机选取10个大写字母
    for (let i = 0; i < 10; i++) {
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
  // shuiyinxiangjiName = "今日水印";
  if ((shuiyinxiangjiName || "").includes("马克")) {
    shuiyinxiangjiName = "马克";
  }

  return [
    [
      {
        path: [
          {
            draw: (ctx, config) => {
              const canvasWidth = canvas.width / dpr;
              const canvasHeight = canvas.height / dpr;
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              Taro.getImageInfo({
                src: Icon5,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    const imgWidth = imgInfo.width;
                    const imgHeight = imgInfo.height;
                    // 绘制图片
                    ctx.drawImage(img, 10, 0, imgWidth / 2.5, imgHeight / 2.5);
                    // 绘制日期和时间
                    // 2!!!!!!!
                    const { year, month, day, weekly, minutes, hours } = config;
                    ctx.font = "26px Arial"; // 文字大小14px
                    ctx.fillStyle = "#2a4360"; // 文字颜色
                    // 计算文本宽度
                    const timeText = `${hours}:${minutes}`;
                    const textWidth = ctx.measureText(timeText).width;

                    // 计算文本的起始位置以实现水平居中
                    const imgXPosition = 10; // 图片的X坐标
                    const imgActualWidth = imgWidth / 2.5; // 图片实际宽度
                    const textXPosition =
                      imgXPosition + (imgActualWidth - textWidth) / 2; // 文本的起始X坐标
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = strokeStyle;
                    // ctx.strokeText(timeText, textXPosition, 56);
                    ctx.fillText(timeText, textXPosition, 58);

                    ctx.font = "13px Arial"; // 文字大小14px
                    const dateString = `${year}-${month}-${day}`;
                    ctx.fillStyle = "#fff"; // 文字颜色白色
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = strokeStyle;
                    ctx.strokeText(dateString, 12, 87);
                    ctx.fillText(dateString, 12, 87);

                    ctx.font = "13px hyqh"; // 文字大小14px
                    const weeklyStr = `${weekly}`;
                    ctx.fillStyle = "#fff"; // 文字颜色白色
                    ctx.fillText(weeklyStr, 95, 87);
                  };
                  img.onerror = (err) => {
                    console.error("Background image loading failed", err);
                  };
                },
                fail: (err) => {
                  console.error("Failed to get background image info", err);
                },
              });

              // 绘制地点
              const { locationName } = config;
              const maxCharsPerLine = 20; // 原来的9 * 0.75
              const lines = [];
              for (let i = 0; i < locationName.length; i += maxCharsPerLine) {
                lines.push(locationName.slice(i, i + maxCharsPerLine));
              }
              ctx.font = "normal 13px hyqh"; // 文字大小14px
              ctx.fillStyle = "#fff"; // 文字颜色白色
              const maxLines = 2;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              lines.slice(0, maxLines).forEach((line, index) => {
                ctx.strokeText(line, 12, 110 + index * (15 * 1.2));
                ctx.fillText(line, 12, 110 + index * (15 * 1.2));
              });
              Taro.getImageInfo({
                src: Icon6,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    const imgWidth = imgInfo.width / 2.8;
                    const imgHeight = imgInfo.height / 2.8;
                    ctx.shadowColor = "none";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
                    ctx.drawImage(img, 12, 140, imgWidth, imgHeight);
                  };
                  img.onerror = (err) => {
                    console.error("Image loading failed", err);
                  };
                },
                fail: (err) => {
                  console.error("Failed to get image information", err);
                },
              });
            },
            args: [
              {
                year,
                month,
                day,
                weekly,
                minutes,
                hours,
                locationName,
              },
            ],
          },

          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              Taro.getImageInfo({
                src: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-16/14931726462345285_shuiyinxiangji.png?sign=8d9e3815f59c6f2dc08d156e7405f6ca&t=1726462345",
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = imgInfo.path;
                  img.onload = () => {
                    const imgWidth = imgInfo.width / 3 + 5;
                    const imgHeight = imgInfo.height / 3 + 5;

                    const canvasWidth = canvas.width / dpr;
                    const canvasHeight = canvas.height / dpr;

                    const x = canvasWidth - imgWidth;
                    const y = canvasHeight - imgHeight + 16;
                    ctx.shadowColor = "none";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
                    ctx.drawImage(img, x, y, imgWidth, imgHeight);
                  };
                  img.onerror = (err) => {
                    console.error("Image loading failed", err);
                  };
                },
                fail: (err) => {
                  console.error("Failed to get image information", err);
                },
              });
            },
            args: [
              {
                fontSize: 12.24,
                color: "rgba(255, 255, 255, 0.8)",
                text: `水印相机`,
                position: [0, 82.4],
              },
            ],
          },
        ],
        img: Shuiyin9,
        height: 180,
        logoY: 0.45,
      },
    ],
    [
      {
        path: [
          {
            draw: (ctx, backgroundConfig) => {
              const { color, rect } = backgroundConfig;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = color;
              ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
              if (disableTrueCode && showHasCheck) {
                // 绘制下标 (移动到左下角)
                ctx.font = "bold 10px hyqh";
                ctx.fillStyle = "#c9cbcd";
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.strokeText(
                  shuiyinxiangjiName +
                    (shuiyinxiangjiName.includes("相机")
                      ? "已验证 | 时间地点真实"
                      : "相机已验证 | 时间地点真实"),
                  26,
                  canvas.height / dpr - 2
                );
                ctx.fillText(
                  shuiyinxiangjiName +
                    (shuiyinxiangjiName.includes("相机")
                      ? "已验证 | 时间地点真实"
                      : "相机已验证 | 时间地点真实"),
                  26,
                  canvas.height / dpr - 2
                );

                // 小盾牌图片 (移动到左下角)
                Taro.getImageInfo({
                  src: Dunpai2,
                  success: (imgInfo) => {
                    const img = canvas.createImage();
                    img.src = "/" + imgInfo.path;
                    img.onload = () => {
                      const imgWidth = imgInfo.width / 3 + 5;
                      const imgHeight = imgInfo.height / 3 + 5;

                      ctx.drawImage(
                        img,
                        9,
                        canvas.height / dpr - imgHeight * 0.65 + 1,
                        imgWidth * 0.65,
                        imgHeight * 0.65
                      );
                    };
                  },
                });
              }

              // 防伪图标
              if (disableTrueCode && showTrueCode) {
                // 如果没有填写水印相机名称 则展示上传图标
                if (!shuiyinxiangjiName) {
                  Taro.getImageInfo({
                    src: Icon7,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = imgInfo.width / 3;
                        const imgHeight = imgInfo.height / 3;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
                        const x = canvasWidth - imgWidth - 20;
                        const y = canvasHeight - imgHeight - 5;
                        ctx.clearRect(x + 40, y + 16, imgWidth, imgHeight);
                        ctx.drawImage(img, x + 10, y, imgWidth, imgHeight);
                      };
                    },
                  });
                } else if (shuiyinxiangjiName === "马克") {
                  // 马克相机
                  Taro.getImageInfo({
                    src: Mk2Back,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = (imgInfo.width / 3) * 0.5;
                        const imgHeight = (imgInfo.height / 3) * 0.5;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
                        const x = canvasWidth - imgWidth;
                        const y = canvasHeight - imgHeight;
                        ctx.drawImage(img, x - 10, y - 10, imgWidth, imgHeight);
                        ctx.font = "bold 12px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = strokeStyle;
                        ctx.fillText("马克", x + 2, y + 2);
                        //  绘制防伪码
                        ctx.font = "7px Monaco";
                        ctx.fillStyle = "#fff";
                        ctx.clearRect(x - 40, y - 10 + imgHeight + 10, 100, 30);
                        ctx.fillText(
                          "防伪 " + generateRandomString(),
                          x - 35,
                          y - 10 + imgHeight + 8
                        );
                      };
                    },
                  });
                } else {
                  // 今日水印
                  Taro.getImageInfo({
                    src: Icon2Back,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = imgInfo.width / 3 + 5;
                        const imgHeight = imgInfo.height / 3 + 5;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
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
                        // 绘制水印名字
                        ctx.font = "bold 11px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = strokeStyle;
                        ctx.fillText(shuiyinxiangjiName, x + 57, y + 25);
                        //  绘制防伪码
                        ctx.font = "6px Monaco";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(generateRandomString(), x + 55, y + 47);
                      };
                    },
                  });
                }
              }
            },
            args: [
              {
                color: "rgba(0, 0, 0, 0)",
                rect: [12, 2, 224, 82], // Adjusted from [20-5, 0+3, 280.5, 102]
              },
            ],
          },
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `${fontSize}px Arial`;
              ctx.fillStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.strokeText(text, position[0], position[1]);
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 23, // Adjusted from 25
                color: "white",
                text: `${hours}:${minutes}`,
                position: [10, 30], // Adjusted from [20-5, 34+3]
              },
            ],
          },
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `bold ${fontSize}px hyqh`;
              ctx.fillStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.strokeText(text, position[0], position[1]);
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 12, // Adjusted from 14
                color: "white",
                text: `${year}年${month}月${day}日`,
                position: [80, 17], // Adjusted from [102-5, 19+3]
              },
            ],
          },
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `bold ${fontSize}px hyqh`;
              ctx.fillStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.strokeText(text, position[0], position[1]);
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 12, // Adjusted from 14
                color: "white",
                text: `${weekly} ${weather || "刷新重试"}℃`,
                position: [80, 36], // Adjusted from [102-5, 42+3]
              },
            ],
          },
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;

              const maxLength = 25;
              const firstLine = text.slice(0, maxLength);
              const secondLine =
                text.length > maxLength ? text.slice(maxLength) : "";
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.fillText(firstLine, position[0], position[1]);

              if (secondLine) {
                ctx.fillText(secondLine, position[0], position[1] + 15);
                ctx.fillText(
                  hideJw
                    ? "经纬度: " +
                        ((latitude * 1)?.toFixed(5) +
                          ", " +
                          (longitude * 1)?.toFixed(5))
                    : "",
                  position[0],
                  86
                );
              } else {
                ctx.fillText(
                  hideJw
                    ? "经纬度: " +
                        ((latitude * 1)?.toFixed(5) +
                          ", " +
                          (longitude * 1)?.toFixed(5))
                    : "",
                  position[0],
                  72
                );
              }
            },
            args: [
              {
                fontSize: 12, // Adjusted from 13.6
                color: "white",
                text: locationName,
                position: [12, 55], // Adjusted from [20-5, 66+3]
              },
            ],
          },
          {
            draw: (ctx, lineConfig) => {
              const { lineWidth, color, start, end } = lineConfig;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(start[0], start[1]);
              ctx.lineTo(end[0], end[1]);
              ctx.stroke();
            },
            args: [
              {
                lineWidth: 2,
                color: "#fec52e",
                start: [74, 6], // Adjusted from [94-5, 5+3]
                end: [74, 38], // Adjusted from [94-5, 44+3]
              },
            ],
          },
        ],
        img: Shuiyin1,
        right: true,
        left: true,
        logoY: 0.6,
        jingweidu: true,
        weather: true,
        name: "免费-时间天气-1",
        height: locationName.length > 16 ? 105 : 95, // Adjusted from 120 and 110
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
              ctx.strokeStyle = "#5d5d5d";
              ctx.lineWidth = 0.38;

              const radius = 4.33;
              ctx.beginPath();
              ctx.moveTo(8.67 + radius, 0);
              ctx.lineTo(8.67 + width - radius, 0);
              ctx.arcTo(8.67 + width, 0, 8.67 + width, radius, radius);
              ctx.lineTo(8.67 + width, height - radius);
              ctx.arcTo(
                8.67 + width,
                height,
                8.67 + width - radius,
                height,
                radius
              );
              ctx.lineTo(8.67 + radius, height);
              ctx.arcTo(8.67, height, 8.67, height - radius, radius);
              ctx.lineTo(8.67, radius);
              ctx.arcTo(8.67, 0, 8.67 + radius, 0, radius);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = "#fec52e";
              ctx.fillRect(11.27, 2.6, 43.35, 28.61);

              ctx.fillStyle = "black";
              ctx.font = "18px MiSans";
              ctx.fillText("打卡", 15, 23.46);
            },
            args: [
              {
                width: 130,
                height: 34.67,
                color: "white",
              },
            ],
          },
          {
            draw: (ctx, textConfig) => {
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `${fontSize}px makeNumber`;
              ctx.fillStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 28,
                color: "#1895e6",
                text: `${hours}:${minutes}`,
                position: [70, 27],
              },
            ],
          },
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;
              const maxLines = 3;
              const charsPerLine = 20;
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
              const lineHeight = 17;
              const locationLines = getLocationLines(locationName);
              let y = 57;
              let remainingText = locationName;
              for (let i = 0; i < locationLines; i++) {
                const line = remainingText.substring(0, charsPerLine);
                ctx.fillText(line, 22, y);
                remainingText = remainingText.substring(charsPerLine);
                y += lineHeight;
              }

              // 绘制日期
              const dateY = y;

              ctx.fillText(`${weekly}`, 135, dateY + 5);
              ctx.font = "14px Arial";
              ctx.fillText(`${year}年${month}月${day}日 `, 22, dateY + 5);
              // 绘制黄线（不包含经纬度部分）
              ctx.lineWidth = 3; // 2.55 * 0.8
              ctx.strokeStyle = "#f6c334";
              ctx.beginPath();
              ctx.moveTo(13, 45); // 11.9 * 0.8, 52.5 * 0.8
              ctx.lineTo(13, dateY + 5);
              ctx.stroke();
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: locationName,
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              let y = canvas.height / 3 - 10;
              position = [10, y];
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.strokeStyle = strokeStyle;
              ctx.strokeText(text, ...position);
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 14,
                color: "white",
                text: hideJw
                  ? "经纬度: " +
                    ((latitude * 1)?.toFixed(5) +
                      ", " +
                      (longitude * 1)?.toFixed(5))
                  : "",
              },
            ],
          },
        ],
        img: Shuiyin2,
        logoY: 0.6,
        name: "免费-打卡-2",
        jingweidu: true,
        height: () => {
          let height = 110;
          if (locationName.length >= 20 && locationName.length <= 40) {
            height = height + 15;
          } else if (locationName.length > 40) {
            height = height + 35;
          }
          return height;
        },
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
              const radius = 7.5; // 原来的10 * 0.75 圆角半径
              ctx.beginPath();
              ctx.moveTo(radius + 7.5, 3.75); // 10 * 0.75, 5 * 0.75
              ctx.lineTo(width - radius + 7.5, 3.75);
              ctx.arcTo(width + 7.5, 3.75, width + 7.5, radius + 3.75, radius);
              ctx.lineTo(width + 7.5, height - radius + 3.75);
              ctx.arcTo(
                width + 7.5,
                height + 3.75,
                width - radius + 7.5,
                height + 3.75,
                radius
              );
              ctx.lineTo(radius + 7.5, height + 3.75);
              ctx.arcTo(
                7.5,
                height + 3.75,
                7.5,
                height - radius + 3.75,
                radius
              );
              ctx.lineTo(7.5, radius + 3.75);
              ctx.arcTo(7.5, 3.75, radius + 7.5, 3.75, radius);
              ctx.closePath();
              ctx.fill();
              // 绘制顶部带圆角的蓝色背景
              ctx.fillStyle = "rgba(31,114,251,.8)";
              ctx.beginPath();
              ctx.moveTo(radius + 7.5, 3.75);
              ctx.lineTo(width - radius + 7.5, 3.75);
              ctx.arcTo(width + 7.5, 3.75, width + 7.5, radius + 3.75, radius);
              ctx.lineTo(width + 7.5, 26.25); // 原来的35 * 0.75
              ctx.lineTo(7.5, 26.25); // 原来的35 * 0.75
              ctx.lineTo(7.5, radius + 3.75);
              ctx.arcTo(7.5, 3.75, radius + 7.5, 3.75, radius);
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景上绘制黄色小圆点
              ctx.fillStyle = "rgb(246, 196, 44)";
              const centerX = 18.75; // 原来的25 * 0.75
              const centerY = 15; // 原来的20 * 0.75
              ctx.beginPath();
              ctx.arc(centerX, centerY, 3, 0, Math.PI * 2); // 4 * 0.75
              ctx.closePath();
              ctx.fill();

              // 在蓝色背景中居中显示文字
              ctx.fillStyle = "white";
              ctx.font = "bold 11.25px hyqh"; // 原来的15 * 0.75
              const textWidth = ctx.measureText(text).width;
              const textX = (width - textWidth + 5.625) / 2 + 7.5; // 10 * 0.75 + 15 - 5 * 0.75
              const textY = 20.0625; // 原来的210 * 0.75
              ctx.fillText(text, textX, textY);
            },
            args: [
              {
                width: 142.5, // 原来的190 * 0.75
                height: () => {
                  const baseHeight = 75; // 原来的100 * 0.75
                  const lineHeight = 15; // 原来的20 * 0.75
                  const maxLines = 3;
                  const charsPerLine = 9; // 原来的9 * 0.75

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
                  let height = baseHeight + (lines - 1) * lineHeight;
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
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 10.125, // 原来的13.5 * 0.75
                color: "#000",
                text: `时   间: ${year}.${month}.${day}  ${hours}:${minutes}`,
                position: [15.9375, 40.3125], // 原来的21.25 * 0.75, 53.75 * 0.75
              },
            ],
          },
          // 天气
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
              // 防伪图标
              if (disableTrueCode && showTrueCode) {
                // 如果没有填写水印相机名称 则展示上传图标
                if (!shuiyinxiangjiName) {
                  Taro.getImageInfo({
                    src: Icon7,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = imgInfo.width / 3;
                        const imgHeight = imgInfo.height / 3;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
                        const x = canvasWidth - imgWidth - 20;
                        const y = canvasHeight - imgHeight - 5;
                        ctx.clearRect(x + 40, y + 16, imgWidth, imgHeight);
                        ctx.drawImage(img, x + 10, y, imgWidth, imgHeight);
                      };
                    },
                  });
                } else if (shuiyinxiangjiName === "马克") {
                  // 马克相机
                  Taro.getImageInfo({
                    src: Mk2Back,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = (imgInfo.width / 3) * 0.5;
                        const imgHeight = (imgInfo.height / 3) * 0.5;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
                        const x = canvasWidth - imgWidth;
                        const y = canvasHeight - imgHeight;
                        ctx.drawImage(img, x - 10, y - 10, imgWidth, imgHeight);
                        ctx.font = "bold 11px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.fillText("马克", x + 5, y + 2);
                        //  绘制防伪码
                        ctx.font = "bold 7px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.clearRect(x - 40, y - 10 + imgHeight + 10, 100, 30);
                        ctx.fillText(
                          "防伪 " + generateRandomString(),
                          x - 35,
                          y - 10 + imgHeight + 8
                        );
                      };
                    },
                  });
                } else {
                  // 今日水印
                  Taro.getImageInfo({
                    src: Icon2Back,
                    success: (imgInfo) => {
                      const img = canvas.createImage();
                      img.src = "/" + imgInfo.path;
                      img.onload = () => {
                        const imgWidth = imgInfo.width / 3 + 5;
                        const imgHeight = imgInfo.height / 3 + 5;
                        const canvasWidth = canvas.width / dpr;
                        const canvasHeight = canvas.height / dpr;
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
                        // 绘制水印名字
                        ctx.font = "bold 11px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(shuiyinxiangjiName, x + 57, y + 25);
                        //  绘制防伪码
                        ctx.font = "bold 6px hyqh";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(generateRandomString(), x + 55, y + 47);
                      };
                    },
                  });
                }
              }
            },
            args: [
              {
                fontSize: 10.125, // 原来的13.5 * 0.75
                color: "#000",
                text: "天   气: " + (weather ? weather + "℃" : "刷新重试"),
                position: [15.9375, 54.375], // 原来的21.25 * 0.75, 72.5 * 0.75
              },
            ],
          },

          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px hyqh`;
              ctx.fillStyle = color;

              const maxCharsPerLine = 9; // 原来的9 * 0.75
              const lines = [];
              for (let i = 0; i < text.length; i += maxCharsPerLine) {
                lines.push(text.slice(i, i + maxCharsPerLine));
              }

              const maxLines = 4;
              lines.slice(0, maxLines).forEach((line, index) => {
                ctx.fillText(
                  index === 0 ? "地   点: " + line : line,
                  position[0] + (index === 0 ? 0 : 35.25), // 原来的47 * 0.75
                  position[1] + index * (fontSize * 1.2)
                );
              });
            },
            args: [
              {
                fontSize: 10.125, // 原来的13.5 * 0.75
                color: "#000",
                text: locationName,
                position: [15.9375, 68.4375], // 原来的21.25 * 0.75, 91.25 * 0.75
              },
            ],
          },
        ],
        img: Shuiyin3,
        logoY: 0.6,
        title: true,
        weather: true,
        right: true,
        name: "免费-工程记录-3",
        width: 168.75, // 原来的225 * 0.75
        height: () => {
          const baseHeight = 82.5; // 原来的110 * 0.75
          const lineHeight = 15; // 原来的20 * 0.75
          const maxLines = 3;
          const charsPerLine = 9; // 原来的9 * 0.75

          const getLocationLines = () => {
            const words = locationName.split("");
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

          const lines = getLocationLines();
          let height = baseHeight + (lines - 1) * lineHeight;
          return height;
        },
      },
    ],
  ];
};

export default generateCanvasConfig;
