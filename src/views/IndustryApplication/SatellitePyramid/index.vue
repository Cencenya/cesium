<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel" style="width:400px">
      <!-- <div class="panel-header">坐标拾取</div> -->
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <el-form ref="form" :model="form" label-width="140px" label-position="left" size="mini">
          <el-form-item label="方向(heading)">
            <el-slider
              v-model="form.heading"
              :show-tooltip="true"
              @input="valueChange"
              :min="0"
              :max="360"
            ></el-slider> 
          </el-form-item>
          <el-form-item label="前后摇摆(pitch)">
            <el-slider
              v-model="form.pitch"
              :show-tooltip="true"
              @input="valueChange"
              :min="-180"
              :max="180"
            ></el-slider> 
          </el-form-item>
          <el-form-item label="左右摇摆(roll)">
            <el-slider
              v-model="form.roll"
              :show-tooltip="true"
              @input="valueChange"
              :min="-180"
              :max="180"
            ></el-slider> 
          </el-form-item>
          <el-form-item label="夹角1">
            <el-slider
              v-model="form.angle1"
              :show-tooltip="true"
              @input="valueChange"
              :min="0"
              :max="90"
            ></el-slider>
             </el-form-item>
             <el-form-item label="夹角2">
            <el-slider
              v-model="form.angle2"
              :show-tooltip="true"
              @input="valueChange"
              :min="0"
              :max="90"
            ></el-slider>
             </el-form-item>
             <el-form-item label="距离">
            <el-slider
              v-model="form.far"
              :show-tooltip="true"
              :step="20"
              @change="valueChange"
              :min="0" 
              :max="9999999"
            ></el-slider>  
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/IndustryApplication/SatellitePyramid";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumSatellitePyramid", 
  data() {
    return {
      form: {
        farMax:20000000
      }
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
    this.form = cesiumInit.pyramid.getOptions();
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    },

    valueChange() { 
      cesiumInit.pyramid.updateOptions(this.form);
    }
  }
};
</script> 

<style   scoped>
.panel /deep/ .el-form-item__label {
  color: white;
}

.panel /deep/ .el-form-item--mini.el-form-item, 
.panel /deep/  .el-form-item--small.el-form-item {
    margin-bottom: 2px;
}
</style>