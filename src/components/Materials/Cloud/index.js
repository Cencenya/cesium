//  云层
//  color 颜色
//  duration 持续时间 毫秒 

function CloudMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this.colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();
}
Object.defineProperties(CloudMaterialProperty.prototype, {
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

CloudMaterialProperty.prototype.getType = function(time) {
    return 'Cloud';
}

CloudMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.CloudImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}

CloudMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof CloudMaterialProperty &&
            Cesium.Property.equals(this.color, other.color))
}
Cesium.CloudMaterialProperty = CloudMaterialProperty;
Cesium.Material.CloudType = 'Cloud';
Cesium.Material.CloudImage = "../../static/images/effects/earth_cloud.png";
Cesium.Material.CloudSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image,   vec2(fract(st.s + time),fract(st.t)));\n\
     material.alpha = colorImage.a * color.a  ;\n\
     material.diffuse =  1.3 * color.rgb  ;\n\
     return material;\n\
 }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.CloudType, {
    fabric: {
        type: Cesium.Material.CloudType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.CloudImage,
            time: 0
        },
        source: Cesium.Material.CloudSource
    },
    translucent: function(material) {
        return true;
    }
});