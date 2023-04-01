 /*
  * 条带状立体墙类
  */
 import "../../../Materials/WallMaterial/WallTrailStripeVertical"
 export default class StripeAnimateWall {
     constructor(viewer, positions, wallHeight, wallColor, duration, count) {
         this.viewer = viewer;
         this.wallHeight = wallHeight;
         this.wallColor = wallColor;
         this.duration = duration;
         this.count = count;

         this.setPositions(positions);
         this.createEntity();
     }

     //设置点串
     setPositions(value) {
         this.positions = value ? value : [];
         this.initHeights();
     }

     //初始化高度
     initHeights() {
         let minimumHeights = []; //最小高度集合
         let maximumHeights = []; //最大高度集合 
         this.positions.forEach(position => {
             const cartographic = Cesium.Cartographic.fromCartesian(position);
             minimumHeights.push(cartographic.height);
             maximumHeights.push(cartographic.height + this.wallHeight);
         });
         this.minimumHeights = minimumHeights;
         this.maximumHeights = maximumHeights;
     }

     //创建实体
     createEntity() {
         this.addWall();
     }

     //添加墙体
     addWall() {
         this.wallEntity = this.viewer.entities.add({
             wall: {
                 positions: this.positions,
                 minimumHeights: this.minimumHeights,
                 maximumHeights: this.maximumHeights,
                 material: new Cesium.WallTrailStripeVerticalMaterialProperty(this.wallColor, this.duration || 2000, this.count || 2)
             }
         });
     }

     //移除墙体对象
     remove() {
         this.viewer.entities.remove(this.wallEntity);
     }
 }