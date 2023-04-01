<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">缓冲区分析</div>
      <div class="panel-body">
        <!-- <button @click="getCamera">测试</button> -->
        <div class="tip-item">如果地图未加载出来，刷新页面试试</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/BufferAnalysis";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumBufferAnalysis", 
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
    getCamera() {
      console.log(pickCamera(CesiumInit.viewer.scene));
    }
  }
};
</script> 