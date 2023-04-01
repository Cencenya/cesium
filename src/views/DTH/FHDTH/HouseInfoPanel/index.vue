<template>
  <div class="house-info-panel">
    <div class="info-header">户室信息</div>
    <div class="info-body">
      <div>
        <span class="info-label">小区名称：</span>
        <span class="info-text">{{feature.properties.CommunityN}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">楼栋名称：</span>
        <span class="info-text">{{feature.properties.BuildName}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">楼层号：</span>
        <span class="info-text">{{feature.properties.FloorNumbe}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">单元数：</span>
        <span class="info-text">{{feature.properties.UnitCount}}</span>
      </div>

      <div class="info-item">
        <span class="info-label">户主名称：</span>
        <span class="info-text">{{feature.properties.Householde}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">户主电话：</span>
        <span class="info-text">{{feature.properties.Phone}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">底部高度</span>
        <span class="info-text">{{feature.properties.BaseHeight}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">楼层高度：</span>
        <span class="info-text">{{feature.properties.FloorHeigh}}</span>
      </div>
      <div class="info-item">
        <span class="info-label">顶部高度：</span>
        <span class="info-text">{{feature.properties.TopHeight}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    feature: {
      type: Object
    }
  }
};
</script>

<style   scoped>
.house-info-panel {
  position: absolute;
  right: 20px;
  top: 100px;
  background: rgba(26, 56, 143, 0.58);
}

.info-header {
  background: rgba(26, 56, 143, 0.88);
  color: white;
  padding: 5px;
}

.info-body {
  min-width: 260px;
  color: white;
}

.info-item {
  margin: 2px 4px;
  background: rgba(0, 0, 0, 0.137);
  height: 40px;
  line-height: 40px;
}

.info-label {
  display: inline-block;
  min-width: 60px;
  text-align: justify;
  -moz-text-align-last: justify;
  text-align-last: justify;
  width: 80px;
}
</style>