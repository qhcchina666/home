<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection?.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>
<script setup>
import {reactive,onMounted} from "vue"
import { getWeather, weatherCodeToText } from "@/api";
import { Error } from "@icon-park/vue-next";

// 天气数据（保持原来的数据结构，模板不用改动！）
const weatherData = reactive({
  adCode: {
    city: "洛阳市",
    adcode: null,
  },
  weather: {
    weather: null,
    temperature: null,
    winddirection: "无",
    windpower: "0",
  },
});

// 获取天气数据
const getWeatherData = async () => {
  try {
    const res = await getWeather();
    if(!res){
      throw "天气接口返回空";
    }
    weatherData.weather = {
      weather: weatherCodeToText(res.code),
      temperature: res.temp,
      winddirection: "风速",
      windpower: res.wind,
    };
  } catch (error) {
    console.error("天气信息获取失败:" + error);
    onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  getWeatherData();
});
</script>
