import {viewer, Cesium} from "./create";
import {Entity} from "cesium";
import {handlerFun, showLabel} from "./marker";

export default class Geometry {

    setPolygon = () => {
         viewer.entities.add({
            id: "szf",
            name: "polygon1",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    119.921045, 28.46817,
                    119.924891, 28.468764,
                    119.925293, 28.466991,
                    119.921347, 28.466821,
                ]),
                material: Cesium.Color.BLUE.withAlpha(0.5),
            },
        });

       const polygon2 = viewer.entities.add({
            name: "polygon2",
            position:Cesium.Cartesian3.fromDegrees(119.905559, 28.4650),
            label:{
                text:"面"
            },
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    119.904559, 28.466293,
                    119.907026, 28.466245,
                    119.907241, 28.463987,
                    119.903936, 28.463953
                ]),
                material: Cesium.Color.BLUE.withAlpha(0.5),
            },
        });

        console.log(polygon2);
        handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, polygon2, (position, pickEntity) => {
            showLabel(polygon2.id, 119.905559, 28.4650, 80)
        });


        viewer.zoomTo(viewer.entities);

    }

}

