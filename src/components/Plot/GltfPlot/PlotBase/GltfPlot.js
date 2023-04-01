// gltf模型标绘类 
/*  标绘对象存储格式
{
	"type":"Feature",
	"properties":{
		"plotBase":"Gltf",
		"plotType":"Gltf",
		"plotName":"Gltf",
        "plotCode":"202002020202", 
        "modelUrl" :".../xxx"
        "style":{

        },
        "attr":{
            name:"警员部署"
        }
	},
	"geometry":{
			"type":"Point",
			"coordinates":[ 108,25,1000]
		}
}*/
export default class GltfPlot {
    constructor(viewer, geoFeature) {
        this.viewer = viewer;
        this.properties = geoFeature.properties;
        this.coordinates = geoFeature.geometry.coordinates; //[x,y,z]

        this.properties.plotType = "Gltf";
        this.properties.plotName = "Gltf";

        this.style = this.properties.style; //{heading,scale,height,width}  

        const headingPitchRoll = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(this.style.heading),
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(0)
        );

        this.position = Cesium.Cartesian3.fromDegrees(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
        this.addGltfEntity();
    }

    addGltfEntity() {
        this.gltfEntity = this.viewer.entities.add({
            type: "GltfPlot",
            plotCode: this.properties.plotCode,
            position: this.position,
            orientation: this.orientation,
            model: {
                uri: this.properties.modelUrl,
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE, //.withAlpha(0.5),
                scale: this.style.scale,
                maximumScale: this.style.scale,
            }
        });
    }

    setVisible(visible) {
        this.gltfEntity.show = visible;
    }

    setSelected(selected) {
        if (selected) {
            this.gltfEntity.model.silhouetteColor = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, 1); //设置模型外轮廓颜色与透明度
            this.gltfEntity.model.silhouetteSize = 4 //设置模型外轮廓线宽度
        } else {
            this.gltfEntity.model.silhouetteColor = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, 1); //设置模型外轮廓颜色与透明度
            this.gltfEntity.model.silhouetteSize = 0 //设置模型外轮廓线宽度
        }

    }

    setScale(scale) {
        this.gltfEntity.model.scale = scale;
        this.gltfEntity.model.maximumScale = scale;
        this.style.scale = scale;
    }


    //获取模型的位置
    getPosition() {
        return this.gltfEntity.position;
    }

    //更新位置
    updatePosition(position) {
        this.gltfEntity.position = position;
        let c = Cesium.Cartographic.fromCartesian(position);
        this.coordinates = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
    }

    updateHeading(heading) {
        this.style.heading = heading;
        const headingPitchRoll = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(heading),
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(0)
        );

        this.gltfEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            this.position, headingPitchRoll
        );
    }

    remove() {
        this.viewer.entities.remove(this.gltfEntity);
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Point",
                coordinates: this.coordinates
            }
        };
    }
}