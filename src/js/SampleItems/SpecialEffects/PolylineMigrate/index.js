// 迁移线效果  
import "@/components/Materials/PolylineMaterial/PolylineMigrate"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addLines();
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
            shouldAnimate: false,
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: appConfig.imageryProvider
            // })
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },

    addLines() {
        let center = [114.302312702, 30.598026044]; //中心点
        let circlePoints = this.generateCirclePoints(center, 100000); //圆周边坐标
        let startP = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0);
        this.addCenterBillboard(startP);
        let endP;
        let positions;

        let material = new Cesium.PolylineMigrateMaterialProperty({
            color: new Cesium.Color(1, 0.79, 0.15, 1),
            duration: 2000
        });

        circlePoints.forEach(item => {
            endP = Cesium.Cartesian3.fromDegrees(item[0], item[1], 0);
            positions = this.generateCurve(startP, endP);
            this.viewer.entities.add({
                polyline: {
                    positions: positions,
                    width: 2,
                    material: material // Cesium.Color.RED
                }
            });
        })
    },

    //中心点图标
    addCenterBillboard(startP) {
        //中心点
        this.viewer.entities.add({
            position: startP,
            billboard: {
                image: "../../static/images/symbol1.png",
                scaleByDistance: new Cesium.NearFarScalar(12000, 1, 52000, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 600000), //设置可见距离  
            }
        });
    },

    //生成流动曲线 传入起点和终点
    generateCurve(startPoint, endPoint) {
        let addPointCartesian = new Cesium.Cartesian3();
        Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
        let midPointCartesian = new Cesium.Cartesian3();
        Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
        let midPointCartographic = Cesium.Cartographic.fromCartesian(
            midPointCartesian
        );
        midPointCartographic.height =
            Cesium.Cartesian3.distance(startPoint, endPoint) / 5;
        let midPoint = new Cesium.Cartesian3();
        Cesium.Ellipsoid.WGS84.cartographicToCartesian(
            midPointCartographic,
            midPoint
        );

        let spline = new Cesium.CatmullRomSpline({
            times: [0.0, 0.5, 1.0],
            points: [startPoint, midPoint, endPoint]
        });

        let curvePoints = [];
        for (let i = 0, len = 200; i < len; i++) {
            curvePoints.push(spline.evaluate(i / len));
        }
        return curvePoints;
    },

    //获取一个圆的边缘坐标
    generateCirclePoints(center, radius) {
        let points = [];
        for (let i = 0; i < 360; i += 20) {
            points.push(this.getCirclePoint(center[0], center[1], i, radius * Math.random()))
        }
        return points;
    },

    getCirclePoint(lon, lat, angle, radius) {
        let dx = radius * Math.sin(angle * Math.PI / 180.0);
        let dy = radius * Math.cos(angle * Math.PI / 180.0);
        let ec = 6356725 + (6378137 - 6356725) * (90.0 - lat) / 90.0;
        let ed = ec * Math.cos(lat * Math.PI / 180);
        let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
        let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
        return [newLon, newLat];
    },

    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2284419.161167738,
                y: 5201019.893242833,
                z: 3119322.0518434322
            },
            orientation: {
                heading: 0.3190159180042542,
                pitch: -0.5767419023955451,
                roll: 6.283054821829467
            }
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    }
}
export default cesiumInit;