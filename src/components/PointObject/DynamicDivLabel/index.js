import Vue from "vue"
import WindowVue from "./window.vue"
let WindowVm = Vue.extend(WindowVue)

export default class DynamicDivLabel {
    constructor(viewer, position, label) {
        this.viewer = viewer;
        this.position = position;
        this.vmInstance = new WindowVm({
            propsData: {
                label,
            }
        }).$mount(); //根据模板创建一个面板 
        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将字符串模板生成的内容添加到DOM上
        this.addPostRender();
        //this.addPoint();
    }

    //添加点图元
    addPoint() {
        this.viewer.entities.add({
            position: this.position,
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            }
        })
    }

    //添加场景事件
    addPostRender() {
        this.viewer.scene.postRender.addEventListener(this.postRender, this);
    }

    //场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
    postRender() {
        if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        const elHeight = this.vmInstance.$el.firstChild.offsetHeight;
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y + elHeight + "px";
        const elWidth = this.vmInstance.$el.firstChild.offsetWidth;

        this.vmInstance.$el.style.left = windowPosition.x - (elWidth / 2) + "px";

        if (this.viewer.camera.positionCartographic.height > 14000) {
            this.vmInstance.$el.style.display = "none";
        } else {
            this.vmInstance.$el.style.display = "block";
        }
    }

    //关闭 
    windowClose() {
        this.vmInstance.show = false; //删除dom
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
    }
}