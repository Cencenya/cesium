import CameraLine from "../CameraLine"
import ViewShedStage from "../ViewShed"

export default class ViewShedDraw {
    constructor(viewer) {
        this.viewer = viewer;
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.initEvents();
    }

    //激活
    activate() {
        this.deactivate();
        this.clear();
        this.firstPosition = undefined; //鼠标点击的第一个点
        this.registerEvents(); //注册鼠标事件 

        //设置鼠标状态 
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
    }

    //禁用
    deactivate() {
        this.unRegisterEvents();
        this.viewer._element.style.cursor = 'pointer';
        this.viewer.enableCursorStyle = true;
    }

    //清空绘制
    clear() {
        if (this.cameraLine) {
            this.cameraLine.remove();
            this.cameraLine = undefined;
        }
    }

    //初始化事件
    initEvents() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.DrawEndEvent = new Cesium.Event();
    }

    //注册鼠标事件
    registerEvents() {
        this.leftClickEvent();
        this.rightClickEvent();
        this.mouseMoveEvent();
    }

    leftClickEvent() {
        //单击鼠标左键画点
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            if (!this.firstPosition) {
                this.firstPosition = this.getFirstPosition(position);
            } else {
                this.drawEnd();
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //获取第一个鼠标点击点（手动加高x米）
    getFirstPosition(position) {
        const c = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(c.longitude);
        const lat = Cesium.Math.toDegrees(c.latitude);
        const height = c.height + 1;
        return Cesium.Cartesian3.fromDegrees(lon, lat, height);
    }

    //创建相机线
    createCameraLine(position) {
        this.cameraLine = new CameraLine(this.viewer, {
            viewPosition: this.firstPosition,
            viewPositionEnd: position
        })
    }


    //鼠标移动事件
    mouseMoveEvent() {
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default'; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
            let position = this.viewer.scene.pickPosition(e.endPosition);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            if (!this.firstPosition) return;

            if (!this.cameraLine) {
                this.createCameraLine(position);
            } else {
                this.cameraLine.updateEndPosition(position);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    rightClickEvent() {
        this.handler.setInputAction(e => {
            if (!this.firstPosition) {
                this.deactivate()
                return;
            } else {
                this.clear();
                this.deactivate();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    //绘制结束 触发结束事件
    drawEnd() {
        this.viewShedStage = new ViewShedStage(this.viewer, this.cameraLine.getOptions());
        this.DrawEndEvent.raiseEvent(this.viewShedStage); //触发结束事件

        this.cameraLine.remove(); //删除绘制的相机
        this.deactivate();
    }
}