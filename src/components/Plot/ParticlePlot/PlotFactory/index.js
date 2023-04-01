import PlotTypes from "../PlotTypes"

import Fire from "../Fire"
import Fountain from "../Fountain"

let PlotFactory = {
    createPlot(viewer, plotType, geoFeature) {
        switch (plotType) {
            case PlotTypes.FIRE:
                return new Fire(viewer, geoFeature);
            case PlotTypes.FOUNTAIN:
                return new Fountain(viewer, geoFeature);
        }
    }
}

export default PlotFactory;