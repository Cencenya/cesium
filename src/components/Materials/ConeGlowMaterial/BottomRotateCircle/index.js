import { createBottomRotateCircleTexture } from "../Texture"

function ConeGlowBottomRotateCircleMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(ConeGlowBottomRotateCircleMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false;
        }
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
ConeGlowBottomRotateCircleMaterialProperty.prototype.getType = function(time) {
    return 'ConeGlowBottomRotateCircle';
}
ConeGlowBottomRotateCircleMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.ConeGlowBottomRotateCircleImage;
    return result;
}
ConeGlowBottomRotateCircleMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof ConeGlowBottomRotateCircleMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.ConeGlowBottomRotateCircleMaterialProperty = ConeGlowBottomRotateCircleMaterialProperty;
Cesium.Material.ConeGlowBottomRotateCircleType = 'ConeGlowBottomRotateCircle';
Cesium.Material.ConeGlowBottomRotateCircleImage = createBottomRotateCircleTexture();
Cesium.Material.ConeGlowBottomRotateCircleSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image, vec2(st ));\n\
     material.diffuse = 2.5 * color.rgb  ;\n\
     material.alpha = colorImage.a ;\n\
     return material;\n\
 }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.ConeGlowBottomRotateCircleType, {
    fabric: {
        type: Cesium.Material.ConeGlowBottomRotateCircleType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.ConeGlowBottomRotateCircleImage,
            time: 0
        },
        source: Cesium.Material.ConeGlowBottomRotateCircleSource
    },
    translucent: function(material) {
        return true;
    }
});