//  流动墙体材质类 上下运行条纹
//  color 颜色
//  duration 持续时间 毫秒
//  count 数量

function WallTrailStripeVerticalMaterialProperty(color, duration, count) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this.count = count;
    this._time = (new Date()).getTime();
}
Object.defineProperties(WallTrailStripeVerticalMaterialProperty.prototype, {
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

WallTrailStripeVerticalMaterialProperty.prototype.getType = function(time) {
    return 'WallTrailStripeVertical';
}

WallTrailStripeVerticalMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.WallTrailStripeVerticalImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.count = this.count;
    return result;
}

WallTrailStripeVerticalMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof WallTrailStripeVerticalMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.WallTrailStripeVerticalMaterialProperty = WallTrailStripeVerticalMaterialProperty;
Cesium.Material.WallTrailStripeVerticalType = 'WallTrailStripeVertical';
Cesium.Material.WallTrailStripeVerticalImage = "data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAUCAYAAAB7wJiVAAACgklEQVRoQ9WZi27DIAxFIeGX9n53//9FBTy5rSNESDC2U2mVqkQRgc7X1wczDwC/zrmQUgrzPM+3a3DOzeVzvL99L89zzmGapss953k5pnG/rAcAwXuP83rH+AAAeO+Tc27km3POaZqmRNfB9/G9rHmf1osx5hDC8ts9AJzqoHKD1xm3Eos7/iYKSxDnHBTBzKOBbYxXz5FSypjbkt/iz+fzKYSwCh45pifWqFO2xhfOIMdNDIPQkO4fDwAZnaR0htpZJFaMMZXOIPHQIT/czKUyxnXQVvCZ62GScD+arNa8WyaCyTwoyDcGKMYYNE4hsbgiNBxxcWn1XCwIOQIAkoAxS6BrVgiZk1NK6Yro63WrnKEgX0VZWuBaZjG3fDEdtMUWMdgrjnTL1y0YFhltMUcqwU6CjAJ4CZ4VQ+oyJgW7kTPMWMF1RsmQT2ZNb7qnB32la0zB7pyzyOhD50CHfBzAkK6DmAxhg13pDLUjqAzWjOkxo2YJCTJasqzG77mO1hCD3cgRSxMo6StGeyQU5L0sK1sA33o+yhDulnm0Y5eCXdmXmHfsKMibkCGc7FaNkYLdyBmHsmJv2/tqwRArp9yrY6eASPsKrbO2OnZ0CApixYRyni7Ymc5kg13pDAtHYA+0bBAkzEFBXsrAjHbsWmcwd1tisNe7L2nnfq+OHQV53jsOZ2axihWVQ1tzSU5+/13Hju5CQZ72mrvOsUm3LHHPtkiU2jFSsCv7EhJzVX5GmUOs4HbsJIgVQ5pOGRWl4UrTjp3EktT40b6is8aKWyjIo4Yh3L5i4P8grVNfNtiVzjisY+eKj4I8HHwexXEfh0FisCt3X6ujeG5wN8bt7ub+ANZIqbIlvAh5AAAAAElFTkSuQmCC" //"../../static/images/effects/colors2.png";
Cesium.Material.WallTrailStripeVerticalSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    {\n\
         czm_material material = czm_getDefaultMaterial(materialInput);\n\
         vec2 st = materialInput.st;\n\
         vec4 colorImage = texture2D(image, vec2(fract(count*st.t - time), fract(st.s)));\n\
         material.alpha = colorImage.a * color.a;\n\
         material.diffuse =  1.5* color.rgb  ;\n\
         return material;\n\
     }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.WallTrailStripeVerticalType, {
    fabric: {
        type: Cesium.Material.WallTrailStripeVerticalType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.WallTrailStripeVerticalImage,
            time: 0,
            count: 1
        },
        source: Cesium.Material.WallTrailStripeVerticalSource
    },
    translucent: function(material) {
        return true;
    }
});