// 扫描线实例
import Scanline from "@/components/SpecialEffects/Scanline"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.loadBuildData();
        this.addScanline();
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
    },

    addScanline() {
        let p3 = {
            x: -1334301.2104443484,
            y: 5327066.724091915,
            z: 3233010.7269238452
        };

        let s3 = new Scanline(this.viewer, p3, { color: Cesium.Color.YELLOW, radius: 1200 });
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
                x: -1335579.228143601,
                y: 5328935.263663113,
                z: 3232288.29351318
            },
            orientation: {
                heading: 5.848404708640302,
                pitch: -0.6704827782244815,
                roll: 6.281601192691522
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