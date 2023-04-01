export default class TrailLineAnimate {
    constructor(viewer) {
        this.viewer = viewer;
        this.initEvents();
    }

    //初始化事件
    initEvents() {
        //动画开始事件
        this.AnimateStartEvent = new Cesium.Event();
        //站点到达事件
        this.StopsArrivedEvent = new Cesium.Event(); //传入站点信息
        //动画结束事件
        this.AnimateEndEvent = new Cesium.Event();
    }

    //开始播放轨迹
    play(stops, speed) {
        this.stop(); //执行前先停止
        this.stops = stops;
        this.speed = speed;
        this.addTrailLine(this.getPositions());
        this.addTickEvent();
        this.isAnimating = true;
        this.nextStopsIndex = 0;
    }

    //获取点串
    getPositions() {
        let positions = [];
        this.stops.forEach(stop => {
            positions.push(stop.position)
        });
        return positions;
    }

    //添加轨迹线
    addTrailLine(positions) {
        this.trailLineInfo = this.getTrailLineInfo(positions, this.speed || 25);
        let startTime = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16)); //Cesium.JulianDate.fromDate(new Date());
        let stopTime = Cesium.JulianDate.addSeconds(startTime, this.trailLineInfo.timeInfo.timeSum, new Cesium.JulianDate());

        this.viewer.clock.startTime = startTime.clone();
        this.viewer.clock.stopTime = stopTime.clone();
        this.viewer.clock.currentTime = startTime.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;

        let property = this.computeCirclularFlight(positions, startTime, this.trailLineInfo.timeInfo.siteTimes);
        this.addAminateModel(startTime, stopTime, property);
        this.addAnimateLine();
        this.calStopsTimes(startTime, this.trailLineInfo.timeInfo.siteTimes);
    }

    //获取飞行的动画点位
    computeCirclularFlight(pArr, startTime, siteTimes) {
        var property = new Cesium.SampledPositionProperty();
        for (var i = 0; i < pArr.length; i++) {
            const time = Cesium.JulianDate.addSeconds(startTime, siteTimes[i], new Cesium.JulianDate());
            property.addSample(time, pArr[i]);
        }
        return property;
    }

    //计算每个站点的时间
    calStopsTimes(startTime, siteTimes) {
        this.stopsTimes = [];
        siteTimes.forEach(item => {
            const date = Cesium.JulianDate.addSeconds(startTime, item, new Cesium.JulianDate());
            this.stopsTimes.push(date);
        });
    }

    //添加动画模型
    addAminateModel(startTime, stopTime, property) {
        this.animateModel = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime
            })]),
            position: property,
            orientation: new Cesium.VelocityOrientationProperty(property),
            model: {
                uri: "static/gltf/redCar.glb",
                scale: 0.1
            }
        });

    }

    //添加动画线
    addAnimateLine() {
        this.linePositions = [];
        this.animateLine = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    this.linePositions.push(this.animateModel.position.getValue(
                        this.viewer.clock.currentTime
                    ));
                    return this.linePositions;
                }, false),
                width: 3,
                material: Cesium.Color.YELLOW,
                clampToGround: true
            },
        })
    }

    //停止
    stop() {
        this.clear();
        this.removeTickEvent();
        this.isAnimating = false;
    }

    //添加时间监听事件
    addTickEvent() {
        this.viewer.clock.onTick.addEventListener(this.tickEventHandler, this);
    }

    //移除时间监听事件
    removeTickEvent() {
        this.viewer.clock.onTick.removeEventListener(this.tickEventHandler, this);
    }

    //时间监听事件处理函数
    tickEventHandler() {
        const currentTime = this.viewer.clock.currentTime;
        const nextStopsTime = this.stopsTimes[this.nextStopsIndex];
        if (Cesium.JulianDate.equalsEpsilon(currentTime, nextStopsTime, 0.1)) {
            //触发站点到达事件 
            this.StopsArrivedEvent.raiseEvent(this.stops[this.nextStopsIndex], this.nextStopsIndex);
            this.nextStopsIndex++; //通过时间判断当前到达的站点
            if (this.nextStopsIndex == this.stopsTimes.length) {
                //最后一个站点结束
                this.removeTickEvent();
                this.isAnimating = false;
                this.AnimateEndEvent.raiseEvent();
            }
        }
    }

    //清除轨迹
    clear() {
        this.viewer.entities.remove(this.animateModel);
        this.animateModel = undefined;

        this.viewer.entities.remove(this.animateLine);
        this.animateLine = undefined;
    }

    //计算笛卡尔坐标串的距离
    spaceDistance(positions) {
        let distance = 0;
        let c1, c2, geodesic, sD;
        for (let i = 0; i < positions.length - 1; i++) {
            c1 = Cesium.Cartographic.fromCartesian(positions[i]);
            c2 = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(c1, c2);
            sD = geodesic.surfaceDistance;
            //返回两点之间的距离
            sD = Math.sqrt(Math.pow(sD, 2) + Math.pow(c2.height - c1.height, 2));
            distance = distance + sD;
        }
        return distance.toFixed(3);
    }

    // GPS点串转笛卡尔点串 coordinates=[[x,y,z],[x,y,z]]格式
    fromCoordinatesToCartesian3(coordinates) {
        let ps = [];
        coordinates.forEach(item => {
            ps.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]));
        });
        return ps;
    }

    //获取轨迹信息 传入笛卡尔坐标点串和速度
    getTrailLineInfo(positions, speed) {
        let trailLineInfo = {};
        trailLineInfo.timeInfo = this.getSiteTimes(positions, speed);
        trailLineInfo.startTime = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16)); //Cesium.JulianDate.fromDate(new Date());//开始时间
        trailLineInfo.stopTime = Cesium.JulianDate.addSeconds(trailLineInfo.startTime, trailLineInfo.timeInfo.timeSum, new Cesium.JulianDate()); //结束时间
        return trailLineInfo;
    }

    //获取每个站点的时间秒及总时间
    getSiteTimes(positions, speed) {
        let times = [0]; //第0个时间为0秒 
        let timeSum = 0;
        for (var i = 1; i < positions.length; i++) {
            timeSum += this.spaceDistance([positions[i - 1], positions[i]]) / speed;
            times.push(timeSum);
        }
        return {
            timeSum: timeSum,
            siteTimes: times
        }
    }
}