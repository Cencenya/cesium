<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">动态扩散圆</div>
      <div class="panel-body">
        <button @click="drawActivate('Point')">绘制点</button>
        <div class="tip-item">点击“绘制点”按钮后在场景中点击鼠标左键绘制点添加动态圆</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/SpecialEffects/SpreadCircle";
export default {
  name: "CesiumSpreadCircle", 
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
 