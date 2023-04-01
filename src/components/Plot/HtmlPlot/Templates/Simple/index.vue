<!--标绘简单的文本-->
<template>
  <div class="LabelPlot-container" @click="onClick" :class="{'is-selected':isSelected}">
    <div class="info-item">{{label}}</div>
  </div>
</template>
<script>
export default {
  name: "LabelPlot", //文本标绘 标绘简单的文本
  props: {
    label: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isSelected:false
    };
  },
  methods: {
    onClick() {
      if (this.PlotItemClick) {
        this.PlotItemClick();
      }
    }
  }
};
</script>

<style   scoped>
.LabelPlot-container {
  background: #e3eee59e;
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
  padding: 5px;
  border: 1px solid #9c9944e8;
}

.is-selected{ 
  border: 2px solid yellow ;
}

.is-selected::before{ 
  border-left: 2px dashed yellow !important;
}

.LabelPlot-container:hover {
  border: 1px solid rgb(9, 255, 0);
}

.LabelPlot-container::before {
  position: absolute;
  content: "";
  left: 50%;
  bottom: -30px;
  height: 30px;
  border-left: 1px dashed #c5e22770;
}
</style>