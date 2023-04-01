<!-- 渐变色文本标绘 -->
<template>
  <div class="gradients-labelPlot-container" @click="onClick" :class="{'is-selected':isSelected}">
    <div class="info-item">{{label}}</div>
  </div>
</template>
<script>
export default {
  name: "GradientsLabelPlot",  
  props: {
    label: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      isSelected: false
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
.gradients-labelPlot-container {
  background-image: linear-gradient(to right, #e64dc1, #00ffc3);
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
  padding: 5px;
  border: 1px solid #9c9944e8;
}

.gradients-labelPlot-container:hover {
 border: 1px solid rgb(9, 255, 0);
}

.gradients-labelPlot-container::before {
  position: absolute;
  content: "";
  left: 50%;
  bottom: -30px;
  height: 30px;
  border-left: 1px dashed #c5e22770;
}

.is-selected{ 
  border: 2px solid yellow ;
}

.is-selected::before{ 
  border-left: 2px dashed yellow !important;
}

</style>