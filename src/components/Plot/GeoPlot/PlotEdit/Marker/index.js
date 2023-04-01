// 单独编辑点类型
//左键按下编辑对象隐藏编辑对象移动开始
//左键抬起编辑对象显示编辑对象移动结束
import MousePoint from "../../../PlotBase/MousePoint"

class GeoMarkerEdit {
    constructor(viewer, geoPlotLayer) {
        this.viewer = viewer;
        this.geoPlotLayer = geoPlotLayer;
        this.registerMouseEvents();
    }

    //注册鼠标事件
    registerMouseEvents() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.initLeftDownEventHandler();
        this.initMouseMoveEventHandler();
        this.initLeftUpEventHandler();
    }

    //移除鼠标事件
    unRegisterMouseEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    destroy() {
        this.unRegisterMouseEvents();
        this.viewer = undefined;
        this.geoPlotLayer = undefined;
        this.eventHandler = undefined;
    }

    //场景鼠标左键按下事件
    initLeftDownEventHandler() {
        this.eventHandler.setInputAction((e) => {
            if (!this.geoPlotLayer.selectedPlot) return;
            let id = this.viewer.scene.pick(e.position);
            if (!id || !id.id || id.id.type !== "GeoPlot") {
                return; // 没有拾取到对象 直接返回 不做任何操作
            }

            //判断拾取的对象是否为选中的对象
            if (this.geoPlotLayer.selectedPlot.properties.plotCode != id.id.plotCode) {
                return;
            }
            this.viewer.enableCursorStyle = false;
            document.body.style.cursor = "move";
            this.moveing = true;

            this.mousePoint = new MousePoint(this.viewer);
            this.viewer.scene.screenSpaceCameraController.enableRotate = false; //禁用场景的旋转移动功能 保留缩放功能
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }

    //场景鼠标左键抬起事件
    initLeftUpEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            if (!this.moveing) return;
            this.viewer.enableCursorStyle = true;
            document.body.style.cursor = "default";
            this.moveing = false;
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;

            this.mousePoint.remove();
            this.mousePoint = undefined;
        }), Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    //场景鼠标移动事件
    initMouseMoveEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            if (!this.moveing) return;
            //先拾取位置 如果没有拾取到 直接返回  因为场景拾取位置有时会发生错误 拾取不到位置
            let pickPosition = this.viewer.scene.pickPosition(e.endPosition);
            if (!pickPosition) return;
            this.mousePoint.updatePosition(pickPosition);
            this.geoPlotLayer.selectedPlot.setPositions([pickPosition]);
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}

export default GeoMarkerEdit;