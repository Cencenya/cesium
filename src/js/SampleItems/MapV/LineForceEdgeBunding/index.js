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

    createLayer() {
        var randomCount = 500;
        var node_data = {
            "0": { "x": 108.154518, "y": 36.643346 },
            "1": { "x": 121.485124, "y": 31.235317 },
        };

        var edge_data = [
            { "source": "1", "target": "0" }
        ]

        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

        // 构造数据
        for (var i = 1; i < randomCount; i++) {
            var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            node_data[i] = {
                x: cityCenter.lng - 5 + Math.random() * 10,
                y: cityCenter.lat - 5 + Math.random() * 10,
            }
            edge_data.push({ "source": ~~(i * Math.random()), "target": '0' });
        }

        var fbundling = mapv.utilForceEdgeBundling()
            .nodes(node_data)
            .edges(edge_data);

        var results = fbundling();

        var data = [];
        var timeData = [];

        for (var i = 0; i < results.length; i++) {
            var line = results[i];
            var coordinates = [];
            for (var j = 0; j < line.length; j++) {
                coordinates.push([line[j].x, line[j].y]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [line[j].x, line[j].y]
                    },
                    count: 1,
                    time: j
                });
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }

        var dataSet = new mapv.DataSet(data);

        var options = {
            strokeStyle: 'rgba(55, 50, 250, 0.3)',
            globalCompositeOperation: 'lighter',
            shadowColor: 'rgba(55, 50, 250, 0.5)',
            shadowBlur: 10,
            methods: {
                click: function(item) {}
            },
            lineWidth: 1.0,
            draw: 'simple'
        }

        var layer1 = new MapVLayer(this.viewer, dataSet, options);

        var dataSet = new mapv.DataSet(timeData);

        var options = {
            fillStyle: 'rgba(255, 250, 250, 0.9)',
            globalCompositeOperation: 'lighter',
            size: 1.5,
            animation: {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 1,
                duration: 5,
            },
            draw: 'simple'
        }

        var layer2 = new MapVLayer(this.viewer, dataSet, options);
        return [layer1, layer2];
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