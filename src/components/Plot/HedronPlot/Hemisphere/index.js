import HedronPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"
import { getPositionHeight, cartesian3ToLonLat } from "../../PlotBase/PlotBaseUtils"
//半球体标绘对象
export default class Hemisphere extends HedronPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "半球体";
        this.properties.plotType = PlotTypes.HEMISPHERE;
        this.fixPositionCount = 1;
        this.style.color = this.style.color || Cesium.Color.LIME.withAlpha(0.5).toCssColorString(); //默认颜色
        this.style.radius = this.style.radius || 200; //默认半径
        this.properties.style = this.style;
        this.createEntity();
        this.createLabelEntity();
    }

    createEntity() {
        this.entity = this.viewer.entities.add({
            plotType: "HedronPlot",
            plotCode: this.properties.plotCode,
            position: this.positions[0],
            ellipsoid: {
                radii: new Cesium.Cartesian3(this.style.radius, this.style.radius, this.style.radius),
                maximumCone: Cesium.Math.toRadians(90),
                material: Cesium.Color.fromCssColorString(this.style.color),
                subdivisions: 128,
                stackPartitions: 24,
                slicePartitions: 24,
                outline: true,
                outlineColor: Cesium.Color.YELLOW.withAlpha(0.4)
            },
        });
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
        let height = getPositionHeight(this.positions[0]) + this.style.radius;
        return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], height);
    }

    updatePositionAction() {
        this.textEntity.position = this.getLabelEntityPosition();
    }

    setVisible(isVisible) {
        this.entity.show = isVisible;
    }

    updateStyle(style) {
        this.entity.ellipsoid.radii = new Cesium.Cartesian3(this.style.radius, this.style.radius, this.style.radius);
        this.entity.ellipsoid.material = Cesium.Color.fromCssColorString(this.style.color);
        this.textEntity.label.text = this.properties.attr.name;
        this.textEntity.position = this.getLabelEntityPosition(); //更新高度属性需要更新位置
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.entity.position = new Cesium.CallbackProperty(e => {
                return this.positions[0];
            });
        } else {
            this.entity.position = this.positions[0];
        }
    }

    setSelected(selected) {
        if (selected) {
            this.entity.ellipsoid.outlineColor = Cesium.Color.YELLOW;
            this.entity.ellipsoid.stackPartitions = 64;
            this.entity.ellipsoid.slicePartitions = 64;
        } else {
            this.setVisible(true);
            this.openEditMode(false);
            this.entity.ellipsoid.outlineColor = Cesium.Color.YELLOW.withAlpha(0.4);
            this.entity.ellipsoid.stackPartitions = 24;
            this.entity.ellipsoid.slicePartitions = 24;
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

    //检测目标位置是否与半球体相交
    checkTargetIsIntersect(targetPosition) {
        this.targetPosition = targetPosition;
        // if (!this.lineEntity) {
        //     this.createLineEntity();
        // }
        return Cesium.Cartesian3.distance(this.positions[0], targetPosition) < this.style.radius; //当两点距离小于球的半径时 说明相交
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