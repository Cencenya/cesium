// arcgis在线底图
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
    },

    //初始化viewer
    initViewer(el) {
        Cesium.Ion.defaultAccessToken = appConfig.cesiumToken;
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
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
    },

    //改变底图
    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll(true); //删除所有底图
        let imageryProvider;
        switch (type) {
            case 0: //影像
                imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                });
                break;
            case 1: //电子街道
                imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: ' https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
                })
                break;
            case 2: //蓝色底图
                imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                })
                break;
            case 3: //灰色底图
                imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
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