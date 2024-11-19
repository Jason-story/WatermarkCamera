import { formatDateTime } from "../utils";
const label = {
  0: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },
    {
      key: "yanzhengmingcheng",
      title: "左下角验证",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
      defaultValue: "无法修改，只能显示或隐藏",
    },

    {
      key: "daka",
      title: "打卡标签名",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: "随便",
      length: 2,
    },
    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: formatDateTime.formatDate() + " " + formatDateTime.formatTime(),
    },

    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },

    {
      key: "beizhu",
      title: "备注",
      visible: false,
      editTitle: false,
      switchVisible: true,
    },
  ],
  1: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },
    {
      key: "yanzhengmingcheng",
      title: "左下角验证",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
      defaultValue: "无法修改，只能显示或隐藏",
    },
    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: formatDateTime.formatDate() + " " + formatDateTime.formatTime(),
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
  ],
  2: [
    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: formatDateTime.formatDate() + " " + formatDateTime.formatTime(),
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
  ],
  3: [
    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: formatDateTime.formatDate() + " " + formatDateTime.formatTime(),
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
  ],
  4: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },

    {
      key: "gongchengmingcheng",
      title: "工程名称",
      // 是否隐藏
      visible: true,
      editTitle: true,
      switchVisible: false,
    },

    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "tianqi",
      title: "天气",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "jingdu",
      title: "经度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "weidu",
      title: "纬度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "beizhu",
      title: "备注",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
  ],
  5: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },

    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "tianqi",
      title: "天气",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "jingdu",
      title: "经度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "weidu",
      title: "纬度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "beizhu",
      title: "备注",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
  ],
  6: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },

    {
      key: "gongchengmingcheng",
      title: "工程名称",
      // 是否隐藏
      visible: true,
      editTitle: true,
      switchVisible: false,
    },

    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
    {
      key: "tianqi",
      title: "天气",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },

    {
      key: "jingdu",
      title: "经度",
      visible: true,
      editTitle: false,
      switchVisible: true,
    },
    {
      key: "weidu",
      title: "纬度",
      visible: true,
      editTitle: false,
      switchVisible: true,
    },
    {
      key: "beizhu",
      title: "备注",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
  ],
  7: [
    {
      key: "fangdaowenzi",
      title: "防盗文字",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: "盗图必究",
    },
  ],
  8: [
    {
      key: "shijian",
      title: "时间",
      visible: true,
      editTitle: false,
      switchVisible: false,
      value: formatDateTime.formatDate() + " " + formatDateTime.formatTime(),
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
    {
      key: "tianqi",
      title: "天气",
      visible: true,
      editTitle: false,
      switchVisible: false,
    },
  ],
  9: [
    {
      key: "shuiyinmingcheng",
      title: "右下角水印",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
    },
    {
      key: "yanzhengmingcheng",
      title: "左下角验证",
      // 是否隐藏
      visible: true,
      editTitle: false,
      switchVisible: true,
      defaultValue: "无法修改，只能显示或隐藏",
    },
    {
      key: "gongchengmingcheng",
      title: "工程名称",
      // 是否隐藏
      visible: true,
      editTitle: true,
      switchVisible: false,
    },
    {
      key: "shigongquyu",
      title: "施工区域",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "shigongneirong",
      title: "施工内容",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "shigongzerenren",
      title: "施工责任人",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "jianlizerenren",
      title: "监理责任人",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "shijian",
      title: "拍摄时间",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "tianqi",
      title: "天气",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "didian",
      title: "地点",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "jingdu",
      title: "经度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "weidu",
      title: "纬度",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "beizhu",
      title: "备注",
      visible: true,
      editTitle: true,
      switchVisible: true,
    },
    {
      key: "jianshedanwei",
      title: "建设单位",
      visible: true,
      editTitle: true,
      switchVisible: true,
      bg: true,
    },
    {
      key: "jianlidanwei",
      title: "监理单位",
      visible: true,
      editTitle: true,
      switchVisible: true,
      bg: true,
    },
    {
      key: "shigongdanwei",
      title: "施工单位",
      visible: true,
      editTitle: true,
      switchVisible: true,
      bg: true,
    },
  ],
};

export default label;
