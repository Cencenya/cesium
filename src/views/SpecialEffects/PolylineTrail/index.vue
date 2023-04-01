<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div>
    <div class="panel">
      <div class="panel-header">尾迹线</div>
      <div class="panel-body">
        <div class="tip-item">可调整以下参数</div>
        <div class="tip-item">color：颜色</div>
        <div class="tip-item">speed：速度</div>
        <div class="tip-item">width：线宽</div>
        <div class="tip-item">percent：尾迹线占整条线长度的百分比</div>
        <div class="tip-item">gradient：尾迹线颜色渐变比</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import cesiumInit from "@/js/SampleItems/SpecialEffects/PolylinTrail";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumPolylinTrail",
  data() {
    return {};
  },

  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {
    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script>

 