import Vue from "vue"

import PlotBase from '../../PlotBase';
import PlotTypes from '../../PlotTypes';

// import HtmlPlotEvent from "../HtmlPlotBase/HtmlPlotEvent"
import Template from "../../Templates/Gradients"
let GradientsLabelVm = Vue.extend(Template)

/**
 * html简单文本标绘类 
 */
class GradientsLabel extends PlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.GRADIENTSLABEL; //标绘类型
        this.properties.plotName = "渐变文本"; //标绘名称 

        //创建模板
        this.vmInstance = new GradientsLabelVm({
            propsData: {
                label: this.properties.attr.label
            }
        }).$mount(); //根据模板创建一个面板


        //注册模板的点击事件
        this.vmInstance.PlotItemClick = e => {
            //从图层对象上设置选中对象
            if (this.layer && this.layer.setSelectedPlot) {
                this.layer.setSelectedPlot(this);
            }
        }

        viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将模板生成的内容添加到DOM上
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
        this.vmInstance.$el.style.bottom = canvasHeight - windowPosition.y + 40 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x - (elWidth / 2) + "px";

        if (this.viewer.camera.positionCartographic.height > 2000) {
            this.vmInstance.$el.style.display = "none";
        } else {
            this.vmInstance.$el.style.display = "block";
        }
    }
}
export default GradientsLabel;