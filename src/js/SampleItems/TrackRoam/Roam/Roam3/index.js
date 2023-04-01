// Cesium上帝视角漫游
import appConfig from '@/js/appConfig'
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: true,
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
        this.viewer.animation.container.style.visibility = 'hidden'; // 不显示动画控件
        //取消双击锁定事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },

    //初始化漫游路线
    initRoamLine() {
        let positions = [
            { x: -1573904.0433920694, y: 5327818.668890881, z: 3122842.9558541914 }, { x: -1573832.9167513775, y: 5327913.353832802, z: 3122727.8987538028 }, { x: -1573823.9500795798, y: 5327921.240143145, z: 3122720.0951048634 }, { x: -1573724.7756341328, y: 5327977.379188832, z: 3122671.958911856 }
        ]
        this.addRoamLine(positions);
    },

    //添加漫游路线
    addRoamLine(positions) {
        this.clearAnimateEntity();
        let timeObj = this.getSiteTimes(positions, 30);
        let startTime = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16)); //Cesium.JulianDate.fromDate(new Date());
        let stopTime = Cesium.JulianDate.addSeconds(startTime, timeObj.timeSum, new Cesium.JulianDate());

        this.viewer.clock.startTime = startTime.clone();
        this.viewer.clock.stopTime = stopTime.clone();
        this.viewer.clock.currentTime = startTime.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

        let property = this.computeCirclularFlight(positions, startTime, timeObj.siteTimes);
        this.animateEntity = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime
            })]),
            position: property,
            orientation: new Cesium.VelocityOrientationProperty(property),
            model: {
                uri: "static/gltf/redCar.glb",
                scale: 0.1
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),
                width: 10
            }
        });

        this.addEvent();

        this.timoutId = setTimeout(e => {
            this.removeEvent();
            this.clearAnimateEntity();
        }, timeObj.timeSum * 1000);
    },

    //添加事件
    addEvent() {
        this.viewer.clock.onTick.addEventListener(this.traceHandler, this);
    },

    //事件处理函数
    traceHandler() {
        let center = this.animateEntity.position.getValue(
            this.viewer.clock.currentTime
        );
        let orientation = this.animateEntity.orientation.getValue(
            this.viewer.clock.currentTime
        )
        let transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
        transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), center);
        this.viewer.camera.lookAtTransform(transform, new Cesium.Cartesian3(-50, 0, 250))
    },

    //移除事件
    removeEvent() {
        this.viewer.clock.onTick.removeEventListener(this.traceHandler, this);
        this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    },

    //清除轨迹
    clearAnimateEntity() {
        if (this.animateEntity) {
            this.viewer.entities.remove(this.animateEntity);
            this.animateEntity = undefined;
        }
        clearTimeout(this.timoutId);
        this.removeEvent();
    },

    //获取飞行的动画点位
    computeCirclularFlight(pArr, startTime, siteTimes) {
        var property = new Cesium.SampledPositionProperty();
        for (var i = 0; i < pArr.length; i++) {
            const time = Cesium.JulianDate.addSeconds(startTime, siteTimes[i], new Cesium.JulianDate());
            property.addSample(time, pArr[i]);
        }
        return property;
    },

    //计算每个点位时间与总时间
    getSiteTimes(pArr, speed) {
        let timeSum = 0,
            times = [];
        for (var i = 0; i < pArr.length; i++) {
            if (i == 0) {
                times.push(0); //第0个时间为0
                continue;
            }
            timeSum += this.spaceDistance([pArr[i - 1], pArr[i]]) / speed;
            times.push(timeSum);
        }
        return {
            timeSum: timeSum,
            siteTimes: times
        }
    },

    //计算距离
    spaceDistance(positions) {
        let distance = 0;
        for (let i = 0; i < positions.length - 1; i++) {
            let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            let geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            let s = geodesic.surfaceDistance;
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
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