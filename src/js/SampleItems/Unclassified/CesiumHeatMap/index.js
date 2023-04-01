//热力图 
import appConfig from "@/js/appConfig"
import getCesiumHeat from "@/components/CesiumHeatMap";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.initHeatMap();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    initHeatMap() {
        var list = []
        for (var i = 0; i < 1000; i++) {
            var lng = 120.38105869 + Math.random() * 0.5
            var lat = 31.10115627 + Math.random() * 0.5
            list.push({
                x: lng,
                y: lat,
                z: Math.random()
            })
        }

        const CesiumHeatMap = getCesiumHeat(Cesium);
        let bbox = [120, 31, 121, 32];
        let heatmap = new CesiumHeatMap(
            this.viewer,
            list,
            bbox
        )
    },


    //设置视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -2807095.603541247,
                y: 4737569.798945139,
                z: 3341269.8143401737
            },
            orientation: {
                heading: 1.7763568394002505e-15,
                pitch: -1.5706104795241673,
                roll: 0
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
export default cesiumInit;