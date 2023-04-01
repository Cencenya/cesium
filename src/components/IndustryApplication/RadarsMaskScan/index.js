export default class RadarsMaskScan {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.position = options.position;
        this.radii = options.radii || new Cesium.Cartesian3(200, 200, 200);
        this.color = options.color || Cesium.Color.YELLOW.withAlpha(0.5);

        this.addEllipsoid();
        this.showScan();
    }

    //添加椭球
    addEllipsoid() {
        this.ellipsoid = this.viewer.entities.add({
            position: this.position,
            ellipsoid: {
                radii: this.radii,
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
        let heading = -90;
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), 0, 0);
        this.scanEllipsoid = this.viewer.entities.add({
            position: this.position,
            orientation: new Cesium.CallbackProperty(e => {
                heading += 0.6;
                heading > 360 && (heading = 0);
                headingPitchRoll.heading = Cesium.Math.toRadians(heading);
                return Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
            }, false),
            ellipsoid: {
                radii: this.radii,
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-0.00001),
                maximumClock: Cesium.Math.toRadians(0.00001),
                minimumCone: Cesium.Math.toRadians(0.0),
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