// 六边形扩散扫描材质 
function HexagonSpreadScanMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(HexagonSpreadScanMaterialProperty.prototype, {
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
HexagonSpreadScanMaterialProperty.prototype.getType = function(time) {
    return 'HexagonSpreadScan';
}
HexagonSpreadScanMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.HexagonSpreadScanImage;
    return result;
}
HexagonSpreadScanMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof HexagonSpreadScanMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.HexagonSpreadScanMaterialProperty = HexagonSpreadScanMaterialProperty;
Cesium.Material.HexagonSpreadScanType = 'HexagonSpreadScan';
Cesium.Material.HexagonSpreadScanImage = "../../static/images/effects/hexagon.png";
Cesium.Material.HexagonSpreadScanSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image,  vec2(st ));\n\
     material.alpha = colorImage.a * color.a*0.5;\n\
     material.diffuse =  1.8* color.rgb  ;\n\
     return material;\n\
 }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.HexagonSpreadScanType, {
    fabric: {
        type: Cesium.Material.HexagonSpreadScanType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.HexagonSpreadScanImage,
            time: 0
        },
        source: Cesium.Material.HexagonSpreadScanSource
    },
    translucent: function(material) {
        return true;
    }
});