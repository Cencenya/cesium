// 圆形扩散扫描实例
import CircleSpreadScan from "@/components/SpecialEffects/CircleSpreadScan"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.loadBuildData();
        this.addHexagons();
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
        // 亮度设置
        // var stages = this.viewer.scene.postProcessStages;
        // this.viewer.scene.brightness = this.viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
        // this.viewer.scene.brightness.enabled = true;
        // this.viewer.scene.brightness.uniforms.brightness = 2;  
    },

    addHexagons() {
        let p1 = {
            x: -1336621.3161093448,
            y: 5326891.653918462,
            z: 3232313.9045081865
        };
        let p2 = {
            x: -1336371.254927663,
            y: 5325664.063701625,
            z: 3234436.839795243
        };
        let p3 = {
            x: -1334301.2104443484,
            y: 5327066.724091915,
            z: 3233010.7269238452
        };
        let h1 = new CircleSpreadScan(this.viewer, p1, 500, Cesium.Color.RED);
        let h2 = new CircleSpreadScan(this.viewer, p2, 500, Cesium.Color.AQUA);
        let h3 = new CircleSpreadScan(this.viewer, p3, 500, Cesium.Color.YELLOW);
    },

    //加载建筑物数据
    loadBuildData() {
        let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "http://data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json" // "http://oss-data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json" //引用火星科技数据
        }));
        tileset.readyPromise.then((tileset) => {
            this.setTilesetHeight(tileset);
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

    //设置模型的高度 否则飘在空中
    setTilesetHeight(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, -500
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },


    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -1337790.7881094853,
                y: 5330396.094162445,
                z: 3231621.5380446212
            },
            orientation: {
                heading: 6.010538181825211,
                pitch: -0.6819480997380261,
                roll: 6.282163306739159,
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