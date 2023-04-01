<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">测量</div>
      <div class="panel-body">
        <button @click="measure('distance')">空间距离</button>
        <button @click="measure('area')">水平面积</button> 
        <button @click="measure('height')">高度测量</button>
        <button @click="measure('clear')">清除</button>
        <div class="tip-item">选择测量工具后在场景中左键添加测量点，右击取消或者结束测量</div>
        <div class="tip-item">测量高度时先在房屋底部点击添加第一个点，然后鼠标移动到房屋顶部，根据水平圆查看需要取那个地方的高度按下第二个点结束</div>
        <div class="tip-item">测量水平面积时，将忽略Z值，与二维地图中测量面积功能相同</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/SceneTools/Measure";
export default {
  name: "CesiumMeasure", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    measure(type) {
      CesiumInit.measure(type);
    }
  }
};
</script>
 