import react, { FC } from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { fontChart } from '../../utils/common'
interface props {
  data: any
}
const BarChart = (chartprops: props) => {
  const { year, car, chartdata } = chartprops.data
  const getOption = () => {
    let data = {
      id: 'multipleBarsLines',
      legendBar: ['高速公路', '城镇公路'],
      symbol: ' ', //数值是否带百分号        --默认为空 ''
      legendLine: ['环比', '同比'],
      xAxis: ['2014', '2015', '2016', '2017', '2018',
        '2019'
      ],
      yAxis: [
        [8, 10, 10, 11, 4, 13],
        [10, 7, 8, 8, 7, 9]
      ],
      lines: [
        [10, 10, 9, 11, 7, 4],
        [6, 12, 12, 2, 4, 4]
      ],
      barColor: ['#009883', '#e66922'], //柱子颜色 必填参数
      lineColor: ['#fd6665', '#fba73b'], // 折线颜色

    }

    let myData = (function test() {
      let yAxis = data.yAxis || []
      let lines = data.lines || []
      let legendBar = data.legendBar || []
      let legendLine = data.legendLine || []
      var symbol = data.symbol || ' '
      let seriesArr = []
      let legendArr = []
      yAxis && yAxis.forEach((item, index) => {
        legendArr.push({
          name: legendBar && legendBar.length > 0 && legendBar[index]
        })
        seriesArr.push({
          name: legendBar && legendBar.length > 0 && legendBar[index],
          type: 'bar',
          barGap: '0.5px',
          data: item,
          barWidth: 12,
          label: {
            normal: {
              show: false,
              formatter: '{c}' + symbol,
              position: 'top',
              textStyle: {
                color: '#000',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                textAlign: 'left',
                fontSize: 11,
              },
            },
          },
          itemStyle: { //图形样式
            normal: {
              barBorderRadius: 0,
              borderWidth: 1,
              borderColor: '#ddd',
              color: data.barColor[index]
            },
          }
        })
      })

      lines && lines.forEach((item, index) => {
        legendArr.push({
          name: legendLine && legendLine.length > 0 && legendLine[index]
        })
        seriesArr.push({
          name: legendLine && legendLine.length > 0 && legendLine[index],
          type: 'line',
          data: item,
          itemStyle: {
            normal: {
              color: data.lineColor[index],
              lineStyle: {
                width: 2,//折线宽度
                type: 'solid',
              }
            }
          },
          label: {
            normal: {
              show: false, //折线上方label控制显示隐藏
              position: 'top',
            }
          },
          symbol: 'circle',
          symbolSize: 5
        })
      })

      return {
        seriesArr,
        legendArr
      }
    })()
    let option = {
      title: {
        show: true,
        // text: data.title,
        // subtext: data.subTitle,
        link: '1111'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let time = '';
          let str = '';
          for (let i of params) {
            time = i.name.replace(/\n/g, '') + '<br/>';
            if (i.data == 'null' || i.data == null) {
              str += i.seriesName + '：无数据' + '<br/>'
            } else {
              str += i.seriesName + '：' + i.data + '%<br/>'
            }

          }
          return time + str;
        },
        axisPointer: {
          type: 'none'
        },
      },
      legend: {
        right: '10px',
        top: 0,
        itemGap: 16,
        itemWidth: 10,
        itemHeight: 10,
        data: myData.legendArr,
        textStyle: {
          color: '#fff',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 12,
        }
      },
      grid: {
        x: 0,
        y: 30,
        x2: 0,
        y2: 25,
      },
      xAxis: {
        type: 'category',
        data: data.xAxis,
        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
        axisLabel: {       //轴标
          show: true,
          interval: '0',
          textStyle: {
            lineHeight: 5,
            padding: [2, 2, 0, 2],
            height: 50,
            fontSize: 12,
            color: '#fff',
          },
          rich: {
            Sunny: {
              height: 50,
              // width: 60,
              padding: [0, 5, 0, 5],
              align: 'center',
            },
          },
          formatter: function (params, index) {
            var newParamsName = "";
            var splitNumber = 5;
            var paramsNameNumber = params && params.length;
            if (paramsNameNumber && paramsNameNumber <= 4) {
              splitNumber = 4;
            } else if (paramsNameNumber >= 5 && paramsNameNumber <= 7) {
              splitNumber = 4;
            } else if (paramsNameNumber >= 8 && paramsNameNumber <= 9) {
              splitNumber = 5;
            } else if (paramsNameNumber >= 10 && paramsNameNumber <= 14) {
              splitNumber = 5;
            } else {
              params = params && params.slice(0, 15);
            }

            var provideNumber = splitNumber; //一行显示几个字
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0;
            if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }

            } else {
              newParamsName = params;
            }
            params = newParamsName
            return '{Sunny|' + params + '}';
          },
          color: '#687284',
        },

      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F1F3F5',
            type: 'solid'
          },
          interval: 2
        },
        splitNumber: 4,
      },
      series: myData.seriesArr
    }
    return option

  }
  return (
    <ReactEcharts
      style={{ height: '100%' }}
      option={getOption()}
    />
  )
}

export default BarChart;