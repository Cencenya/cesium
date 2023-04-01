//球体旋转
export default class GlobeRotate {
    constructor(viewer) {
        this.viewer = viewer;
        this.rAngle = Cesium.Math.toRadians(-0.5);
    }

    //开始旋转
    startRotate() {
        if (this.removeEvent) {
            this.stopRotate();
        }
        this.removeEvent = this.viewer.scene.postRender.addEventListener(this.postRenderEvent, this);
    }

    postRenderEvent() {
        this.viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, this.rAngle);
    }

    //结束旋转
    stopRotate() {
        this.viewer.scene.postRender.removeEventListener(this.postRenderEvent, this);
        this.removeEvent = undefined;
    }
}