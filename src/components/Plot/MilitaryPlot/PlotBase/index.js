import { poin2dsToPoint3ds } from "../PlotUtils/utils3d"
/* 军事标绘对象存储格式
{
	"type":"Feature",
	"properties":{
		"plotBase":"Military",
		"plotType":"Polygon",
		"plotName":"面",
		"plotCode":"202002020202",  
	},
	"geometry":{
			"type":"Polygon",
			"coordinates":[
				[
					[108,24],
					[109,25],
					[110,24],
					[108,24]
				]
			]
		}
}*/

// 所有军事标绘的父类
export default class MilitaryPlotBase {
    constructor(viewer, geoFeature) { //geoFeature为geojson 对象 类型为Feature
        this.viewer = viewer;

        this.properties = geoFeature.properties; //相关属性 如plotCode  plotType
        this.properties.plotBase = "MilitaryPlot"; //基础类型
        this.coordinates = geoFeature.geometry.coordinates; //坐标信息 格式与geojson polygon 一个标准
        this.style = this.properties.style; //样式信息存储在properties中 引用对象 
        this.initConsts();
        this.setPoints(this.coordinates[0]);
    }

    //初始化常量 初始化常量要放在构造点的之前 否则构造点的时候读不到参数 就会报错
    initConsts() {

    }

    //开启或关闭编辑模式
    openEditMode(isEdit) {

    }

    setHeight(height) {
        this.style.height = height;
    }

    getHeight() {
        return this.style.height;
    }

    setPoints(value) {
        this.coordinates[0] = value ? value : [];
        if (this.coordinates[0].length >= 1)
            this.generate();
    }

    getPoints() {
        return this.coordinates[0].slice(0);
    }

    getPointCount() {
        return this.coordinates[0].length;
    }

    generate() {}

    //二维点转成三维点 在generate方法中将二维点转为三维点
    generatePositions(points) {
        this.positions = poin2dsToPoint3ds(points, this.getHeight());
    }
}