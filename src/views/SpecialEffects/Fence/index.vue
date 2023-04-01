<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">动态立体墙</div>
      <div class="panel-body">
        <button @click="drawActivate('Polyline')">绘制</button>
        <div class="tip-item">点击“绘制”按钮后在场景中绘制新的墙体</div>
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/SpecialEffects/Fence";
export default {
  name: "CesiumFence", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    }
  }
};
</script>
 