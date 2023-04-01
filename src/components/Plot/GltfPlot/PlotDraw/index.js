import PlotDrawTip from "../../PlotBase/PlotDrawTip"
import MousePoint from "../../PlotBase/MousePoint"

export default class GltfDraw {
    constructor(viewer) {
        this.viewer = viewer;
        this.initEvents();
    }

    initEvents() {
        this.DrawEndEvent = new Cesium.Event(); //结束绘制事件  
    }

    activate() {
        this.registerEvents();
        this.plotDrawTip = new PlotDrawTip(this.viewer);
        this.plotDrawTip.setContent(["左键点击确定模型位置", "右键点击取消"]);
        this.mousePoint = new MousePoint(this.viewer);
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
    }

    registerEvents() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.initLeftClickEvent();
        this.initMouseMoveEvent();
        this.eventHandler.setInputAction(((e) => {
            this.deactivate();
        }), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    initLeftClickEvent() {
        this.eventHandler.setInputAction(e => {
            let pickPosition = this.viewer.scene.pickPosition(e.position);
            if (!pickPosition) {
                pickPosition = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!pickPosition) return;
            this.DrawEndEvent.raiseEvent(pickPosition);
            this.deactivate();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    initMouseMoveEvent() {
        this.eventHandler.setInputAction(((e) => {
            let pickPosition = this.viewer.scene.pickPosition(e.startPosition);
            if (!pickPosition) {
                pickPosition = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!pickPosition) return;
            this.plotDrawTip.updatePosition(pickPosition);
            this.mousePoint.updatePosition(pickPosition);
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    unRegisterEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    deactivate() {
        this.unRegisterEvents();
        this.plotDrawTip.remove();
        this.plotDrawTip = undefined;
        this.mousePoint.remove();
        this.mousePoint = undefined;
        this.viewer._element.style.cursor = 'pointer';
        this.viewer.enableCursorStyle = true;
    }
}