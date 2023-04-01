  /**
   * html文本标绘基类 
   */
  class HtmlPlotBase {
      constructor(viewer, geoFeature) { //传入的点为笛卡尔坐标 
          this.properties = geoFeature.properties;
          this.coordinates = geoFeature.geometry.coordinates; //[x,y,z] 
          this.style = this.properties.style || {};

          this.position = Cesium.Cartesian3.fromDegrees(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
          this.properties.plotBase = "Html";
          this.viewer = viewer;
          this.addBillboard();
      }

      //设置选中状态
      setSelected(selected) {
          this.vmInstance.isSelected = selected;
          this.setPointVisible(selected);
      }


      //添加广告牌
      addBillboard() {
          this.billboardEntity = this.viewer.entities.add({
              position: this.position,
              type: "HtmlPlot",
              plotCode: this.properties.plotCode,
              //   billboard: {
              //       image: this.style.image || "../../static/images/Plot/location.png",
              //       scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
              //       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
              //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM
              //   },
              point: {
                  color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                  pixelSize: 6, //10
                  outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                  outlineWidth: 2, //3 
                  scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4),
                  disableDepthTestDistance: 500,
              },
          });
      }

      //选中的时候显示point
      setPointVisible(visible) {
          if (visible) {
              this.billboardEntity.point.pixelSize = 10;
              this.billboardEntity.point.outlineWidth = 3;
              this.billboardEntity.point.outlineColor = Cesium.Color.YELLOW;
          } else {
              this.billboardEntity.point.pixelSize = 6;
              this.billboardEntity.point.outlineWidth = 2;
              this.billboardEntity.point.outlineColor = Cesium.Color.YELLOW.withAlpha(0.4);
          }
      }

      updatePosition(newPosition) {
          this.billboardEntity.position = newPosition;
          let c = Cesium.Cartographic.fromCartesian(newPosition);
          this.position = newPosition;
          this.coordinates = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
      }

      updateLabel(label) {
          this.vmInstance.label = label;
          this.properties.attr.label = label;
      }


      //转到geojson对象 用于存储操作
      toGeoJson() {
          return {
              "type": "Feature",
              "properties": this.properties,
              "geometry": {
                  "type": "Point",
                  "coordinates": this.coordinates
              }
          }
      }


      //移除标绘
      remove() {
          this.viewer.entities.remove(this.billboardEntity);
          this.viewer.cesiumWidget.container.removeChild(this.vmInstance.$el); //删除DOM
          this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
      }
  }
  export default HtmlPlotBase;