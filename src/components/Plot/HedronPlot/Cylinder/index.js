import HedronPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"
import * as Constants from "../Constants"
import { getPositionHeight, cartesian3ToLonLat } from "../../PlotBase/PlotBaseUtils"
import { targetPolyhedronIsIntersect } from "../Utils"

//圆柱体标绘对象
export default class Cylinder extends HedronPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "圆柱体";
        this.properties.plotType = PlotTypes.CYLINDER;
        this.fixPositionCount = 1;
        this.style.radius = this.style.radius || 200;
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
                hierarchy: this.getHierarchy(),
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
        let lonLat = cartesian3ToLonLat(this.positions[0]);
        let height = getPositionHeight(this.positions[0]) + this.style.extrudedHeight;
        return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], height);
    }

    updatePositionAction() {
        this.textEntity.position = this.getLabelEntityPosition();
    }

    setVisible(isVisible) {
        this.entity.show = isVisible;
    }

    updateStyle(style) {
        //因为vue是双向数据绑定 所以界面上的值改变后自动更新 不用重新赋值 如果不是双向绑定 需要重新将style赋值给this.style
        this.entity.polygon.extrudedHeight = getPositionHeight(this.positions[0]) + this.style.extrudedHeight; //更新高度
        this.entity.polygon.hierarchy = this.getHierarchy(); //更新半径
        this.entity.polygon.material = Cesium.Color.fromCssColorString(this.style.color); //更新颜色 
        this.textEntity.label.text = this.properties.attr.name;
        this.textEntity.position = this.getLabelEntityPosition(); //更新高度属性需要更新位置
    }

    getHierarchy() {
        let center = [this.coordinates[0], this.coordinates[1]];
        let ds = this.generateCirclePoints(center, this.style.radius);
        return this.circleDsToPositions(ds);
    }

    circleDsToPositions(circleDs) {
        let positions = [];
        circleDs.map(item => {
            positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], this.coordinates[2]))
        })
        return positions;
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.entity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return this.getHierarchy();
            });

            this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(e => {
                return getPositionHeight(this.positions[0]) + this.style.extrudedHeight
            });
        } else {
            this.entity.polygon.hierarchy = this.getHierarchy();
            this.entity.polygon.extrudedHeight = getPositionHeight(this.positions[0]) + this.style.extrudedHeight
        }
    }

    setSelected(selected) {
        if (selected) {
            this.entity.polygon.outline = true;
            this.entity.polygon.outlineColor = Cesium.Color.YELLOW;

        } else {
            this.setVisible(true);
            this.openEditMode(false);
            this.entity.polygon.outline = false;
            this.entity.polygon.outlineColor = Cesium.Color.YELLOW;
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Point",
                coordinates: this.coordinates
            }
        };
    }


    //获取一个圆的边缘坐标
    generateCirclePoints(center, radius) {
        let points = [];
        for (let i = 0; i < 360; i += 2) {
            points.push(this.getCirclePoint(center[0], center[1], i, radius))
        }
        return points;
    }

    getCirclePoint(lon, lat, angle, radius) {
        let dx = radius * Math.sin(angle * Math.PI / 180.0);
        let dy = radius * Math.cos(angle * Math.PI / 180.0);
        let ec = Constants.PRADIUS + (Constants.ERADIUS - Constants.PRADIUS) * (90.0 - lat) / 90.0;
        let ed = ec * Math.cos(lat * Math.PI / 180);
        let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
        let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
        return [newLon, newLat];
    }

    //检测目标位置是否与体对象相交
    checkTargetIsIntersect(targetPosition) {
        this.targetPosition = targetPosition;
        // if (!this.lineEntity) {
        //     this.createLineEntity();
        // }
        return targetPolyhedronIsIntersect(targetPosition, this.getHierarchy(), this.style.extrudedHeight);
    }

    //目标点与区域的连线
    createLineEntity() {
        this.lineEntity = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return [this.targetPosition, this.positions[0]]
                }, false),
                show: new Cesium.CallbackProperty(e => {
                    return Cesium.Cartesian3.distance(this.targetPosition, this.positions[0]) < 4000;
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

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.entity);
        this.viewer.entities.remove(this.textEntity);
        this.viewer.entities.remove(this.lineEntity);
    }
}