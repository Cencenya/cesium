import { createBottomCircleTexture } from "../Texture"

function ConeGlowBottomCircleMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(ConeGlowBottomCircleMaterialProperty.prototype, {
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
ConeGlowBottomCircleMaterialProperty.prototype.getType = function(time) {
    return 'ConeGlowBottomCircle';
}
ConeGlowBottomCircleMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.ConeGlowBottomCircleImage;
    return result;
}
ConeGlowBottomCircleMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof ConeGlowBottomCircleMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.ConeGlowBottomCircleMaterialProperty = ConeGlowBottomCircleMaterialProperty;
Cesium.Material.ConeGlowBottomCircleType = 'ConeGlowBottomCircle';
Cesium.Material.ConeGlowBottomCircleImage = createBottomCircleTexture();
Cesium.Material.ConeGlowBottomCircleSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image,  vec2(st ));\n\
     material.alpha = colorImage.a * color.a;\n\
     material.diffuse =  1.5* color.rgb  ;\n\
     return material;\n\
 }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.ConeGlowBottomCircleType, {
    fabric: {
        type: Cesium.Material.ConeGlowBottomCircleType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.ConeGlowBottomCircleImage,
            time: 0
        },
        source: Cesium.Material.ConeGlowBottomCircleSource
    },
    translucent: function(material) {
        return true;
    }
});