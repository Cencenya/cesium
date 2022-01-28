import React, { forwardRef, useEffect, useState, FC } from "react";
import LineChart from '../components/chart/lineChart';

interface CardLayoutProps {
  config: any
  // background: any,
  Chart?: React.ReactElement

}
const CardLayout: FC<CardLayoutProps> = function ({ config, Chart }) {
  useEffect(() => {
    console.log(config);

  }, [])
  return (
    <div className="card">
      <div className="card-title">
        <h1>{config ? config.title : void 0}</h1>
        {/* <img src={background} alt="" /> */}
        <div className="card-bg"></div>
      </div>
      <div className="card-box">
        {Chart ? Chart : void 0}
      </div>

    </div>
  )
}
export default CardLayout