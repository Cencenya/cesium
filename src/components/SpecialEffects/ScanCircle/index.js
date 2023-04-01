import "@/components/Materials/ScanCircleMaterial";

export default class ScanCircle {
    constructor(viewer, position, options) {
        this.viewer = viewer;
        this.position = position;
        options = options || {};

        this.radius = options.radius || 10;
        this.color = options.color || Cesium.Color.AQUA;
        this.addCircle();
    }

    //添加圆
    addCircle() {
        let stRotation = 360;
        this.circle = this.viewer.entities.add({
            position: this.position,
            ellipse: {
                semiMinorAxis: this.radius,
                semiMajorAxis: this.radius,
                material: new Cesium.ScanCircleMaterialProperty(this.color),
                classificationType: Cesium.ClassificationType.BOTH,
                stRotation: new Cesium.CallbackProperty(e => {
                    stRotation--;
                    stRotation < 0 && (stRotation = 360);
                    return Cesium.Math.toRadians(stRotation);
                }, false),
            }
        });
    }

    //移除
    remove() {
        this.viewer.remove(this.circle);
    }
}