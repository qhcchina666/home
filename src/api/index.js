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
 * 天气 - Open‑Meteo（修复跨域，无需密钥）洛阳固定坐标
 */
export const getWeather = async () => {
  // 洛阳经纬度，无需浏览器弹窗定位
  const lat = 34.62;
  const lon = 112.45;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    const res = await fetch(url)
    const json = await res.json()
    // 转换成你主页原来可以渲染的格式
    return {
      temp: json.current_weather.temperature,
      wind: json.current_weather.windspeed,
      code: json.current_weather.weathercode
    }
  } catch (err) {
    console.error("天气获取失败：", err)
    return null
  }
}
