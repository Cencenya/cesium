// 多字段自动适配窗口
//根据字段字符段长度设置label的宽度 
//不限字段数量
// 动态设置字段与字段值

import Vue from "vue"
import WindowVue from "./window.vue"
let WindowVm = Vue.extend(WindowVue)

export default class MultiFieldAdaptWindow {
    constructor(viewer, position, title, fields, values) {
        if (!Array.isArray(fields) || !Array.isArray(values)) {
            throw "字段和值必须为数组类型"
        }

        if (fields.length != values.length) {
            throw "字段和值数组长度不一致！"
        }
        this.viewer = viewer;
        this.position = position;
        this.vmInstance = new WindowVm({
            propsData: {
                title,
                fields,
                values
            }
        }).$mount(); //根据模板创建一个面板

        //点击窗口上的关闭按钮
        this.vmInstance.closeEvent = e => {
            this.windowClose();
        };

        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将字符串模板生成的内容添加到DOM上
        this.addPostRender();
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
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y + 80 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x - (elWidth / 2) + "px";

        if (this.viewer.camera.positionCartographic.height > 4000) {
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