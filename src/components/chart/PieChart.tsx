import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { fontChart } from '../../utils/common';
import imgSrc from "../../assets/image/background/hc-project-bg2.svg";
// import { IChartItem } from "interface";

interface IChartItem {
  value: number,
  name: string,
  unit?: string
}
interface IProps {
  datas: IChartItem[],
  img?: string
}

const PieChart = (props: IProps) => {
  let pieSeriesData = props.datas;
  let legendArr = pieSeriesData.map(v => v.name);
  let unit = pieSeriesData.length > 0 ? pieSeriesData[0].unit : null;
  let colors = ["#03A5FF", "#11C9F4", "#EAE41C", "#11BC8E", "#5045F5", "#FE4343"];

  const getOption = () => {
    let placeHolderStyle = {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        color: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 0
      }
    };

    let data = [];
    for (let i = 0; i < pieSeriesData.length; i++) {
      data.push(
        {
          data: pieSeriesData[i].value,
          value: pieSeriesData[i].value,
          name: pieSeriesData[i].name
        },
        {
          value: 20,
          name: "",
          itemStyle: placeHolderStyle
        }
      );
    }
    let chartData = data;
    let option = {
      backgroundColor: '',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <br/>{c} ({d}%)'
      },
      color: colors,
      legend: {
        orient: 'vertical',
        y: 'center',
        x: '52%',
        right: fontChart(0.3),
        icon: 'rect',
        itemWidth: fontChart(0.13),
        itemHeight: fontChart(0.13),
        itemGap: fontChart(0.2),
        data: legendArr,
        formatter: (parmars: any) => {
          for (let i = 0; i < pieSeriesData.length; i++) {
            if (pieSeriesData[i].name === parmars) {
              if (parmars.length > 7) {
                let text1 = parmars.substring(0, 7);
                let text2 = parmars.substring(7);
                return `{a|${text1}}{b|${pieSeriesData[i].value}}{b|${unit}}\n{a|${text2}}`;
              } else {
                return `{a|${parmars}}{b|${pieSeriesData[i].value}}{b|${unit}}`;
              }
            }
          }
        },
        textStyle: {
          rich: {
            a: {
              fontSize: fontChart(0.23),
              lineHeight: fontChart(0.24),
              width: fontChart(1.6),
              color: '#fff'
            },
            b: {
              fontSize: fontChart(0.23),
              color: '#fff',
              lineHeight: fontChart(0.24)
            }
          }
        }
      },
      graphic: {
        elements: [{
          type: "image",
          z: 6,
          style: {
            image: imgSrc,
            width: fontChart(1.4),
            shadowBlur: 0,
            shadowColor: '#000',
            shadowOffsetX: '1',
            shadowOffsetY: '1',
          },
          left: '12%',
          top: "28%"
        }]
      },
      series: [
        {
          type: 'pie',
          radius: ['46%', '52%'],
          center: ['22%', '50%'],
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            }
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ]
    };
    return option
  };

  return (
    <ReactEcharts
      style={{ height: '100%' }}
      option={getOption()}
    />
  );
};


export default PieChart;