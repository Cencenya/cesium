<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">二维点转三维点</div>
      <div class="panel-body">
        <button @click="startTransform">开始转换</button>
        <button @click="clear">清空</button>
        <br />
        现在很多项目都是从二维迁移到三维，发现项目中的很多数据如监控点、消防栓点都是只有经纬度，在三维上无法展示，
        最快的方式就是批量进行转换，而不是手动一个个采集高度。
        <br/>
        模型底部红色图标的点是原始的二维点，转换后展示在模型上面的为三维点。
        转换结果查看控制台或源码
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/Point2dToPoint3d";
export default {
  name: "CesiumPoint2To3", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    startTransform() {
      CesiumInit.startTransform();
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script>

 