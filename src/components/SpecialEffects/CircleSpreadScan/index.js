 /*
  * 圆形扩散扫描
  */
 import "../../Materials/CircleSpreadScanMaterial"
 export default class CircleSpreadScan {
     constructor(viewer, position, radius, color) {
         this.viewer = viewer;
         this.position = position;
         this.maxRadius = radius;

         this.color = color;
         this.createEntity();
     }

     //创建实体
     createEntity() {
         let radius = 0.1;
         this.ellipseEntity = this.viewer.entities.add({
             position: this.position,
             ellipse: {
                 semiMinorAxis: new Cesium.CallbackProperty(e => {
                     radius += 8;
                     radius > this.maxRadius && (radius = 0.1);
                     return radius
                 }, false),
                 semiMajorAxis: new Cesium.CallbackProperty(e => {
                     return radius
                 }, false),
                 material: new Cesium.CircleSpreadScanMaterialProperty(this.color),
             }
         });
     }


     //移除对象
     remove() {
         this.viewer.entities.remove(this.ellipseEntity);
     }
 }