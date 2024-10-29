export const formatTextWithLineLimit = (text, maxCharsPerLine, maxLines) => {
  // 初始化一个数组存储每一行的内容
  const lines = [];

  // 使用正则表达式，按照每行最大字符数进行切割
  for (let i = 0; i < maxLines; i++) {
    const start = i * maxCharsPerLine;
    const end = start + maxCharsPerLine;
    // 获取每一行的子字符串
    const line = text.slice(start, end);

    // 如果子字符串为空，跳出循环
    if (!line) break;

    lines.push(`<Text>${line}</Text>`);
  }

  // 将所有行拼接成一个字符串返回
  return lines.join("");
};

