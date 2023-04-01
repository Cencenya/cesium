<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">模型裁剪</div>
      <div class="panel-body">
        <button @click="drawActivate('Polygon')">绘制多边形</button>
        <button @click="clear">清除</button>
        <div class="tip-item">目前仅支持凸多边形，如果绘制的是凹多边形，可能裁剪结果不正确</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/TilesClip";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumTilesClip", 
  data() {
    return {};
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
      //console.log(pickCamera(CesiumInit.viewer.scene));
    }
  }
};
</script> 