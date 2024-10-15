import Taro from "@tarojs/taro";
import Mk1 from "../../images/mk-1.png";
import Dunpai from "../../images/dunpai.png";
import Dunpai2 from "../../images/dunpai-2.png";
import Icon2Back from "../../images/icon-2-back.png";
import Icon5 from "../../images/icon-5.png";
import Icon6 from "../../images/icon-6.png";
import Shuiyin8 from "../../images/shuiyin-8.png";
import Shuiyin9 from "../../images/shuiyin-9.png";
import Icon7 from "../../images/icon-7.png";
import Mk2 from "../../images/mk-2.png";
import Mk2Back from "../../images/mk-2-back.png";

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
    // 马克
    // 马克
    // 马克
    // 马克
    // 马克
    // 马克
    // 马克
    [
      {
        path: [
          {
            draw: (ctx, rectConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              const { width } = rectConfig;
              const lineHeight = 21.25 * 0.8;
              const maxLines = 2;
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

              const locationLines = getLocationLines(locationName);
              Taro.getImageInfo({
                src: Mk1,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    ctx.drawImage(
                      img,
                      10,
                      0,
                      img.width / 2.8,
                      img.height / 2.8
                    );
                    // 绘制时间（调整大小为原来的0.7倍）
                    ctx.font = "bold 16px fzlt"; // 24 * 0.7
                    ctx.fillStyle = "#21c3a2";
                    ctx.fillText(`${hours}:${minutes}`, 71, 22);
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 18px fzlt"; // 24 * 0.7
                    // 绘制日期
                    ctx.fillText(
                      `${year}/${month}/${day} ${weekly}`,
                      10,
                      img.height / 2.8 + 22
                    );
                    if (disableTrueCode && showHasCheck) {
                      // 绘制下标 (移动到左下角)
                      ctx.font = "bold 10px fzlt";
                      ctx.fillStyle = "#c9cbcd";
                      ctx.fillText(
                        shuiyinxiangjiName +
                        (shuiyinxiangjiName.includes('相机') ? '已验证照片真实性' : '相机已验证照片真实性'),
                        26,
                        canvas.height / dpr - 2
                      );
                      // 小盾牌图片 (移动到左下角)
                      Taro.getImageInfo({
                        src: Dunpai,
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

                    if (disableTrueCode && showTrueCode) {
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
                                ctx.clearRect(
                                  x + 40,
                                  y + 16,
                                  imgWidth,
                                  imgHeight
                                );
                                ctx.drawImage(
                                  img,
                                  x + 10,
                                  y,
                                  imgWidth,
                                  imgHeight
                                );
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
                                ctx.drawImage(
                                  img,
                                  x - 10,
                                  y - 10,
                                  imgWidth,
                                  imgHeight
                                );
                                ctx.font = "bold 11px NotoSansMono";
                                ctx.fillStyle = "#fff";
                                ctx.fillText("马克", x + 5, y + 2);
                                //  绘制防伪码
                                ctx.font = "bold 7px NotoSansMono";
                                ctx.fillStyle = "#fff";
                                ctx.clearRect(
                                  x - 40,
                                  y - 10 + imgHeight + 10,
                                  100,
                                  30
                                );
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
                                ctx.clearRect(
                                  x + 40,
                                  y + 16,
                                  imgWidth,
                                  imgHeight
                                );
                                ctx.drawImage(
                                  img,
                                  x + 40,
                                  y + 16,
                                  imgWidth * 0.7,
                                  imgHeight * 0.7
                                );
                                // 绘制水印名字
                                ctx.font = "bold 11px NotoSansMono";
                                ctx.fillStyle = "#fff";
                                ctx.fillText(
                                  shuiyinxiangjiName,
                                  x + 57,
                                  y + 25
                                );
                                //  绘制防伪码
                                ctx.font = "bold 6px NotoSansMono";
                                ctx.fillStyle = "#fff";
                                ctx.fillText(
                                  generateRandomString(),
                                  x + 55,
                                  y + 47
                                );
                              };
                            },
                          });
                        }
                      }
                    }
                  };
                  img.onerror = (err) => {
                    console.error("Background image loading failed", err);
                  };
                },
                fail: (err) => {
                  console.error("Failed to get background image info", err);
                },
              });
            },
            args: [
              {
                width: 120, // 127.5 * 0.8
              },
            ],
          },
          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;

              const maxCharsPerLine = 20;
              const lines = [];
              for (let i = 0; i < text.length; i += maxCharsPerLine) {
                lines.push(text.slice(i, i + maxCharsPerLine));
              }

              const maxLines = 2;
              const circleRadius = 4; // 白色圆点的半径
              const circleOffset = 10; // 圆点和文字之间的距离

              lines.slice(0, maxLines).forEach((line, index) => {
                if (index === 0) {
                  // 保存当前的填充样式
                  const currentFillStyle = ctx.fillStyle;

                  // 绘制白色圆点
                  ctx.beginPath();
                  ctx.arc(
                    position[0] + circleRadius,
                    69, // 调整圆点的垂直位置
                    circleRadius,
                    0,
                    2 * Math.PI
                  );
                  ctx.fillStyle = "white";
                  ctx.fill();

                  // 恢复原来的填充样式用于文字
                  ctx.fillStyle = currentFillStyle;
                }

                ctx.font = "bold 14px NotoSansMono";
                ctx.fillText(
                  line,
                  position[0] +
                    (index === 0
                      ? circleRadius * 2 + circleOffset
                      : circleRadius * 2 + circleOffset),
                  position[1] + index * (fontSize * 1.2) + fontSize / 2 // 调整垂直位置
                );
              });
            },
            args: [
              {
                fontSize: 14, // 原来的13.5 * 0.75
                color: "#fff",
                text: locationName,
                position: [20, 67], // 原来的21.25 * 0.75, 91.25 * 0.75
              },
            ],
          },
        ],
        img: Shuiyin8,
        width: 204, // 255 * 0.8
        name: "定制-今日水印相机-打卡",
        left: true,
        right: true,
        logoY: 0.6,
        height: () => {
          return 110;
        },
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
                ctx.font = "bold 10px fzlt";
                ctx.fillStyle = "#c9cbcd";
                ctx.fillText(
                  shuiyinxiangjiName +
                  (shuiyinxiangjiName.includes('相机') ? '已验证 | 时间地点真实' : '相机已验证 | 时间地点真实'),
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
                        ctx.font = "bold 11px NotoSansMono";
                        ctx.fillStyle = "#fff";
                        ctx.fillText("马克", x + 5, y + 2);
                        //  绘制防伪码
                        ctx.font = "bold 7px NotoSansMono";
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
                        ctx.font = "bold 11px NotoSansMono";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(shuiyinxiangjiName, x + 57, y + 25);
                        //  绘制防伪码
                        ctx.font = "bold 6px NotoSansMono";
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
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 20, // Adjusted from 25
                color: "white",
                text: `${hours}:${minutes}`,
                position: [12, 30], // Adjusted from [20-5, 34+3]
              },
            ],
          },
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 11, // Adjusted from 14
                color: "white",
                text: `${year}年${month}月${day}日`,
                position: [78, 18], // Adjusted from [102-5, 19+3]
              },
            ],
          },
          {
            draw: (ctx, weatherConfig) => {
              const { fontSize, color, text, position } = weatherConfig;
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, position[0], position[1]);
            },
            args: [
              {
                fontSize: 11, // Adjusted from 14
                color: "white",
                text: `${weekly} ${weather || "刷新重试"}℃`,
                position: [78, 36], // Adjusted from [102-5, 42+3]
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

              ctx.fillText(firstLine, position[0], position[1]);
              if (secondLine) {
                ctx.fillText(secondLine, position[0], position[1] + 15); // Adjusted from +19
              }
            },
            args: [
              {
                fontSize: 11, // Adjusted from 13.6
                color: "white",
                text: locationName,
                position: [12, 55], // Adjusted from [20-5, 66+3]
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 15]; // Adjusted from +19
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 11, // Adjusted from 13.6
                color: "white",
                text: hideJw
                  ? "经纬度: " +
                    ((latitude * 1)?.toFixed(5) +
                      ", " +
                      (longitude * 1)?.toFixed(5))
                  : "",
                position: [12, 72], // Adjusted from [20-5, 87+3]
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
                start: [71, 6], // Adjusted from [94-5, 5+3]
                end: [71, 38], // Adjusted from [94-5, 44+3]
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

              const radius = 3.4; // Adjusted from 4.25
              ctx.beginPath();
              ctx.moveTo(6.8 + radius, 0);
              ctx.lineTo(6.8 + width - radius, 0);
              ctx.arcTo(6.8 + width, 0, 6.8 + width, radius, radius);
              ctx.lineTo(6.8 + width, height - radius);
              ctx.arcTo(
                6.8 + width,
                height,
                6.8 + width - radius,
                height,
                radius
              );
              ctx.lineTo(6.8 + radius, height);
              ctx.arcTo(6.8, height, 6.8, height - radius, radius);
              ctx.lineTo(6.8, radius);
              ctx.arcTo(6.8, 0, 6.8 + radius, 0, radius);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = "#fec52e";
              ctx.fillRect(8.84, 2.04, 34, 22.44);

              ctx.fillStyle = "black";
              ctx.font = "bold 12.24px fzlt"; // Adjusted from 15.3px
              ctx.fillText("打卡", 13.6, 18.4); // Adjusted from (17, 23)
            },
            args: [
              {
                width: 102, // Adjusted from 127.5
                height: 27.2, // Adjusted from 34
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
                fontSize: 17.6, // Adjusted from 22
                color: "#1895e6",
                text: `${hours}:${minutes}`,
                position: [52, 20], // Adjusted from [65, 25]
              },
            ],
          },
          {
            draw: (ctx, config) => {
              let { fontSize, color, text, position } = config;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 13.6]; // Adjusted from 17
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 10.88, // Adjusted from 13.6
                color: "white",
                text: `${year}年${month}月${day}日 ${weekly}`,
                position: [14.96, 62.56], // Adjusted from [18.7, 78.2]
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
                ctx.fillText(secondLine, position[0], position[1] + 16); // Adjusted from 20
              }
            },
            args: [
              {
                fontSize: 10.88, // Adjusted from 13.6
                color: "white",
                text: locationName,
                position: [14.96, 44.2], // Adjusted from [18.7, 55.25]
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1] + 18.36]; // Adjusted from 22.95
              }
              ctx.font = `bold ${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 10.88, // Adjusted from 13.6
                color: "white",
                text: hideJw
                  ? "经纬度: " +
                    ((latitude * 1)?.toFixed(5) +
                      ", " +
                      (longitude * 1)?.toFixed(5))
                  : "",
                position: [6.8, 80], // Adjusted from [8.5, 100]
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
                end = [end[0], end[1] + 13.6]; // Adjusted from 17
              }
              ctx.lineTo(...end);
              ctx.stroke();
            },
            args: [
              {
                lineWidth: 2.04, // Adjusted from 2.55
                color: "#fec52e",
                start: [9.52, 34], // Adjusted from [11.9, 42.5]
                end: [9.52, 64.6], // Adjusted from [11.9, 80.75]
              },
            ],
          },
        ],
        img: Shuiyin2,
        width: 204, // Adjusted from 255
        logoY: 0.6,
        name: "免费-打卡-2",
        jingweidu: true,
        height: locationName.length > 16 ? 104 : 88, // Adjusted from 130 and 110
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
              ctx.font = "bold 11.25px fzlt"; // 原来的15 * 0.75
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
              ctx.font = `${fontSize}px fzlt`;
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
              ctx.font = `${fontSize}px fzlt`;
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
                        ctx.font = "bold 11px NotoSansMono";
                        ctx.fillStyle = "#fff";
                        ctx.fillText("马克", x + 5, y + 2);
                        //  绘制防伪码
                        ctx.font = "bold 7px NotoSansMono";
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
                        ctx.font = "bold 11px NotoSansMono";
                        ctx.fillStyle = "#fff";
                        ctx.fillText(shuiyinxiangjiName, x + 57, y + 25);
                        //  绘制防伪码
                        ctx.font = "bold 6px NotoSansMono";
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
              ctx.font = `${fontSize}px fzlt`;
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
        height: (locationName) => {
          const baseHeight = 82.5; // 原来的110 * 0.75
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
      },
    ],
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
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
                    const { year, month, day, weekly, minutes, hours } = config;
                    ctx.font = "bold 24px fzlt"; // 文字大小14px
                    ctx.fillStyle = "#2a4360"; // 文字颜色
                    // 计算文本宽度
                    const timeText = `${hours}:${minutes}`;
                    const textWidth = ctx.measureText(timeText).width;

                    // 计算文本的起始位置以实现水平居中
                    const imgXPosition = 10; // 图片的X坐标
                    const imgActualWidth = imgWidth / 2.5; // 图片实际宽度
                    const textXPosition =
                      imgXPosition + (imgActualWidth - textWidth) / 2; // 文本的起始X坐标

                    // 在计算出的X坐标处绘制时间文本
                    ctx.fillText(timeText, textXPosition, 56);

                    ctx.font = "normal 14px fzlt"; // 文字大小14px
                    const dateString = `${year}-${month}-${day} ${weekly}`;
                    ctx.fillStyle = "#fff"; // 文字颜色白色
                    ctx.fillText(dateString, 12, 87);
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
              ctx.font = "normal 14px fzlt"; // 文字大小14px
              ctx.fillStyle = "#fff"; // 文字颜色白色
              const maxLines = 2;
              lines.slice(0, maxLines).forEach((line, index) => {
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
  ];
};

export default generateCanvasConfig;
