import PointEdit from "./point"
import PolygonEdit from "./polygon"
export default class HedronPlotEdit {
    constructor(viewer, plotLayer) {
        this.pointEdit = new PointEdit(viewer, plotLayer);
        this.polygonEdit = new PolygonEdit(viewer, plotLayer);
        this.polygonEdit.activate();
    }
}