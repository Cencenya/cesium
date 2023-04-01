<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">属性设置</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <el-form-item label="文字内容">
          <el-input v-model="plot.properties.style.text"  @input="updateStyle"></el-input>
        </el-form-item>
        <el-form-item v-if="plot.properties.plotType=='polygon'" label="文字角度">
          <el-slider
            @input="updateStyle"
            :min="0"
            :max="360"
            v-model="plot.properties.style.stRotation"
          ></el-slider>
        </el-form-item>
        <el-form-item label="字体大小">
          <el-slider
            @input="updateStyle"
            :step="1"
            :min="16"
            :max="124"
            v-model="plot.properties.style.fontSize"
          ></el-slider>
        </el-form-item>
        <el-form-item label="字体颜色">
          <el-color-picker v-model="plot.properties.style.color" @change="updateStyle"></el-color-picker>
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
    }
  }
};
</script>