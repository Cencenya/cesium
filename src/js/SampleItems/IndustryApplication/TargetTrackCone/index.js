//雷达追踪圆锥体
import appConfig from "@/js/appConfig"
import TargetTrackCone from "@/components/IndustryApplication/TargetTrack/Cone"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        //源点坐标
        this.originPoint = [106.45531788088708, 29.50637660924465, 35];
        this.originPosition = Cesium.Cartesian3.fromDegrees(this.originPoint[0], this.originPoint[1], this.originPoint[2] + 20);
        this.targetTrackCone = new TargetTrackCone(this.viewer, this.originPosition);

        this.addRadarModel();
        this.addTarget();
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
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2168792.734068365,
                y: 6881947.030631928,
                z: 2564864.3138284963
            },
            orientation: {
                heading: 6.2092497690218975,
                pitch: -0.8489176138360675,
                roll: 0.0001151687477829455
            }
        });
    },

    //添加雷达模型
    addRadarModel() {
        var entity = this.viewer.entities.add({
            name: "leida",
            position: Cesium.Cartesian3.fromDegrees(this.originPoint[0], this.originPoint[1], this.originPoint[2]),
            model: {
                uri: "../../static/glb/leida.glb",
                scale: 0.5,
                maximumScale: 1,
                silhouetteColor: Cesium.Color.fromAlpha(Cesium.Color.YELLOW, 0.8), //设置模型外轮廓颜色与透明度
                silhouetteSize: 1 //设置模型外轮廓线宽度
            },
        });
    },

    //添加目标 ，这里以运行的飞机为例
    addTarget() {
        var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(
            start,
            360,
            new Cesium.JulianDate()
        );

        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = 10;
        var position = this.computeCirclularFlight(this.originPoint[0], this.originPoint[1], 5, start);

        this.targetEntity = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: start,
                    stop: stop,
                }),
            ]),
            position: position,
            orientation: new Cesium.VelocityOrientationProperty(position),
            model: {
                uri: "../../static/glb/Cesium_Air.glb",
                minimumPixelSize: 128,
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW,
                }),
                width: 10,
            },
        });

        this.targetEntity.position.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
        })
        this.addTickEvent(); //注册事件 获取飞机的实时位置
    },

    //生成目标的运行轨迹
    computeCirclularFlight(lon, lat, radius, start) {
        var property = new Cesium.SampledPositionProperty();
        for (var i = 0; i <= 360; i += 45) {
            var radians = Cesium.Math.toRadians(i);
            var time = Cesium.JulianDate.addSeconds(
                start,
                i,
                new Cesium.JulianDate()
            );
            var position = Cesium.Cartesian3.fromDegrees(
                lon + radius * 1.5 * Math.cos(radians),
                lat + radius * Math.sin(radians),
                300000
            );
            property.addSample(time, position);

            this.viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.TRANSPARENT,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3,
                },
            });
        }
        return property;
    },

    //动态获取目标点位置
    addTickEvent() {
        this.viewer.clock.onTick.addEventListener(e => {
            const targetPosition = this.targetEntity.position.getValue(
                this.viewer.clock.currentTime
            );
            this.targetTrackCone.updateTargetPosition(targetPosition);
        }, this);
    },

    //加载3dtiles数据
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
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
        let cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, 55
        );
        let translation = Cesium.Cartesian3.subtract(
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