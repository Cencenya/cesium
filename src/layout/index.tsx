import { Suspense, Component } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import Header from './Header'
import { Divider, Spin } from 'antd';
import routes from "../config/routers";
interface Props extends RouteComponentProps {
  store: { [k: string]: any; loading?: boolean };
}

interface States {

}
class Layout extends Component<Props, States>{
  state = {
    drawerVisible: false,
    store: {}
  }
  componentDidMount() {
    routes.map((i, k) => {
      console.log(i.icon)
    });


  }
  componentDidUpdate({ location, ...rest }) {
    const { pathname } = this.props.location;
    const { store } = this.state;
    let r = routes.find((r) => r.path == pathname);
    if (r && !store[r.key]) {
      const { key, configPath } = r;
      configPath && this.getPageConfig({ key, configPath });
      Object.assign(this.props.location, { state: { key: r.key } });
    }
  }
  //页面预设 json 数据
  getPageConfig = ({ key, configPath }) => {
    const { store } = this.state;

    // this.setStore({ loading: true });
    fetch(configPath, { mode: "cors" })
      .then((r) => r.json())
      .then((r) => {
        this.setState({ [key]: r, loading: false });
      });

  };
  render() {
    const { drawerVisible, store } = this.state
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
              // component={r.component}
              >
                <r.component config={store[r.key]} ></r.component>
              </Route>
            ))}
          </Switch>
        </Suspense>
      </div>
    )
  }
}
export default withRouter(Layout);