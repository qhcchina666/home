// import axios from "axios";
import fetchJsonp from "fetch-jsonp";
/**
 * 音乐播放器
 */
// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
    );
    const data = await res.json();
    if (data[0].url.startsWith("@")) {
      // eslint-disable-next-line no-unused-vars
      const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
      const jsonpData = await fetchJsonp(url).then((res) => res.json());
      const sipList = jsonpData?.req_0?.data?.sip || [];
      const domain = (
        sipList.find((i) => !i.startsWith("http://ws")) ||
        sipList[0]
      ).replace("http://", "https://");
      const midUrlInfo = jsonpData?.req_0?.data?.midurlinfo || [];
      return data.map((v, i) => ({
        name: v.name || v.title,
        artist: v.artist || v.author,
        url: domain + (midUrlInfo[i]?.purl || ""),
        cover: v.cover || v.pic,
        lrc: v.lrc,
      }));
    } else {
      return data.map((v) => ({
        name: v.name || v.title,
        artist: v.artist || v.author,
        url: v.url,
        cover: v.cover || v.pic,
        lrc: v.lrc,
      }));
    }
  } catch (err) {
    console.error("获取播放列表失败：", err);
    return [];
  }
};
/**
 * 一言
 */
// 获取一言数据
export const getHitokoto = async () => {
  try {
    const res = await fetch("https://v1.hitokoto.cn");
    return await res.json();
  } catch (err) {
    console.error("获取一言失败：", err);
    return null;
  }
};

/**
 * 天气 - Open-Meteo 无密钥支持跨域
 */
// 获取洛阳天气（固定坐标，不用弹窗定位）
export const getWeather = async () => {
  const lat = 34.62;
  const lon = 112.45;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const res = await fetch(url);
    const json = await res.json();
    const w = json.current_weather;
    return {
      temp: Math.round(w.temperature),   // 温度°C
      wind: Math.round(w.windspeed),     // 风速 km/h
      code: w.weathercode,               // 天气代码
      time: w.time,
    };
  } catch (err) {
    console.error("天气获取失败：", err);
    return null;
  }
};

// 把天气代码转成中文描述
export const weatherCodeToText = (code) => {
  const map = {
    0: "晴",
    1: "大部晴朗",
    2: "多云",
    3: "阴",
    45: "雾",
    48: "雾凇",
    51: "毛毛雨",
    53: "毛毛雨",
    55: "毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    80: "阵雨",
    81: "阵雨",
    82: "强阵雨",
    95: "雷阵雨",
    96: "雷阵雨伴冰雹",
    99: "雷阵雨伴强冰雹",
  };
  return map[code] || "未知";
};

