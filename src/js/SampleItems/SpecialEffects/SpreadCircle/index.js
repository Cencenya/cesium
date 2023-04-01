//扩散圆效果实例 
import "@/components/Materials/EllipsoidMaterial"
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initEntityDraw();
        this.initCircles();
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
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions, drawType) => {
            result.remove();
            console.log(positions[0]);
            this.addCircle(positions[0], Cesium.Color.RED);
        })
    },

    //初始化圆
    initCircles() {
        let positions = [ {
                x: -1573574.8574973033,
                y: 5327861.680997554,
                z: 3122936.8396082064
            },
            {
                x: -1573833.0796997768,
                y: 5327917.394503697,
                z: 3122721.2821285133
            },   {
                x: -1573512.0741523548,
                y: 5328081.842318251,
                z: 3122613.8688152106
            }
        ];

        this.addCircle(positions[0], Cesium.Color.RED);
        this.addCircle(positions[1], Cesium.Color.YELLOW);
        this.addCircle(positions[2], Cesium.Color.LIME);
    },

    //添加扩散圆
    addCircle(position, color) {
        this.viewer.entities.add({
            name: 'EllipsoidFade',
            position: position,
            ellipse: {
                height: 20,
                semiMinorAxis: 130.0,
                semiMajorAxis: 130.0,
                material: new Cesium.EllipsoidFadeMaterialProperty(color, 2000)
            }
        });
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