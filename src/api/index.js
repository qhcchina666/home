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
 * 天气【新版 Open‑Meteo 无密钥、支持跨域】
 */
// 获取浏览器定位得到经纬度
export const getLocation = ()=>{
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation){
      reject("浏览器不支持定位");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos)=>resolve({lat:pos.coords.latitude,lon:pos.coords.longitude}),
      (err)=>reject(err.message)
    )
  })
}

// 根据经纬度获取天气
export const getWeather = async(lat,lon)=>{
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    const res = await fetch(url)
    return await res.json()
  }catch(err){
    console.error("天气请求失败",err)
    return null
  }
}
