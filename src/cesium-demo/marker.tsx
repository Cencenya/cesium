import { Cesium, viewer } from "./create";
import ReactDOM from "react-dom";
import ModalBox from "../components/ModalBox";
import { Cartesian3, Entity } from "cesium";

// export enum MarkerType {
//     text = 0,
//     img = 1,
//     textImg = 2
// }

interface MarkerProps {
    // type: MarkerType,
    lon: number,
    lat: number,
    height?: number,
    text?: string,
    textColor?: string,
    img?: string,
    lineColor?: string
}

//// 实体点击事件
export function handlerFun(eventType: number, target: Entity, callback: (position: any, pickEntity: Entity) => void) {
    const { scene } = viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement: any) {
        const pick = scene.pick(movement.position);// movement.position 画布坐标 x,y
        if (Cesium.defined(pick) && (pick.id === target)) {
            console.log("defined Entity", pick.id);
            callback(movement.position, pick.id);
        }
    }, eventType);

}

export function showLabel(id: string, lon: number, lat: number, height: number) {
    const modalRender = new ModalRender([], true);
    modalRender.append({
        id,
        position: [lon, lat, height],
        element: `<div class='diy-dynamic-layer diy-css3-box'>
    <div class='line'></div>
    <div class='main'>
        <div class="diy-modal-content" id=${id}></div>
    </div>
</div>`,
        offset: [10, -250],
    })
}


export class Marker {

    private entity: Entity | null = null;

    constructor({
        lon,
        lat,
        height = 0,
        text = "",
        textColor = "#fff",
        img = "",
        lineColor = "#fff"
    }: MarkerProps) {
        this.init(lon, lat, height, text, textColor, lineColor, img);
        // switch (type) {
        //     case MarkerType.text:
        //         this.textRender(lon, lat, height, text, textColor, lineColor);
        //         break;
        //     case MarkerType.img:
        //         console.log("img render");
        //         break;
        //     case MarkerType.textImg:
        //         this.render(lon, lat, height, text, textColor, lineColor, img);
        //         break;
        // }
    }

    // // @ts-ignore
    //         this.entity.label.scale = 2.0;
    // // @ts-ignore
    //         this.entity.label.showBackground = true;

    // viewer.entities.collectionChanged.addEventListener((collection,added,removed,changed) => {
    //     console.log(collection,added,removed,changed)
    // })

    init(lon: number, lat: number, height: number, text: string, textColor: string, lineColor: string, image: string) {
        ////// 标签文本示例
        const labels = viewer.entities.add(new Cesium.Entity());
        setProperties(labels);

        function setProperties(parent: Entity) {
            const label = viewer.entities.add({
                // id: "label-1",
                name: text,
                position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
                // point: {
                //     pixelSize: 5,
                //     color: Cesium.Color.RED,
                //     outlineColor: Cesium.Color.WHITE,
                //     outlineWidth: 1
                // },
                parent,
                polyline: {
                    show: true,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lon, lat, 0,
                        lon, lat, height
                    ]),
                    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),//高于多少m的时候，不可见
                    width: 1,
                    material: Cesium.Color.fromCssColorString(lineColor),
                },
                billboard: {
                    image,
                    width: 40,
                    height: 40,
                    pixelOffset: new Cesium.Cartesian2(0, -10)

                },
                label: {
                    text,
                    font: "32px  MicroSoft YaHei",// 格式要求字号 字体 '32px MicroSoft YaHei',
                    fillColor: Cesium.Color.WHITE,
                    // outlineColor:Cesium.Color.RED,
                    style: Cesium.LabelStyle.FILL,
                    outlineWidth: 1,
                    //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
                    pixelOffset: new Cesium.Cartesian2(0, -40)
                }
            });

            handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, label, (position, pickEntity) => {
                showLabel(label.id, lon, lat, height)
            });
            console.log(label.polyline);
        }


    }


    // 渲染多个实体时，注册点击事件
    renderEntityList() {
        for (let i = 1; i <= 3; i++) {
            const entity1 = viewer.entities.add({
                id: i + "000",
                position: Cesium.Cartesian3.fromDegrees(119.904559 + (i * 0.001), 28.466293 + (i * 0.001),),
                billboard: {
                    image: `${process.env.PUBLIC_URL}/logo192.png`,
                    width: 40,
                    height: 40
                }
            });
            // If the mouse is over the billboard, change its scale and color
            const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (movement: any) {
                const pickedObject = viewer.scene.pick(movement.position);
                if (Cesium.defined(pickedObject) && (pickedObject.id === entity1)) {
                    console.log("picked entity", entity1)
                    // @ts-ignore
                    entity1.billboard.scale = 2.0;
                    // @ts-ignore
                    entity1.billboard.color = Cesium.Color.YELLOW;
                } else {
                    // @ts-ignore
                    entity1.billboard.scale = 1.0;
                    // @ts-ignore
                    entity1.billboard.color = Cesium.Color.WHITE;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

    }
}

export class ModalRender {
    private container: HTMLElement | undefined = undefined;
    private scene = viewer.scene;
    private camera = viewer.camera;

    elements: any;
    isBackHide: any;

    constructor(element: any, isHide: boolean) {
        this.elements = element;
        this.isBackHide = isHide;
        this.init()
    }

    init() {
        const content = document.createElement('div');
        content.className = `diy-css3-container`;
        document.body.appendChild(content);
        this.container = content;
        this.elements.forEach((e: any) => {
            this.container!.insertAdjacentHTML('beforeend', e.element);
        });
        this.scene.preRender.addEventListener(() => {
            // @ts-ignore
            for (let i = 0; i < this.container!.children.length; i++) {
                const position = Cesium.Cartesian3.fromDegrees(this.elements[i].position[0], this.elements[i].position[1], this.elements[i].position[2] || 0)
                const canvasPosition = this.scene.cartesianToCanvasCoordinates(position, new Cesium.Cartesian2());
                if (Cesium.defined(canvasPosition)) {
                    // @ts-ignore
                    this.container.children[i].style.left = parseFloat(canvasPosition.x) + parseFloat(this.elements[i].offset[0]) + 'px';
                    // @ts-ignore
                    this.container.children[i].style.top = parseFloat(canvasPosition.y) + parseFloat(this.elements[i].offset[1]) + 'px';
                    if (this.isBackHide) {
                        let j = this.camera.position, n = this.scene.globe.ellipsoid.cartesianToCartographic(j).height;
                        if (!(n += this.scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(j, position) > n)) {
                            // @ts-ignore
                            this.container.children[i].style.display = 'block'
                        } else {
                            // @ts-ignore
                            this.container.children[i].style.display = 'none'
                        }
                    }
                }
            }
        })
    }

    remove(id: string) {
        this.elements = this.elements.filter((e: any) => e.id !== id);
        this.container!.removeChild(document.getElementById(id)!)
    }

    append(object: any) {
        if (!document.getElementById(object.id)) {
            this.elements.push(object);
            this.container!.insertAdjacentHTML('beforeend', object.element);
            ReactDOM.render(<ModalBox ele={object.value} />, document.getElementById(object.id));
        }
    };
}