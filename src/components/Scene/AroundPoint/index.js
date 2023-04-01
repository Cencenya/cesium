//绕点旋转
export default class GlobeRotate {
    constructor(viewer) {
        this.viewer = viewer;
        this.rAngle = 0.05;
    }

    //开始旋转
    startRotate(position) {
        if (this.entity) this.stopRotate();
        this.heading = 0; // 朝向
        this.offset = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(-45), 2000);
        this.entity = this.viewer.entities.add({
            position: position,
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED.withAlpha(0.01),
            }
        });
        this.viewer.zoomTo(this.entity, this.offset).then(() => {
            this.viewer.scene.screenSpaceCameraController.enableInputs = false;
            this.viewer.clock.onTick.addEventListener(this.postRenderEvent, this);
        });
    }

    postRenderEvent() {
        this.heading -= this.rAngle;
        this.offset = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(-45), 2000);
        this.viewer.zoomTo(this.entity, this.offset);
    }

    //结束旋转
    stopRotate() {
        this.viewer.clock.onTick.removeEventListener(this.postRenderEvent, this);
        this.viewer.scene.screenSpaceCameraController.enableInputs = true;
        this.viewer.entities.remove(this.entity);
        this.entity = undefined;
    }
}