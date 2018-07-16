import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Edit from './Edit';
import Secret from './Secret';
import Login from './Login';
import Signup from './Signup';
import api from '../api';
import NavbarTop from './Navbar';

class App extends Component {
  constructor(props) {
    super(props)
    api.loadUser();
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {                
    return (
      <div className="App">
        <NavbarTop />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile/:username" exact component={Profile} />
          <Route path="/profile/:username/edit" exact component={Edit} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/login" exact component={Login} />
          <Route path="/secret" exact component={Secret} />
          <Route render={() => <h2>404</h2>} />
        </Switch>        
      </div>
    );
  }
}

export default App;
