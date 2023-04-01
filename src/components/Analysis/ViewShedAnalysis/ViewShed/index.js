 /**
  * 可视域分析。
  *
  * @author xietao
  * @date 2020/11/3
  * @alias ViewShedStage
  * @class
  * @param {Cesium.Viewer} viewer Cesium三维视窗。
  * @param {Object} options 选项。
  * @param {Cesium.Cartesian3} options.viewPosition 观测点位置。
  * @param {Cesium.Cartesian3} options.viewPositionEnd 最远观测点位置（如果设置了观测距离，这个属性可以不设置）。
  * @param {Number} options.viewDistance 观测距离（单位`米`，默认值100）。
  * @param {Number} options.viewHeading 航向角（单位`度`，默认值0）。
  * @param {Number} options.viewPitch 俯仰角（单位`度`，默认值0）。
  * @param {Number} options.horizontalViewAngle 可视域水平夹角（单位`度`，默认值90）。
  * @param {Number} options.verticalViewAngle 可视域垂直夹角（单位`度`，默认值60）。
  * @param {Cesium.Color} options.visibleAreaColor 可视区域颜色（默认值`绿色`）。
  * @param {Cesium.Color} options.invisibleAreaColor 不可视区域颜色（默认值`红色`）。
  * @param {Boolean} options.enabled 阴影贴图是否可用。
  * @param {Boolean} options.softShadows 是否启用柔和阴影。
  * @param {Boolean} options.size 每个阴影贴图的大小。
  */
 import glsl from "./glsl"

 class ViewShedStage {
     constructor(viewer, options) {
         this.viewer = viewer;
         this.viewPosition = options.viewPosition;
         this.viewPositionEnd = options.viewPositionEnd;

         this.viewDistance = options.viewDistance;
         this.viewHeading = options.viewHeading;
         this.viewPitch = options.viewPitch;

         this.horizontalViewAngle = options.horizontalViewAngle || 90.0;
         this.verticalViewAngle = options.verticalViewAngle || 60.0;

         this.visibleAreaColor = options.visibleAreaColor || Cesium.Color.LIME; // Cesium.Color.GREEN;
         this.invisibleAreaColor = options.invisibleAreaColor || Cesium.Color.RED;
         this.enabled = (typeof options.enabled === "boolean") ? options.enabled : true;
         this.softShadows = (typeof options.softShadows === "boolean") ? options.softShadows : true;
         this.size = options.size || 2048;
         this.add();
     }

     //添加
     add() {
         this.createLightCamera();
         this.createShadowMap();
         this.createPostStage();
         this.drawFrustumOutline();
         this.drawSketch();
     }

     //  //获取参数
     //  getOptions() {
     //      return {
     //          viewDistance: this.viewDistance,
     //          horizontalViewAngle: this.horizontalViewAngle,
     //          verticalViewAngle: this.verticalViewAngle
     //      }
     //  }

     //  //更新参数
     //  updateOptions(options) {
     //      this.viewDistance = options.viewDistance;
     //      this.horizontalViewAngle = options.horizontalViewAngle;
     //      this.verticalViewAngle = options.verticalViewAngle;
     //  }

     //清除
     clear() {
         if (this.sketch) {
             this.viewer.entities.removeById(this.sketch.id);
             this.sketch = null;
         }

         if (this.frustumOutline) {
             this.viewer.entities.remove(this.frustumOutline);
             this.frustumOutline = null;
         }

         if (this.postStage) {
             this.viewer.scene.postProcessStages.remove(this.postStage);
             this.postStage = null;
         }
     }

     //相机
     createLightCamera() {
         this.lightCamera = new Cesium.Camera(this.viewer.scene);
         this.lightCamera.position = this.viewPosition;

         this.lightCamera.frustum.near = this.viewDistance * 0.001;
         this.lightCamera.frustum.far = this.viewDistance;
         const hr = Cesium.Math.toRadians(this.horizontalViewAngle);
         const vr = Cesium.Math.toRadians(this.verticalViewAngle);
         const aspectRatio =
             (this.viewDistance * Math.tan(hr / 2) * 2) /
             (this.viewDistance * Math.tan(vr / 2) * 2);
         this.lightCamera.frustum.aspectRatio = aspectRatio;
         if (hr > vr) {
             this.lightCamera.frustum.fov = hr;
         } else {
             this.lightCamera.frustum.fov = vr;
         }
         this.lightCamera.setView({
             destination: this.viewPosition,
             orientation: {
                 heading: Cesium.Math.toRadians(this.viewHeading || 0),
                 pitch: Cesium.Math.toRadians(this.viewPitch || 0),
                 roll: 0
             }
         });
     }

     createShadowMap() {
         this.shadowMap = new Cesium.ShadowMap({
             context: (this.viewer.scene).context,
             lightCamera: this.lightCamera,
             enabled: this.enabled,
             isPointLight: true,
             pointLightRadius: this.viewDistance,
             cascadesEnabled: false,
             size: this.size,
             softShadows: this.softShadows,
             normalOffset: false,
             fromLightSource: false
         });
         this.viewer.scene.shadowMap = this.shadowMap;
     }

     createPostStage() {
         const fs = glsl
         const postStage = new Cesium.PostProcessStage({
             fragmentShader: fs,
             uniforms: {
                 shadowMap_textureCube: () => {
                     this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                     return Reflect.get(this.shadowMap, "_shadowMapTexture");
                 },
                 shadowMap_matrix: () => {
                     this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                     return Reflect.get(this.shadowMap, "_shadowMapMatrix");
                 },
                 shadowMap_lightPositionEC: () => {
                     this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                     return Reflect.get(this.shadowMap, "_lightPositionEC");
                 },
                 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
                     this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                     const bias = this.shadowMap._pointBias;
                     return Cesium.Cartesian4.fromElements(
                         bias.normalOffsetScale,
                         this.shadowMap._distance,
                         this.shadowMap.maximumDistance,
                         0.0,
                         new Cesium.Cartesian4()
                     );
                 },
                 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
                     this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
                     const bias = this.shadowMap._pointBias;
                     const scratchTexelStepSize = new Cesium.Cartesian2();
                     const texelStepSize = scratchTexelStepSize;
                     texelStepSize.x = 1.0 / this.shadowMap._textureSize.x;
                     texelStepSize.y = 1.0 / this.shadowMap._textureSize.y;
                     return Cesium.Cartesian4.fromElements(
                         texelStepSize.x,
                         texelStepSize.y,
                         bias.depthBias,
                         bias.normalShadingSmooth,
                         new Cesium.Cartesian4()
                     );
                 },
                 camera_projection_matrix: this.lightCamera.frustum.projectionMatrix,
                 camera_view_matrix: this.lightCamera.viewMatrix,
                 x_viewDistance: () => {
                     return this.viewDistance;
                 },
                 x_visibleAreaColor: this.visibleAreaColor,
                 x_invisibleAreaColor: this.invisibleAreaColor,
             }
         });
         this.postStage = this.viewer.scene.postProcessStages.add(postStage);
     }

     //视锥边线
     drawFrustumOutline() {
         this.frustumOutline = this.viewer.entities.add({
             name: 'frustumOutline',
             position: this.viewPosition,
             orientation: new Cesium.CallbackProperty(e => {
                 return Cesium.Transforms.headingPitchRollQuaternion(
                     this.viewPosition,
                     Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading - this.horizontalViewAngle, this.viewPitch, 0.0)
                 )
             }, false),
             ellipsoid: {
                 radii: new Cesium.CallbackProperty(e => {
                     return new Cesium.Cartesian3(this.viewDistance, this.viewDistance, this.viewDistance);
                 }, false),

                 innerRadii: new Cesium.Cartesian3(0.01, 0.01, 0.01),
                 minimumClock: new Cesium.CallbackProperty(e => {
                     return Cesium.Math.toRadians(-this.horizontalViewAngle / 2);
                 }, false),
                 maximumClock: new Cesium.CallbackProperty(e => {
                     return Cesium.Math.toRadians(this.horizontalViewAngle / 2);
                 }, false),
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
                     Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading - this.horizontalViewAngle, this.viewPitch, 0.0)
                 )
             }, false),
             ellipsoid: {
                 radii: new Cesium.CallbackProperty(e => {
                     return new Cesium.Cartesian3(this.viewDistance, this.viewDistance, this.viewDistance);
                 }, false),
                 minimumClock: new Cesium.CallbackProperty(e => {
                     return Cesium.Math.toRadians(-this.horizontalViewAngle / 2);
                 }, false),
                 maximumClock: new Cesium.CallbackProperty(e => {
                     return Cesium.Math.toRadians(this.horizontalViewAngle / 2);
                 }, false),
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
 }

 export default ViewShedStage;