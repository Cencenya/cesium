import { Suspense, Component } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import Header from './Header'
import { Divider, Spin } from 'antd';
import routes from "../config/routers";
interface Props extends RouteComponentProps {

}

interface States {

}
class Layout extends Component<Props, States>{
  state = {
    drawerVisible: false
  }
  componentDidMount() {
    routes.map((i, k) => {
      console.log(i.icon)
    });


  }
  render() {
    const { drawerVisible } = this.state
    return (
      <div className={"container"}>
        <Header title={""} enTitle={""} bg={!drawerVisible} />
        <Suspense fallback={
          <div className="global-spin">
            <Spin />
          </div>
        }>
          <Switch>
            {routes.map((r, i) => (
              <Route
                key={r.key}
                exact={r.exact}
                path={r.path}
                component={r.component}
              >
              </Route>
            ))}
          </Switch>
        </Suspense>
      </div>
    )
  }
}
export default withRouter(Layout);