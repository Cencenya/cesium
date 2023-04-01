// 雷达扫描效果实例
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import RadarsEffects from "@/components/IndustryApplication/RadarsEffects"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initEntityDraw();
        this.initRadars();
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
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化雷达扫描效果
    initRadars() {
        this.radarsEffects = new RadarsEffects(this.viewer); 
        this.radarsEffects.addRadarScan({
            x: -1573747.6747866408,
            y: 5327860.258964331,
            z: 3122892.479122948
        }, 120, new Cesium.Color(0, 1.0, 0, 1), 3000);
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions, drawType) => {
            result.remove();
            console.log(positions[0])
            this.radarsEffects.addRadarScan(positions[0], 120, new Cesium.Color(0, 1.0, 0, 1), 3000)
        })
    },

    //清空雷达扫描
    clearRadarScans() {
        this.radarsEffects.clearRadarScans();
    },

    //激活绘制
    drawActivate(type) {
        this.entityDraw.activate(type);
    },

    //清空
    clear() {
        this.radarsEffects.clearRadarScans();
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