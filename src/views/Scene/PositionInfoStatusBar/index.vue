<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">位置信息状态栏控件</div>
      <div class="panel-body">
        <button @click="show">显示</button>
        <button @click="hide">隐藏</button>
        <div>使用原生DOM实现，非Vue项目也可直接使用</div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入样式
import "@/assets/css/position-info-status-bar.css";  
import CesiumInit from "@/js/SampleItems/Scene/PositionInfoStatusBar";
export default {
  name: "CesiumPositionInfoStatusBar",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    show() {
      CesiumInit.pInfoStatusBar.show();
    },
    hide() {
      CesiumInit.pInfoStatusBar.hide();
    }
  }
};
</script>
 