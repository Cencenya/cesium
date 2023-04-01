// 火焰粒子标绘类
import ParticlePlotBase from "../PlotBase"
import PlotTypes from "../PlotTypes"

export default class FirePlot extends ParticlePlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.FIRE;
        this.properties.plotName = "火焰";
        this.style = geoFeature.properties.style || this.getDefaultStyle();
        this.properties.style = this.style;
        this.init();
    }

    init() {
        //需要一个entity提供位置信息
        this.entity = this.viewer.entities.add({
            position: this.position,
        });
        this.particleSystem = this.createParticleSystem();
        this.viewer.scene.primitives.add(this.particleSystem);
        this.addEvent();
    }

    //添加事件
    addEvent() {
        this.emitterModelMatrix = new Cesium.Matrix4();
        this.translation = new Cesium.Cartesian3();
        this.rotation = new Cesium.Quaternion();
        this.hpr = new Cesium.HeadingPitchRoll();
        this.trs = new Cesium.TranslationRotationScale();
        this.viewer.scene.preUpdate.addEventListener(this.preUpdateEvent, this);
    }

    removeEvent() {
        this.viewer.scene.preUpdate.removeEventListener(this.preUpdateEvent, this);
        this.emitterModelMatrix = undefined;
        this.translation = undefined;
        this.rotation = undefined;
        this.hpr = undefined;
        this.trs = undefined;
    }

    //场景渲染事件
    preUpdateEvent(scene, time) {
        this.particleSystem.modelMatrix = this.entity.computeModelMatrix(time, new Cesium.Matrix4());
        this.hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, this.hpr);
        this.trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, this.translation);
        this.trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(this.hpr, this.rotation);
        this.particleSystem.emitterModelMatrix = Cesium.Matrix4.fromTranslationRotationScale(this.trs, this.emitterModelMatrix);
    }

    //创建粒子对象
    createParticleSystem() {
        return new Cesium.ParticleSystem({
            image: this.style.fireImage,
            startColor: new Cesium.Color(1, 1, 1, 1),
            endColor: new Cesium.Color(0.5, 0, 0, 0),

            startScale: this.style.startScale,
            endScale: this.style.endScale,
            minimumParticleLife: this.style.minimumParticleLife,
            maximumParticleLife: this.style.maximumParticleLife,
            minimumSpeed: this.style.minimumSpeed,
            maximumSpeed: this.style.maximumSpeed,
            imageSize: new Cesium.Cartesian2(this.style.particleSize, this.style.particleSize),
            emissionRate: this.style.emissionRate,

            lifetime: 16.0,
            loop: true,
            emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
            sizeInMeters: true,
        });
    }

    //移除
    remove() {
        this.removeEvent(); //清除事件
        this.viewer.scene.primitives.remove(this.particleSystem); //删除粒子对象
        this.viewer.entities.remove(this.entity); //删除entity
    }

    updateStyle() {
        this.particleSystem.startScale = this.style.startScale;
        this.particleSystem.endScale = this.style.endScale;
        this.particleSystem.minimumParticleLife = this.style.minimumParticleLife;
        this.particleSystem.maximumParticleLife = this.style.maximumParticleLife;
        this.particleSystem.minimumSpeed = this.style.minimumSpeed;
        this.particleSystem.maximumSpeed = this.style.maximumSpeed;
        this.particleSystem.imageSize = new Cesium.Cartesian2(this.style.particleSize, this.style.particleSize);
        this.particleSystem.emissionRate = this.style.emissionRate;
    }

    //默认样式信息
    getDefaultStyle() {
        return {
            fireImage: "../../../static/images/effects/fire.png",
            startScale: 3,
            endScale: 1.5,
            minimumParticleLife: 1.5,
            maximumParticleLife: 1.8,
            minimumSpeed: 7,
            maximumSpeed: 9,
            particleSize: 2,
            emissionRate: 200,
        }
    }
}