<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">属性值修改</div>
      <div class="panel-body">
        <!-- <button @click="clickEvent">视图</button> -->
        <span>contrast：{{contrast}}</span>
        <el-slider
          v-model="contrast"
          :step="0.02"
          :show-tooltip="true"
          @input="valueChange"
          :min="0"
          :max="500"
        ></el-slider>
        <span>brightness：{{brightness}}</span>
        <el-slider
          v-model="brightness"
          :show-tooltip="true"
          @input="valueChange"
          :min="-10"
          :max="20"
          :step="0.2"
        ></el-slider>
        <span>delta：{{delta}}</span>
        <el-slider
          v-model="delta"
          :step="0.02"
          :show-tooltip="true"
          @input="valueChange"
          :min="-10"
          :max="20"
        ></el-slider>
        <span>sigma：{{sigma}}</span>
        <el-slider
          v-model="sigma"
          :show-tooltip="true"
          @input="valueChange"
          :min="0"
          :max="5"
          :step="0.02"
        ></el-slider>
        <span>stepSize：{{stepSize}}</span>
        <el-slider
          v-model="stepSize"
          :step="0.02"
          :show-tooltip="true"
          @input="valueChange"
          :min="0"
          :max="20"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/Scene/Bloom";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumBloom", 
  data() {
    return {
      brightness: -0.2,
      contrast: 182.68,
      delta: -0.32,
      sigma: 1.44,
      stepSize: 1.78
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    clickEvent() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    },

    valueChange() {
      var bloom = cesiumInit.viewer.scene.postProcessStages.bloom;
      bloom.enabled = true;
      bloom.uniforms.glowOnly = false;
      bloom.uniforms.contrast = Number(this.contrast);
      bloom.uniforms.brightness = Number(this.brightness);
      bloom.uniforms.delta = Number(this.delta);
      bloom.uniforms.sigma = Number(this.sigma);
      bloom.uniforms.stepSize = Number(this.stepSize);
    }
  }
};
</script>

 