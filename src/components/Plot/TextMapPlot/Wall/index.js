import TextMapPlotBase from "../PlotBase";
import { drawText } from "../PlotUtils"
import { unifiedHeight } from "../../PlotBase/PlotBaseUtils";

import PlotTypes from "../PlotTypes"

export default class Wall extends TextMapPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);
        this.properties.plotName = "立体墙文字贴图";
        this.properties.plotType = PlotTypes.WALL;
        this.fixPositionCount = 2;
        this.style = this.properties.style || this.getDefaultStyle();
        this.properties.style = this.style;
        this.createEntity();
    }

    createEntity() {
        this.initHeights(); //创建之前先设置高度
        this.initWall();
    }

    getStyle() {
        return this.style;
    }

    updateStyle() {
        this.initHeights();
        this.wallEntity.wall.material.image = drawText(this.style);
    }

    updatePositionAction() {
        this.initHeights();
    }

    initHeights() {
        this.style.baseHeight = unifiedHeight(this.positions, this.style.baseHeight);
        if (this.style.baseHeight < 0) this.style.baseHeight = 0;
        let minimumHeights = new Array(this.positions.length).fill(this.style.baseHeight); //最小高度集合 

        let maximumHeights = []; //最大高度集合 
        for (let i = 0; i < minimumHeights.length; i++) {
            maximumHeights.push(minimumHeights[i] + this.style.wallHeight);
        }
        this.minimumHeights = minimumHeights;
        this.maximumHeights = maximumHeights;

    }

    initWall() {
        this.wallEntity = this.viewer.entities.add({
            plotType: this.properties.plotBase,
            plotCode: this.properties.plotCode,
            wall: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions
                }, false),
                minimumHeights: new Cesium.CallbackProperty(e => {
                    return this.minimumHeights //最小高度集合
                }, false),
                maximumHeights: new Cesium.CallbackProperty(e => {
                    return this.maximumHeights
                }, false),
                material: new Cesium.ImageMaterialProperty({
                    image: drawText(this.style),
                    transparent: true,
                    color: Cesium.Color.WHITE
                }),
                outline: false,
                outlineWidth: 10,
                outlineColor: Cesium.Color.AQUA
            }
        });
    }

    setSelected(selected) {
        this.wallEntity.wall.outline = selected;
    }

    getDefaultStyle() {
        return {
            wallHeight: 10,
            color: "#FFFF00",
            fontSize: 84,
            text: "立体墙文字贴图"
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "LineString",
                coordinates: this.coordinates
            }
        };
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.wallEntity);
    }
}