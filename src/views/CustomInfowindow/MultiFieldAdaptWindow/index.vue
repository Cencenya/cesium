<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">多字段自适应信息框</div>
      <div class="panel-body">
        <div class="tip-item">点击监控点位图标显示信息</div>
        <div class="tip-item">可通过css修改信息框的样式</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/CustomInfowindow/MultiFieldAdaptWindow";
export default {
  name: "CesiumMultiFieldAdaptWindow", 
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

 