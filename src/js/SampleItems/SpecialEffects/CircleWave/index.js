//圆形波纹效果实例
import appConfig from "@/js/appConfig"
import "@/components/Materials/CircleWaveMaterial" //引入自定义材质类 
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addCircles();
        this.viewer.flyTo(this.viewer.entities)
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

    //添加波动圆
    addCircles() {
        let position = Cesium.Cartesian3.fromDegrees(106.88433361209046, 27.645364988637994, 126.58837375543308);
        this.addEllipse(position, Cesium.Color.RED);

        position = Cesium.Cartesian3.fromDegrees(106.8850889029875, 27.648447704248348, 32.277422145507053);
        this.addEllipse(position, Cesium.Color.GREEN);

        position = Cesium.Cartesian3.fromDegrees(106.88813665557215, 27.648530332248313, 40.303729118573436);
        this.addEllipse(position, Cesium.Color.YELLOW);
    },

    //添加圆实体
    addEllipse(position, color) {
        this.viewer.entities.add({      
            position: position,
            ellipse: {
                height: 0,
                semiMinorAxis: 60,
                semiMajorAxis: 60,
                material: new Cesium.CircleWaveMaterialProperty({
                    duration: 2e3,
                    gradient: 0,
                    color: color,
                    count: 3
                })
            }
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;