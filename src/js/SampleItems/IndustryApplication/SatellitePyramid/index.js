//卫星视锥体四棱锥 
import appConfig from "@/js/appConfig"
import SatellitePyramid from "@/components/IndustryApplication/SatellitePyramid"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.initPyramid();
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
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //创建卫星棱锥体
    initPyramid() {
        this.pyramid = new SatellitePyramid(this.viewer, [117.169969, 31.840886, 899999.87]);
    },

    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -3610616.535767916,
                y: 7542288.61411993,
                z: 2764700.1118213907
            },
            orientation: {
                heading: 0.07548868416752708,
                pitch: -0.9393689784973649,
                roll: 6.283050993104599
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