<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div>
    
    <div class="panel">
      <div class="panel-header">弹框样式</div>
      <div class="panel-body">
        <div class="tip-item">点击场景中的监控图标</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/CustomInfowindow/PopupWindow2";
export default {
  name: "CesiumPopupWindow2", 
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

 