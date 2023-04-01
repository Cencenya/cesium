import PlotTypes from "../PlotTypes"
import Simple from '../Plots/Simple';
import Gradients from '../Plots/Gradients';
import Location from '../Plots/Location';


let PlotFactory = {

    createPlot(viewer, plotType, geoFeature) {

        switch (plotType) {
            case PlotTypes.SIMPLELABEL:
                return new Simple(viewer, geoFeature);
            case PlotTypes.GRADIENTSLABEL:
                return new Gradients(viewer, geoFeature);
            case PlotTypes.LOCATIONLABEL:
                return new Location(viewer, geoFeature);
        }
    }
}

export default PlotFactory;