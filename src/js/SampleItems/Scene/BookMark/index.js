import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
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
            }),
            contextOptions: {
                //cesium状态下允许canvas转图片convertToImage
                webgl: {
                    alpha: true,
                    depth: false,
                    stencil: true,
                    antialias: true,
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: true,
                    failIfMajorPerformanceCaveat: true
                },
                allowTextureFilterAnisotropic: true
            }
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //设置视角
    setView() {
        this.defaultView = {
            destination: {
                x: -1786421.197370212,
                y: 5501661.313181829,
                z: 2680487.898044998
            },
            orientation: {
                heading: 2.374363218526797,
                pitch: -0.47583562533664026,
                roll: 0.0020031393509505335
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(this.defaultView);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;