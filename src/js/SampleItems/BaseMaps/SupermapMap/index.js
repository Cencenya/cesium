// 超图在线底图

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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China/zxyTileImage.png?z={z}&x={x}&y={y}"
            })
        });
    },

    //改变底图
    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider;
        switch (type) {
            case 0: //街道地图
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China/zxyTileImage.png?z={z}&x={x}&y={y}"
                })
                break;
            case 1: //灰色底图
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/ChinaDark/zxyTileImage.png?z={z}&x={x}&y={y}"
                })
                break;
        }
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;