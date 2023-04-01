// 本地单张照片

let cesiumInit = {
    init(el) {
        this.initViewer(el);
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
            imageryProvider: new Cesium.SingleTileImageryProvider({
                url: "../../static/images/maps/earth4.jpg",
            })
        });
    },

    //改变底图
    changeBaseMap(name) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider = new Cesium.SingleTileImageryProvider({
            url: "../../static/images/maps/" + name + ".jpg",
        })
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;