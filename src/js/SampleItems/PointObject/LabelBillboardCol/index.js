// 图标点+文字(primitive方式)
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initPrimitives();
        this.addPrimitives();
        this.setView();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: true,
            selectionIndicator: true,
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
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //初始化Collection
    initPrimitives() {
        // Create a billboard collection  
        this.billboards = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
        // Create a label collection 
        this.labels = this.viewer.scene.primitives.add(new Cesium.LabelCollection());
    },

    //添加数据
    addPrimitives() {
        fetch("../../static/data/mudi-all.json").then(res => {
            return res.json();
        }).then(res => {
            res.data.forEach(item => {
                const position = Cesium.Cartesian3.fromDegrees(Number(item.lng), Number(item.lat), 0);
                const label = item.text;
                this.addBillboard(position);
                this.addLabel(position, label);
            });
        })
    },

    //添加单个图标点
    addBillboard(position) {
        this.billboards.add({
            position: position,
            image: '../static/images/mark3.png',
            scale: 0.6,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0.4),
        });
    },

    //添加单个文本
    addLabel(position, label) {
        this.labels.add({
            position: position,
            text: label,
            fillColor: Cesium.Color.WHITE,
            scale: 0.4,
            font: 'normal 40px MicroSoft YaHei',
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
            scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0.4),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(14, -4),
            outlineWidth: 20,
            outlineColor: Cesium.Color.BLACK
        })
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -2896592.4002341526,
                y: 6805455.47576909,
                z: 2951507.971335161
            },
            orientation: {
                heading: 6.212023475726037,
                pitch: -1.1010167185227777,
                roll: 6.282976514038227
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;