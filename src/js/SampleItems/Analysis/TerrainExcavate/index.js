//地形开挖实例 
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import TerrainExcavate from "@/components/Analysis/Excavate/TerrainExcavate"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initEntityDraw();
        this.terrainExcavate = new TerrainExcavate(this.viewer);
        this.setView();
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
            // terrainProvider: Cesium.createWorldTerrain(),
            terrainProvider: new Cesium.CesiumTerrainProvider({ //使用火星科技地形 因为cesium自带的经常加载不了 经纬度拾取是错误的 可能是坐标系的原因
                url: "http://data.marsgis.cn/terrain",
                requestVertexNormals: true
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions) => {
            result.remove();
            console.log(positions);
            this.terrainExcavate.add(positions, {
                excavateDepth: this.excavateDepth
            });
        })
    },

    //激活绘制
    drawActivate(type, excavateDepth) {
        this.entityDraw.activate(type);
        this.excavateDepth = excavateDepth;
        this.clear();
    },

    //清空
    clear() {
        this.terrainExcavate.clear();
    },

    //设置初始视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -2047155.0648887777,
                y: 5427911.513159129,
                z: 2644869.9468807583
            },
            orientation: {
                heading: 3.0617280509395037,
                pitch: -0.8122279167480544,
                roll: 0.0002939111051949439
            },
            duration: 1
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;