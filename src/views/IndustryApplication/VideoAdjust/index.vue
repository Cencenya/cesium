<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">视频贴图参数调整</div>
      <div class="panel-body">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="视频角度">
            <el-slider
              v-model="form.stRotation"
              :show-tooltip="false"
              @input="valueChange"
              :min="0"
              :max="360"
            ></el-slider>
          </el-form-item>
        </el-form>

        <div>
          <button @click="getParams">获取参数</button>
        </div>

        <div class="tip-item">
          视频融合顾名思义就是将监控视频与三维场景融合在一起，但是由于监控视角、监控分辨率与场景数据分辨率存在较大差异等原因，
          所以很难完全融合在一起的，只能最大程度调整监控画面与三维场景的融合。之前在项目中是通过调整面材质的方向及面坐标点来实现的，
          可能不是最好的方式，但是将就能用。
        </div>
        <div class="tip-item">拖动滑块进行材质方向调整，点击面对象编辑节点，点击“获取参数”按钮打印调整后的参数。</div>
      </div>
    </div>

    <div class="video-container">
      <video
        id="video"
        muted="muted"
        width="636"
        height="432"
        src="/static/lukou.mp4"
        autoplay="autoplay"
        loop
      ></video>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/IndustryApplication/VideoAdjust";
export default {
  name: "CesiumSpreadCircle",  
  data() {
    return {
      form: {
        stRotation: 0
      }
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    valueChange() {
      CesiumInit.updateStRotation(this.form.stRotation);
    },

    getParams() {
      this.form.positions = CesiumInit.getPositions();
      console.log(this.form);
      this.$message.success("参数已打印到控制台");
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script>
 

<style   scoped>
.panel-body {
  width: 300px;
}

.panel-body /deep/ .el-form-item__label {
  color: #edeeee;
  line-height: 40px;
}

.panel-body /deep/ .el-radio {
  color: #edeeee;
}

.video-container {
  position: absolute;
  right: 10px;
  top: 70px;
}
</style>