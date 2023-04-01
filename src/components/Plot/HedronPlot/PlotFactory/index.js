import PlotTypes from "../PlotTypes"
import Polyhedron from "../Polyhedron"
import Hemisphere from "../Hemisphere"
import Cylinder from "../Cylinder"

let PlotFactory = {
    createPlot(viewer, plotType, geoFeature) {
        switch (plotType) {
            case PlotTypes.POLYHEDRON:
                return new Polyhedron(viewer, geoFeature);
            case PlotTypes.HEMISPHERE:
                return new Hemisphere(viewer, geoFeature);
            case PlotTypes.CYLINDER:
                return new Cylinder(viewer, geoFeature);
        }
    }
}

export default PlotFactory;