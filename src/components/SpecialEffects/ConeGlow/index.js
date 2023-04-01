//光柱椎体类

import "@/components/Materials/ConeGlowMaterial/BottomCircle";
import "@/components/Materials/ConeGlowMaterial/BottomRotateCircle";

export default class ConeGlow {
    constructor(viewer, position, options) {
        this.viewer = viewer;
        this.position = position;

        this.options = options; //color 颜色 height 光柱高度 bottomRadius 底部圆的半径
        this.height = options.height || 300;
        this.bottomRadius = options.bottomRadius || 30;
        this.color = options.color || Cesium.Color.AQUA; //给个亮亮的颜色

        this.addCone();
        this.addBottomCircle();
        this.addBottomRotateCircle();
    }

    //添加圆锥体
    addCone() {
        var modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(this.position),
            new Cesium.Cartesian3(0.0, 0.0, this.height * 0.5), new Cesium.Matrix4()
        );

        var cylinderGeometry = new Cesium.CylinderGeometry({
            length: this.height,
            topRadius: 0.0,
            bottomRadius: this.bottomRadius * 0.7,
            vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
        });
        var cone = new Cesium.GeometryInstance({
            geometry: cylinderGeometry,
            modelMatrix: modelMatrix,
        });
        this.cylinderPrimitive = this.viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: [cone],
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'VtxfShader1',
                        uniforms: {
                            color: this.color,
                            alpha: 2
                        },
                        source: `
                                uniform vec4 color;   
                                czm_material czm_getMaterial(czm_materialInput materialInput)
                                {
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    vec2 st = materialInput.st;
                                    float dis = distance(st, vec2(0.5)); 
                                    material.diffuse =2.9 * color.rgb;
                                    material.alpha = color.a * dis * alpha ;
                                    return material;
                                }
                            `
                    },
                    translucent: false
                }),
                faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
                closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
            }),
        }));
        this.viewer.scene.preUpdate.addEventListener(this.preUpdateHandle, this);
    }

    preUpdateHandle() {
        //圆锥闪烁动画
        this.cylinderPrimitive.appearance.material.uniforms.alpha += 0.05;
        if (this.cylinderPrimitive.appearance.material.uniforms.alpha > 2.5) {
            this.cylinderPrimitive.appearance.material.uniforms.alpha = 2;
        }
    }

    //添加底部圆
    addBottomCircle() {
        this.bottomCircle = this.viewer.entities.add({
            position: this.position,
            ellipse: {
                semiMinorAxis: this.bottomRadius * 2,
                semiMajorAxis: this.bottomRadius * 2,
                height: 0.0,
                material: new Cesium.ConeGlowBottomCircleMaterialProperty(this.color),
            }
        });
    }

    //添加底部旋转圆
    addBottomRotateCircle() {
        let stRotation = 360;
        this.bottomRotateCircle = this.viewer.entities.add({
            position: this.position,
            ellipse: {
                semiMinorAxis: this.bottomRadius * 1.45,
                semiMajorAxis: this.bottomRadius * 1.45,
                height: 0.0,
                material: new Cesium.ConeGlowBottomRotateCircleMaterialProperty(this.color),
                stRotation: new Cesium.CallbackProperty(e => {
                    stRotation--;
                    stRotation < 0 && (stRotation = 360);
                    return Cesium.Math.toRadians(stRotation);
                }, false),
            }
        });
    }

    //移除光柱体
    remove() {
        //移除事件监听
        this.viewer.scene.preUpdate.removeEventListener(this.preUpdateHandle, this);
        this.viewer.entities.remove(this.bottomRotateCircle);
        this.viewer.entities.remove(this.bottomCircle);
        this.viewer.scene.primitives.remove(this.cylinderPrimitive);
    }
}