<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">光柱椎体</div>
      <div class="panel-body">
        <div class="tip-item">可以自有设置高度、宽度、颜色等参数</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/SpecialEffects/ConeGlow";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumConeGlow", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script>

 