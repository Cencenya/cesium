// 水闸放水效果实例 
import appConfig from "@/js/appConfig"
import WaterColumn from "@/components/IndustryApplication/WaterColumn"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        //存储所有水面数据
        this.waterPrimitives = [];
        this.waterColumns = [];

        this.addHeliuRegion();
        this.addFoundations();
        this.addWindowEvent();
        this.setView();
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
            shouldAnimate: true,
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: appConfig.imageryProvider
            // }),
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
    },


    //添加河流水面
    addHeliuRegion() {
        //创建水体材质
        let waterMaterial = this.createWaterMaterial();

        fetch("../static/data/hedao-wai.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            let coordinates, positions;
            features.map(feature => {
                coordinates = feature.geometry.coordinates[0];
                positions = this.coordinatesToPositions(coordinates);
                this.addWaterRegion(positions, waterMaterial);
            })
        })
    },

    //添加水面
    addWaterRegion(positions, waterMaterial) {
        //创建水体geometry
        var polygon1 = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            perPositionHeight: true,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });

        var primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polygon1
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true
            }),
            show: true
        });
        primitive.appearance.material = waterMaterial;
        this.viewer.scene.primitives.add(primitive); //添加到场景
        this.waterPrimitives.push(primitive);
    },

    //创建水体材质
    createWaterMaterial() {
        return new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    baseWaterColor: Cesium.Color.fromCssColorString("rgba(10, 59, 129, 0.6)"), //Cesium.Color.AQUA.withAlpha(0.6),
                    normalMap: 'static/images/effects/waterNormalsSmall.jpg',
                    frequency: 800.0,
                    animationSpeed: 0.01,
                    amplitude: 5,
                    specularIntensity: 5
                }
            }
        });
    },

    //坐标串转为笛卡尔坐标数组
    coordinatesToPositions(coordinates) {
        let positions = [];
        coordinates.map(c => {
            positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1], 0))
        });
        return positions;
    },

    //添加效果
    addFoundations() {
        let p = Cesium.Cartesian3.fromDegrees(121.4797478760175, 29.79120152341423, 2.3)
        let w = new WaterColumn(this.viewer, p);
        this.waterColumns.push(w);
        p = Cesium.Cartesian3.fromDegrees(121.47978538512763, 29.79119264447956, 2.3)
        w = new WaterColumn(this.viewer, p);
        this.waterColumns.push(w);
        p = Cesium.Cartesian3.fromDegrees(121.47982225257076, 29.79118386888971, 2.3)
        w = new WaterColumn(this.viewer, p);
        this.waterColumns.push(w);
    },

    //清除所有
    removeAll() {
        this.waterColumns.forEach(item => {
            item.remove();
        });
        this.waterColumns = [];
    },

    //窗口激活或隐藏事件
    addWindowEvent() {
        let that = this;
        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
            null;
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        var onVisibilityChange = function() {
            if (!document[hiddenProperty]) {
                //页面激活
                that.addFoundations();
            } else {
                //页面非激活
                that.removeAll();
            }
        }
        document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    },

    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2892919.3475019126,
                y: 4724523.285281391,
                z: 3150306.5927484147
            },
            orientation: {
                heading: 5.961367847498018,
                pitch: -0.9074515488372628,
                roll: 6.2816949558360005
            }
        });
    },

    //加载三维模型
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://data.marsgis.cn/3dtiles/max-fsdzm/tileset.json"
            })
        );

        tileset.readyPromise
            .then(tileset => {
                // this.tileset = tileset;
                // this.setTilesetHeight(tileset); 
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },


    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        let cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            20
        );
        let translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;