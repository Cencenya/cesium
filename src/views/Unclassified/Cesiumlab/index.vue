<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">3dtiles高度调整</div>
      <div class="panel-body">
        <el-slider v-model="height" :show-tooltip="false" @input="valueChange" :min="-200" :max="200"></el-slider>
        <span>{{height}}</span>
        <div class="tip-item">
          有时候通过数据处理软件转换处理的3dtiles数据加载到前端显示的时候会发现看不见或者一闪而过，又或是看得见但是移动场景的时候
          会发现模型会飘着移动，感觉模型位置没有固定。最可能的原因就是生成的数据高度不对。
        </div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Unclassified/Cesiumlab";
export default {
  name: "CesiumBuild",  
  data() {
    return {
      height: 55
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
      CesiumInit.setTilesetHeight(this.height);
    }
  }
};
</script>

 