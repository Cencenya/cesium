import { Suspense, Component } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import Header from './Header'
import { Divider, Spin } from 'antd';
import routes from "../config/routers";
interface Props extends RouteComponentProps {

}

interface States {
  store: { [k: string]: any; },
  loading: boolean
}
class Layout extends Component<Props, States>{
  state = {
    drawerVisible: false,
    store: {},
    loading: false
  }
  componentDidMount() {
    console.log('mount');
    let r = routes.find((r) => r.path == window.location.pathname);
    const { configPath } = r
    fetch(configPath, { mode: "cors" })
      .then((r) => r.json())
      .then((r) => {
        this.setState({
          store: r,

        })
      });

  }
  componentDidUpdate() {
    console.log('update');
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
    const { store, loading } = this.state;
    // this.setStore({ loading: true });
    if (!loading) {
      fetch(configPath, { mode: "cors" })
        .then((r) => r.json())
        .then((r) => {
          this.setState({
            store: r,
            loading: true
          })
        });
    }


  };
  render() {
    const { drawerVisible, store, loading } = this.state
    return (
      <div className={"container"}>
        <Header title={""} enTitle={""} bg={!drawerVisible} />
        {
          loading && <Suspense fallback={
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
                >
                  <r.component config={store} ></r.component>
                </Route>
              ))}
            </Switch>
          </Suspense>
        }

      </div>
    )
  }
}
export default withRouter(Layout);