<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">倾斜模型动态单体化</div>
      <div class="panel-body">
        <div>
          鼠标左键点击楼栋，查看楼栋信息。（部分房屋没有做单体化）
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/DTH/DynamicDTH";
import { pickCamera } from "@/utils/scene"
export default {
  name: "CesiumDynamicDTH", 
  data() {
    return {
      height: 55
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    pickCamera() {
      let p = pickCamera(cesiumInit.viewer.scene);
      console.log(p);
    }
  }
};
</script>
 