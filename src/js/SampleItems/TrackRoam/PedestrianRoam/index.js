// Cesium 行人漫游
import appConfig from '@/js/appConfig'
import "@/components/Materials/CircleWaveMaterial" //引入自定义材质类

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initRoamLine();
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
                url: "https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A"
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        //取消双击锁定事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },

    //初始化漫游路线
    initRoamLine() {
        let positions = [
            Cesium.Cartesian3.fromDegrees(106.45270641311477, 29.50644099401112, 1),
            Cesium.Cartesian3.fromDegrees(106.45398412135906, 29.506502298321386, 1),
            Cesium.Cartesian3.fromDegrees(106.45673383868487, 29.506562187916277, 1),
            Cesium.Cartesian3.fromDegrees(106.45801836706899, 29.50650794603084, 1),
            Cesium.Cartesian3.fromDegrees(106.4693364885288, 29.506228128841304, 1)
        ]
        this.addRoamLine(positions);
        this.ePosition = positions[0];
        this.addEllipse();
    },

    //添加漫游路线
    addRoamLine(positions) {
        this.clearAnimateEntity();
        let timeObj = this.getSiteTimes(positions, 25);
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
                uri: "static/gltf/man/walk.gltf",
                scale: 10
            },
        });

        this.viewer.trackedEntity = this.animateEntity;
        this.viewer.clock.onTick.addEventListener(this.traceHandler, this);
        //完成清除
        this.timoutId = setTimeout(e => {
            this.clearAnimateEntity();
            this.viewer.clock.onTick.removeEventListener(this.traceHandler, this);
        }, timeObj.timeSum * 1000)
    },

    //添加圆实体
    addEllipse() {
        this.eEntity = this.viewer.entities.add({      
            position: new Cesium.CallbackProperty(e => {
                return this.ePosition;
            }, false),
            ellipse: {
                height: 1,
                semiMinorAxis: 20,
                semiMajorAxis: 20,
                material: new Cesium.CircleWaveMaterialProperty({
                    duration: 2e3,
                    gradient: 0,
                    color: Cesium.Color.YELLOW,
                    count: 3
                })
            }
        });
    },

    //事件处理函数
    traceHandler() {
        this.ePosition = this.animateEntity.position.getValue(
            this.viewer.clock.currentTime
        );
    },

    //清除轨迹
    clearAnimateEntity() {
        if (this.animateEntity) {
            this.viewer.entities.remove(this.animateEntity);
            this.animateEntity = undefined;

            this.viewer.entities.remove(this.eEntity);
            this.eEntity = undefined;
        }
        clearTimeout(this.timoutId);
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
                show: false
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