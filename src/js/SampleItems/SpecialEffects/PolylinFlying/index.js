// 飞线实例
import appConfig from "@/js/appConfig"
import "@/components/Materials/PolylineMaterial/PolylineTrail"
import * as turf from "@turf/turf"

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
        this.addFlyintLines();
    },

    //添加飞线
    addFlyintLines() {
        fetch('../static/data/nanshan-road1.geojson').then(res => {
            return res.json();
        }).then(res => {
            var bbox = turf.bbox(res);
            let points = turf.randomPoint(100, { bbox: bbox }); //生成随机点
            let features = points.features;
            let point;
            let startPosition;
            let endPosition;
            features.forEach(item => {
                point = item.geometry.coordinates;
                startPosition = Cesium.Cartesian3.fromDegrees(point[0], point[1], 0);
                endPosition = Cesium.Cartesian3.fromDegrees(point[0], point[1], 5000 * Math.random())
                this.addFlyintLine([startPosition, endPosition]);
            })
        })
    },

    addFlyintLine(positions) {
        this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 2,
                material: new Cesium.PolylineTrailMaterialProperty({
                    speed: 6 * Math.random(),
                    color: Cesium.Color.CYAN,
                    percent: 0.1,
                    gradient: 0.01,
                }),
            }
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
                x: -2392968.857,
                y: 5391789.3995,
                z: 2423807.75055
            },
            orientation: {
                heading: 0.0029569,
                pitch: -0.474585,
                roll: 0.0000078,
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