export default class Sensor1 {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.position = options.position;
        this.radius = options.radius || 200;
        this.heading = options.heading || 0;
        this.color = options.color || Cesium.Color.YELLOW.withAlpha(0.5);

        this.addEllipsoid();
        this.showScan();
    }

    //添加椭球
    addEllipsoid() {
        this.ellipsoid = this.viewer.entities.add({
            position: this.position,
            ellipsoid: {
                radii: new Cesium.Cartesian3(this.radius, this.radius, this.radius),
                maximumCone: Cesium.Math.toRadians(90),
                material: this.color,
                subdivisions: 128,
                stackPartitions: 32,
                slicePartitions: 32,
                outline: true,
                outlineColor: this.color.withAlpha(1)
            },
        });
    }

    //显示扫描
    showScan() {
        let roll = -90;
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), 0, Cesium.Math.toRadians(roll));
        this.scanEllipsoid = this.viewer.entities.add({
            position: this.position,
            orientation: new Cesium.CallbackProperty(e => {
                roll += 0.6;
                roll > 90 && (roll = -90);
                headingPitchRoll.roll = Cesium.Math.toRadians(roll);
                return Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
            }, false),
            ellipsoid: {
                radii: new Cesium.Cartesian3(this.radius, this.radius, this.radius),
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-0.00001),
                maximumClock: Cesium.Math.toRadians(0.00001),
                minimumCone: Cesium.Math.toRadians(-90.0),
                maximumCone: Cesium.Math.toRadians(90.0),
                material: this.color,
                outline: false,
            },
        });
    }


    //关闭扫描
    closeScan() {
        this.viewer.entities.remove(this.scanEllipsoid);
    }
}