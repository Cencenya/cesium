<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">水闸放水效果</div>
      <div class="panel-body">引用了火星科技的BIM模型</div>
      <!-- <button @click="p">视角</button> -->
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/IndustryApplication/WaterSpout";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumWaterSpout", 
  data() {
    return {};
  },

  mounted() {
    cesiumInit.init("cesium-container");
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
    }
  }
};
</script>

 