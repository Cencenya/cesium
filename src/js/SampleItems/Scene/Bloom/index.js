import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.load3dtiles();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: true,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            //     url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            // })
            //
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
            })
        });


        this.viewer.animation.container.style.visibility = 'hidden'; // 不显示动画控件
        // 亮度设置
        var stages = this.viewer.scene.postProcessStages;
        this.viewer.scene.brightness =
            this.viewer.scene.brightness ||
            stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
        this.viewer.scene.brightness.enabled = true;
        this.viewer.scene.brightness.uniforms.brightness = Number(2);
    },

    setView() {
        let flyToOpts = {
            destination: {
                x: -1640818.8972526276,
                y: 5467689.9927234035,
                z: 2837147.4144279435
            },
            orientation: {
                heading: 0.8563545130120094,
                pitch: -0.9895168422798717,
                roll: 0.0037000598964986864
            },
            duration: 1
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    //加载三维模型
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.build3dtiles // "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json"
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
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