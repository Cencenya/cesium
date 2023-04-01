//限定视角范围实例
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initLimit();
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
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化视角限定
    initLimit() {
        let position = Cesium.Cartesian3.fromDegrees(108, 25, 0); //中心点位置
        let radius = 2000; //半径 
        this.addLimitEllipsoid(position, radius);
        this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEndEventHnadle, this)
    },

    //相机视角移动事件处理函数
    cameraMoveEndEventHnadle() {
        let p = this.viewer.camera.position; //相机位置
        let distance = Cesium.Cartesian3.distance(p, Cesium.Cartesian3.fromDegrees(108, 25, 0)); //两个点的距离
        if (distance > 2000) {
            console.log("超界")
            this.viewer.camera.flyTo(this.defaultView);
        } else {
            this.defaultView = {
                destination: Cesium.Cartesian3.clone(this.viewer.camera.position),
                orientation: {
                    heading: this.viewer.camera.heading,
                    pitch: this.viewer.camera.pitch,
                    roll: this.viewer.camera.roll
                },
                duration: 1
            }
        }
    },

    //添加范围球
    addLimitEllipsoid(position, radius) {
        this.ellipsoid = this.viewer.entities.add({
            position: position,
            ellipsoid: {
                radii: new Cesium.Cartesian3(radius, radius, radius),
                maximumCone: Cesium.Math.toRadians(90),
                material: Cesium.Color.RED.withAlpha(0.1),
                subdivisions: 128,
                stackPartitions: 32,
                slicePartitions: 32,
                outline: true,
                outlineColor: Cesium.Color.AQUA.withAlpha(1)
            },
        });
    },

    //设置视角
    setView() {
        this.defaultView = {
            destination: {
                x: -1786421.197370212,
                y: 5501661.313181829,
                z: 2680487.898044998
            },
            orientation: {
                heading: 2.374363218526797,
                pitch: -0.47583562533664026,
                roll: 0.0020031393509505335
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(this.defaultView);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;