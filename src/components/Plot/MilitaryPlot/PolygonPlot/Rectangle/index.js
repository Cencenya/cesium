// 矩形标绘类 
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"
export default class Rectangle extends Polygon {

    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.RECTANGLE; //标绘类型
        this.properties.plotName = "矩形"; //标绘名称
    }

    initConsts() {
        this.fixPointCount = 2;
    }

    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        } else {
            var pnt1 = this.coordinates[0][0];
            var pnt2 = this.coordinates[0][1];
            var xmin = Math.min(pnt1[0], pnt2[0]);
            var xmax = Math.max(pnt1[0], pnt2[0]);
            var ymin = Math.min(pnt1[1], pnt2[1]);
            var ymax = Math.max(pnt1[1], pnt2[1]);
            var tl = [xmin, ymax];
            var tr = [xmax, ymax];
            var br = [xmax, ymin];
            var bl = [xmin, ymin];
            this.generatePositions([tl, tr, br, bl]);
        }
    }
}