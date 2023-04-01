<template>
  <div class="div-point-container">
    <div class="divpoint divpoint-theme">
      <div class="divpoint-wrap">
        <div class="area">
          <div class="arrow-lt"></div>
          <div class="b-t"></div>
          <div class="b-r"></div>
          <div class="b-b"></div>
          <div class="b-l"></div>
          <div class="arrow-rb"></div>
          <div class="label-wrap">
            <div class="title">{{wStation.name}}</div>
            <div class="label-content">
              <div class="data-li">
                <div class="data-label">实时流量：</div>
                <div class="data-value">
                  <span class="label-num">{{wStation.flow}}</span>
                  <span class="label-unit">m³/s</span>
                </div>
              </div>

              <div class="data-li">
                <div class="data-label">水池液位：</div>
                <div class="data-value">
                  <span class="label-num">{{wStation.stage}}</span>
                  <span class="label-unit">m</span>
                </div>
              </div>
              <div class="data-li">
                <div class="data-label">水泵状态：</div>
                <div class="data-value" v-for="(item, index) in wStation.status" :key="index">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.stateName"
                    placement="bottom"
                  >
                    <span class="label-tag" :style="{'background':getBg(item.state)}">{{item.num}}号</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="b-t-l"></div>
        <div class="b-b-r"></div>
      </div>
      <div class="arrow"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DivPoint",
  data() {
    return {
      show: true
    };
  },
  props: {
    wStation: {
      type: Object
    }
  },
  methods: {
    getBg(state) {
      switch (state) {
        case 0:
          return "red";
        case 1:
          return "green";
        case 2:
          return "#ffff00ab";
      }
    }
  }
};
</script>

<style   scoped>
.div-point-container {
  position: absolute;
  left: 0px;
  bottom: 0px;
  display: block;
}

.divpoint-wrap {
  position: relative;
  padding: 30px;
  overflow: hidden;
}

.divpoint-theme .arrow,
.divpoint-theme .title::before {
  background-color: #28bbf0;
}

.divpoint .arrow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 45px;
  height: 2px;
  transform: rotate(-45deg) translate(5px, -15px);
}

.divpoint-theme .area {
  background-image: linear-gradient(
      135deg,
      transparent 30px,
      #28bbf06c 30px,
      #28bbf06c 50%,
      transparent 50%
    ),
    linear-gradient(
      -45deg,
      transparent 30px,
      #28bbf06c 30px,
      #28bbf06c 50.1%,
      transparent 50%
    );
}

.divpoint .area {
  position: relative;
  min-width: 180px;
  min-height: 150px;
}

.divpoint-theme .b-b,
.divpoint-theme .b-b-r,
.divpoint-theme .b-l,
.divpoint-theme .b-r,
.divpoint-theme .b-t,
.divpoint-theme .b-t-l {
  background-color: #29baf1;
  box-shadow: 0 0 10px 2px #29baf1;
}

.divpoint .b-t-l {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 62px;
  transform: rotate(45deg) translate(52px, -22px);
  z-index: 10;
}

.divpoint .b-b-r {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1px;
  height: 62px;
  transform: rotate(45deg) translate(-52px, 22px);
  z-index: 10;
}

.divpoint .b-t {
  position: absolute;
  top: 0;
  left: 44px;
  right: 0;
  height: 1px;
  z-index: 10;
}

.divpoint .b-r {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 44px;
  width: 1px;
  z-index: 10;
}

.divpoint .b-b {
  position: absolute;
  left: 0;
  right: 44px;
  bottom: 0;
  height: 1px;
  z-index: 10;
}

.divpoint .b-l {
  position: absolute;
  top: 44px;
  left: 0;
  bottom: 0;
  width: 1px;
  z-index: 10;
}

.divpoint .label-wrap {
  padding-left: 12px;
  color: #fff;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
}

.divpoint-theme .title {
  background-image: linear-gradient(135deg, transparent 25px, #29baf1 25px);
}

.divpoint .title {
  margin-top: 20px;
  padding: 0 12px 0 30px;
  height: 36px;
  line-height: 36px;
  position: relative;
}

.divpoint .data-li {
  padding: 4px 45px 4px 0;
}

.data-value,
.divpoint .data-label {
  display: inline-block;
}

.divpoint .data-value {
  font-size: 14px;
}

.data-value,
.divpoint .data-label {
  display: inline-block;
}

.divpoint .label-num {
  margin-right: 3px;
  color: #f09e28;
  font-weight: 600;
}

.divpoint .label-tag {
  display: inline-block;
  position: relative;
  margin-right: 6px;
  padding: 0 6px;
  font-weight: 600;
  cursor: pointer;
  background-color: #909399;
  border-radius: 4px;
}
</style>