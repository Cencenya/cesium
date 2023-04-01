<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">雷达扫描</div>
      <div class="panel-body">
        <button @click="drawActivate('Point')">绘制点</button>
        <button @click="clear">清空</button>
        <div class="tip-item">点击“绘制点”按钮后在场景中点击鼠标左键添加雷达扫描，点击“清空”按钮删除所有雷达扫描</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/IndustryApplication/RadarsEffect";
export default {
  name: "CesiumRadarsEffect",  
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
    }
  }
};
</script> 