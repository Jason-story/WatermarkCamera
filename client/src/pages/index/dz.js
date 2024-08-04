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
    // [
    //   {
    //     path: [
    //       // 时间
    //       {
    //         draw: (ctx, textConfig) => {
    //           const { fontSize, color, text, position } = textConfig;
    //           ctx.font = `bold ${fontSize}px Pragmatica`;

    //           // 添加阴影效果
    //           ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    //           ctx.shadowOffsetX = 2;
    //           ctx.shadowOffsetY = 4;
    //           ctx.shadowBlur = 4;

    //           ctx.fillStyle = color;

    //           // 获取文本宽度
    //           const textWidth = ctx.measureText(text).width;

    //           // 计算居中位置
    //           const canvasWidth = width - 20; // 假设你知道 canvas 的宽度
    //           const xPosition = (canvasWidth - textWidth) / 2;
    //           const yPosition = position[1]; // 保持 y 位置不变

    //           // 绘制文本
    //           ctx.fillText(text, xPosition, yPosition);
    //         },
    //         args: [
    //           {
    //             fontSize: 52,
    //             color: "white",
    //             text: `${hours}:${minutes}`,
    //             position: [0, 58], // position 数组的 x 值在计算居中时被忽略
    //           },
    //         ],
    //       },

    //       // 日期
    //       {
    //         draw: (ctx, config) => {
    //           const { fontSize, color, text, position } = config;
    //           const maxLocationLength = 12;
    //           const canvasWidth = width - 20; // Assuming you know the canvas width

    //           // Split text
    //           const parts = text.split("📍");
    //           const beforeMarker = parts[0].split(weekly);
    //           const datePart = beforeMarker[0].trim() + "  ";
    //           const weeklyPart = weekly + " ";
    //           const locationName = parts[1].trim();

    //           // Set font and style
    //           ctx.font = `${fontSize}px 黑体`;
    //           ctx.fillStyle = color;

    //           // Calculate widths
    //           const dateWidth = ctx.measureText(datePart).width;
    //           const weeklyWidth = ctx.measureText(weeklyPart).width;
    //           const markerWidth = ctx.measureText("📍").width;
    //           const firstPartWidth = dateWidth + weeklyWidth + markerWidth;

    //           // Handle long location names
    //           let firstLine, secondLine;
    //           if (locationName.length > maxLocationLength) {
    //             firstLine = locationName.slice(0, maxLocationLength);
    //             secondLine = locationName.slice(maxLocationLength);
    //           } else {
    //             firstLine = locationName;
    //             secondLine = "";
    //           }

    //           const firstLineWidth = ctx.measureText(firstLine).width;
    //           const secondLineWidth = ctx.measureText(secondLine).width;

    //           // Calculate total width and center position
    //           const totalWidth = Math.max(
    //             firstPartWidth + firstLineWidth,
    //             firstPartWidth + secondLineWidth
    //           );
    //           const xPosition = (canvasWidth - totalWidth) / 2;
    //           let yPosition = position[1];

    //           // Draw date part
    //           ctx.font = `${fontSize}px 黑体`;
    //           ctx.fillText(datePart, xPosition, yPosition);

    //           // Draw weekly part
    //           ctx.font = `bold ${fontSize}px 黑体`;
    //           ctx.fillText(weeklyPart, xPosition + dateWidth, yPosition);

    //           // Draw marker
    //           ctx.font = `bold ${18}px 黑体`;
    //           ctx.fillText("📍", xPosition + dateWidth + weeklyWidth, yPosition + 2);

    //           // Draw location name
    //           ctx.font = `bold ${fontSize}px 黑体`;
    //           const locationX = xPosition + firstPartWidth + 4;
    //           ctx.fillText(firstLine, locationX, yPosition);

    //           // Draw second line if needed
    //           if (secondLine) {
    //             yPosition += fontSize + 4; // Add some spacing between lines
    //             ctx.fillText(secondLine, locationX, yPosition);
    //           }
    //         },
    //         args: [
    //           {
    //             fontSize: 14,
    //             color: "white",
    //             text: `${year}.${month}.${day}  ${weekly} 📍 ${locationName}`,
    //             position: [0, 99],
    //           },
    //         ],
    //       },

    //       // 水印相机
    //       {
    //         draw: (ctx, config) => {
    //           const { fontSize, color, text, position } = config;
    //           // 绘制图片
    //           Taro.getImageInfo({
    //             src: "https://fonts-1326883150.cos.ap-beijing.myqcloud.com/shuiyinxiangji.png", // 替换为你的图片路径
    //             success: (imgInfo) => {
    //               const img = canvas.createImage();
    //               img.src = imgInfo.path;
    //               img.onload = () => {
    //                 const imgWidth = imgInfo.width / dpr + 5;
    //                 const imgHeight = imgInfo.height / dpr + 5;

    //                 // 获取画布的宽高
    //                 const canvasWidth = canvas.width / dpr;
    //                 const canvasHeight = canvas.height / dpr;

    //                 // 计算图片绘制的坐标，使其位于右下角
    //                 const x = canvasWidth - imgWidth;
    //                 const y = canvasHeight - imgHeight + 14;
    //                 ctx.drawImage(img, x, y, imgWidth, imgHeight);
    //               };
    //               img.onerror = (err) => {
    //                 console.error("图片加载失败", err);
    //               };
    //             },
    //             fail: (err) => {
    //               console.error("获取图片信息失败", err);
    //             },
    //           });
    //         },
    //         args: [
    //           {
    //             fontSize: 15.3,
    //             color: "rgba(255, 255, 255, 0.8)", // 使用带透明度的白色作为文字颜色
    //             text: `水印相机`,
    //             position: [0, 103],
    //           },
    //         ],
    //       },
    //     ],
    //     img: Shuiyin4,
    //     width: width - 20,
    //     height: 140,
    //     position: "center",
    //     vip: true,
    //   },
    // ],
    [
      {
        path: [
          {
            draw: (ctx, rectConfig) => {
              const { width } = rectConfig;
              const baseHeight = 99; // 减小20px
              const imgHeight = 34;
              const lineHeight = 21.25;
              const maxLines = 3;
              const charsPerLine = 15;

              const getLocationLines = (text) => {
                const words = text.split('');
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
              let canvasHeight = baseHeight + (locationLines - 1) * lineHeight;
              if (!hideJw) {
                canvasHeight += lineHeight + 5;
              }

              Taro.getImageInfo({
                src: "https://fonts-1326883150.cos.ap-beijing.myqcloud.com/icon1.png",
                success: (imgInfo) => {
                  const img = canvas.createImage();
                  img.src = imgInfo.path;
                  img.onload = () => {
                    ctx.drawImage(img, 8.5, 0, width, imgHeight);

                    // 绘制时间
                    ctx.font = "bold 24px sans-serif"; // 加粗并放大时间文字
                    const gradient = ctx.createLinearGradient(65, 3.6, 65, 25);
                    gradient.addColorStop(0, "#497cbd");
                    gradient.addColorStop(1, "#000");
                    ctx.fillStyle = gradient;
                    ctx.fillText(`${hours}:${minutes}`, 65, 25);

                    // 绘制位置名称
                    ctx.font = "bold 13.6px sans-serif"; // 加粗位置名称文字
                    ctx.fillStyle = "white";
                    let y = 65.25; // 增加距离线边的距离10px
                    let remainingText = locationName;
                    for (let i = 0; i < locationLines; i++) {
                      const line = remainingText.substring(0, charsPerLine);
                      ctx.fillText(line, 18.7, y);
                      remainingText = remainingText.substring(charsPerLine);
                      y += lineHeight;
                    }

                    // 绘制日期
                    const dateY = y;
                    ctx.fillText(`${year}年${month}月${day}日 ${weekly}`, 18.7, dateY);

                    // 绘制黄线（不包含经纬度部分）
                    ctx.lineWidth = 2.55;
                    ctx.strokeStyle = "#fdc144";
                    ctx.beginPath();
                    ctx.moveTo(11.9, 52.5);
                    ctx.lineTo(11.9, dateY);
                    ctx.stroke();

                    // 绘制经纬度（如果不隐藏）
                    if (hideJw) {
                      const coordinateY = dateY + lineHeight + 5;
                      const coordinateText = "经纬度: " +
                        ((latitude * 1)?.toFixed(5) + ", " + (longitude * 1)?.toFixed(5));
                      ctx.fillText(coordinateText, 18.7, coordinateY);
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
                width: 127.5,
              },
            ],
          },
        ],
        img: Shuiyin4,
        width: 255,
        height: (locationName, hideJw) => {
          const baseHeight = 99; // 减小20px
          const lineHeight = 21.25;
          const maxLines = 3;
          const charsPerLine = 15;

          const getLocationLines = (text) => {
            const words = text.split('');
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
          if (hideJw) height += lineHeight + 5;
          return height;
        },
      },
    ]

  ];
};
export default generateCanvasConfig;
