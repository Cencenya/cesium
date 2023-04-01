import appConfig from "@/js/appConfig"
import "@/components/Materials/Cloud"

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
            animation: true,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.animation.container.style.visibility = 'hidden'; // 不显示动画控件
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        this.viewer.entities.add({
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
                material: new Cesium.CloudMaterialProperty(Cesium.Color.WHITE.withAlpha(0.8), 100000), // Cesium.Color.RED.withAlpha(0.2),
                height: 6000,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(3000000, 100000000)
            }
        });
    },


    setView() {
        let flyToOpts = {
            destination: {
                x: -1563604.1538326172,
                y: 5339284.777234141,
                z: 3124686.571583323
            },
            orientation: {
                heading: 1.3946862718235566,
                pitch: -0.6663081682589098,
                roll: 0.003599398222597472
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(flyToOpts);
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
                this.viewer.zoomTo(tileset)
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