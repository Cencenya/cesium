<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">属性设置</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <!-- <el-form-item label="视频名称">
          <el-input v-model="plot.properties.style.text"  @input="updateStyle"></el-input>
        </el-form-item>-->
        <el-form-item label="视频地址">
          <el-input v-model="plot.properties.style.url" @input="updateStyle"></el-input>
        </el-form-item>
        <el-form-item v-if="plot.properties.plotType=='wall'" label="墙体高度">
          <el-slider
            @input="updateStyle"
            :step="0.5"
            :min="0"
            :max="plot.properties.style.wallHeight+50"
            v-model="plot.properties.style.wallHeight"
          ></el-slider>
        </el-form-item>
        <el-form-item v-if="plot.properties.plotType=='wall'" label="底部高度">
          <el-slider
            @input="updateStyle"
            :step="0.5"
            :min="0"
            :max="plot.properties.style.baseHeight+20"
            v-model="plot.properties.style.baseHeight"
          ></el-slider>
        </el-form-item>
        <el-form-item label="视频操作">
          <el-button type="primary" @click="playClick">播放</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    plot: {
      type: Object
    }
  },
  methods: {
    updateStyle() {
      this.plot.updateStyle();
    },
    playClick() {
      this.plot.playVideo();
    }
  }
};
</script>