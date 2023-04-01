2<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">鼠标提示信息</div>
      <div class="panel-body">鼠标移动到实体上查看信息提示</div>
    </div>
  </div>
</template>

<script>  
import "@/assets/css/scene-tooltip.css"
import CesiumInit from "@/js/SampleItems/Scene/Tooltip";
export default {
  name: "CesiumTooltip", 
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