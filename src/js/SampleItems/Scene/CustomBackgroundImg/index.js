// 自定义空间背景  
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
    },

    //初始化viewer
    initViewer(el) {
        Cesium.Ion.defaultAccessToken = appConfig.cesiumToken;
        this.viewer = new Cesium.Viewer("cesium-container", {
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
            orderIndependentTranslucency: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
            contextOptions: {
                webgl: {
                    alpha: true
                }
            }
        });
        this.viewer.scene.skyBox.show = false;
        this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -6283267.004204832,
                y: 28123682.896774407,
                z: 23709669.98539126
            },
            orientation: {
                heading: 6.149339593573709,
                pitch: -1.539825618847483,
                roll: 0
            },
            duration: 2
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