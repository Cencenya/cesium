<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">动态水域颜色调整</div>
      <div class="panel-body">
        <el-color-picker v-model="color" show-alpha @change="updateColor"></el-color-picker>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/IndustryApplication/WaterMaterial";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumWaterMaterial", 
  data() {
    return {
      color: "rgba(19, 206, 102, 0.8)"
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
    this.color = cesiumInit.getColor();
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {  
    p() {
      let c = pickCamera(cesiumInit.viewer);
      console.log(c);
    },

    clear() {
      cesiumInit.clear();
    },

    updateColor() {
      cesiumInit.updateColor(this.color);
    }
  }
};
</script>

 