<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">视频播放窗口</div>
      <div class="panel-body">
        <div class="tip-item">点击场景中的监控图标即可播放</div>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/IndustryApplication/CommonVideoWindow";
import "@/assets/css/video-window.css";

export default {
  name: "CesiumCommonVideoWindow", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {
   
  }
};
</script>

 