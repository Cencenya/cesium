import PlotTypes from "../PlotTypes"

import Polygon from '../PolygonPlot/Polygon'
import ClosedCurve from '../PolygonPlot/ClosedCurve'
import Circle from '../PolygonPlot/Circle'
import Ellipse from '../PolygonPlot/Ellipse'
import Sector from '../PolygonPlot/Sector'
import Rectangle from "../PolygonPlot/Rectangle"
import FineArrow from '../PolygonPlot/FineArrow'
import AssaultDirection from '../PolygonPlot/AssaultDirection'
import AttackArrow from '../PolygonPlot/AttackArrow'
import TailedAttackArrow from '../PolygonPlot/TailedAttackArrow'
import DoubleArrow from '../PolygonPlot/DoubleArrow'
import GatheringPlace from '../PolygonPlot/GatheringPlace'
import SquadCombat from "../PolygonPlot/SquadCombat"
import TailedSquadCombat from "../PolygonPlot/TailedSquadCombat"

import Marker from "../MarkerPlot/Marker"

import Polyline from "../LinePolt/Polyline"

let PlotFactory = {
    createPlot(viewer, plotType, geoFeature) {

        switch (plotType) {
            case PlotTypes.POLYGON:
                return new Polygon(viewer, geoFeature);
            case PlotTypes.DOUBLE_ARROW:
                return new DoubleArrow(viewer, geoFeature);
            case PlotTypes.ATTACK_ARROW:
                return new AttackArrow(viewer, geoFeature);
            case PlotTypes.ELLIPSE:
                return new Ellipse(viewer, geoFeature);
            case PlotTypes.CIRCLE:
                return new Circle(viewer, geoFeature);
            case PlotTypes.FINE_ARROW:
                return new FineArrow(viewer, geoFeature);
            case PlotTypes.TAILED_ATTACK_ARROW:
                return new TailedAttackArrow(viewer, geoFeature);
            case PlotTypes.ASSAULT_DIRECTION:
                return new AssaultDirection(viewer, geoFeature);
            case PlotTypes.GATHERING_PLACE:
                return new GatheringPlace(viewer, geoFeature);
            case PlotTypes.CLOSED_CURVE:
                return new ClosedCurve(viewer, geoFeature);
            case PlotTypes.SECTOR:
                return new Sector(viewer, geoFeature);
            case PlotTypes.RECTANGLE:
                return new Rectangle(viewer, geoFeature);
            case PlotTypes.SQUAD_COMBAT:
                return new SquadCombat(viewer, geoFeature);
            case PlotTypes.TAILED_SQUAD_COMBAT:
                return new TailedSquadCombat(viewer, geoFeature);

            case PlotTypes.MARKER:
                return new Marker(viewer, geoFeature);

            case PlotTypes.POLYLINE:
                return new Polyline(viewer, geoFeature);
        }
    }
}

export default PlotFactory;