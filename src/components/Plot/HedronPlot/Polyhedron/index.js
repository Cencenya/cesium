import HedronPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"
import { unifiedHeight, getPositionHeight, cartesian3sToLonLats } from "../../PlotBase/PlotBaseUtils"
import { targetPolyhedronIsIntersect } from "../Utils"
import * as turf from "@turf/turf"
//多边体标绘对象
export default class Polyhedron extends HedronPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "多边体";
        this.properties.plotType = PlotTypes.POLYHEDRON;
        this.minPositionCount = 3;
        this.style.color = this.style.color || Cesium.Color.LIME.withAlpha(0.5).toCssColorString(); //默认颜色
        this.style.extrudedHeight = this.style.extrudedHeight || 100;
        this.properties.style = this.style;
        this.createEntity();
        this.createLabelEntity();
    }

    createEntity() {
        this.entity = this.viewer.entities.add({
            plotType: "HedronPlot",
            plotCode: this.properties.plotCode,
            polygon: {
                hierarchy: this.positions,
                material: Cesium.Color.fromCssColorString(this.style.color),
                perPositionHeight: true,
                extrudedHeight: getPositionHeight(this.positions[0]) + this.style.extrudedHeight
            },
        })
    }

    createLabelEntity() {
        this.textEntity = this.viewer.entities.add({
            position: this.getLabelEntityPosition(),
            show: false,
            plotType: "HedronPlot",
            plotCode: this.properties.plotCode,
            label: {
                text: this.properties.attr.name,
                fillColor: Cesium.Color.WHITE,
                scale: 0.5,
                font: 'normal 40px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
                scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                outlineWidth: 20,
                outlineColor: Cesium.Color.BLACK
            }
        })
    }

    //文本标注坐标点
    getLabelEntityPosition() {
        let coordinates = cartesian3sToLonLats(this.getPositions());
        coordinates.push(coordinates[0]);
        if (coordinates.length < 4) return this.positions[0];
        let feature = turf.polygon([coordinates]);
        let bbox = turf.bbox(feature);
        let bboxPolygon = turf.bboxPolygon(bbox);
        let pointOnFeature = turf.center(bboxPolygon);
        let lonLat = pointOnFeature.geometry.coordinates;
        let height = getPositionHeight(this.positions[0]) + this.style.extrudedHeight;
        return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], height);
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.entity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return new Cesium.PolygonHierarchy(this.positions);
            }, false);

            this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(e => {
                return getPositionHeight(this.positions[0]) + this.style.extrudedHeight
            });

            this.entity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 1,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                })
            }
        } else {
            this.entity.polygon.hierarchy = this.positions;
            this.entity.polygon.extrudedHeight = getPositionHeight(this.positions[0]) + this.style.extrudedHeight;

            this.entity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 0,
            }
        }
    }

    //更新坐标之后的操作
    updatePositionAction() {
        unifiedHeight(this.positions);
        this.textEntity.position = this.getLabelEntityPosition();
        this.setPolygonCenter();
    }

    updateStyle(style) {
        //因为vue是双向数据绑定 所以界面上的值改变后自动更新 不用重新赋值 如果不是双向绑定 需要重新将style赋值给this.style
        this.entity.polygon.extrudedHeight = this.style.extrudedHeight; //更新高度 
        this.entity.polygon.material = Cesium.Color.fromCssColorString(this.style.color); //更新颜色 
        this.textEntity.label.text = this.properties.attr.name;
    }

    setSelected(selected) {
        if (selected) {
            this.entity.polygon.outline = true;
            this.entity.polygon.outlineColor = Cesium.Color.YELLOW;

        } else {
            this.entity.polygon.outline = false;
            this.entity.polygon.outlineColor = Cesium.Color.YELLOW;
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Polygon",
                coordinates: this.coordinates
            }
        };
    }

    //检测目标位置是否与体对象相交
    checkTargetIsIntersect(targetPosition) {
        this.targetPosition = targetPosition;
        // if (!this.lineEntity) {
        //     this.createLineEntity();
        // }
        return targetPolyhedronIsIntersect(targetPosition, this.getPositions(), this.style.extrudedHeight);
    }

    //目标点与区域的连线
    createLineEntity() {
        this.setPolygonCenter();
        this.lineEntity = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return [this.targetPosition, this.hedronCenter]
                }, false),
                show: new Cesium.CallbackProperty(e => {
                    return Cesium.Cartesian3.distance(this.targetPosition, this.hedronCenter) < 4000;
                }, false),
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
            }
        });
    }

    setPolygonCenter() {
        let coordinates = cartesian3sToLonLats(this.getPositions());
        coordinates.push(coordinates[0]);
        if (coordinates.length < 4) {
            this.hedronCenter = this.positions[0];
            return;
        };
        let feature = turf.polygon([coordinates]);
        let bbox = turf.bbox(feature);
        let bboxPolygon = turf.bboxPolygon(bbox);
        let pointOnFeature = turf.center(bboxPolygon);
        let lonLat = pointOnFeature.geometry.coordinates;
        let height = getPositionHeight(this.positions[0]);
        this.hedronCenter = Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], height);
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.entity);
        this.viewer.entities.remove(this.textEntity);
        this.viewer.entities.remove(this.lineEntity);
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.entity);
    }
}