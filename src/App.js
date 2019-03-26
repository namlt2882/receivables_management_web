import React, { Component } from 'react';
import './App.scss';
import MyMenu from './components/common/my-menu';
import routes from './routes';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './components/common/login';
import { isLoggedIn } from './services/auth-service'
import NotFoundPage from './components/common/not-found';
import SideNav from './components/common/sideNav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.callBackFromSideNav = this.callBackFromSideNav.bind(this);
  }

  callBackFromSideNav(expanded) {
    this.setState({ expanded: expanded });
  }

  render() {
    isLoggedIn(() => { }, () => {
      var url = window.location.href;
      var lastPart = url.substr(url.lastIndexOf('/') + 1);
      if (lastPart != 'login') {
        window.location.href = '/login';
      }
    })
    return (
      <Router style={{ minHeight: '100%' }}>
        <Switch>
          <Route path='/login' exact={true} component={({ match, history }) => <LoginPage match={match} history={history} />} />
          {/* <Route path='' exact={false}> */}
          <div>
              <SideNav
                expanded={this.state.expanded}
                onToggle={(expanded) => {
                  this.setState({ expanded });
                }}
                callBack={this.callBackFromSideNav}
              />

            <main>
              <div className={!this.state.expanded ? "main-container" : "main-container-expanded"}>
                <MyMenu />
                <div className='row justify-content-center main-content arial'>
                  {this.privateContent(routes)}
                </div>
              </div>
            </main>
          </div>

          {/* </Route> */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
  privateContent = (routes) => {
    var result = routes.map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.main}
        />
      );
    });
    return result;
  }
}

export default App;
