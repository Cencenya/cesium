//地表开挖实例 
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import SurfaceExcavate from "@/components/Analysis/Excavate/SurfaceExcavate"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initEntityDraw();
        this.initExcavate();
        this.viewer.flyTo(this.viewer.entities)
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

    //初始化开挖
    initExcavate() {
        this.surfaceExcavate = new SurfaceExcavate(this.viewer);
        let positions = [{ x: -1817985.6346013895, y: 5346983.514759019, z: 2954067.416274151 }, { x: -1818110.6205038251, y: 5347049.118534961, z: 2953873.0497033927 }, { x: -1818349.5802951844, y: 5346903.215823618, z: 2953989.2823170996 }, { x: -1818219.835985455, y: 5346844.658871308, z: 2954173.884790382 }]
        this.surfaceExcavate.add(positions);
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions) => {
            result.remove();
            console.log(positions);
            this.surfaceExcavate.add(positions, {
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
        this.surfaceExcavate.clear();
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;