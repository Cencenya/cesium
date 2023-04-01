//BillboardGif实例
import BillboardGif from "@/components/PointObject/BillboardGif"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initBillboardGifs();
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

    //初始化BillboardGif
    initBillboardGifs() {
        this.bGifs = [];
        let bGif = new BillboardGif(this.viewer, { x: -1573531.5631498995, y: 5327960.189358987, z: 3122917.196622447 }, "../../static/images/bgif/bgif0.gif");
        this.bGifs.push(bGif);

        bGif = new BillboardGif(this.viewer, { x: -1573682.84696387, y: 5327851.624198511, z: 3123024.6822918407 }, "../../static/images/bgif/tf.gif");
        this.bGifs.push(bGif);

        bGif = new BillboardGif(this.viewer, { x: -1573858.3865497303, y: 5327847.144559804, z: 3122861.3058495014 }, "../../static/images/bgif/bgif0.gif");
        this.bGifs.push(bGif);
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