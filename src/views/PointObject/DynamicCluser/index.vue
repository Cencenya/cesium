<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">点聚合2</div>
      <div class="panel-body">
        <div class="tip-item">参照Leaflet点聚合插件的效果，动态生成聚合图标，可自由设置聚合图标的颜色</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/PointObject/DynamicCluser";
export default {
  name: "CesiumDynamicCluser", 
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

 