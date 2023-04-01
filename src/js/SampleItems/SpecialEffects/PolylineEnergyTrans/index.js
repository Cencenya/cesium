// 能量传输线
import appConfig from "@/js/appConfig"
import "@/components/Materials/PolylineMaterial/PolylineEnergyTrans"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initLine();
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
            shouldAnimate: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },
    //添加线
    addLine(positions, color, duration, count) {
        let line = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 8,
                material: new Cesium.PolylineEnergyTransMaterialProperty(color, duration, count),
                clampToGround: true
            }
        });
    },

    //初始化线
    initLine() {
        let positions = [
            { x: -1573322.5898919392, y: 5327819.044424408, z: 3123159.886483282 }, { x: -1573593.4933278325, y: 5327868.7743272325, z: 3122914.2552465447 }, { x: -1573838.5503531531, y: 5327917.311878511, z: 3122719.1071619135 }, { x: -1573992.1810728193, y: 5327947.898810904, z: 3122595.063992435 }
        ]
        this.addLine(positions, Cesium.Color.YELLOW, 5000, 6);

        positions = [
            { x: -1573753.6344409478, y: 5328022.051847136, z: 3122597.6760313655 }, { x: -1573849.1986015164, y: 5327892.807416029, z: 3122752.4022583542 }, { x: -1574011.3916008596, y: 5327685.2314376, z: 3123015.1803947105 }
        ]
        this.addLine(positions, Cesium.Color.YELLOW, 5000, 5);

        positions = [
            { x: -1573920.830492183, y: 5328066.683343329, z: 3122439.390488729 }, { x: -1574072.6578983108, y: 5327859.201900331, z: 3122703.893024206 }
        ]
        this.addLine(positions, Cesium.Color.YELLOW, 5000, 3);

        positions = [
            { x: -1573537.5569049332, y: 5327935.351199462, z: 3122831.6039051972 }, { x: -1573727.2305734043, y: 5327677.711104301, z: 3123174.6440329007 }
        ]
        this.addLine(positions, Cesium.Color.YELLOW, 5000, 1);
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