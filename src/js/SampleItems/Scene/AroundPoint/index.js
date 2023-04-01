//绕点旋转
import appConfig from "@/js/appConfig"
import AroundPoint from "@/components/scene/AroundPoint"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.center = Cesium.Cartesian3.fromDegrees(109.02025470002677, 32.08927505285042, 2140.534056351892);
        this.addFengcheModel();
        this.aroundPoint = new AroundPoint(this.viewer);
        this.aroundPoint.startRotate(this.center); //开始旋转
        // this.aroundPoint.stopRotate();//停止旋转
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
            }),
            terrainProvider: new Cesium.CesiumTerrainProvider({ //使用火星科技地形 因为cesium自带的经常加载不了 经纬度拾取是错误的 可能是坐标系的原因
                url: "http://data.marsgis.cn/terrain",
                requestVertexNormals: true
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false 
    },

    //添加风车模型
    addFengcheModel() {
        this.viewer.entities.add({
            position: this.center,
            model: {
                uri: "../../../static/gltf/fengche.gltf",
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE,
                scale: 30,
                maximumScale: 40,
            }
        });
    },

    destroy() {
        this.aroundPoint.stopRotate();
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;