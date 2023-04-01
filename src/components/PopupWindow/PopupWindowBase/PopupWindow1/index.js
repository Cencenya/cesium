import Vue from "vue";
import WindowVue from "./window.vue";
let WindowVm = Vue.extend(WindowVue);
class PopupWindow1 {
    constructor(viewer, position, data) {
        this.vmInstance = new WindowVm({
            propsData: data
        }).$mount();
        this.viewer = viewer;
        this.position = position;

        //点击窗口上的关闭按钮
        this.vmInstance.closeEvent = e => {
            this.windowClose();
        };

        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el);
        this.addPostRender(position);
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
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y + 70 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x - (elWidth / 2) + "px";

        if (this.viewer.camera.positionCartographic.height > 4000) {
            this.vmInstance.$el.style.display = "none";
        } else {
            this.vmInstance.$el.style.display = "block";
        }
    }


    windowClose() {
        this.vmInstance.show = false; //删除dom
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
    }
}
export default PopupWindow1;