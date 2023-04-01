<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">视频融合</div>
      <div class="panel-body">
        <el-form ref="form" :model="form" label-width="60px" label-position="left" size="mini">
          <el-form-item label="翻转">
            <el-slider
              v-model="form.rotation.x"
              :show-tooltip="true"
              @input="valueChange"
              :min="-180"
              :max="180"
            ></el-slider>
          </el-form-item>
          <el-form-item label="旋转">
            <el-slider
              v-model="form.rotation.y"
              :show-tooltip="true"
              @input="valueChange"
              :min="-360"
              :max="360"
            ></el-slider>
          </el-form-item>
          <el-form-item label="夹角">
            <el-slider
              v-model="form.fov"
              :show-tooltip="true"
              @input="valueChange"
              :min="0"
              :max="90"
            ></el-slider>
          </el-form-item>

          <el-form-item label="透明">
            <el-slider
              v-model="form.alpha"
              :show-tooltip="true"
              @input="valueChange"
              :step="0.1"
              :min="0"
              :max="1"
            ></el-slider>
          </el-form-item>

          <el-form-item label="投影线">
            <el-switch v-model="form.debugFrustum" @change="setFrustumVisible" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <video
          src="/static/lukou.mp4"
          autoplay="autoplay"
          id="testVideo"
          controls
          style="height:200px;width:369px;"
        ></video>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/IndustryApplication/VideoFusion";

export default {
  name: "CesiumVideoShed3d", 
  data() {
    return {
      form: {
        rotation: {}
      }
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
    this.form = cesiumInit.videoShed3d.getOptions();
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    valueChange() {
      cesiumInit.videoShed3d.updateOptions(this.form);
    },

    setFrustumVisible() {
      cesiumInit.videoShed3d.setFrustumVisible(this.form.debugFrustum);
    }
  }
};
</script>
 

<style   scoped>
.panel-body /deep/ .el-form-item__label {
  color: #edeeee;
  line-height: 40px;
}
</style>