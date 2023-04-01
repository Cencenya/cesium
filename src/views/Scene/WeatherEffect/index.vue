<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">Cesium天气效果</div>
      <div class="panel-body">
        <div class="tip-item">
          <button @click="openSnow">雪天</button>
          <button @click="openRain">雨天</button>
          <button @click="openFog">雾天</button>
          <button @click="close">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/Scene/WeatherEffect";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumWeatherEffects", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    //雪天
    openSnow() {
      CesiumInit.openSnow();
    },

    //雨天
    openRain() {
      CesiumInit.openRain();
    },

    //雾天
    openFog() {
      CesiumInit.openFog();
    },

    //关闭
    close() {
      CesiumInit.close();
     //  console.log(pickCamera(CesiumInit.viewer.scene))
    }
  }
};
</script>
 