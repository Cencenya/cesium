//鼠标移入信息提示 
import appConfig from "@/js/appConfig"
import SceneTooltip from "@/components/Scene/Tooltip"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addMonitor();
        this.addFireCar();
        this.addText();
        this.addLabel();
        this.addCylinder();
        this.viewer.flyTo(this.viewer.entities)
        this.sceneTooltip = new SceneTooltip(this.viewer);
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
            }),
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        this.viewer.scene.globe.depthTestAgainstTerrain = true;

    },



    addMonitor() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88494472424244, 27.651695813697945, 0),
            tooltip: "永辉超市门口监控2",
            billboard: {
                image: 'static/images/blueCamera.png',
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
    },

    addFireCar() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88550634358194, 27.65144046270557, 0),
            tooltip: "消防车模型",
            model: {
                uri: "../../../static/gltf/xiaofangche.gltf",
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE,
                scale: 2,
                maximumScale: 6,
            }
        });
    },

    addText() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88508052553753, 27.651412543526178, 0),
            tooltip: "文本信息 Cesium实战",
            label: {
                text: "Cesium实战",
                fillColor: Cesium.Color.WHITE,
                scale: 0.5,
                font: 'normal 40px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
                scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                outlineWidth: 20,
                outlineColor: Cesium.Color.BLACK
            }
        })
    },

    addLabel() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88524719514241, 27.651278344527853, 0),
            tooltip: "文本信息 + 图标",
            label: {
                text: "文本信息 + 图标",
                fillColor: Cesium.Color.WHITE,
                scale: 0.5,
                font: 'normal 40px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
                scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                outlineWidth: 20,
                outlineColor: Cesium.Color.BLACK
            },
            billboard: {
                image: 'static/images/mark3.png',
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
    },

    addCylinder() {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(106.88524924333072, 27.651659443920074, 0),
            tooltip: "体对象-圆锥体",
            cylinder: {
                length: 20,
                topRadius: 0, //根据需要设置
                bottomRadius: 5.0,
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;