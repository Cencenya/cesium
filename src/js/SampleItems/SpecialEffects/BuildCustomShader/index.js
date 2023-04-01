 // 矢量白膜自定义shader 不改源码实例 
 let CesiumInit = {
     init(el) {
         this.initViewer(el);
         this.loadBuildData();
     },

     //初始化viewer
     initViewer(el) {
         this.viewer = new Cesium.Viewer(el, {
             infoBox: false,
             selectionIndicator: false,
             navigation: false,
             animation: false,
             timeline: false,
             baseLayerPicker: false,
             geocoder: false,
             homeButton: false,
             sceneModePicker: false,
             navigationHelpButton: false,
             shouldAnimate: false,
             imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                 url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
             })
         });
         //是否开启抗锯齿
         this.viewer.scene.fxaa = true;
         this.viewer.scene.postProcessStages.fxaa.enabled = true;
         this.viewer._cesiumWidget._creditContainer.style.display = "none";
     },

     //加载建筑物数据
     loadBuildData() {
         let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
             url: "http://data.marsgis.cn/3dtiles/jzw-shanghai/tileset.json" //引用火星科技数据
         }));
         tileset.readyPromise.then((tileset) => {
             //飞到3dtiles模型的位置
             //  var boundingSphere = tileset.boundingSphere;
             //  this.viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
             //  this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
             this.setView();
             tileset.tileVisible.addEventListener(function(tile) {
                 var content = tile.content;
                 var featuresLength = content.featuresLength;
                 for (var i = 0; i < featuresLength; i += 2) {
                     let feature = content.getFeature(i)
                     let model = feature.content._model

                     if (model && model._sourcePrograms && model._rendererResources) {
                         Object.keys(model._sourcePrograms).forEach(key => {
                             let program = model._sourcePrograms[key]
                             model._rendererResources.sourceShaders[program.fragmentShader] =
                                 // "varying vec3 v_positionEC;\n" +
                                 // "void main(void){\n" +
                                 // "    vec4 position = czm_inverseModelView * vec4(v_positionEC,1);\n" +
                                 // "    float glowRange = 10.0;\n" +
                                 // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
                                 // "    gl_FragColor *= vec4(vec3(position.z / 10.0), 1.0);\n" +
                                 // "    float time = fract(czm_frameNumber / 360.0);\n" +
                                 // "    time = abs(time - 0.5) * 2.0;\n" +
                                 // "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
                                 // "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
                                 // "}\n"

                                 `varying vec3 v_positionEC;
                               void main(void){
                                   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                                   float glowRange = 100.0; // 光环的移动范围(高度)
                                   gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
                                   gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0); // 渐变
                                   // 动态光环
                                   float time = fract(czm_frameNumber / 360.0);
                                   time = abs(time - 0.5) * 2.0;
                                   float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                                   gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
                               }
                              `
                         })
                         model._shouldRegenerateShaders = true
                     }
                 }
             });
         }).otherwise(function(error) {
             console.error(error);
         });
     },

     //设置初始视角
     setView() {
         let flyToOpts = {
             destination: {
                 x: -2850553.061164769,
                 y: 4659137.661901569,
                 z: 3286154.8283797456
             },
             orientation: {
                 heading: 6.266559430745632,
                 pitch: -0.5461040848738343,
                 roll: 6.283127387035428
             },
             duration: 1
         };
         this.viewer.scene.camera.setView(flyToOpts);
     },

     destroy() {
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }
 export default CesiumInit;