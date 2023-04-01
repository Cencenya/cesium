<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">信息编辑</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <el-form-item label="类型">
          <el-input v-model="plot.properties.plotName" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="plot.properties.attr.name"  @input="updateStyle"></el-input>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker
            :show-alpha="true"
            v-model="plot.properties.style.color"
            @input="updateStyle"
          ></el-color-picker>
        </el-form-item>

        <el-form-item label="半径" v-show="showRadius">
          <el-slider
            @input="updateStyle"
            :min="10"
            :max="2000"
            v-model="plot.properties.style.radius"
          ></el-slider>
        </el-form-item>
        <el-form-item label="高度" v-show="showHeight">
          <el-slider
            @input="updateStyle"
            :min="10"
            :max="2000"
            v-model="plot.properties.style.extrudedHeight"
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

  computed: {
    showRadius() {
      //是否显示编辑半径 圆柱体和半球体
      return ["hemisphere", "cylinder"].indexOf(this.plot.properties.plotType) > -1;
    },

    showHeight() {
      //是否显示编辑高度 圆柱体和多边体
      return ["polyhedron", "cylinder"].indexOf(this.plot.properties.plotType) > -1;
    }
  },

  methods: {
    updateStyle() { 
      this.plot.updateStyle();
    }
  }
};
</script>