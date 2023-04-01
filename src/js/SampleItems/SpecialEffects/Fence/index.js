import EntityDraw from "@/components/CesiumTools/EntityDraw"
import appConfig from "@/js/appConfig"
// 动态立体墙
import Fence from "./Fence"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initEntityDraw();
        this.addRedFence();
        this.addGreenFence();
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
            })
        });
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions, drawType) => {
            result.remove();
            console.log(positions)
            this.addFence(positions)
        })
    },

    //激活绘制工具
    drawActivate(type) {
        this.entityDraw.activate(type);
    },

    //添加结果
    addFence(positions) {
        if (!this.redFence) {
            this.redFence = new Fence(this.viewer, positions, 20, Cesium.Color.RED);
        } else {
            this.greenFence = new Fence(this.viewer, positions, 20, Cesium.Color.fromCssColorString("#0BFF0D"));
        }
    },

    addGreenFence() {
        let positions = [
            { x: -1573635.6071447732, y: 5327876.906231757, z: 3122878.928250711 }, { x: -1573943.459924136, y: 5327645.711941848, z: 3123094.5285245045 }, { x: -1574009.0770215357, y: 5327673.147886553, z: 3123045.671607318 }, { x: -1574013.902494587, y: 5327679.950759558, z: 3123022.801053999 }, { x: -1573831.4438271062, y: 5327916.489753731, z: 3122723.9583727047 }, { x: -1573635.4421579556, y: 5327876.21513823, z: 3122880.20724414 }
        ]
        let greenFence = new Fence(this.viewer, positions, 20, Cesium.Color.fromCssColorString("#0BFF0D"));
    },

    addRedFence() {
        let positions = [
            { x: -1573733.8681838464, y: 5327891.690280139, z: 3122807.3135355837 }, { x: -1573844.670695646, y: 5327784.092327943, z: 3122927.0154715613 }, { x: -1573921.5764383215, y: 5327789.140594587, z: 3122883.3852528557 }, { x: -1573829.0323274087, y: 5327912.274138674, z: 3122731.583446209 }, { x: -1573733.6414963433, y: 5327890.835694463, z: 3122808.84515286 }
        ]
        let redFence = new Fence(this.viewer, positions, 30, Cesium.Color.RED);
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
    }
}

export default cesiumInit;