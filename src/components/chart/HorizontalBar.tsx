import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { fontChart } from '../../utils/common';



interface IChartItem {
  value: number,
  name: string,
  unit?: string
}

interface IChartObj {
  datas: IChartItem[],
  option?: {}
}
const HorizontalBar = (props: IChartObj) => {
  let datas: IChartItem[] = [...props.datas];
  const getOption = () => {
    let getSymbolData = (data: IChartItem[]) => {
      let arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].value,
          symbolPosition: 'end'
        })
      }
      return arr;
    }
    let maxArr = (new Array(datas.length)).fill(100);
    let option = {
      tooltip: {
        show: false
      },
      grid: {
        top: '10%',
        bottom: '5%',
        left: 0,
        right: '15%'
      },
      legend: {
        show: false
      },
      xAxis: {
        show: false,
        type: 'value'

      },
      yAxis: [{
        type: 'category',
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisPointer: {
          label: {
            show: true,
            margin: fontChart(0.3)
          }
        },
        data: datas.map(item => item.name),
        axisLabel: {
          margin: fontChart(1),
          fontSize: fontChart(0.2),
          align: 'left',
          color: '#fff',
          padding: [0, 0, fontChart(0.4), fontChart(1)],
          rich: {
            b: {
              color: '#03FBEE',
              backgroundColor: "rgba(3,251,238,0.3)",
              width: fontChart(0.32),
              height: fontChart(0.18),
              align: 'center',
              borderRadius: 2
            }
          },
          formatter: function (params: any) {
            var index = datas.map(item => item.name).indexOf(params);
            index = index + 1;
            return [
              '{b|' + index + '}' + '  ' + params
            ].join('\n')
          }
        }
      }, {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        data: datas.map(item => item.value),
        axisLabel: {
          show: true,
          fontSize: fontChart(0.2),
          color: '#fff',
          formatter: '{value}' + datas[0].unit
        }
      }],
      series: [{
        name: 'XXX',
        type: 'pictorialBar',
        symbol: 'rect',
        symbolSize: [fontChart(0.04), fontChart(0.12)],
        symbolOffset: [fontChart(0.02), 0],
        z: 12,
        itemStyle: {
          normal: {
            color: '#02D2DA'
          }
        },
        data: getSymbolData(datas)
      }, {
        z: 2,
        name: 'value',
        type: 'bar',
        barWidth: fontChart(0.06),
        zlevel: 1,
        itemStyle: {
          normal: {
            barBorderRadius: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: 'rgba(2, 210, 218, 0.1)'
            }, {
              offset: 1,
              color: '#02D2DA'
            }]),
          },
        },
        data: datas.map((item, i) => {
          return {
            value: item.value
          };
        }),
        label: {
          show: false,
          position: 'right',
          color: '#333333',
          fontSize: fontChart(0.14),
          offset: [10, 0]
        }
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: fontChart(0.06),
        barGap: '-100%',
        itemStyle: {
          normal: {
            color: 'rgba(118, 111, 111, 0.55)'
          }
        },
        data: maxArr,
      }

      ]
    }
    return option
  };

  return (
    <ReactEcharts
      style={{ height: '100%' }}
      option={getOption()}
    />
  );
};


export default HorizontalBar;