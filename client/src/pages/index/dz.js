import Taro from "@tarojs/taro";
import Shuiyin7 from "../../images/shuiyin-7.png";
import Dunpai2 from "../../images/dunpai-2.png";
import Icon2Back from "../../images/icon-2-back.png";
import Icon1 from "../../images/icon-1.png";
import Icon3 from "../../images/icon-3.png";
import Icon4 from "../../images/icon-4.png";
import Icon7 from "../../images/icon-7.png";
import Mk2 from "../../images/mk-2.png";
import Mk2Back from "../../images/mk-2-back.png";
const lineWidth = 0.3;
const strokeStyle = "#5d5d5d"; // 描边颜色可以设置为黑色或你想要的颜色

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
  Shuiyin5,
  Shuiyin6,
  canvas,
  showHasCheck,
  showTrueCode,
  disableTrueCode,
  shuiyinxiangjiName,
}) => {
  let width = "";
  wx.getSystemInfo({
    success: function (res) {
      width = res.screenWidth;
    },
  });
  // 辅助函数：转换坐标
  function transformCoords(y) {
    return (width * 4) / 3 - y;
  }

  function generateRandomString() {
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
          // Time
          {
            draw: (ctx, textConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const { fontSize, color, text, position } = textConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowOffsetX = 1;
              ctx.shadowOffsetY = 8;
              ctx.shadowBlur = 3;
              ctx.fillStyle = color;
              const textWidth = ctx.measureText(text).width;
              const canvasWidth = canvas.width / dpr;
              const xPosition = (canvasWidth - textWidth) / 2;
              const yPosition = position[1];
              ctx.fillText(text, xPosition, yPosition);
            },
            args: [
              {
                fontSize: 41.6,
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 46.4],
              },
            ],
          },

          // Date and Location
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              const maxLocationLength = 14;
              const canvasWidth = canvas.width / dpr;

              const parts = text.split("@");
              const beforeMarker = parts[0].split(weekly);
              const datePart = beforeMarker[0].trim() + "  ";
              const weeklyPart = weekly + " ";
              const locationName = parts[1].trim();

              ctx.font = `${fontSize}px 黑体`;
              ctx.fillStyle = color;

              const dateWidth = ctx.measureText(datePart).width;
              const weeklyWidth = ctx.measureText(weeklyPart).width;
              const markerWidth = 14.4;
              const firstPartWidth = dateWidth + weeklyWidth + markerWidth;

              let firstLine, secondLine;
              if (locationName.length > maxLocationLength) {
                firstLine = locationName.slice(0, maxLocationLength);
                secondLine = locationName.slice(maxLocationLength);
              } else {
                firstLine = locationName;
                secondLine = "";
              }

              const firstLineWidth = ctx.measureText(firstLine).width;
              const secondLineWidth = ctx.measureText(secondLine).width;

              const totalWidth = Math.max(
                firstPartWidth + firstLineWidth,
                firstPartWidth + secondLineWidth
              );
              const xPosition = (canvasWidth - totalWidth) / 2;
              let yPosition = position[1];

              ctx.font = `${fontSize}px 黑体`;
              ctx.fillText(datePart, xPosition, yPosition);

              ctx.font = `bold ${fontSize}px 黑体`;
              ctx.fillText(weeklyPart, xPosition + dateWidth, yPosition);

              Taro.getImageInfo({
                src: Icon3,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    const iconSize = 22.4;
                    ctx.shadowColor = "none";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
                    ctx.drawImage(
                      img,
                      xPosition + dateWidth + weeklyWidth - 4,
                      yPosition - iconSize + 4,
                      iconSize,
                      iconSize * 1.12
                    );

                    ctx.font = `bold ${fontSize}px 黑体`;
                    const locationX = xPosition + firstPartWidth + 3.2;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 4;
                    ctx.shadowBlur = 4;
                    ctx.fillText(firstLine, locationX, yPosition);

                    if (secondLine) {
                      yPosition += fontSize + 3.2;
                      ctx.fillText(secondLine, locationX, yPosition);
                    }
                  };
                },
              });
            },
            args: [
              {
                fontSize: 11.2,
                color: "white",
                text: `${year}.${month}.${day}  ${weekly} @ ${
                  locationName || "加载中..."
                }`,
                position: [0, 79.2],
              },
            ],
          },
          // Watermark camera (unchanged)
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              Taro.getImageInfo({
                src: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-16/14931726462345285_shuiyinxiangji.png?sign=8d9e3815f59c6f2dc08d156e7405f6ca&t=1726462345",
                success: (imgInfo) => {
                  console.log("imgI222nfo: ", imgInfo);
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
        img: Shuiyin4,
        width: width - 20,
        height: 112,
        logoY: 0.6,
        name: "定制-水印相机",
        position: "center",
        // vip: true,
      },
    ],
    [
      {
        path: [
          {
            draw: (ctx, rectConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const { width } = rectConfig;
              const imgHeight = 34 * 0.8;
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
                src: Icon1,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    ctx.drawImage(img, 8.5 * 0.8, 0, width * 0.8, imgHeight);
                    // 绘制时间（调整大小为原来的0.7倍）
                    ctx.font = "bold 15px fzlt"; // 24 * 0.7
                    const gradient = ctx.createLinearGradient(
                      65 * 0.7,
                      3.6 * 0.7,
                      65 * 0.7,
                      25 * 0.7
                    );
                    gradient.addColorStop(0, "#4b81c5");
                    gradient.addColorStop(1, "#181818");
                    ctx.fillStyle = gradient;
                    ctx.fillText(`${hours}:${minutes}`, 63 * 0.7, 28 * 0.7);

                    // 绘制位置名称
                    ctx.font = "bold 10.88px fzlt"; // 13.6 * 0.8
                    // 设置描边
                    ctx.lineWidth = lineWidth; // 设置描边宽度为0.5px
                    ctx.strokeStyle = strokeStyle; // 描边颜色可以设置为黑色或你想要的颜色

                    ctx.fillStyle = "white";
                    let y = 52.2; // (65.25 * 0.8)
                    let remainingText = locationName;
                    for (let i = 0; i < locationLines; i++) {
                      const line = remainingText.substring(0, charsPerLine);
                      ctx.strokeText(line, 14.96, y); // 绘制文字描边
                      ctx.fillText(line, 14.96, y); // 18.7 * 0.8
                      remainingText = remainingText.substring(charsPerLine);
                      y += lineHeight;
                    }

                    // 绘制日期
                    const dateY = y;
                    ctx.strokeText(
                      `${year}.${month}.${day} ${weekly}`,
                      14.96,
                      dateY
                    );
                    ctx.fillText(
                      `${year}.${month}.${day} ${weekly}`,
                      14.96,
                      dateY
                    );
                    // 绘制黄线（不包含经纬度部分）
                    ctx.lineWidth = 2.04; // 2.55 * 0.8
                    ctx.strokeStyle = "#fdc144";
                    ctx.beginPath();
                    ctx.moveTo(9.52, 42); // 11.9 * 0.8, 52.5 * 0.8
                    ctx.lineTo(9.52, dateY);
                    ctx.stroke();

                    if (disableTrueCode && showHasCheck) {
                      // 绘制下标 (移动到左下角)
                      ctx.font = "bold 10px fzlt";
                      ctx.fillStyle = "#c9cbcd";
                      ctx.lineWidth = lineWidth; // 设置描边宽度为0.5px
                      ctx.strokeStyle = strokeStyle; // 描边颜色可以设置为黑色或你想要的颜色
                      ctx.strokeText(
                        shuiyinxiangjiName +
                          (shuiyinxiangjiName.includes("相机")
                            ? "已验证 | 时间地点真实"
                            : "相机已验证 | 时间地点真实"),
                        26,
                        canvas.height / dpr - 2
                      ); // 绘制文字描边
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
                              ctx.strokeText("马克", x + 5, y + 2);
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
                              ctx.lineWidth = lineWidth; // 设置描边宽度为0.5px
                              ctx.strokeStyle = strokeStyle; // 描边颜色可以设置为黑色或你想要的颜色
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
                              ctx.lineWidth = lineWidth; // 设置描边宽度为0.5px
                              ctx.strokeStyle = strokeStyle; // 描边颜色可以设置为黑色或你想要的颜色
                              ctx.strokeText(
                                shuiyinxiangjiName,
                                x + 57,
                                y + 25
                              );
                              ctx.fillText(shuiyinxiangjiName, x + 57, y + 25);
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
                width: 102, // 127.5 * 0.8
              },
            ],
          },
        ],
        img: Shuiyin5,
        width: 204,
        name: "定制-今日水印相机-打卡",
        left: true,
        right: true,
        logoY: 0.6,
        height: (locationName, hideJw) => {
          const baseHeight = 88; // 110 * 0.8
          const lineHeight = 17; // 21.25 * 0.8
          const maxLines = 2;
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
          let height = baseHeight + (lines - 1) * lineHeight;
          return height;
        },
      },
    ],
    [
      {
        path: [
          // 现场拍照
          {
            draw: (ctx, rectConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const { width, height, color, text } = rectConfig;
              // 清除画布
              ctx.clearRect(0, 0, width, height);
              Taro.getImageInfo({
                src: Icon4,
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = "/" + imgInfo.path;
                  img.onload = () => {
                    const imgWidth = imgInfo.width / 3;
                    const imgHeight = imgInfo.height / 3;

                    // 获取画布的宽高
                    const canvasWidth = canvas.width / dpr;
                    const canvasHeight = canvas.height / dpr;

                    // 计算图片绘制的坐标，使其位于中心
                    const x = (canvasWidth - imgWidth) / 2;
                    const y = (canvasHeight - imgHeight) / 2;
                    ctx.shadowColor = "none";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
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
                width,
                height: (width * 4) / 3,
                text: "现场拍照",
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1]];
              } else {
                position = [position[0], position[1]];
              }
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 11, // Reduced from 16
                color: "white",
                text: hideJw ? "经度: " + (latitude * 1)?.toFixed(5) : "",
                position: [7, transformCoords(70)], // Adjusted from [10, transformCoords(100)]
              },
            ],
          },
          {
            draw: (ctx, coordinateConfig) => {
              let { fontSize, color, text, position } = coordinateConfig;
              if (locationName.length > 16) {
                position = [position[0], position[1]];
              } else {
                position = [position[0], position[1]];
              }
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;
              ctx.fillText(text, ...position);
            },
            args: [
              {
                fontSize: 11, // Reduced from 16
                color: "white",
                text: hideJw ? "纬度: " + (longitude * 1)?.toFixed(5) : "",
                position: [7, transformCoords(52)], // Adjusted from [10, transformCoords(75)]
              },
            ],
          },

          // 地址
          {
            draw: (ctx, locationConfig) => {
              const { fontSize, color, text, position } = locationConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.fillStyle = color;

              const maxCharsPerLine = 16;
              const lines = [];
              for (let i = 0; i < text.length; i += maxCharsPerLine) {
                lines.push(text.slice(i, i + maxCharsPerLine));
              }

              const maxLines = 2;
              lines.slice(0, maxLines).forEach((line, index) => {
                ctx.fillText(
                  index === 0 ? "地址: " + line : line,
                  position[0] + (index === 0 ? 0 : 29), // Adjusted from 42
                  position[1] + index * (fontSize * 1.25)
                );
              });
            },
            args: [
              {
                fontSize: 11, // Reduced from 16
                color: "#fff",
                text: locationName,
                position: [7, transformCoords(17)], // Adjusted from [10, transformCoords(25)]
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
              }
            },
            args: [
              {
                fontSize: 11, // Reduced from 16
                color: "#fff",
                text: `时间: ${year}.${month}.${day}  ${hours}:${minutes}`,
                position: [7, transformCoords(35)], // Adjusted from [10, transformCoords(50)]
              },
            ],
          },
        ],
        img: Shuiyin7,
        name: "免费-工程记录-3",
        logoY: 0.6,
        right: true,
        jingweidu: true,
        height: () => {
          return (width * 4) / 3;
        },
      },
    ],
    [
      {
        path: [
          // 时间
          {
            draw: (ctx, textConfig) => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              const { fontSize, color, text, position } = textConfig;
              ctx.font = `${fontSize}px fzlt`;
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // 添加阴影效果
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowOffsetX = 1;
              ctx.shadowOffsetY = 6; // Adjusted from 8
              ctx.shadowBlur = 2; // Adjusted from 3

              // 分割小时和分钟
              const [hours, minutes] = text.split(":");

              // 计算各部分的宽度
              const hoursWidth = ctx.measureText(hours).width;
              const minutesWidth = ctx.measureText(minutes).width;
              const dotRadius = 3; // Adjusted from 4
              const dotSpacing = 16; // Adjusted from 20
              const totalWidth =
                hoursWidth + minutesWidth + dotRadius * 2 + fontSize / 4;

              // 计算居中位置
              const canvasWidth = width - 20;
              const xPosition = (canvasWidth - totalWidth) / 2;
              const yPosition = position[1];

              // 绘制小时部分
              ctx.fillStyle = color;
              ctx.fillText(hours, xPosition, yPosition);

              // 计算圆点的中心位置
              const dotXPosition = xPosition + hoursWidth + fontSize / 8;
              const dotYCenter = yPosition - fontSize / 4;

              // 绘制两个垂直居中的圆点
              ctx.fillStyle = "#fac92e";

              // 上圆点
              ctx.beginPath();
              ctx.arc(
                dotXPosition + 6, // Adjusted from 7
                dotYCenter - dotSpacing / 2 - 4, // Adjusted from 5
                dotRadius,
                0,
                Math.PI * 2
              );
              ctx.fill();

              // 下圆点
              ctx.beginPath();
              ctx.arc(
                dotXPosition + 6, // Adjusted from 7
                dotYCenter + dotSpacing / 2 - 4, // Adjusted from 5
                dotRadius,
                0,
                Math.PI * 2
              );
              ctx.fill();

              // 绘制分钟部分
              ctx.fillStyle = color;
              ctx.fillText(
                minutes,
                dotXPosition + dotRadius * 2 + fontSize / 4,
                yPosition
              );
            },
            args: [
              {
                fontSize: 42, // Adjusted from 52
                color: "white",
                text: `${hours}:${minutes}`,
                position: [0, 56], // Adjusted from 70
              },
            ],
          },
          // 日期
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              const canvasWidth = width - 20;

              // Split text
              const parts = text.split("@");
              const beforeMarker = parts[0].split(weekly);
              const datePart = beforeMarker[0].trim() + "  ";
              const weeklyPart = weekly;

              // Set font and style
              ctx.font = `bold ${fontSize}px 黑体`;
              ctx.fillStyle = color;

              // Calculate widths
              const dateWidth = ctx.measureText(datePart).width;
              const weeklyWidth = ctx.measureText(weeklyPart).width;

              // Calculate total width and center position
              const totalWidth = dateWidth + weeklyWidth;
              const xPosition = (canvasWidth - totalWidth) / 2;
              let yPosition = position[1];

              // Draw date part
              ctx.font = `bold ${fontSize}px 黑体`;
              ctx.fillText(datePart, xPosition, yPosition);

              // Draw weekly part
              ctx.font = `bold ${fontSize}px 黑体`;
              ctx.fillText(weeklyPart, xPosition + dateWidth, yPosition);
            },
            args: [
              {
                fontSize: 12, // Adjusted from 15
                color: "white",
                text: `${year}年${month}月${day}日  ${weekly}`,
                position: [0, 80], // Adjusted from 100
              },
            ],
          },
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              const maxCharsPerLine = 20;
              const canvasWidth = width - 20;

              // 提取locationName
              const parts = text.split("@");
              const locationName = parts[1].trim();

              // 设置字体和样式
              ctx.font = `bold ${fontSize}px 黑体`;
              ctx.fillStyle = color;

              // 分割locationName为两行
              let firstLine, secondLine;
              if (locationName.length > maxCharsPerLine) {
                firstLine = locationName.slice(0, maxCharsPerLine);
                secondLine = locationName.slice(maxCharsPerLine);
              } else {
                firstLine = locationName;
                secondLine = "";
              }

              // 计算每行的宽度
              const firstLineWidth = ctx.measureText(firstLine).width;
              const secondLineWidth = ctx.measureText(secondLine).width;

              // 计算第一行和第二行的居中位置
              const xPositionFirstLine = (canvasWidth - firstLineWidth) / 2;
              const xPositionSecondLine = (canvasWidth - secondLineWidth) / 2;
              let yPosition = position[1];

              // 绘制第一行
              ctx.fillText(firstLine, xPositionFirstLine, yPosition);

              // 如果有第二行，绘制第二行，并且独立居中
              if (secondLine) {
                yPosition += fontSize + 6; // Adjusted from 7
                ctx.fillText(secondLine, xPositionSecondLine, yPosition);
              }
            },
            args: [
              {
                fontSize: 12, // Adjusted from 15
                color: "white",
                text: `@ ${locationName}`,
                position: [0, 101], // Adjusted from 126
              },
            ],
          },

          // 水印相机 (unchanged)
          {
            draw: (ctx, config) => {
              const { fontSize, color, text, position } = config;
              // 绘制图片
              Taro.getImageInfo({
                src: "https://7379-sy-4gecj2zw90583b8b-1326662896.tcb.qcloud.la/kit-cms-upload/2024-09-16/14931726462345285_shuiyinxiangji.png?sign=8d9e3815f59c6f2dc08d156e7405f6ca&t=1726462345",
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
                    const x = canvasWidth - imgWidth;
                    const y = canvasHeight - imgHeight + 16;
                    ctx.shadowColor = "none";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;
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
                color: "rgba(255, 255, 255, 0.8)",
                text: `水印相机`,
                position: [0, 103],
              },
            ],
          },
        ],
        img: Shuiyin6,
        width: width - 20,
        height: 128, // Adjusted from 160
        logoY: 0.6,
        name: "定制-水印相机",
        position: "center",
      },
    ],
  ];
};
export default generateCanvasConfig;
