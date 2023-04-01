<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">通视分析</div>
      <div class="panel-body">
        <div class="tip-item">
          <button @click="start(0)">通视分析</button>
          <button @click="start(1)">圆形通视分析</button>
          <button @click="clear">清空</button>
        </div>
        <div class="tip-item">依赖cesium底层接口，部分情况不够准确</div>
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/Analysis/SightLine";
export default {
  name: "CesiumSightLine", 
  data() {
    return {
      form: {
        underGroundEnable: true,
        alpha: 0.8
      }
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    start(type) {
      CesiumInit.start(type);
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script> 
 