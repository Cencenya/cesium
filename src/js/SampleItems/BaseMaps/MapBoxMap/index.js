// Mapbox在线底图

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
                url: "https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A"
            })
        });
    },

    //改变底图
    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider;
        switch (type) {
            case 0: //影像
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A"
                })
                break;
            case 1: //电子
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://api.mapbox.com/styles/v1/marsgis/cki0a0ire3jvh19r92vwfau1e/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A"
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