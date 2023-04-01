// 天地图在线底图

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
                url: "https://t5.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
            })
        });

        //默认添加注记图层
        this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: "https://t5.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
        }));
    },

    //改变底图
    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider; //天地图访问需要加Token 请自己申请token 否则可能访问失败
        switch (type) {
            case 0: //影像
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://t5.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
                })
                break;
            case 1: //电子
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://t5.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
                })
                break;
            case 2: //地形
                imageryProvider = new Cesium.UrlTemplateImageryProvider({
                    url: "https://t5.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
                })
                break;
        }
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        //默认添加注记图层
        this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: "https://t5.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=4a00a1dc5387b8ed8adba3374bd87e5e"
        }));
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;