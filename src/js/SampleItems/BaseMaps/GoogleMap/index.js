// 谷歌在线底图

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
                url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
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
                    url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
                })
                break;
            case 1: //谷歌电子
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "http://mt3.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile"
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