 /*
  * 规则多边形扩散动态立体墙类
  */

 import "../../../Materials/WallMaterial/WallGradients"
 export default class RegularSpreadWall {
     constructor(viewer, edgeCount, position, radius, wallHeight, wallColor) {
         this.viewer = viewer;
         if (!edgeCount || edgeCount < 3) edgeCount = 3;
         this.edgeCount = edgeCount;
         this.wallHeight = wallHeight;
         this.radius = radius;
         this.wallColor = wallColor;
         this.init(position);
         this.createEntity();
     }

     //初始化
     init(position) {
         //转为经纬度
         let c = Cesium.Cartographic.fromCartesian(position);
         if (c.height < 0) c.height = 0;
         this.baseHeight = c.height;

         this.centerDegrees = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
         this.currentRadius = this.radius;
         this.rPositions = {}; //坐标缓存
         let points = this.generateCirclePoints([this.centerDegrees[0], this.centerDegrees[1]], this.currentRadius);
         let positions = this.pointsToPositions(points, this.centerDegrees[2]);
         this.rPositions[this.radius] = positions;
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

     //获取坐标串
     getPositions() {
         this.currentRadius += 5;
         if (this.currentRadius > this.radius) this.currentRadius = 1;
         if (this.rPositions[this.currentRadius]) return this.rPositions[this.currentRadius];
         let points = this.generateCirclePoints([this.centerDegrees[0], this.centerDegrees[1]], this.currentRadius);
         let positions = this.pointsToPositions(points, this.centerDegrees[2]);
         this.rPositions[this.currentRadius] = positions;
         return this.rPositions[this.currentRadius];
     }

     //初始化高度
     initHeights() {
         this.minimumHeights = new Array(this.positions.length).fill(this.baseHeight);
         this.maximumHeights = new Array(this.positions.length).fill(this.baseHeight + this.wallHeight);
     }

     //创建实体
     createEntity() {
         this.addWall();
     }

     //添加墙体
     addWall() {
         this.wallEntity = this.viewer.entities.add({
             wall: {
                 positions: new Cesium.CallbackProperty(e => {
                     return this.getPositions()
                 }, false),
                 minimumHeights: this.minimumHeights,
                 maximumHeights: this.maximumHeights,
                 material: new Cesium.WallGradientsMaterialProperty(this.wallColor)
             }
         });
     }

     //获取一个圆的边缘坐标
     generateCirclePoints(center, radius) {
         let points = [];
         let num = parseInt(360 / this.edgeCount);
         for (let i = 0; i <= 360; i += num) {
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