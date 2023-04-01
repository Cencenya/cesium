import Vue from "vue"

import LocationPlotVue from "./vm.vue"
let LocationPlotVm = Vue.extend(LocationPlotVue)

/**
 * 经纬度信息拾取类 在场景中显示经度 纬度 高度信息
 */
class PositionPick {
    constructor(viewer, position) {
        this.position = position;
        this.index = (new Date().getTime())
        this.viewer = viewer;
        let c = Cesium.Cartographic.fromCartesian(this.position);
        let point = {
            x: Cesium.Math.toDegrees(c.longitude),
            y: Cesium.Math.toDegrees(c.latitude),
            z: c.height,
        }
        this.vmInstance = new LocationPlotVm({
            propsData: {
                point
            }
        }).$mount(); //根据模板创建一个面板

        this.vmInstance.closeEvent = e => {
            this.remove();
        }
        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将字符串模板生成的内容添加到DOM上
        this.addPostRender();
        this.addBillboard();
        this.initEvents();
    }

    updatePosition(newPosition) {
        this.position = newPosition;
        let c = Cesium.Cartographic.fromCartesian(this.position);
        let point = {
            x: Cesium.Math.toDegrees(c.longitude),
            y: Cesium.Math.toDegrees(c.latitude),
            z: c.height,
        }
        this.vmInstance.point = point;
    }

    addBillboard() {
        this.locationBillboard = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(e => {
                return this.position;
            }, false),
            type: "PositionPick",
            index: this.index,
            billboard: {
                image: "../../static/images/icon_location.png",
                scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        });
    }

    //添加场景事件
    addPostRender() {
        this.viewer.scene.postRender.addEventListener(this.postRender, this);
    }

    postRender() {
        if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y + 70 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x - (elWidth / 2) + "px";

        if (this.viewer.camera.positionCartographic.height > 4000) {
            this.vmInstance.$el.style.display = "none";
        } else {
            this.vmInstance.$el.style.display = "block";
        }
    }

    initEvents() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.registerMouseEvents();
    }

    //注册鼠标事件
    registerMouseEvents() {
        //鼠标左键按下事件 当有对象被选中时 如果拾取到编辑辅助要素 表示开始改变对象的位置
        this.initLeftDownEventHandler();
        //鼠标移动事件 鼠标移动 如果有编辑对象 表示改变编辑对象的位置
        this.initMouseMoveEventHandler();
        //鼠标左键抬起事件 当有编辑对象时  
        this.initLeftUpEventHandler();
    }

    //移除鼠标事件
    unRegisterMouseEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //场景鼠标左键按下事件
    initLeftDownEventHandler() {
        this.eventHandler.setInputAction((e) => {
            let id = this.viewer.scene.pick(e.position);
            if (!id) {
                return;
            }
            // 拾取到对象 判断拾取到的对象类型 
            if (!id.id || !id.id.type) return;
            //拾取到具有type 属性的entity对象 
            if (id.id.type == "PositionPick") {
                if (id.id.index != this.index) return;
                this.isEditing = true;
                this.viewer.scene.screenSpaceCameraController.enableRotate = false; //禁用场景的旋转移动功能 保留缩放功能
                //改变鼠标状态
                this.viewer.enableCursorStyle = false;
                this.viewer._element.style.cursor = '';
                document.body.style.cursor = "move";
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }

    //场景鼠标左键抬起事件
    initLeftUpEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            this.isEditing = false;
            this.viewer.enableCursorStyle = true;
            document.body.style.cursor = "default";
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        }), Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    //场景鼠标移动事件
    initMouseMoveEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            //先拾取位置 如果没有拾取到 直接返回  因为场景拾取位置有时会发生错误 拾取不到位置
            let pickPosition = this.viewer.scene.pickPosition(e.endPosition);
            if (!pickPosition) return;
            //判断是否有正在移动的对象  
            if (!this.isEditing) return;
            this.updatePosition(pickPosition); //更新位置 
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }


    //设置选中状态
    setSelected(selected) {
        this.vmInstance.isSelected = selected || false;
    }

    remove() {
        this.unRegisterMouseEvents();
        this.viewer.entities.remove(this.locationBillboard);
        this.viewer.cesiumWidget.container.removeChild(this.vmInstance.$el); //删除DOM
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
    }
}
export default PositionPick;