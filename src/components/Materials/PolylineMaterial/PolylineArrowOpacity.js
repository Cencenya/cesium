// 动态线材质 箭头

function PolylineArrowOpacityMaterialProperty(color, duration, count) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this.count = count;
    this._time = (new Date()).getTime();
}

Object.defineProperties(PolylineArrowOpacityMaterialProperty.prototype, {
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

PolylineArrowOpacityMaterialProperty.prototype.getType = function(time) {
    return 'PolylineArrowOpacity';
}

PolylineArrowOpacityMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineArrowOpacityImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.count = this.count || 4;
    return result;
}

PolylineArrowOpacityMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof PolylineArrowOpacityMaterialProperty &&
            Cesium.Property.equals(this._color, other._color) &&
            this.duration == other.duration &&
            this.count == other.count
        )

}

Cesium.PolylineArrowOpacityMaterialProperty = PolylineArrowOpacityMaterialProperty;
Cesium.Material.PolylineArrowOpacityType = 'PolylineArrowOpacity';
Cesium.Material.PolylineArrowOpacityImage = "../../static/images/effects/arrowopacity.png";
Cesium.Material.PolylineArrowOpacitySource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
 { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
    vec4 colorImage = texture2D(image, vec2(fract( count * st.s - time),fract(st.t)));\n\
     material.alpha =  colorImage.a * color.a;\n\
     material.diffuse =  color.rgb * 3.0 ;\n\
     return material;}";

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineArrowOpacityType, {
    fabric: {
        type: Cesium.Material.PolylineArrowOpacityType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.PolylineArrowOpacityImage,
            time: 20,
            count: 4
        },
        source: Cesium.Material.PolylineArrowOpacitySource
    },
    translucent: function(material) {
        return true;
    }
});