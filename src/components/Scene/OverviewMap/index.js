// 鹰眼图 基于ol 构造函数中传入viewer 和map对象
import * as olExtent from 'ol/extent';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Polygon from 'ol/geom/Polygon';
import Feature from "ol/Feature"
import { Fill, Stroke, Style } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';

export default class OverviewMap {
    constructor(viewer, map) {
        this.viewer = viewer;
        this.map = map;
        this.activateContainer = undefined;
        this.initEvent();
        this.activate();
        this.addMapData();
    }

    initEvent() {
        this.viewer.scene.postRender.addEventListener(e => {
            if (this.activateContainer != "viewer") return;
            let rec = this.viewer.camera.computeViewRectangle();
            if (!rec) {
                console.log("rec is undefined");
                return;
            }
            let extent = [Cesium.Math.toDegrees(rec.west),
                Cesium.Math.toDegrees(rec.south),
                Cesium.Math.toDegrees(rec.east),
                Cesium.Math.toDegrees(rec.north),
            ]
            if (olExtent.isEmpty(extent)) {
                console.log("extent is empty");
                return;
            }
            const coordinates = this.getPolygonByBbox(extent);
            this.feature.setGeometry(new Polygon(coordinates))
            this.map.getView().fit(extent, {
                padding: [50, 50, 50, 50]
            });
        });
    }

    getPolygonByBbox(bbox) {
        return [
            [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[1]],
                [bbox[2], bbox[3]],
                [bbox[0], bbox[3]],
                [bbox[0], bbox[1]]
            ]
        ];
    }

    addMapData() {
        this.feature = new Feature(new Polygon([
            [
                [75, 20],
                [75, 40],
                [120, 40],
                [120, 20],
                [75, 20]
            ]
        ]));
        let source = new VectorSource({
            features: [this.feature],
        });
        let layer = new VectorLayer({
            source: source,
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 1,
                }),
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.2)',
                }),
            }),
        });
        this.map.addLayer(layer);
    }

    activate() {
        this.viewer.container.onmouseenter = (e) => {
            this.activateContainer = "viewer";
        };
        this.map.getViewport().onmouseenter = (e) => {
            this.activateContainer = "map";
        };
    }

    deactivate() {
        this.viewer.container.onmouseenter = undefined;
        this.map.getViewport().onmouseenter = undefined;
        this.activateContainer = undefined;
    }
}