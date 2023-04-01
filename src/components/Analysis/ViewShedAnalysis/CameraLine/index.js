 /**
  * 相机类 
  * */

 import { getHeading, getPitch } from "../Utils"

 class CameraLine {
     constructor(viewer, options) {
         this.viewer = viewer;

         this.viewPosition = options.viewPosition; //观察点
         this.viewPositionEnd = options.viewPositionEnd; //结束点
         this.viewDistance = this.getDistance();

         this.viewHeading = this.getViewHeading();
         this.viewPitch = this.getViewPitch();

         this.horizontalViewAngle = options.horizontalViewAngle || 90.0;
         this.verticalViewAngle = options.verticalViewAngle || 60.0;

         this.drawSketch();
         this.drawFrustumOutline();
     }

     //更新结束点
     updateEndPosition(endPosition) {
         this.viewPositionEnd = endPosition;
     }

     //获取heading
     getViewHeading() {
         this.viewHeading = getHeading(this.viewPosition, this.viewPositionEnd);
         return this.viewHeading;
     }

     //获取pitch
     getViewPitch() {
         this.viewPitch = getPitch(this.viewPosition, this.viewPositionEnd);
         return this.viewPitch;
     }

     //获取距离
     getDistance() {
         this.viewDistance = Cesium.Cartesian3.distance(this.viewPosition, this.viewPositionEnd);
         return this.viewDistance;
     }

     //获取相机参数
     getOptions() {
         return {
             viewPosition: this.viewPosition,
             viewPositionEnd: this.viewPositionEnd,
             viewDistance: this.viewDistance,
             viewHeading: this.viewHeading,
             viewPitch: this.viewPitch,
             horizontalViewAngle: this.horizontalViewAngle,
             verticalViewAngle: this.verticalViewAngle
         }
     }

     //视锥边线
     drawFrustumOutline() {
         this.frustumOutline = this.viewer.entities.add({
             name: 'frustumOutline',
             position: this.viewPosition,
             orientation: new Cesium.CallbackProperty(e => {
                 return Cesium.Transforms.headingPitchRollQuaternion(
                     this.viewPosition,
                     Cesium.HeadingPitchRoll.fromDegrees(this.getViewHeading() - this.horizontalViewAngle, this.getViewPitch(), 0.0)
                 )
             }, false),
             ellipsoid: {
                 radii: new Cesium.CallbackProperty(e => {
                     const distance = this.getDistance();
                     return new Cesium.Cartesian3(distance, distance, distance);
                 }, false),

                 innerRadii: new Cesium.Cartesian3(0.01, 0.01, 0.01),
                 minimumClock: Cesium.Math.toRadians(-this.horizontalViewAngle / 2),
                 maximumClock: Cesium.Math.toRadians(this.horizontalViewAngle / 2),
                 minimumCone: Cesium.Math.toRadians(this.verticalViewAngle + 7.75),
                 maximumCone: Cesium.Math.toRadians(180 - this.verticalViewAngle - 7.75),
                 fill: false,
                 outline: true,
                 outlineColor: Cesium.Color.AQUA
             }
         });
     }

     //视网网格
     drawSketch() {
         this.sketch = this.viewer.entities.add({
             name: 'sketch',
             position: this.viewPosition,
             orientation: new Cesium.CallbackProperty(e => {
                 return Cesium.Transforms.headingPitchRollQuaternion(
                     this.viewPosition,
                     Cesium.HeadingPitchRoll.fromDegrees(this.getViewHeading() - this.horizontalViewAngle, this.getViewPitch(), 0.0)
                 )
             }, false),
             ellipsoid: {
                 radii: new Cesium.CallbackProperty(e => {
                     const distance = this.getDistance();
                     return new Cesium.Cartesian3(distance, distance, distance);
                 }, false),
                 minimumClock: Cesium.Math.toRadians(-this.horizontalViewAngle / 2),
                 maximumClock: Cesium.Math.toRadians(this.horizontalViewAngle / 2),
                 minimumCone: Cesium.Math.toRadians(this.verticalViewAngle + 7.75),
                 maximumCone: Cesium.Math.toRadians(180 - this.verticalViewAngle - 7.75),
                 fill: false,
                 outline: true,
                 subdivisions: 256,
                 stackPartitions: 64,
                 slicePartitions: 64,
                 outlineColor: Cesium.Color.AQUA
             }
         });
     }

     //清除
     remove() {
         if (this.sketch) {
             this.viewer.entities.remove(this.sketch);
             this.sketch = null;
         }

         if (this.frustumOutline) {
             this.viewer.entities.remove(this.frustumOutline);
             this.frustumOutline = null;
         }
     }
 }
 export default CameraLine;