//模型热力图 
import appConfig from "@/js/appConfig"
import HeatMap from "@/components/SpecialEffects/TilesHeatMap";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initHeatMap();
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
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    initHeatMap() {
        var list = [{
                x: 106.4539017008,
                y: 29.5027558947,
                z: Math.random()
            }, {
                x: 106.4551132292,
                y: 29.5034262296,
                z: Math.random()
            }, {
                x: 106.4560860455,
                y: 29.5029204495,
                z: Math.random()
            }, {
                x: 106.4567780225,
                y: 29.5054223234,
                z: Math.random()
            },
            {
                x: 106.4565609600,
                y: 29.5069330499,
                z: Math.random()
            }, {
                x: 106.4561247201,
                y: 29.5065141442,
                z: Math.random()
            }
        ]

        let bbox = [106.4519988952, 29.5021084567, 106.4590407287, 29.5092024712];
        let heatmap = new HeatMap(
            this.viewer,
            list,
            bbox
        )
    },


    //加载3dtiles数据
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, 55
        );
        var translation = Cesium.Cartesian3.subtract(
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