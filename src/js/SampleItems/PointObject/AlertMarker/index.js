import appConfig from "@/js/appConfig"
import AlertMarker from "@/components/PointObject/AlertMarker"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.addMarkers();
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
                url: appConfig.imageryProvider
            })
        });
    },

    //添加marker
    addMarkers() {
        let p1 = [106.45332960278935, 29.505968155210237, 80.04600931385025];
        let p2 = [106.45377240762079, 29.50653022945677, 70.49301763120009];
        let p3 = [106.45372948529989, 29.506279211964337, 70.58591134883969];
        let p4 = [106.4565365840505, 29.505992532615764, 30.070031394164918];
        let p5 = [106.45721717052103, 29.508857826447745, 30.828267397716047];
        let m1 = new AlertMarker({
            viewer: this.viewer,
            position: Cesium.Cartesian3.fromDegrees(p5[0], p5[1], p5[2]),
            iconUrl: "../../static/images/pos_red.png",
            color: Cesium.Color.RED
        });

        let m2 = new AlertMarker({
            viewer: this.viewer,
            position: Cesium.Cartesian3.fromDegrees(p4[0], p4[1], p4[2]),
            iconUrl: "../../static/images/pos_yellow.png",
            color: Cesium.Color.YELLOW
        });

        let m3 = new AlertMarker({
            viewer: this.viewer,
            position: { x: -1573502.1873961585, y: 5327859.690320177, z: 3123060.233659639 },
            iconUrl: "../../static/images/pos_orange.png",
            color: Cesium.Color.ORANGE
        });

        let m4 = new AlertMarker({
            viewer: this.viewer,
            position: {
                x: -1573678.3258349395,
                y: 5327853.659547878,
                z: 3123024.8602834097
            },
            iconUrl: "../../static/images/pos_yellow.png",
            color: Cesium.Color.BLUE
        });

        let m5 = new AlertMarker({
            viewer: this.viewer,
            position: Cesium.Cartesian3.fromDegrees(p1[0], p1[1], p1[2]),
            iconUrl: "../../static/images/pos_yellow.png",
            color: Cesium.Color.GREEN
        });
    },

    //加载三维模型
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(55);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置模型高度 否则飘在空中
    setTilesetHeight(height) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            this.tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, height
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;