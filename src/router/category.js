// 分类路由配置 
let items = [{
        categoryName: "基础底图",
        items: [{
                path: "/argismap",
                name: "argismap",
                component: () =>
                    import ('@/views/BaseMaps/ArcgisMap'),
                meta: {
                    title: "ArcGIS在线底图",
                    img: "../../../static/images/samples/argismaps.jpg",
                }
            },
            {
                path: "/mapboxmap",
                name: "mapboxmap",
                component: () =>
                    import ('@/views/BaseMaps/MapBoxMap'),
                meta: {
                    title: "MapBox在线底图",
                    img: "../../../static/images/samples/mapboxmap.jpg",
                }
            }, {
                path: "/gaodemap",
                name: "gaodemap",
                component: () =>
                    import ('@/views/BaseMaps/GaodeMap'),
                meta: {
                    title: "高德在线底图",
                    img: "../../../static/images/samples/gaodemap.jpg",
                }
            }, {
                path: "/tdtmap",
                name: "tdtmap",
                component: () =>
                    import ('@/views/BaseMaps/TdtMap'),
                meta: {
                    title: "天地图在线底图",
                    img: "../../../static/images/samples/tdtmap.jpg",
                }
            }, {
                path: "/supermapmap",
                name: "supermapmap",
                component: () =>
                    import ('@/views/BaseMaps/SupermapMap'),
                meta: {
                    title: "超图在线底图",
                    img: "../../../static/images/samples/supermapmap.jpg",
                }
            }, {
                path: '/singletileimage',
                name: "singletileimage",
                component: () =>
                    import ('@/views/BaseMaps/SingleTileImage'),
                meta: {
                    title: "本地单张图片",
                    img: "../../../static/images/samples/singletileimage.jpg",
                }
            },
        ]
    },
    {
        categoryName: "点状对象",
        items: [{
            path: "/cluser",
            name: "cluser",
            component: () =>
                import ('@/views/PointObject/Cluser'),
            meta: {
                title: "Cesium点聚合1",
                img: "../../../static/images/samples/cluser1.gif",
            }
        }, {
            path: "/dynamiccluser",
            name: "dynamiccluser",
            component: () =>
                import ('@/views/PointObject/DynamicCluser'),
            meta: {
                title: "Cesium点聚合2",
                img: "../../../static/images/samples/cluser2.gif",
            }
        }, {
            path: '/billboardgif',
            name: "billboardgif",
            component: () =>
                import ('@/views/PointObject/BillboardGif'),
            meta: {
                title: "Billboard加载Gif图片",
                img: "../../../static/images/samples/bgif.gif",
            }
        }, {
            path: "/alertmarker",
            name: "alertmarker",
            component: () =>
                import ('@/views/PointObject/AlertMarker'),
            meta: {
                title: "Cesium 闪烁点",
                img: "../../../static/images/samples/alertmarker.gif",
            }
        }, {
            path: '/pointprimitives',
            name: "pointprimitives",
            component: () =>
                import ('@/views/PointObject/PointPrimitives'),
            meta: {
                title: "Primitives加载大量图标点",
                img: "../../../static/images/samples/pointprimitives.jpg",
            }
        }, {
            path: '/divpoint',
            name: "divpoint",
            component: () =>
                import ('@/views/PointObject/DivPoint'),
            meta: {
                title: "div文本点",
                img: "../../../static/images/samples/divpoint.jpg",
            }
        }, {
            path: '/animationpoint',
            name: "animationpoint",
            component: () =>
                import ('@/views/PointObject/AnimationPoint'),
            meta: {
                title: "动态效果点",
                img: "../../../static/images/samples/animationpoint.gif",
            }
        }, {
            path: '/labelbillboardcol',
            name: "labelbillboardcol",
            component: () =>
                import ('@/views/PointObject/LabelBillboardCol'),
            meta: {
                title: "图标点+文字(primitive方式)",
                img: "../../../static/images/samples/labelbillboardcol.jpg",
            }
        }, {
            path: '/dynamicdivlabel',
            name: "dynamicdivlabel",
            component: () =>
                import ('@/views/PointObject/DynamicDivLabel'),
            meta: {
                title: "动态文本标记",
                img: "../../../static/images/samples/dynamicdivlabel.gif",
            }
        }]
    }, {
        categoryName: "单体化",
        items: [{
            path: "/dynamicdth",
            name: "dynamicdth",
            component: () =>
                import ('@/views/DTH/DynamicDTH'),
            meta: {
                title: "倾斜模型分栋单体化 （基于geoserver）",
                img: "../../../static/images/samples/dynamicDTH.gif",
            }
        }, {
            path: '/FCDTH',
            name: "FCDTH",
            component: () =>
                import ('@/views/DTH/FCDTH'),
            meta: {
                title: "倾斜模型分层单体化（基于geoserver）含教程",
                img: "../../../static/images/samples/fcDTH.gif",
            }
        }, {
            path: '/FHDTH',
            name: "FHDTH",
            component: () =>
                import ('@/views/DTH/FHDTH'),
            meta: {
                title: "倾斜模型分户单体化（基于geoserver）含教程",
                img: "../../../static/images/samples/fhDTH.gif",
            }
        }, ]
    },
    {
        categoryName: "编辑绘制",
        items: [{
            path: "/entitydraw",
            name: "entitydraw",
            component: () =>
                import ('@/views/DrawEdit/EntityDraw'),
            meta: {
                title: "点线面绘制",
                img: "../../../static/images/samples/entitydraw.jpg",
            }
        }, {
            path: "/entityedit",
            name: "entityedit",
            component: () =>
                import ('@/views/DrawEdit/EntityEdit'),
            meta: {
                title: "点线面编辑",
                img: "../../../static/images/samples/entityedit.jpg",
            }
        }, {
            path: '/entitydrawext',
            name: "entitydrawext",
            component: () =>
                import ('@/views/DrawEdit/EntityDrawExt'),
            meta: {
                title: "点线面绘制扩展",
                img: "../../../static/images/samples/entitydrawext.jpg",
            }
        }, {
            path: '/entityeditext',
            name: "entityeditext",
            component: () =>
                import ('@/views/DrawEdit/EntityEditExt'),
            meta: {
                title: "点线面编辑扩展",
                img: "../../../static/images/samples/entityediteext.png",
            }
        }, ]
    },
    {
        categoryName: "自定义信息框",
        items: [{
            path: "/multifieldadaptwindow",
            name: "multifieldadaptwindow",
            component: () =>
                import ('@/views/CustomInfowindow/MultiFieldAdaptWindow'),
            meta: {
                title: "多字段自适应信息框",
                img: "../../../static/images/samples/multifieldadaptwindow.gif",
            }
        }, {
            path: "/popupwindow1",
            name: "popupwindow1",
            component: () =>
                import ('@/views/CustomInfowindow/PopupWindow1'),
            meta: {
                title: "气泡窗口样式1",
                img: "../../../static/images/samples/popupwindow1.jpg",
            }
        }, {
            path: "/popupwindow2",
            name: "popupwindow2",
            component: () =>
                import ('@/views/CustomInfowindow/PopupWindow2'),
            meta: {
                title: "气泡窗口样式2",
                img: "../../../static/images/samples/popupwindow2.jpg",
            }
        }, ]
    },
    {
        categoryName: "标注标绘",
        items: [{
                path: '/htmlplot',
                name: "htmlplot",
                component: () =>
                    import ('@/views/LabelPlotting/HtmlPlot'),
                meta: {
                    img: "../../../static/images/samples/htmlplot.gif",
                    title: "自定义html标注图层"
                }
            }, {
                path: '/militaryplot',
                name: "militaryplot",
                component: () =>
                    import ('@/views/LabelPlotting/MilitaryPlotDraw'),
                meta: {
                    img: "../../../static/images/samples/militaryplotdraw.jpg",
                    title: "军事标绘"
                }
            }, {
                path: '/militaryplotedit',
                name: "militaryplotedit",
                component: () =>
                    import ('@/views/LabelPlotting/MilitaryPlotEdit'),
                meta: {
                    img: "../../../static/images/samples/militaryplotedit.jpg",
                    title: "军事标绘编辑"
                }
            }, {
                path: "/gltfdraw",
                name: "gltfdraw",
                component: () =>
                    import ('@/views/LabelPlotting/GltfDraw'),
                meta: {
                    title: "gltf 标绘绘制",
                    img: "../../../static/images/samples/gltfdraw.gif",
                }
            }, {
                path: "/gltfedit",
                name: "gltfedit",
                component: () =>
                    import ('@/views/LabelPlotting/GltfEdit'),
                meta: {
                    title: "gltf 标绘编辑",
                    img: "../../../static/images/samples/gltfedit.gif",
                }
            }, {
                path: '/chinaregion',
                name: "chinaregion",
                component: () =>
                    import ('@/views/LabelPlotting/ChinaRegion'),
                meta: {
                    title: "行政区标注",
                    img: "../../../static/images/samples/chinaregion.jpg",
                }
            },
            {
                path: '/hedronplot',
                name: "hedronplot",
                component: () =>
                    import ('@/views/LabelPlotting/HedronPlot'),
                meta: {
                    title: "体对象绘制编辑",
                    img: "../../../static/images/samples/hedronplot.png",
                }
            },
        ]
    },
    {
        categoryName: "轨迹漫游",
        items: [{
            path: "/trailline",
            name: "trailline",
            component: () =>
                import ('@/views/TrackRoam/TrailLine'),
            meta: {
                title: "轨迹回放",
                img: "../../../static/images/samples/trailline.gif",
            }
        }, {
            path: "/roam1",
            name: "roam1",
            component: () =>
                import ('@/views/TrackRoam/Roam/Roam1'),
            meta: {
                title: "跟随视角漫游",
                img: "../../../static/images/samples/roam1.gif",
            }
        }, {
            path: "/roam2",
            name: "roam2",
            component: () =>
                import ('@/views/TrackRoam/Roam/Roam2'),
            meta: {
                title: "第一人称漫游",
                img: "../../../static/images/samples/roam2.gif",
            }
        }, {
            path: "/roam3",
            name: "roam3",
            component: () =>
                import ('@/views/TrackRoam/Roam/Roam3'),
            meta: {
                title: "上帝视角漫游",
                img: "../../../static/images/samples/roam3.gif",
            }
        }, {
            path: "/pedestrianroam",
            name: "pedestrianroam",
            component: () =>
                import ('@/views/TrackRoam/PedestrianRoam'),
            meta: {
                title: "行人漫游",
                img: "../../../static/images/samples/pedestrianroam.gif",
            }
        }]
    }, {
        categoryName: "分析",
        items: [{
                path: "/point2To3",
                name: "point2To3",
                component: () =>
                    import ('@/views/Analysis/Point2dToPoint3d'),
                meta: {
                    title: "Cesium 2维点转3维点",
                    img: "../../../static/images/samples/point2to3.gif",
                }
            },
            {
                path: "/bisection",
                name: "bisection",
                component: () =>
                    import ('@/views/Analysis/BisectionLine'),
                meta: {
                    title: "Cesium 空间线段等分",
                    img: "../../../static/images/samples/bisection.jpg",
                }
            }, {
                path: '/underground',
                name: "underground",
                component: () =>
                    import ('@/views/Analysis/UnderGround'),
                meta: {
                    title: "地表透明（地下模式）",
                    img: "../../../static/images/samples/underground.jpg",
                }
            }, {
                path: '/sightline',
                name: "sightline",
                component: () =>
                    import ('@/views/Analysis/SightLine'),
                meta: {
                    title: "通视分析",
                    img: "../../../static/images/samples/sightline.jpg",
                }
            }, {
                path: '/viewshed',
                name: "viewshed",
                component: () =>
                    import ('@/views/Analysis/ViewShedStage'),
                meta: {
                    title: "可视域分析",
                    img: "../../../static/images/samples/viewshed.gif",
                }
            }, {
                path: '/bufferanalysis',
                name: "bufferanalysis",
                component: () =>
                    import ('@/views/Analysis/BufferAnalysis'),
                meta: {
                    title: "缓冲区分析",
                    img: "../../../static/images/samples/buffer.jpg",
                }
            }, {
                path: '/surfaceexcavate',
                name: "surfaceexcavate",
                component: () =>
                    import ('@/views/Analysis/SurfaceExcavate'),
                meta: {
                    title: "地表开挖（材质贴图）",
                    img: "../../../static/images/samples/surfaceexcavate.jpg",
                }
            }, {
                path: '/terrainexcavate',
                name: "terrainexcavate",
                component: () =>
                    import ('@/views/Analysis/TerrainExcavate'),
                meta: {
                    title: "地形开挖（材质贴图）",
                    img: "../../../static/images/samples/terrainexcavate.png",
                }
            }, {
                path: '/tilesclip',
                name: "tilesclip",
                component: () =>
                    import ('@/views/Analysis/TilesClip'),
                meta: {
                    title: "模型裁剪（Planes）",
                    img: "../../../static/images/samples/tilesclip.jpg",
                }
            }, {
                path: '/stratumexcavate',
                name: "/stratumexcavate",
                component: () =>
                    import ('@/views/Analysis/StratumExcavate'),
                meta: {
                    title: "矿区岩层效果",
                    img: "../../../static/images/samples/stratumexcavate.jpg",
                }
            }, {
                path: '/viewersync',
                name: "viewersync",
                component: () =>
                    import ('@/views/Analysis/ViewerSync'),
                meta: {
                    title: "双屏对比",
                    img: "../../../static/images/samples/viewersync.jpg",
                }
            }, {
                path: '/cesiumolsync',
                name: "cesiumolsync",
                component: () =>
                    import ('@/views/Analysis/CesiumOLSync'),
                meta: {
                    title: "二三维联动（基于openlayers)",
                    img: "../../../static/images/samples/cesiumolsync.jpg",
                }
            }
        ]
    }, {
        categoryName: "场景",
        items: [{
            path: "/scenetofile",
            name: "scenetofile",
            component: () =>
                import ('@/views/Scene/SceneToFile'),
            meta: {
                title: "场景出图（导出图片）",
                img: "../../../static/images/samples/scenetofile.jpg",
            }
        }, {
            path: '/skybox',
            name: "skybox",
            component: () =>
                import ('@/views/Scene/SkyBox'),
            meta: {
                title: "自定义天空盒",
                img: "../../../static/images/samples/skybox.jpg",
            }
        }, {
            path: '/positioninfostatusbar',
            name: "positioninfostatusbar",
            component: () =>
                import ('@/views/Scene/PositionInfoStatusBar'),
            meta: {
                title: "位置信息状态栏控件",
                img: "../../../static/images/samples/position_status_bar.jpg",
            }
        }, {
            path: '/weathereffect',
            name: "weathereffect",
            component: () =>
                import ('@/views/Scene/WeatherEffect'),
            meta: {
                title: "雨雪雾天气效果",
                img: "../../../static/images/samples/weathereffect.jpg",
            }
        }, {
            path: '/limitcamera',
            name: "limitcamera",
            component: () =>
                import ('@/views/Scene/LimitCamera'),
            meta: {
                title: "限定视角范围",
                img: "../../../static/images/samples/limitcamera.jpg",
            }
        }, {
            path: '/boundary',
            name: "boundary",
            component: () =>
                import ('@/views/Scene/Boundary'),
            meta: {
                title: "绘制反选遮罩",
                img: "../../../static/images/samples/boundary.jpg",
            }
        }, {
            path: '/custombackgroundimg',
            name: "custombackgroundimg",
            component: () =>
                import ('@/views/Scene/CustomBackgroundImg'),
            meta: {
                title: "自定义空间背景",
                img: "../../../static/images/samples/custombackgroundimg.png",
            }
        }, {
            path: '/macrodigitalearth',
            name: "macrodigitalearth",
            component: () =>
                import ('@/views/Scene/MacroDigitalEarth'),
            meta: {
                title: "宏观数字地球",
                img: "../../../static/images/samples/macrodigitalearth.png",
            }
        }, {
            path: '/overviewmap',
            name: "overviewmap",
            component: () =>
                import ('@/views/Scene/OverviewMap'),
            meta: {
                title: "鹰眼地图（基于openlayers）",
                img: "../../../static/images/samples/overviewmap.jpg",
            }
        }, {
            path: '/navigation',
            name: "navigation",
            component: () =>
                import ('@/views/Scene/CesiumNavigation'),
            meta: {
                title: "导航控件",
                img: "../../../static/images/samples/navigation.jpg",
            }
        }, {
            path: '/cloud',
            name: "cloud",
            component: () =>
                import ('@/views/Scene/Cloud'),
            meta: {
                title: "云层",
                img: "../../../static/images/samples/cloud.gif",
            }
        }, {
            path: '/tooltip',
            name: "tooltip",
            component: () =>
                import ('@/views/Scene/Tooltip'),
            meta: {
                title: "Tooltip鼠标移入信息",
                img: "../../../static/images/samples/tooltip.gif",
            }
        }, {
            path: '/bookmark',
            name: "bookmark",
            component: () =>
                import ('@/views/Scene/BookMark'),
            meta: {
                title: "书签管理",
                img: "../../../static/images/samples/bookmark.jpg",
            }
        }, {
            path: '/globerotate',
            name: "globerotate",
            component: () =>
                import ('@/views/Scene/GlobeRotate'),
            meta: {
                title: "旋转的地球",
                img: "../../../static/images/samples/globerotate.gif",
            }
        }, {
            path: '/aroundpoint',
            name: "aroundpoint",
            component: () =>
                import ('@/views/Scene/AroundPoint'),
            meta: {
                title: "绕点旋转",
                img: "../../../static/images/samples/aroundpoint.gif",
            }
        }, {
            path: '/bloom',
            name: "bloom",
            component: () =>
                import ('@/views/Scene/Bloom'),
            meta: {
                title: "场景泛光",
                img: "../../../static/images/samples/bloom.jpg",
            }
        }]
    }, {
        categoryName: "工具",
        items: [{
            path: "/measure",
            name: "measure",
            component: () =>
                import ('@/views/SceneTools/Measure'),
            meta: {
                title: "场景测量工具",
                img: "../../../static/images/samples/measure.jpg",
            }
        }, {
            path: "/pickposition",
            name: "pickposition",
            component: () =>
                import ('@/views/SceneTools/PositionPick'),
            meta: {
                title: "鼠标位置拾取工具",
                img: "../../../static/images/samples/positioinpick.gif",
            }
        }, ]
    }, {
        categoryName: "特效",
        items: [{
            path: "/polylinedynamic",
            name: "polylinedynamic",
            component: () =>
                import ('@/views/SpecialEffects/PolylineDynamic'),
            meta: {
                title: "动态线",
                img: "../../../static/images/samples/polylinedynamic.gif",
            }
        }, {
            path: "/polylinemigrate",
            name: "polylinemigrate",
            component: () =>
                import ('@/views/SpecialEffects/PolylineMigrate'),
            meta: {
                title: "迁徙线效果",
                img: "../../../static/images/samples/polylinemigrate.gif",
            }
        }, {
            path: "/watermaterial",
            name: "watermaterial",
            component: () =>
                import ('@/views/SpecialEffects/WaterMaterial'),
            meta: {
                title: "动态水面效果",
                img: "../../../static/images/samples/water.gif",
            }
        }, {
            path: "/spreadline",
            name: "spreadline",
            component: () =>
                import ('@/views/SpecialEffects/SpreadCircle'),
            meta: {
                title: "动态扩散圆",
                img: "../../../static/images/samples/spreadcircle.gif",
            }
        }, {
            path: "/fence",
            name: "fence",
            component: () =>
                import ('@/views/SpecialEffects/Fence'),
            meta: {
                title: "动态立体墙",
                img: "../../../static/images/samples/fence.gif",
            }
        }, {
            path: '/particelsystem',
            name: "particelsystem",
            component: () =>
                import ('@/views/SpecialEffects/ParticleSystem'),
            meta: {
                title: "粒子系统",
                img: "../../../static/images/samples/particle.gif",
            }
        }, {
            path: '/circlewave',
            name: "circlewave",
            component: () =>
                import ('@/views/SpecialEffects/CircleWave'),
            meta: {
                title: "圆形波纹效果",
                img: "../../../static/images/samples/circlewave.gif",
            }
        }, {
            path: '/buildcustomshader',
            name: "buildcustomshader",
            component: () =>
                import ('@/views/SpecialEffects/BuildCustomShader'),
            meta: {
                title: "矢量白膜自定义shader（不改源码）",
                img: "../../../static/images/samples/customshader.gif",
            }
        }, {
            path: '/glowline',
            name: "/glowline",
            component: () =>
                import ('@/views/SpecialEffects/GlowLine'),
            meta: {
                title: "光晕线",
                img: "../../../static/images/samples/glowline.jpg",
            }
        }, {
            path: '/wallanimate',
            name: "/wallanimate",
            component: () =>
                import ('@/views/SpecialEffects/WallAnimate'),
            meta: {
                title: "动态立体墙（升级）",
                img: "../../../static/images/samples/wallanimate.gif",
            }
        }, {
            path: '/regularwall',
            name: "/regularwall",
            component: () =>
                import ('@/views/SpecialEffects/RegularWall'),
            meta: {
                title: "圆形、规则多边形动态围墙",
                img: "../../../static/images/samples/regularwall.gif",
            }
        }, {
            path: '/wallspread',
            name: "/wallspread",
            component: () =>
                import ('@/views/SpecialEffects/WallSpread'),
            meta: {
                title: "围墙扩散动画",
                img: "../../../static/images/samples/wallspread.gif",
            }
        }, {
            path: '/coneglow',
            name: "/coneglow",
            component: () =>
                import ('@/views/SpecialEffects/ConeGlow'),
            meta: {
                title: "光柱椎体",
                img: "../../../static/images/samples/goneglow.gif",
            }
        }, {
            path: '/datafactory',
            name: "/datafactory",
            component: () =>
                import ('@/views/SpecialEffects/DataFactory'),
            meta: {
                title: "数字工厂",
                img: "../../../static/images/samples/datafactory.gif",
            }

        }, {
            path: '/hexagonspreadscan',
            name: "/hexagonspreadscan",
            component: () =>
                import ('@/views/SpecialEffects/HexagonSpreadScan'),
            meta: {
                title: "六边形扩散扫描",
                img: "../../../static/images/samples/hexagonspreadscan.gif",
            }
        }, {
            path: '/circlespreadscan',
            name: "/circlespreadscan",
            component: () =>
                import ('@/views/SpecialEffects/CircleSpreadScan'),
            meta: {
                title: "圆形扩散扫描",
                img: "../../../static/images/samples/circlespreadscan.gif",
            }
        }, {
            path: '/tilesheatmap',
            name: "/tilesheatmap",
            component: () =>
                import ('@/views/SpecialEffects/TilesHeatmap'),
            meta: {
                title: "模型热力图",
                img: "../../../static/images/samples/tilesheatmap.jpg",
            }
        }, {
            path: '/polylineenergytrans',
            name: "/polylineenergytrans",
            component: () =>
                import ('@/views/SpecialEffects/PolylineEnergyTrans'),
            meta: {
                title: "动态传输线",
                img: "../../../static/images/samples/polylineenergytrans.gif",
            }
        }, {
            path: '/scanline',
            name: "/scanline",
            component: () =>
                import ('@/views/SpecialEffects/Scanline'),
            meta: {
                title: "扫描线",
                img: "../../../static/images/samples/scanline.gif",
            }
        }, {
            path: '/polylinetrail',
            name: "/polylinetrail",
            component: () =>
                import ('@/views/SpecialEffects/PolylineTrail'),
            meta: {
                title: "尾迹线",
                img: "../../../static/images/samples/polylinetrail.gif",
            }
        }, {
            path: '/polylineflying',
            name: "/polylineflying",
            component: () =>
                import ('@/views/SpecialEffects/PolylineFlying'),
            meta: {
                title: "飞线",
                img: "../../../static/images/samples/polylineflying.gif",
            }
        }]
    }, {
        categoryName: "行业应用",
        items: [{
            path: "/radar",
            name: "radar",
            component: () =>
                import ('@/views/IndustryApplication/RadarsEffect'),
            meta: {
                title: "雷达扫描效果",
                img: "../../../static/images/samples/radarseffect.gif",
            }
        }, {
            path: '/targettrackcone',
            name: "targettrackcone",
            component: () =>
                import ('@/views/IndustryApplication/TargetTrackCone'),
            meta: {
                title: "雷达追踪圆锥体",
                img: "../../../static/images/samples/targettrackcone.gif",
            }
        }, {
            path: '/targettrackpyramid',
            name: "targettrackpyramid",
            component: () =>
                import ('@/views/IndustryApplication/TargetTrackPyramid'),
            meta: {
                title: "雷达追踪四棱锥体",
                img: "../../../static/images/samples/targettrackpyramid.gif",
            }
        }, {
            path: '/radarsmaskscan',
            name: "radarsmaskscan",
            component: () =>
                import ('@/views/IndustryApplication/RadarsMaskScan'),
            meta: {
                title: "雷达遮罩扫描",
                img: "../../../static/images/samples/radarsmaskscan.gif",
            }
        }, {
            path: '/spacesensor',
            name: "spacesensor",
            component: () =>
                import ('@/views/IndustryApplication/SpaceSensor'),
            meta: {
                title: "相控阵雷达范围",
                img: "../../../static/images/samples/spacesensor.gif",
            }
        }, {
            path: '/radarradiationwave',
            name: "/radarradiationwave",
            component: () =>
                import ('@/views/IndustryApplication/RadarRadiationWave'),
            meta: {
                title: "雷达放射波",
                img: "../../../static/images/samples/radarradiationwave.gif",
            }
        }, {
            path: '/satellitepyramid',
            name: "satellitepyramid",
            component: () =>
                import ('@/views/IndustryApplication/SatellitePyramid'),
            meta: {
                title: "卫星视椎体（四棱锥体）",
                img: "../../../static/images/samples/satellitepyramid.jpg",
            }
        }, {
            path: '/videoadjust',
            name: "videoadjust",
            component: () =>
                import ('@/views/IndustryApplication/VideoAdjust'),
            meta: {
                title: "视频贴图参数调整",
                img: "../../../static/images/samples/videoadjust.gif",
            }
        }, {
            path: '/videofusion',
            name: "videofusion",
            component: () =>
                import ('@/views/IndustryApplication/VideoFusion'),
            meta: {
                title: "视频融合",
                img: "../../../static/images/samples/videofuse.gif",
            }
        }, {
            path: '/targettrackcollection',
            name: "targettrackcollection",
            component: () =>
                import ('@/views/IndustryApplication/TargetTrackCollection'),
            meta: {
                title: "目标跟踪",
                img: "../../../static/images/samples/targettrackcollection.gif",
            }
        }, {
            path: '/targetdetection',
            name: "targetdetection",
            component: () =>
                import ('@/views/IndustryApplication/TargetDetection'),
            meta: {
                title: "动态目标检测",
                img: "../../../static/images/samples/targetdetection.gif",
            }
        }, {
            path: '/commonvideowindow',
            name: "commonvideowindow",
            component: () =>
                import ('@/views/IndustryApplication/CommonVideoWindow'),
            meta: {
                title: "视频窗口（普通视频）",
                img: "../../../static/images/samples/commonvideowindow.gif",
            }
        }, {
            path: '/rtmpvideowindow',
            name: "rtmpvideowindow",
            component: () =>
                import ('@/views/IndustryApplication/RtmpVideoWindow'),
            meta: {
                title: "视频窗口（rtmp视频）",
                img: "../../../static/images/samples/rtmpvideowindow.gif",
            }
        }, {
            path: '/videowall',
            name: "videowall",
            component: () =>
                import ('@/views/IndustryApplication/VideoWall'),
            meta: {
                title: "视频墙（含编辑）",
                img: "../../../static/images/samples/videowall.gif",
            }
        }, {
            path: '/dynamicwater',
            name: "dynamicwater",
            component: () =>
                import ('@/views/IndustryApplication/WaterMaterial'),
            meta: {
                title: "动态水域",
                img: "../../../static/images/samples/dynamicwater.gif",
            }
        }, {
            path: '/waterspout',
            name: "waterspout",
            component: () =>
                import ('@/views/IndustryApplication/WaterSpout'),
            meta: {
                title: "水闸放水效果",
                img: "../../../static/images/samples/waterspout.gif",
            }
        }]
    }, {
        categoryName: "Echarts可视化支持",
        items: [{
                path: "/migrate1",
                name: "migrate1",
                component: () =>
                    import ('@/views/EchartLayer/Migrate1'),
                meta: {
                    title: "Echarts 迁徙图1",
                    img: "../../../static/images/samples/echartmigrater1.gif",
                }
            }, {
                path: "/migrate2",
                name: "migrate2",
                component: () =>
                    import ('@/views/EchartLayer/Migrate2'),
                meta: {
                    title: "Echarts 迁徙图2",
                    img: "../../../static/images/samples/echartmigrater2.gif",
                }
            },
            {
                path: "/scatter",
                name: "scatter",
                component: () =>
                    import ('@/views/EchartLayer/Scatter'),
                meta: {
                    title: "Echarts 散点图",
                    img: "../../../static/images/samples/echartscatter.gif",
                }
            }, {
                path: "/inflow",
                name: "inflow",
                component: () =>
                    import ('@/views/EchartLayer/Inflow'),
                meta: {
                    title: "Echarts 流入线",
                    img: "../../../static/images/samples/echartinflow.gif",
                }
            }, {
                path: "/outflow",
                name: "outflow",
                component: () =>
                    import ('@/views/EchartLayer/Outflow'),
                meta: {
                    title: "Echarts 流出线",
                    img: "../../../static/images/samples/echartoutflow.gif",
                }
            },
        ]
    }, {
        categoryName: "MapV可视化支持",
        items: [{
            path: '/mapvqianxi',
            name: "mapvqianxi",
            component: () =>
                import ('@/views/MapV/QianXi'),
            meta: {
                title: "MapV 迁徙图",
                img: "../../../static/images/samples/mapvqianxi.gif",
            }
        }, {
            path: '/mapvqianxitime',
            name: "mapvqianxitime",
            component: () =>
                import ('@/views/MapV/QianXiTime'),
            meta: {
                title: "MapV 大迁徙图",
                img: "../../../static/images/samples/mapvqianxitime.gif",
            }
        }, {
            path: '/mapvheatmap',
            name: "mapvheatmap",
            component: () =>
                import ('@/views/MapV/HeatMap'),
            meta: {
                title: "MapV 热力图",
                img: "../../../static/images/samples/mapvheatmap.jpg",
            }
        }, {
            path: '/lineforceedgebunding',
            name: "lineforceedgebunding",
            component: () =>
                import ('@/views/MapV/LineForceEdgeBunding'),
            meta: {
                title: "MapV 强边界图",
                img: "../../../static/images/samples/mapvlineforceedgebunding.gif",
            }
        }]
    },
    {
        categoryName: "其他",
        items: [{
            path: '/cesiumlab',
            name: "cesiumlab",
            component: () =>
                import ('@/views/Unclassified/Cesiumlab'),
            meta: {
                img: "../../../static/images/samples/cesiumlab.jpg",
                title: "3dtiles高度调整"
            }
        }, {
            path: '/textmap',
            name: "textmap",
            component: () =>
                import ('@/views/Unclassified/TextMap'),
            meta: {
                title: "文字贴图",
                img: "../../../static/images/samples/textmap.jpg",
            }
        }, {
            path: '/cesiumheatmap',
            name: "cesiumheatmap",
            component: () =>
                import ('@/views/Unclassified/CesiumHeatMap'),
            meta: {
                title: "热力图（基于heatmap.js插件）",
                img: "../../../static/images/samples/heatmap.jpg",
            }
        }, ]
    },
]
export default items;