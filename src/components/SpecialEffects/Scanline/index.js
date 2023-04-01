import "@/components/Materials/ScanlineMaterial";

export default class Scanline {
    constructor(viewer, position, options) {
        this.viewer = viewer;
        this.position = position;
        options = options || {};
        this.radius = options.radius || 200;
        this.color = options.color || Cesium.Color.YELLOW;
        this.speed = options.speed || 10;
        this.addEnt();
    }

    addEnt() {
        this.ent = this.viewer.entities.add({
            position: this.position,
            ellipse: {
                semiMinorAxis: this.radius,
                semiMajorAxis: this.radius,
                material: new Cesium.ScanlineMaterialProperty(this.color, this.speed),
                classificationType: Cesium.ClassificationType.BOTH,
            }
        });
    }

    //移除
    remove() {
        this.viewer.remove(this.ent);
    }
}