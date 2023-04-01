//缓冲区分析
import * as turf from "@turf/turf"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initBuffers();
        this.setView();
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

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //初始化缓冲区
    initBuffers() {
        this.initPointBuffer();
        this.initPolylineBuffer();
        this.initPolygonBuffer();
    },

    //设置视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -1571387.3809212528,
                y: 5327289.882969427,
                z: 3128663.905758795
            },
            orientation: {
                heading: 6.166690373674861,
                pitch: -0.8912442588528116,
                roll: 6.2826513409245255
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    //初始化点缓冲
    initPointBuffer() {
        let point = [106.422638966289, 29.5698367125623];
        this.addPoint(point);

        let pointF = turf.point(point);
        let buffered = turf.buffer(pointF, 60, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        let points = coordinates[0];
        let degreesArray = this.pointsToDegreesArray(points);
        this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
    },

    //添加点
    addPoint(point) {
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point[0], point[1], 0),
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
                outlineWidth: 3,
                outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
            }
        });
    },

    //初始化线缓冲
    initPolylineBuffer() {
        let points = [
            [106.425203158107, 29.5694914480581],
            [106.428808047023, 29.569230166027],
            [106.431661917416, 29.5692674920729],
            [106.434708906857, 29.5693048181049]
        ];
        let degreesArray = this.pointsToDegreesArray(points);
        this.addPolyline(Cesium.Cartesian3.fromDegreesArray(degreesArray));

        let polylineF = turf.lineString(points);
        let buffered = turf.buffer(polylineF, 30, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        points = coordinates[0];
        degreesArray = this.pointsToDegreesArray(points);
        this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
    },

    //添加线
    addPolyline(positions) {
        this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 2,
                material: Cesium.Color.YELLOW,
            }
        })
    },

    //初始化面缓冲
    initPolygonBuffer() {
        let points = [
            [106.438549830166, 29.5701073244566],
            [106.440695597377, 29.5701073244566],
            [106.440738512722, 29.5688755679036],
            [106.438700033871, 29.5687262630581],
            [106.438034846035, 29.5690248725284],
            [106.438549830166, 29.5701073244566]
        ];

        let degreesArray = this.pointsToDegreesArray(points);
        this.addPolygon(Cesium.Cartesian3.fromDegreesArray(degreesArray));

        let polygonF = turf.polygon([points]);
        let buffered = turf.buffer(polygonF, 60, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        points = coordinates[0];
        degreesArray = this.pointsToDegreesArray(points);
        this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
    },

    //添加面
    addPolygon(positions) {
        this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: Cesium.Color.YELLOW.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH
            },
            polyline: {
                positions: positions,
                width: 2,
                material: Cesium.Color.YELLOW.withAlpha(0.4),
            }
        });
    },

    //添加缓冲面
    addBufferPolyogn(positions) {
        this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: Cesium.Color.RED.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH
            },
        });
    },

    //格式转换
    pointsToDegreesArray(points) {
        let degreesArray = [];
        points.map(item => {
            degreesArray.push(item[0]);
            degreesArray.push(item[1]);
        });
        return degreesArray;
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;