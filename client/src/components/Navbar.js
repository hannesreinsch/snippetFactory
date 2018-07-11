import React, { Component } from 'react';

import { //Route, Switch, NavLink,
   Link } from 'react-router-dom';

import api from '../api';
// import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props)
    api.loadUser();
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {           
    
    
    
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>  
          <Link to="/secret">Secret</Link> 
          {api.isLoggedIn() &&  <Link to="profile/hannesreinsch">My Profile</Link> }
          {api.isLoggedIn() && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link> }
          {!api.isLoggedIn() && <Link to="/login">Login</Link> }
          {!api.isLoggedIn() && <Link to="/signup">Signup</Link> }
        </nav>
      </div>
    );
  }
}

export default Navbar;
