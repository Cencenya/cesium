// 尾迹线实例
import appConfig from "@/js/appConfig"
import "@/components/Materials/PolylineMaterial/PolylineTrail"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addData();
        this.setView();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer("cesium-container", {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            shouldAnimate: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
        });
        this.viewer.imageryLayers.removeAll(true); //删除所有底图 
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //添加数据
    addData() {
        this.loadBuildData();
        this.loadLine1();
        this.loadLine2();
        this.loadLine3();
    },

    loadLine1() {
        var promise = Cesium.GeoJsonDataSource.load('../static/data/nanshan-road1.geojson');
        promise.then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            let values = dataSource.entities.values;

            for (var i = 0; i < values.length; i++) {
                var line = values[i];
                line.polyline.material = new Cesium.PolylineTrailMaterialProperty({
                    speed: 4 * Math.random(),
                    color: Cesium.Color.YELLOW,
                    percent: 0.5,
                    gradient: 0.01,
                });
                line.polyline.width = 3;
            }
        }).otherwise(function(error) {
            console.log(error)
        });
    },

    loadLine2() {
        var promise = Cesium.GeoJsonDataSource.load('../static/data/nanshan-road2.geojson');
        promise.then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            let values = dataSource.entities.values;

            for (var i = 0; i < values.length; i++) {
                var line = values[i];
                line.polyline.material = new Cesium.PolylineTrailMaterialProperty({
                    speed: 5 * Math.random(),
                    color: Cesium.Color.CYAN,
                    percent: 0.5,
                    gradient: 0.01,
                });
                line.polyline.width = 3;
            }
        }).otherwise(function(error) {
            console.log(error)
        });
    },

    loadLine3() {
        var promise = Cesium.GeoJsonDataSource.load('../static/data/nanshan-road3.geojson');
        promise.then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            let values = dataSource.entities.values;

            for (var i = 0; i < values.length; i++) {
                var line = values[i];
                line.polyline.material = new Cesium.PolylineTrailMaterialProperty({
                    speed: 6 * Math.random(),
                    color: Cesium.Color.RED,
                    percent: 0.5,
                    gradient: 0.01,
                });
                line.polyline.width = 3;
            }
        }).otherwise(function(error) {
            console.log(error)
        });
    },

    //加载建筑物数据
    loadBuildData() {
        let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "../static/data/nanshan_buildings/tileset.json"
        }));
        tileset.readyPromise.then((tileset) => {
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
                                `varying vec3 v_positionEC;
                              void main(void){
                                  vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                                  float glowRange = 150.0; // 光环的移动范围(高度)
                                  gl_FragColor = vec4(0.2,  0.5, 1.0,1.0); // 颜色
                                  gl_FragColor *= vec4(vec3(position.z / 120.0), 1.0); // 渐变
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

    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2392152.372495393,
                y: 5389303.638930457,
                z: 2426554.4952483447
            },
            orientation: {
                heading: 6.23986332651069,
                pitch: -0.6180741519438153,
                roll: 6.283059179056622
            }
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;