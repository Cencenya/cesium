import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface TravialProps extends RouteComponentProps {

}
const Travial: FC<TravialProps> = function ({ }) {
  return (
    <>
      <Drawer></Drawer>
      <Drawer></Drawer>
    </>
  )

}
export default Travial;