// 高德在线底图

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
                url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
            })
        });

        //标注
        let imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
        })
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    },

    //改变底图
    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider;
        switch (type) {
            case 0: //影像
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
                })
                break;
            case 1: //电子街道
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: 'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
                })
                break;
        }
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);

        if (type == 0) {
            //卫星影像的话加上标注
            imageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
            })
            this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        }
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;