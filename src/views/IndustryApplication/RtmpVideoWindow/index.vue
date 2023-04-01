<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">rtmp视频播放窗口</div>
      <div class="panel-body">
        <div class="tip-item">点击场景中的监控图标即可播放</div>
        <br />
        <div
          class="tip-item"
        >浏览器需要启用flash，谷歌浏览器默认是禁用flash的。不启用flash会出现“No compatible source was found for this media.”错误</div>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/IndustryApplication/RtmpVideoWindow";
import "@/assets/css/video-window.css";

export default {
  name: "CesiumRtmpVideoWindow", 
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

 