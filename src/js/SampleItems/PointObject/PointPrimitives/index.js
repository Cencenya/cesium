// 使用primitives添加大量点数据
import appConfig from "@/js/appConfig"
import * as turf from "@turf/turf"
let CesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initPrimitives();
        this.addPrimitives();
        this.setView();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: true,
            selectionIndicator: true,
            navigation: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: 'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
            }),
            terrainProvider: new Cesium.CesiumTerrainProvider({ //使用火星科技地形 因为cesium自带的经常加载不了  
                url: "http://data.marsgis.cn/terrain",
                requestVertexNormals: true
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //初始化BillboardCollection
    initPrimitives() {
        // Create a billboard collection  
        this.billboards = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
    },

    //添加图标点
    addPrimitives() {
        let points = turf.randomPoint(20000, { bbox: [73, 20, 135, 40] }); //使用turf生产20000个随机坐标点
        let features = points.features;
        let feature, geom, coordinates, position;

        for (let i = 0; i < features.length; i++) {
            feature = features[i];
            geom = feature.geometry;
            coordinates = geom.coordinates;
            position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0);
            this.addPrimitive(position);
        }
    },

    //添加单个图标点
    addPrimitive(position) {
        this.billboards.add({
            position: position,
            image: '../static/images/monitor.png',
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        });
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -2519873.872063144,
                y: 5980265.43512472,
                z: 2728481.985781643
            },
            orientation: {
                heading: 0.15184662496471635,
                pitch: -0.9371141121917788,
                roll: 6.282781043024009
            }
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