import React, { forwardRef, useEffect, useState, FC } from "react";

interface CardLayoutProps {
  config: any
  // background: any
}
const CardLayout: FC<CardLayoutProps> = function ({ config, }) {
  useEffect(() => {
  }, [])
  return (
    <div className="card">
      <div className="card-title">
        <h1>{'总体情况'}</h1>
        {/* <img src={background} alt="" /> */}
        <div className="card-bg"></div>
      </div>

    </div>
  )
}
export default CardLayout