 //author:https://blog.csdn.net/xietao20/article/details/108457857
 import * as turf from "@turf/turf"
 // 3dtiles裁剪类
 export default class TilesClip {
     constructor(viewer) {
         this.viewer = viewer;
     }

     //添加裁剪
     add(positions, tiles) {
         this.tiles = tiles;
         this.clear();
         let bClockwise = this.booleanClockwise(positions);
         if (bClockwise) { //顺时针 需要转换点的顺序
             positions = positions.reverse();
         }
         this.addClippingPlanes(positions);
     }

     //添加ClippingPlanes
     addClippingPlanes(positions) {
         let inverseTransform = this.getInverseTransform(this.tiles);
         let pLength = positions.length;
         let cP, nP, plane, clippingPlanes = [];
         for (let i = 0; i < pLength; ++i) {
             let nextIndex = (i + 1) % pLength;
             cP = positions[i];
             nP = positions[nextIndex];
             plane = this.createPlane(cP, nP, inverseTransform);
             clippingPlanes.push(plane);
         }

         this.tiles.clippingPlanes = new Cesium.ClippingPlaneCollection({
             planes: clippingPlanes,
             edgeWidth: 1.0,
             edgeColor: Cesium.Color.WHITE,
         });
     }

     //坐标转换需要用到的矩阵的方法
     getInverseTransform(tileSet) {
         let transform
         let tmp = tileSet.root.transform
         if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
             // 如果root.transform不存在，则3DTiles的原点变成了boundingSphere.center
             transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileSet.boundingSphere.center)
         } else {
             transform = Cesium.Matrix4.fromArray(tileSet.root.transform)
         }
         return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
     }

     //以3DTiles原点为坐标原点 转换坐标点
     getOriginCoordinateSystemPoint(position, inverseTransform) {
         return Cesium.Matrix4.multiplyByPoint(
             inverseTransform, position, new Cesium.Cartesian3(0, 0, 0))
     }

     //创建Plane
     createPlane(fromPosition, endPosition, inverseTransform) {
         let p1 = this.getOriginCoordinateSystemPoint(fromPosition, inverseTransform);
         let p2 = this.getOriginCoordinateSystemPoint(endPosition, inverseTransform);
         // 定义一个垂直向上的向量up
         let up = new Cesium.Cartesian3(0, 0, 10);
         // right 实际上就是由p1指向p2的向量
         let right = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3());
         // 计算normal， right叉乘up，得到平面法向量，这个法向量指向right的右侧
         let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
         normal = Cesium.Cartesian3.normalize(normal, normal);
         //由于已经获得了法向量和过平面的一点，因此可以直接构造Plane,并进一步构造ClippingPlane
         let plane = Cesium.Plane.fromPointNormal(p1, normal);
         return Cesium.ClippingPlane.fromPlane(plane);
     }

     //判断笛卡尔坐标串是否为顺时针
     booleanClockwise(positions) {
         let degreesArrary = [];
         positions.map(position => {
             degreesArrary.push(this.cartesian3ToDegrees(position));
         });
         //首尾闭合
         degreesArrary.push(degreesArrary[0]);
         let lineString = turf.lineString(degreesArrary);
         return turf.booleanClockwise(lineString)
     }

     //笛卡尔转为经纬度
     cartesian3ToDegrees(position) {
         let c = Cesium.Cartographic.fromCartesian(position);
         return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
     }

     //清空
     clear() {
         if (!this.tiles) return;
         this.tiles.clippingPlanes = new Cesium.ClippingPlaneCollection({
             planes: [],
             edgeWidth: 1.0,
             edgeColor: Cesium.Color.WHITE
         });;
     }
 };