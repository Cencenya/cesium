//MapV实例 详情请查看 https://mapv.baidu.com/examples/#qianxi-time.html
import appConfig from "../../../appConfig"
import MapVLayer from "@/components/MapV/MapVLayer"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.mapvLayers = this.createLayer();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //设置视角
    setView() {
        this.defaultView = {
            destination: {
                x: -3874633.212230056,
                y: 10054080.029018454,
                z: 6368816.013934072
            },
            orientation: {
                heading: 6.255853362822051,
                pitch: -1.5246792925228814,
                roll: 6.282407507031573
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(this.defaultView);
    },

    //创建图层
    createLayer() {
        let randomCount = 1000;
        let data = [];
        let citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

        // 构造数据
        while (randomCount--) {
            let cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                },
                count: 30 * Math.random()
            });
        }

        let dataSet = new mapv.DataSet(data);

        let options = {
            size: 13,
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
            max: 100,
            // range: [0, 100], // 过滤显示数据范围
            // minOpacity: 0.5, // 热力图透明度
            // maxOpacity: 1,
            draw: 'heatmap'
        }

        let mapvLayer = new MapVLayer(this.viewer, dataSet, options);
        return [mapvLayer];
    },

    destroy() {
        this.mapvLayers.map(layer => {
            layer.destroy();
        })
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;