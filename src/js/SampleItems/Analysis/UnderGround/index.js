// 地下模型、地表透明实例
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addModel();
        this.addBox();
        this.addPolylineVolume();
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
            terrainProvider: new Cesium.CesiumTerrainProvider({ //使用火星科技地形 因为cesium自带的经常加载不了 经纬度拾取是错误的 可能是坐标系的原因
                url: "http://data.marsgis.cn/terrain",
                requestVertexNormals: true
            }),
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        //开启地下模式
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
        //透明度 
        this.viewer.scene.globe.translucency.enabled = true; //可用透明度 
        this.viewer.scene.globe.translucency.frontFaceAlpha = 0.8; //默认设置为0.8
    },

    //开启或者关闭地下模式
    setCollisionDetection(enable) {
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = enable
    },

    //设置透明度
    setAlpha(alpha) {
        this.viewer.scene.globe.translucency.frontFaceAlpha = alpha;
    },

    //添加模型
    addModel() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88433361209046, 27.645364988637994, 850),
            model: {
                uri: "../../../static/gltf/xiaofangche.gltf",
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE,
                scale: 2,
                maximumScale: 6,
            }
        });

        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.884684, 27.645236, 850),
            model: {
                uri: "../../../static/gltf/xiaofangche.gltf",
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE,
                scale: 2,
                maximumScale: 6,
            }
        });
    },

    //添加柱体
    addBox() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.884566, 27.6455, 850),
            box: {
                dimensions: new Cesium.Cartesian3(10, 10, 20),
                material: Cesium.Color.YELLOW
            }
        });
    },

    //添加管线
    addPolylineVolume() {
        let lineString = [
            [106.88355376451588, 27.6463676411241, 840.0],
            [106.88522910724784, 27.645135003039023, 840.0],
            [106.88590845875306, 27.645923905844867, 840.0],
            [106.88413636965775, 27.646905649202246, 840.0],
            [106.88372029525429, 27.646473316273184, 840.0]
        ];

        let positions = [];
        lineString.forEach(item => {
            positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]))
        })

        this.viewer.entities.add({
            polylineVolume: {
                positions: positions,
                shape: this.computeCircle(0.5),
                material: Cesium.Color.RED,
            },
        });
    },

    //管线形状
    computeCircle(radius) {
        var positions = [];
        for (var i = 0; i < 360; i++) {
            var radians = Cesium.Math.toRadians(i);
            positions.push(
                new Cesium.Cartesian2(
                    radius * Math.cos(radians),
                    radius * Math.sin(radians)
                )
            );
        }
        return positions;
    },

    //设置初始视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1642571.109251998,
                y: 5411138.154654505,
                z: 2942098.167472331
            },
            orientation: {
                heading: 5.450601406118034,
                pitch: -0.5763782371499313,
                roll: 6.280751500849277
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

export default cesiumInit;