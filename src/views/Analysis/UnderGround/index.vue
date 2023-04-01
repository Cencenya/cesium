<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">地表透明（地下模式）</div>
      <div class="panel-body">
        <div class="tip-item">
          <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="地下模式开关：">
              <el-switch v-model="form.underGroundEnable" @change="changeCollisionDetection"></el-switch>
            </el-form-item>
            <el-form-item label="地表透明度：">
              <el-slider
                v-model="form.alpha"
                style="width:250px"
                :min="0"
                :max="1"
                :step="0.1"
                @input="changeAlpha"
              ></el-slider>
            </el-form-item>
          </el-form>

          <button @click="camera1">俯仰视角</button>
          <button @click="camera2">地下视角1</button>
          <button @click="camera3">地下视角2</button>
          <!-- <button @click="pickCamera">视角拾取</button>  -->
        </div>

        <div class="tip-item">待地形与影像加载完成，才能看到效果。如果地形和影像未加载出来，请刷新浏览器重试</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/UnderGround";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumUnderGround",
  data() {
    return {
      form: {
        underGroundEnable: true,
        alpha: 0.8
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
    //改变地下模式可用
    changeCollisionDetection() {
      CesiumInit.setCollisionDetection(!this.form.underGroundEnable);
    },

    //改变透明值
    changeAlpha() {
      CesiumInit.setAlpha(this.form.alpha);
    },

    camera1() {
      let flyToOpts = {
        destination: {
          x: -1642520.7062941045,
          y: 5411292.873460493,
          z: 2942295.0596271716
        },
        orientation: {
          heading: 5.926427854705866,
          pitch: -1.5119620008871242,
          roll: 6.266070447186079
        },
        duration: 1
      };
      CesiumInit.viewer.scene.camera.flyTo(flyToOpts);
    },

    camera2() {
      let flyToOpts = {
        destination: {
          x: -1642412.2831661056,
          y: 5411080.547864046,
          z: 2942010.9438542794
        },
        orientation: {
          heading: 0.13770007433951026,
          pitch: 0.06781475986517727,
          roll: 0.0003790297477417326
        },
        duration: 1
      };
      CesiumInit.viewer.scene.camera.flyTo(flyToOpts);
    },

    camera3() {
      let flyToOpts = {
        destination: {
          x: -1642557.3834583496,
          y: 5410928.808183915,
          z: 2942185.351353508
        },
        orientation: {
          heading: 4.451254950474495,
          pitch: 0.12194453156914276,
          roll: 6.280502978418216
        },
        duration: 1
      };
      CesiumInit.viewer.scene.camera.flyTo(flyToOpts);
    },

    pickCamera() {
      console.log(pickCamera(CesiumInit.viewer.scene));
    }, 
  }
};
</script>

<style   scoped>
.panel-body /deep/ .el-form-item__label {
  color: #f3f6fb;
}
</style>
 