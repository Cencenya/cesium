<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <!-- <div class="panel-header">圆形波纹效果</div>
      <div class="panel-body"></div> -->
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/SpecialEffects/CircleWave";
export default {
  name: "CesiumCircleWave",  
  data() {
    return {
      enable: true
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {
     
  }
};
</script> 