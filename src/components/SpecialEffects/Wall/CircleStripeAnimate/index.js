 /*
  * 圆形条状动态立体墙类
  */

 import "../../../Materials/WallMaterial/WallTrailStripeVertical"
 export default class CircleStripeAnimateWall {
     constructor(viewer, position, radius, wallHeight, wallColor, duration, count) {
         this.viewer = viewer;
         this.wallHeight = wallHeight;
         this.radius = radius;
         this.wallColor = wallColor;
         this.duration = duration;
         this.count = count;
         this.generatePositions(position);
         this.createEntity();
     }

     //构造点串
     generatePositions(position) {
         //转为经纬度
         let c = Cesium.Cartographic.fromCartesian(position);
         if (c.height < 0) c.height = 0;
         let degrees = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
         let points = this.generateCirclePoints([degrees[0], degrees[1]], this.radius);
         let positions = this.pointsToPositions(points, degrees[2]);
         this.setPositions(positions);
     }

     //二维点转三维点
     pointsToPositions(points, height) {
         let positions = [];
         points.map(item => {
             positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], height))
         })
         return positions;
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

     //获取一个圆的边缘坐标
     generateCirclePoints(center, radius) {
         let points = [];
         for (let i = 0; i <= 360; i += 2) {
             points.push(this.getCirclePoint(center[0], center[1], i, radius))
         }
         return points;
     }

     getCirclePoint(lon, lat, angle, radius) {
         let dx = radius * Math.sin(angle * Math.PI / 180.0);
         let dy = radius * Math.cos(angle * Math.PI / 180.0);
         let ec = 6356725 + (6378137 - 6356725) * (90.0 - lat) / 90.0;
         let ed = ec * Math.cos(lat * Math.PI / 180);
         let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
         let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
         return [newLon, newLat];
     }

     //移除墙体对象
     remove() {
         this.viewer.entities.remove(this.wallEntity);
     }
 }