<template>
  <div class="app-wrapp">
    <div class="cesium-container">
      <div id="cesium-container1"></div>
      <div id="cesium-container2"></div>
    </div> 
    <div class="panel">
      <div class="panel-body">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="开启同步">
            <el-switch v-model="form.value1" @change="change"></el-switch>
          </el-form-item>
        </el-form>

        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/Analysis/ViewerSync";
import ViewerSyncUtils from "@/components/Analysis/ViewerSyncUtils";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumViewerSync", 
  data() {
    return {
      form: {
        value1: false
      }
    };
  },

  mounted() {
    cesiumInit.initViewer1("cesium-container1");
    cesiumInit.initViewer2("cesium-container2");

    cesiumInit.viewerSyncUtils = new ViewerSyncUtils(
      cesiumInit.viewer1,
      cesiumInit.viewer2
    ); 

    cesiumInit. setView();
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {
    logoClick() {
      this.$router.go(-1);
    },

    change() {
      cesiumInit.viewerSyncUtils.sync(this.form.value1);
    },

    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer1.scene));
    }
  }
};
</script>

<style  scoped>
.cesium-container {
  display: flex;
}

.cesium-container div {
  width: 50%;
}

.panel-body /deep/ .el-form-item__label {
  color: white;
}

#cesium-container2 {
  border-left: 1px solid white;
}
</style>

 