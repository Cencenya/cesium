//旋转的地球
import appConfig from "@/js/appConfig"
import GlobeRotate from "@/components/scene/GlobeRotate"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.globeRotate = new GlobeRotate(this.viewer);
        // this.globeRotate.startRotate();//开始旋转
        // this.globeRotate.stopRotate();//停止旋转
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
    },

    destroy() {
        this.globeRotate.stopRotate();
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;