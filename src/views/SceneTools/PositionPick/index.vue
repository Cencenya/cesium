<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
     <div class="panel">
      <div class="panel-header">坐标拾取</div>
      <div class="panel-body">
        <button @click="drawActivate('Point')">新增</button>
        <div>点击新增按钮后在场景中添加工具，按住图标进行移动显示实时坐标信息</div>
      </div>
    </div>  
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/SceneTools/PositionPick";
export default {
  name: "CesiumPositionPick",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script>
 