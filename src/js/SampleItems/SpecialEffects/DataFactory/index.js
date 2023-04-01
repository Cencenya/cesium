// 数字工厂实例  
import appConfig from "@/js/appConfig"
import ScanCircle from "@/components/SpecialEffects/ScanCircle"
import CircleSpreadWall from "@/components/SpecialEffects/Wall/CircleSpreadAnimate"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addFactoryData();

        this.addScanCircle();
        this.addCircleSpreadWall();
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
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
            })
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        // 亮度设置
        var stages = this.viewer.scene.postProcessStages;
        this.viewer.scene.brightness =
            this.viewer.scene.brightness ||
            stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
        this.viewer.scene.brightness.enabled = true;
        this.viewer.scene.brightness.uniforms.brightness = 1.2;
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;

    },

    //添加工厂数据
    addFactoryData() {
        this.loadData1();
        this.loadData2();
        this.loadData3();
    },

    loadData1() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://lab.earthsdk.com/model/27af3f70003311eaae02359b3e5d0653/tileset.json"
            })
        );
        tileset.readyPromise
            .then(tileset => {
                tileset.tileVisible.addEventListener(tile => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i += 2) {
                        let feature = content.getFeature(i);
                        let model = feature.content._model;
                        if (model && model._sourcePrograms && model._rendererResources) {
                            Object.keys(model._sourcePrograms).forEach(key => {
                                let program = model._sourcePrograms[key];
                                model._rendererResources.sourceShaders[
                                    program.fragmentShader
                                ] = this.get_fs();
                            });
                            model._shouldRegenerateShaders = true;
                        }
                    }
                });
            })
            .otherwise(function(error) {
                console.error(error);
            });
    },

    loadData2() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://lab.earthsdk.com/model/212bc470003311eaae02359b3e5d0653/tileset.json"
            })
        );
        tileset.readyPromise
            .then(tileset => {
                tileset.tileVisible.addEventListener(tile => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i += 2) {
                        let feature = content.getFeature(i);
                        let model = feature.content._model;

                        if (model && model._sourcePrograms && model._rendererResources) {
                            Object.keys(model._sourcePrograms).forEach(key => {
                                let program = model._sourcePrograms[key];
                                model._rendererResources.sourceShaders[
                                    program.fragmentShader
                                ] = this.get_fs();
                            });
                            model._shouldRegenerateShaders = true;
                        }
                    }
                });
            })
            .otherwise(function(error) {
                console.error(error);
            });
    },

    loadData3() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://lab.earthsdk.com/model/1b91bf10003311eaae02359b3e5d0653/tileset.json"
            })
        );
        tileset.readyPromise
            .then(tileset => {
                tileset.tileVisible.addEventListener(tile => {
                    var content = tile.content;
                    var featuresLength = content.featuresLength;
                    for (var i = 0; i < featuresLength; i += 2) {
                        let feature = content.getFeature(i);
                        let model = feature.content._model;

                        if (model && model._sourcePrograms && model._rendererResources) {
                            Object.keys(model._sourcePrograms).forEach(key => {
                                let program = model._sourcePrograms[key];
                                model._rendererResources.sourceShaders[
                                    program.fragmentShader
                                ] = this.get_fs();
                            });
                            model._shouldRegenerateShaders = true;
                        }
                    }
                });
            })
            .otherwise(function(error) {
                console.error(error);
            });
    },

    //添加扫描圆
    addScanCircle() {
        let p = {
            x: -2178278.3680711966,
            y: 4388536.048142271,
            z: 4069993.5577284778
        };
        let circle = new ScanCircle(this.viewer, p, {
            color: new Cesium.Color(0.5, 0.8, 1.0, 1.0),
            radius: 500
        });
    },

    //添加扩散圆形墙体
    addCircleSpreadWall() {
        let p1 = {
            x: -2177511.1970080775,
            y: 4389128.1647437345,
            z: 4069767.0963036907
        };
        let c1 = new CircleSpreadWall(
            this.viewer,
            p1,
            800,
            100,
            new Cesium.Color(0.5, 0.8, 1.0, 1.0)
        );
    },

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -2178535.7197663393,
                y: 4391025.063932634,
                z: 4069324.109522099
            },
            orientation: {
                heading: 0.07808864412131555,
                pitch: -0.7641862957753718,
                roll: 0.0003580297052918624
            },
            duration: 2
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    //着色器
    get_fs() {
        return `varying vec3 v_positionEC;
              void main(void){
                   vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                   float glowRange = 50.0; // 光环的移动范围(高度)
                   gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
                   gl_FragColor *= vec4(vec3((position.z + 40.0) / 30.0), 0.2); // 渐变
                   // 动态光环
                   float time = fract(czm_frameNumber / 360.0);
                   time = abs(time - 0.5) * 2.0;
                   float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                   gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
            }`;
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;