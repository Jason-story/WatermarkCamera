export const formatTextWithLineLimit = (text, maxCharsPerLine, maxLines) => {
  // 初始化一个数组存储每一行的内容
  const lines = [];
  if(!text){return ''}

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

export const generateRandomString = (length) => {
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
  for (let i = 0; i < length; i++) {
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
};
// 格式化日期时间的辅助函数
export const formatDateTime = {
  formatDate: (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  formatTime: (date = new Date()) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  },
};

export const getEditItem = (editLabel, key) => {
  const index = editLabel.findIndex((item) => item.key === key);
  return editLabel[index] || "";
};

export const getWeekdayCN = (date) => {
  const days = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const d = new Date(date);
  return days[d.getDay()];
};

export const parseDateString = (dateStr = null) => {
  // If no dateStr is provided, use current time
  if (!dateStr) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: (now.getMonth() + 1).toString().padStart(2, "0"), // Ensure two digits for month
      day: now.getDate().toString().padStart(2, "0"), // Ensure two digits for day
      hours: now.getHours().toString().padStart(2, "0"), // Ensure two digits for hours
      minutes: now.getMinutes().toString().padStart(2, "0"), // Ensure two digits for minutes
    };
  }

  const regex = /(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{1,2})/;
  const matches = dateStr.match(regex);

  if (!matches) {
    throw new Error("Invalid date format");
  }

  return {
    year: matches[1], // Year doesn't need padding
    month: matches[2].padStart(2, "0"), // Ensure two digits for month
    day: matches[3].padStart(2, "0"), // Ensure two digits for day
    hours: matches[4].padStart(2, "0"), // Ensure two digits for hours
    minutes: matches[5].padStart(2, "0"), // Ensure two digits for minutes
  };
};
export const mergeArrays = (newArr, oldArr, defaultArr) => {
  if (!oldArr) {
    return newArr;
  }
  const arr = newArr.map((newItem) => {
    // 在 old 中找到与 newItem.key 相同的对象
    const oldItem = oldArr.find((oldItem) => oldItem.key === newItem.key);

    // 如果找到对应的 oldItem，就合并 oldItem 的属性，否则仅保留 newItem 的属性
    return oldItem ? { ...oldItem } : { ...newItem };
  });

  if (defaultArr) {
    defaultArr.forEach((item) => {
      const arrItem = arr.find((arrItem) => arrItem.key === item.key);
      if (arrItem && arrItem.value === undefined) {
        arrItem.value = item.value;
      }
    });
  }

  return arr;
};
