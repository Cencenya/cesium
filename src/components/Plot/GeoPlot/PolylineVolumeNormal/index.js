import GeoPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"

// 墙体类  使用polylineVolume来实现 能够每个点高度不一样 能设置自定义贴图
export default class PolylineVolume extends GeoPlotBase {
    constructor(viewer, baseInfo, properties) {
        super(viewer, baseInfo, properties);
        this.baseInfo.plotName = PlotTypes.POLYLINEVOLUME;
        this.baseInfo.height = this.baseInfo.height || 5;
        this.baseInfo.width = this.baseInfo.width || 0.1;
        this.minPositionCount = 2;
        this.createEntity();
    }

    createEntity() {
        let material = this.baseInfo.material || Cesium.Color.RED.withAlpha(0.6);
        this.polylineVolumeEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.baseInfo.plotCode,
            polylineVolume: {
                positions: this.positions,
                shape: [
                    new Cesium.Cartesian2(-this.baseInfo.width / 2, -this.baseInfo.height / 2),
                    new Cesium.Cartesian2(this.baseInfo.width / 2, -this.baseInfo.height / 2),
                    new Cesium.Cartesian2(this.baseInfo.width / 2, this.baseInfo.height / 2),
                    new Cesium.Cartesian2(-this.baseInfo.width / 2, this.baseInfo.height / 2),
                ],
                cornerType: Cesium.CornerType.BEVELED,
                material: material,
                // material: new Cesium.FenceNormalMaterialProperty(Cesium.Color.RED, 2000, 10)
            }
        })
    }

    //设置材质
    setMaterial(material) {
        if (!material) return;
        this.polylineVolumeEntity.material = material;
        this.baseInfo.material = material;
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polylineVolumeEntity.polylineVolume.positions = new Cesium.CallbackProperty(e => {
                return this.positions;
            }, false)
        } else {
            this.polylineVolumeEntity.polylineVolume.positions = this.positions;
        }
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.polylineVolumeEntity);
    }
}