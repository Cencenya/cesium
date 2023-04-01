// 动态线材质

function EnergyTransLineMaterialProperty(color, duration, count) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this.count = count;
    this._time = (new Date()).getTime();
}

Object.defineProperties(EnergyTransLineMaterialProperty.prototype, {
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

EnergyTransLineMaterialProperty.prototype.getType = function(time) {
    return 'EnergyTransLine';
}

EnergyTransLineMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.EnergyTransLineImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.count = this.count || 4;
    return result;
}

EnergyTransLineMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof EnergyTransLineMaterialProperty &&
            Cesium.Property.equals(this._color, other._color) &&
            this.duration == other.duration &&
            this.count == other.count
        )

}

Cesium.EnergyTransLineMaterialProperty = EnergyTransLineMaterialProperty;
Cesium.Material.EnergyTransLineType = 'EnergyTransLine';
Cesium.Material.EnergyTransLineImage = "../../static/images/effects/arrow_2.png";
Cesium.Material.EnergyTransLineSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
 { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
    vec4 colorImage = texture2D(image, vec2(fract( count * st.s - time),fract(st.t)));\n\
     material.alpha =  colorImage.a * color.a;\n\
     material.diffuse =  color.rgb * 3.0 ;\n\
     return material;}";

Cesium.Material._materialCache.addMaterial(Cesium.Material.EnergyTransLineType, {
    fabric: {
        type: Cesium.Material.EnergyTransLineType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.EnergyTransLineImage,
            time: 20,
            count: 4
        },
        source: Cesium.Material.EnergyTransLineSource
    },
    translucent: function(material) {
        return true;
    }
});