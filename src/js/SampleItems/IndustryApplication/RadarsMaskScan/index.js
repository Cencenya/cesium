// 雷达遮罩扫描效果实例  
import appConfig from "@/js/appConfig"
import RadarsMaskScan from "@/components/IndustryApplication/RadarsMaskScan"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addRadarsMaskScan();
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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //添加雷达遮罩
    addRadarsMaskScan() {
        let p = Cesium.Cartesian3.fromDegrees(108.63655, 25.02, 0);
        let r = new RadarsMaskScan(this.viewer, {
            position: p,
            color: Cesium.Color.AQUA.withAlpha(0.2),
            radii: new Cesium.Cartesian3(500, 500, 200)
        });

        p = Cesium.Cartesian3.fromDegrees(108.63655, 25.03, 0);
        r = new RadarsMaskScan(this.viewer, {
            position: p,
            color: Cesium.Color.RED.withAlpha(0.2),
            radii: new Cesium.Cartesian3(500, 500, 350)
        });

        p = Cesium.Cartesian3.fromDegrees(108.63655, 25.04, 0);
        r = new RadarsMaskScan(this.viewer, {
            position: p,
            color: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.2),
            radii: new Cesium.Cartesian3(500, 500, 500)
        });
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1846645.1956822774,
                y: 5483230.465456908,
                z: 2683360.6111075855
            },
            orientation: {
                heading: 1.5052570799863236,
                pitch: -0.9879873423771932,
                roll: 0.0046597500382210555
            }
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;