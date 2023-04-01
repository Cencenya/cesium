//天气效果
import appConfig from "@/js/appConfig"
import WeatherEffects from "@/components/Scene/WeatherEffects"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.wfs = new WeatherEffects(this.viewer);
        this.load3dtiles();
        this.setView();
        this.openSnow();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        //禁用缩放操作 
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1573212.9075937702,
                y: 5328492.48598626,
                z: 3122714.6391274813
            },
            orientation: {
                heading: 1.2218609197620385,
                pitch: -0.5517229127501526,
                roll: 0.003173202315718271
            },
            duration: 1
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    //开启雪天效果
    openSnow() {
        this.wfs.openSnowEffect();
    },

    //开启雨天效果
    openRain() {
        this.wfs.openRainEffect();
    },

    //开启雾天效果
    openFog() {
        this.wfs.openFogEffect();
    },

    //关闭天气效果
    close() {
        this.wfs.closeWeatherEffects();
    },

    //加载3dtiles数据
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                // this.viewer.zoomTo(tileset);
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
            cartographic.latitude, 55
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