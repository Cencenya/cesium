import react, { Component } from 'react';
import * as ReactDom from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d';
import '../../style/chart.scss';
highcharts3d(Highcharts);

interface IObj {
  name: string,
  y: number,
  unit: string,
  [propsName: string]: any
}

interface IProps {
  data: any
}
interface LegendPieChart3DIObj {
  name: string,
  y: number,
  unit: string
}

interface LegendPieChart3DIProps {
  datas: LegendPieChart3DIObj[]
}
const LegendPieChart3D = ({ datas }: LegendPieChart3DIProps) => {
  let color = ["#11BC8E", "#03A5FF", "#E2D71A"];
  return (
    <div className="piechart-3d-legend">
      {
        datas.map((item, index) => {
          return (
            <div className="piechart-3d-legend-item">
              <div className="piechart-3d-legend-icon" style={{ background: color[index] }}></div>
              <span className="piechart-3d-legend-name">{item.name}</span>
              <span className="piechart-3d-legend-data">{item.y}</span>
              <span className="piechart-3d-legend-unit">{item.unit}</span>
            </div>
          )
        })
      }
    </div>
  )
}
class PieChart3D extends Component<IProps> {
  getOption() {
    console.log(this.props.data);


    let data = [...this.props.data.data];
    data[0].sliced = true;
    data[0].selected = true;
    const options: Highcharts.Options = {
      chart: {
        type: "pie",
        backgroundColor: "rgba(0,0,0,0)",  //透明背景
        options3d: {
          enabled: true,
          alpha: 67,  //旋转角度
          beta: 0
        }
      },
      title: {
        text: ""
      },
      legend: {
        layout: "horizontal", //vertical
        align: "left",
        verticalAlign: "bottom",
        borderWidth: 0,
        itemStyle: {
          color: '#fff',
          fontWeight: 'noraml',
          fontSize: '20px'
        }
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        style: {
          fontSize: "20px",
        }
      },
      colors: ["#11BC8E", "#03A5FF", "#E2D71A"],
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          size: 240,
          innerSize: 150,
          allowPointSelect: true,
          cursor: "pointer",
          depth: 45, //高度
          dataLabels: {
            distance: 20,
            style: {
              fontSize: "40px",
              textOutline: "none" //去掉文字白色描边
            },
            formatter: function () {
              return (
                '<p style="fontSize:40px;color:' +
                this.color + //文字展示对应颜色
                '">' +
                this.percentage.toFixed(1) + //展示百分比
                "%</p>"
              );
            }
          },
          showInLegend: false
        }
      },
      series: [
        {
          type: "pie",
          name: "",
          data: data
        }
      ]
    }
    return options
  }
  render() {
    return (
      <div className='piechart-3d-w piechart-3d-w2'>
        <div className="piechart-3d-legend-w ">
          <div className="contradiction-text">矛盾解纷数：</div>
          <div className="contradiction-div">
            <span className="contradiction-data">{this.props.data.problem}</span>
            <span className="contradiction-unit">件</span>
          </div>
          <LegendPieChart3D datas={this.props.data.data}></LegendPieChart3D>
        </div>
        <div className="piechart-3d-chart-w">
          <HighchartsReact
            style={{ height: '100%' }}
            highcharts={Highcharts}
            options={this.getOption()}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}





export default PieChart3D