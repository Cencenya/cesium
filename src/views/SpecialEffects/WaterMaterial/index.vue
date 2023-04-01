<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">动态水面效果</div>
      <div class="panel-body">  
        <button @click="drawActivate('Polygon')">新增水面</button>
        <button @click="clear">清空</button>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/SpecialEffects/watermaterial";
import {pickCamera} from "@/utils/scene"
export default {
  name: "CesiumWater", 
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

 