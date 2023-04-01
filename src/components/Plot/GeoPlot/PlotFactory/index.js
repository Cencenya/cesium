import PlotTypes from "../PlotTypes"

import Marker from "../Marker"
import Text from "../Text"
import Polyline from "../Line"
import Polygon from '../Polygon'
import Circle from "../Circle"
import Rectangle from "../Rectangle"

import DynamicFence from "../Fence/DynamicFence"
import NormalFence from "../Fence/NormalFence"

import PolylineVolumeNormal from "../PolylineVolumeNormal"
import PolylineVolume from "../PolylineVolume"

let PlotFactory = {
    createPlot(viewer, plotType, geoFeature) {

        switch (plotType) {
            case PlotTypes.POLYGON:
                return new Polygon(viewer, geoFeature);
            case PlotTypes.MARKER:
                return new Marker(viewer, geoFeature);
            case PlotTypes.TEXT:
                return new Text(viewer, geoFeature);
            case PlotTypes.POLYLINE:
                return new Polyline(viewer, geoFeature);
            case PlotTypes.CIRCLE:
                return new Circle(viewer, geoFeature);
            case PlotTypes.RECTANGLE:
                return new Rectangle(viewer, geoFeature);

            case PlotTypes.NORMALFENCE:
                return new NormalFence(viewer, geoFeature);
            case PlotTypes.DYNAMICFENCE:
                return new DynamicFence(viewer, geoFeature);

            case PlotTypes.CORRIDOR:
                return new Corridor(viewer, geoFeature);
            case PlotTypes.POLYLINEVOLUME:
                return new PolylineVolume(viewer, geoFeature);
        }
    }
}

export default PlotFactory;