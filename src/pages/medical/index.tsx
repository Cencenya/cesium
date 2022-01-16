import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface MedicalProps extends RouteComponentProps {

}
const Medical: FC<MedicalProps> = function ({ }) {
  return (
    <>
      <Drawer></Drawer>
      <Drawer></Drawer>
    </>
  )

}
export default Medical;