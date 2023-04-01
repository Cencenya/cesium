// 所有图层的基类 
export default class LayerBase {
    constructor(viewer) {
        this.viewer = viewer;
        this.plots = [];
        this.plotSelecteable = false; //默认元素不可选
    }

    setPlotSelectable(selecteable) {
        this.plotSelecteable = selecteable;
    }

    //从服务器上查询下来的数据通过该方法初始化
    initPlots(data) {

    }

    //绘制的时候 通过该方法添加
    addPlot(plot) {}

    removeByPlotCode(plotCode) {
        for (let i = 0; i < this.plots.length; i++) {
            if (this.plots[i].properties.plotCode == plotCode) {
                this.plots[i].remove();
                this.plots.splice(i, 1);
                return;
            }
        }
    }

    //每个标会对象必须有plotCode这个属性作为唯一标识 
    getByPlotCode(plotCode) {
        for (let i = 0; i < this.plots.length; i++) {
            if (this.plots[i].properties.plotCode == plotCode)
                return this.plots[i];
        }
    }

    removeAll() {
        this.clear();
    }

    clear() {
        this.plots.forEach(item => {
            item.remove();
        })
        this.plots = [];
    }
}