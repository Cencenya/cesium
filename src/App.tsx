import React from 'react';
import { Viewer } from "cesium";
import { Input } from 'antd';
import { BrowserRouter as Router } from "react-router-dom";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import Layout from "./layout/index";
import CesiumMap from './utils/cesium'
// import './style/test.scss';
import './style/index.scss'
import { CreateViewer, viewer } from "./cesium-cai/create"
import { setTiles } from './cesium-cai/settiles'
import { setAlarm } from "./cesium-cai/alarm";
import { glowLine } from './cesium-cai/line'
import { flyPath } from './cesium-cai/flypath'
import { Wall } from './cesium-cai/wall'
import { changLight } from './cesium-cai/lighting'
import { radarScan } from './cesium-cai/radarScan'
import { boundaryLine } from './cesium-cai/boundaryLine'
import Geometry from "./cesium-cai/geometry";
import Models from "./cesium-cai/model"
import img1 from './assets/image/strmingLine.png'
import img2 from './assets/image/color1.png'


const geometry = new Geometry();
const Cesium = window['Cesium'];
class App extends React.Component {
    state = {
        light: true,
        citySelect: false,
        medicalSelect: false,
        educationSelect: false,
        warningSelect: false,
        trafficSelect: false,
        TravelSelect: false,
        ControlSelect: false,
        searchVisible: false
    }

    componentDidMount() {
        // CesiumMap.init()
        // // 119.90925531347617 28.477942326229833
        // // 119.92907977607317 28.47682639505234
        // // 119.91114461171757 28.458759939248726
        // // 119.93037335575659 28.462306567742377
        // CreateViewer();
        // boundaryLine('bound1', 119.90925531347617, 28.477942326229833, 8000, img1);
        // boundaryLine('bound2', 119.92907977607317, 28.47682639505234, 8000, img1);
        // boundaryLine('bound3', 119.91114461171757, 28.458759939248726, 8000, img1);
        // boundaryLine('bound4', 119.93037335575659, 28.462306567742377, 8000, img1);
        // // 开启白膜数据
        // setTiles()
        // Models.setCone(viewer, 119.92288031584074, 28.470939553526446, 140, '主控室', '领导主控室', `${process.env.PUBLIC_URL}/3d/zhui.glb`);
        // // 教育
        // Models.setCone(viewer, 119.89908122274129, 28.460642777400345, 140, '丽水学院', '丽水学院共计8000人', `${process.env.PUBLIC_URL}/3d/zhui1.glb`);
        // radarScan(119.89908122274129, 28.460642777400345, 200);
        // //预警
        // geometry.setMark(1, 119.91286417532214, 28.462863669630227, 140, '发生危险区域', '发生危险类型：火灾');
        // var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
        // let lon1 = 119.91286417532214;
        // let lat1 = 28.462863669630227;
        // var CartographicCenter1 = new Cesium.Cartographic(
        //     Cesium.Math.toRadians(lon1),
        //     Cesium.Math.toRadians(lat1),
        //     0
        // );
        // setAlarm(viewer, CartographicCenter1, 200, scanColor, 1000);

        // Models.setModel({
        //     modelUrl: `${process.env.PUBLIC_URL}/3d/CesiumDrone.gltf`,
        //     startPos: Cesium.Cartesian3.fromDegrees(119.91388098940308, 28.463157258190098, 100),
        //     endPos: Cesium.Cartesian3.fromDegrees(119.91388098940308, 28.463157258190098, 100),
        //     time: 360,
        //     scale: 10,
        //     text: '救援无人机巡查',
        //     showPoint: false,
        //     airPlane: true
        // });
        // //交通
        // glowLine()
        // Models.setCone(viewer, 119.95036125517865, 28.44471897721914, 140, '高铁站', '丽水高铁站，今日共89班次', `${process.env.PUBLIC_URL}/3d/zhui1.glb`)
        // radarScan(119.95036125517865, 28.44471897721914, 200)
        // // Models.airLine();

        // Models.setModel({
        //     modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
        //     startPos: Cesium.Cartesian3.fromDegrees(119.91600024277844, 28.46643744731459, 2),
        //     endPos: Cesium.Cartesian3.fromDegrees(119.92133943285947, 28.468109441248263, 2),
        //     time: 360,
        //     scale: 0.25,
        //     text: '社会车辆1',
        //     showPoint: false,
        //     airPlane: false
        // });
        // Models.setModel({
        //     modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
        //     startPos: Cesium.Cartesian3.fromDegrees(119.9188904573172, 28.46216016417923, 2),
        //     endPos: Cesium.Cartesian3.fromDegrees(119.91864250772069, 28.467137181698114, 2),
        //     time: 360,
        //     scale: 0.25,
        //     text: '社会车辆2',
        //     showPoint: false,
        //     airPlane: false
        // });
        // //疫情
        // geometry.setMark(2, 119.92400321458236, 28.46212632105087, 140, '隔离区', '发热人数：8人,咳嗽：6人');

        // flyPath()
        // Models.setModel({
        //     modelUrl: `${process.env.PUBLIC_URL}/3d/CesiumDrone.gltf`,
        //     startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 100),
        //     endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 100),
        //     time: 360,
        //     scale: 20,
        //     text: '无人机巡查',
        //     showPoint: false,
        //     airPlane: false
        // });
        // Models.setModel({
        //     modelUrl: ``,
        //     startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 0),
        //     endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 0),
        //     time: 360,
        //     scale: 0,
        //     text: '',
        //     showPoint: true,
        //     airPlane: false
        // });

        // Wall(Cesium.Cartesian3.fromDegreesArrayHeights([
        //     119.92174110410446, 28.4627408439087, 80,
        //     119.92167849772021, 28.462605767390524, 80,
        //     119.92228865196599, 28.46025781857183, 80,
        //     119.92246799353285, 28.460157242202612, 80,
        //     119.92567476716196, 28.46117373327441, 80,
        //     119.92580188108182, 28.46133584315255, 80,
        //     119.9257883493644, 28.46385878933483, 80,
        //     119.92574494515367, 28.464007983649257, 80,
        //     119.92566694795825, 28.46406371653822, 80,
        //     119.92536160383271, 28.464060205076482, 80,
        //     119.92174110410446, 28.4627408439087, 80
        // ]))
        // //changLight
        // changLight('Moonlight');

    }

    // 开启白膜数据
    setCity = () => {
        const { citySelect } = this.state
        this.setState({
            citySelect: true
        })
        if (citySelect === false) {
            setTiles()
            Models.setCone(viewer, 119.92288031584074, 28.470939553526446, 140, '主控室', '领导主控室', `${process.env.PUBLIC_URL}/3d/zhui.glb`);
        }

    }
    //医疗
    medical = () => {
        const { medicalSelect } = this.state
        this.setState({
            medicalSelect: true
        })
    }
    // 教育
    education = () => {
        const { educationSelect } = this.state
        this.setState({
            educationSelect: true
        })
        if (educationSelect === false) {
            Models.setCone(viewer, 119.89908122274129, 28.460642777400345, 140, '丽水学院', '丽水学院共计8000人', `${process.env.PUBLIC_URL}/3d/zhui1.glb`)
            radarScan(119.89908122274129, 28.460642777400345, 200)
        }

    }
    // 预警救援
    warning = () => {
        const { warningSelect } = this.state
        this.setState({
            warningSelect: true
        })
        if (warningSelect === false) {

            geometry.setMark(1, 119.91286417532214, 28.462863669630227, 140, '发生危险区域', '发生危险类型：火灾');
            var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
            let lon1 = 119.91286417532214;
            let lat1 = 28.462863669630227;
            var CartographicCenter1 = new Cesium.Cartographic(
                Cesium.Math.toRadians(lon1),
                Cesium.Math.toRadians(lat1),
                0
            );
            setAlarm(viewer, CartographicCenter1, 200, scanColor, 1000);

            Models.setModel({
                modelUrl: `${process.env.PUBLIC_URL}/3d/CesiumDrone.gltf`,
                startPos: Cesium.Cartesian3.fromDegrees(119.91388098940308, 28.463157258190098, 100),
                endPos: Cesium.Cartesian3.fromDegrees(119.91388098940308, 28.463157258190098, 100),
                time: 360,
                scale: 10,
                text: '救援无人机巡查',
                showPoint: false,
                airPlane: true
            });
        }

    }
    // 交通情况
    traffic = () => {
        const { trafficSelect } = this.state
        this.setState({
            trafficSelect: true
        })
        if (trafficSelect === false) {
            glowLine()
            Models.setCone(viewer, 119.95036125517865, 28.44471897721914, 140, '高铁站', '丽水高铁站，今日共89班次', `${process.env.PUBLIC_URL}/3d/zhui1.glb`)
            radarScan(119.95036125517865, 28.44471897721914, 200)
            // Models.airLine();

            Models.setModel({
                modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
                startPos: Cesium.Cartesian3.fromDegrees(119.91600024277844, 28.46643744731459, 2),
                endPos: Cesium.Cartesian3.fromDegrees(119.92133943285947, 28.468109441248263, 2),
                time: 360,
                scale: 0.25,
                text: '社会车辆1',
                showPoint: false,
                airPlane: false
            });
            Models.setModel({
                modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
                startPos: Cesium.Cartesian3.fromDegrees(119.9188904573172, 28.46216016417923, 2),
                endPos: Cesium.Cartesian3.fromDegrees(119.91864250772069, 28.467137181698114, 2),
                time: 360,
                scale: 0.25,
                text: '社会车辆2',
                showPoint: false,
                airPlane: false
            });
        }

    }
    // 旅游交通
    Travel = () => {
        const { TravelSelect } = this.state
        this.setState({
            TravelSelect: true
        })
    }
    //疫情管控
    Control = () => {
        const { ControlSelect } = this.state
        this.setState({
            ControlSelect: true
        })
        if (ControlSelect === false) {
            flyPath()
            geometry.setMark(2, 119.92400321458236, 28.46212632105087, 140, '隔离区', '发热人数：8人,咳嗽：6人');


            Models.setModel({
                modelUrl: `${process.env.PUBLIC_URL}/3d/CesiumDrone.gltf`,
                startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 100),
                endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 100),
                time: 360,
                scale: 20,
                text: '无人机巡查',
                showPoint: false,
                airPlane: false
            });
            Models.setModel({
                modelUrl: ``,
                startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 0),
                endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 0),
                time: 360,
                scale: 0,
                text: '',
                showPoint: true,
                airPlane: false
            });

            Wall(Cesium.Cartesian3.fromDegreesArrayHeights([
                119.92174110410446, 28.4627408439087, 80,
                119.92167849772021, 28.462605767390524, 80,
                119.92228865196599, 28.46025781857183, 80,
                119.92246799353285, 28.460157242202612, 80,
                119.92567476716196, 28.46117373327441, 80,
                119.92580188108182, 28.46133584315255, 80,
                119.9257883493644, 28.46385878933483, 80,
                119.92574494515367, 28.464007983649257, 80,
                119.92566694795825, 28.46406371653822, 80,
                119.92536160383271, 28.464060205076482, 80,
                119.92174110410446, 28.4627408439087, 80
            ]))

        }

    }
    // 日夜切换
    switch = () => {
        const { light } = this.state

        this.setState({
            light: !light
        })
        changLight(light ? "Moonlight" : "Flashlight")

    }
    // 搜索
    changeSearchVisible = (key: boolean) => {
        const search = document.getElementById('search')
        if (!key) {
            search.style.border = '1px solid #0091fe'
            search.style.borderLeft = 'none'
            search.style.width = '140px'
        }
        else {
            search.style.width = '0'
            setTimeout(() => {
                search.style.border = 'none'
            }, 600)
        }
        this.setState({
            searchVisible: !key
        })
    }
    render() {
        const {
            light,
            citySelect,
            medicalSelect,
            educationSelect,
            warningSelect,
            trafficSelect,
            TravelSelect,
            ControlSelect,
            searchVisible
        } = this.state
        return (
            <Router >
                <ConfigProvider locale={zhCN}>
                    <Layout />
                </ConfigProvider>
            </Router>


            // <div className={"navBar"}>
            //     <div className="header-box">
            //         <div className="header-L">
            //             <div className="title">丽水中心城市·数字孪生平台</div>
            //             <div className="entitle">LISHUI CENTRAL CITY·VISUAL DIGITAL TWIN INFORMATION PLATFORM</div>
            //         </div>
            //         <div className="header-R">
            //             <div className={"head-button " + (citySelect ? "selected" : "")} onClick={this.setCity}>城市总览</div>
            //             <div className={"head-button " + (medicalSelect ? 'selected' : '')} onClick={this.medical}>城市医疗</div>
            //             <div className={"head-button " + (educationSelect ? 'selected' : '')} onClick={this.education}>教育数据</div>
            //             <div className={"head-button " + (warningSelect ? 'selected' : '')} onClick={this.warning}>应急救援</div>
            //             <div className={"head-button " + (trafficSelect ? 'selected' : '')} onClick={this.traffic}>交通情况</div>
            //             <div className={"head-button " + (TravelSelect ? 'selected' : '')} onClick={this.Travel}>旅游住宿</div>
            //             <div className={"head-button " + (ControlSelect ? 'selected' : '')} onClick={this.Control}>疫情管控</div>
            //         </div>
            //     </div>
            //     <div className="topbar">
            //         <div className={light ? "light" : "moon"} onClick={this.switch}>
            //             <div className='iconfont iconyueliang'></div>
            //         </div>
            //         <div className={'search-box'}>
            //             <div className={(searchVisible ? 'button-blue' : "button-gray")} onClick={() => this.changeSearchVisible(searchVisible)}>
            //                 <div className='iconfont iconsearcher'></div>
            //             </div>
            //             <div id='search'>
            //                 <Input bordered={false} placeholder={'搜索'} allowClear />
            //             </div>
            //         </div>

            //     </div>
            //     {/* <Button onClick={handleRanging}>测距</Button>
            // <Button onClick={cancleRanging}>取消测距</Button> */}
            //     <div className={'foot-background'} />
            // </div>

        );
    }


};

export default App;