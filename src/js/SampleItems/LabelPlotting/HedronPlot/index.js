//体对象标绘 
import appConfig from "@/js/appConfig"
import PlotDraw from "@/components/Plot/HedronPlot/PlotDraw"
import HedronPlotLayer from "@/components/Plot/PlotLayer/HedronPlot"
import HedronPlotEdit from "@/components/Plot/HedronPlot/PlotEdit"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initPlot();
        // this.load3dtiles();
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
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        //this.viewer.animation.container.style.visibility = 'hidden'; // 不显示动画控件
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },


    setView() {
        let flyToOpts = {
            destination: {
                x: -1563604.1538326172,
                y: 5339284.777234141,
                z: 3124686.571583323
            },
            orientation: {
                heading: 1.3946862718235566,
                pitch: -0.6663081682589098,
                roll: 0.003599398222597472
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    //初始化标绘
    initPlot() {
        this.plotDraw = new PlotDraw(this.viewer);
        this.hedronPlotLayer = new HedronPlotLayer(this.viewer);
        this.hedronPlotLayer.setPlotSelectable(true);
        this.plotDraw.PlotDrawEndEvent.addEventListener((drawPlot, type) => {
            drawPlot.remove(); //移除绘制的对象      
            this.hedronPlotLayer.addPlot(drawPlot.toGeoJson()); //将标绘对象添加到图层中进行管理
        });

        this.plotEdit = new HedronPlotEdit(this.viewer, this.hedronPlotLayer);
        this.initDatas();
    },

    //初始化数据
    initDatas() {
        fetch("../../static/data/1608101533866.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.hedronPlotLayer.addPlot(feature);
            })
        }).catch(err => {
            console.log(err)
        })
    },

    //激活绘制
    drawActivate(plotType) {
        this.plotDraw.activate(plotType);
    },

    //保存到文件
    savePlots() {
        const features = [];
        this.hedronPlotLayer.plots.forEach(plot => {
            features.push(plot.toGeoJson());
        })
        let geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        let data = JSON.stringify(geojson);

        var blob = new Blob([data], { type: 'text/json' });
        var e = document.createEvent('MouseEvents');
        var a = document.createElement('a');
        a.download = new Date().getTime() + ".json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },

    //清空
    clear() {
        this.hedronPlotLayer.clear();
    },


    //模拟飞行飞行代码开始

    //初始化漫游路线
    initRoamLine() {
        let ds = [
            [106.41275965096104, 29.527708616368333, -2.7819584377807334],
            [106.43832972407525, 29.471079289267706, -2.1220583986467974],
            [106.46053329123941, 29.484380666765635, -2.268773501999807],
            [106.44042820596253, 29.531371779728396, -2.8008197764655294]
        ];
        let as = [];
        ds.forEach(item => {
            as.push(item[0]);
            as.push(item[1]);
            as.push(400);
        })

        let ps = Cesium.Cartesian3.fromDegreesArrayHeights(as)
        this.addRoamLine(ps);
    },

    //添加漫游路线
    addRoamLine(positions) {
        this.clearAnimateEntity();
        let timeObj = this.getSiteTimes(positions, 160);
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
                scale: 1
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
        this.interval = setInterval(() => {
            let center = this.animateEntity.position.getValue(
                this.viewer.clock.currentTime
            );
            this.hedronPlotLayer.updateTargetPosition(center);
        }, 1000);
    },

    //移除事件
    removeEvent() {
        clearInterval(this.interval);
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


    //模拟飞行飞行代码结束

    //加载3dtiles数据
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
                //show: false
            })
        );

        tileset.readyPromise
            .then(tileset => {
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