import PlotTypes from "../PlotTypes"
import Polygon from "../Polygon"
import Wall from "../Wall"
let PlotFactory = {
    createPlot(viewer, plotType, geoFeature) {

        switch (plotType) {
            case PlotTypes.POLYGON:
                return new Polygon(viewer, geoFeature);
            case PlotTypes.WALL:
                return new Wall(viewer, geoFeature);
        }
    }
}

export default PlotFactory;