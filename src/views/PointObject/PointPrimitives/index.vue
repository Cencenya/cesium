<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">大量图标点 </div>
      <div class="panel-body">
        <div class="tip-item">primitives展示大量图标点数据（2万）</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/PointObject/PointPrimitives";
import {pickCamera} from "@/utils/scene"
export default {
  name: "CesiumPointPrimitives",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    pickCamera(){
      console.log(pickCamera(CesiumInit.viewer.scene))
    }
  }
};
</script>

 