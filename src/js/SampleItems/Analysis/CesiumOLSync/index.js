//二三维联动 
import appConfig from "@/js/appConfig"
import CesiumOLSyncUtils from "@/components/CesiumOLSyncUtils"
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZSource from "ol/source/XYZ";
import { defaults } from 'ol/control';

let cesiumInit = {
    init(viewerContainer, mapContainer) {
        this.initViewer(viewerContainer);
        this.load3dtiles();
        this.initMap(mapContainer);
        this.cesiumOLSyncUtils = new CesiumOLSyncUtils(this.viewer, this.map);
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

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    initMap(el) {
        this.map = new Map({
            target: el,
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        //  url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
                    })
                })
            ],
            view: new View({
                center: [37.41, 8.82],
                zoom: 4,
                projection: 'EPSG:4326'
            }),
            controls: defaults({ zoom: false })
        });
    },

    //加载三维模型
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json"
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {
                    duration: 0.1,
                    offset: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-90),
                        range: 0.0
                    }
                });
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },


    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        let cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            20
        );
        let translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;