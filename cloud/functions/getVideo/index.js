// 云函数入口文件
const cloud = require("wx-server-sdk");
const axios = require("axios");
const md5 = require("md5");
const moment = require("moment");

cloud.init({
  end: "wxapp-5ggd50r5785ca107",
});
// 云函数入口函数
exports.main = async (event) => {
  let data = "";
  try {
    data = await axios({
      method: "get",
      url:
        "https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk?ak=d9d8dcb6ef4d42ac8f7ef5c5d3df4ac0&link=" +
        event.url,
    });
    if (data.data.code * 1 !== 10000) {
      return { code: data.data.code, msg: "受平台限制，此视频被禁止下载" };
    }
  } catch (err) {
    // console.log("err: ", err);
  }
  const videoData = data.data.content;
  let cover,
    video,
    coverCloud = {},
    videoCloud = {};
  const savePath =
    "remove-mask/" +
    (moment().month() + 1) +
    "-month/" +
    moment().date() +
    "-date/";
  // 处理文本
  const handleText = (text) => {
    const str = text || "";
    let plainText = str.match(/[\u4e00-\u9fa5_a-zA-Z0-9]/g) || "";
    plainText && plainText.length > 0
      ? (plainText = plainText.join(""))
      : (plainText = "");
    return plainText;
  };

  const coverName = handleText(videoData.title + +new Date()) + ".jpeg";
  const videoName = handleText(videoData.title + +new Date()) + ".mp4";
  try {
    cover = await axios({
      method: "get",
      url: videoData.cover,
      responseType: "arraybuffer",
    });
    coverCloud = await cloud.uploadFile({
      cloudPath: savePath + coverName,
      fileContent: cover.data, //base64 to buffer
    });
  } catch (err) {}
  try {
    video = await axios({
      method: "get",
      url: videoData.url,
      responseType: "arraybuffer",
    });

    videoCloud = await cloud.uploadFile({
      cloudPath: savePath + videoName,
      fileContent: video.data, //base64 to buffer
    });
  } catch (err) {}

  return {
    code: 200,
    cover: coverCloud.fileID,
    p_cover_url: videoData.cover,
    p_video_url: videoData.url,
    title: videoData.title,
    video: videoCloud.fileID,
    videoSize: video ? video.data.length / 1024 / 1024 : 0,
  };
};
