// 圆形扩散扫描材质 
function CircleSpreadScanMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(CircleSpreadScanMaterialProperty.prototype, {
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
CircleSpreadScanMaterialProperty.prototype.getType = function(time) {
    return 'CircleSpreadScan';
}
CircleSpreadScanMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.CircleSpreadScanImage;
    return result;
}
CircleSpreadScanMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof CircleSpreadScanMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.CircleSpreadScanMaterialProperty = CircleSpreadScanMaterialProperty;
Cesium.Material.CircleSpreadScanType = 'CircleSpreadScan';
Cesium.Material.CircleSpreadScanImage = "../../static/images/effects/circlegradients.png";
Cesium.Material.CircleSpreadScanSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image,  vec2(st ));\n\
     material.alpha = colorImage.a * color.a*0.6;\n\
     material.diffuse =  2.2* color.rgb  ;\n\
     return material;\n\
 }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleSpreadScanType, {
    fabric: {
        type: Cesium.Material.CircleSpreadScanType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.CircleSpreadScanImage,
            time: 0
        },
        source: Cesium.Material.CircleSpreadScanSource
    },
    translucent: function(material) {
        return true;
    }
});