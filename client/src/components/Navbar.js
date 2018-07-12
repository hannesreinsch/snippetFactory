import React, { Component } from 'react';

import { //Route, Switch, NavLink,
   Link } from 'react-router-dom';

import api from '../api';
// import './Navbar.css';

import 'bootstrap/dist/css/bootstrap.css'

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
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">

          <Link className="navbar-brand" to="/">snippetFactory</Link>

          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">

                <Link className="nav-link" to="/secret">Secret</Link>

              </li>
              {api.isLoggedIn() &&
                <li class="nav-item">
                  <Link className="nav-link" to="profile/hannesreinsch">My Profile</Link> 
                </li>}

              {api.isLoggedIn() && 
                <li class="nav-item">
                  <Link className="nav-link" to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>
              </li>}
             
              {!api.isLoggedIn() &&
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>}

              {!api.isLoggedIn() && 
                <li className="nav-item">
                 <Link className="nav-link" to="/signup">Signup</Link> 
                </li>}

            </ul>
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>

          </div>
        </div>
      </nav>
      </div>
      
    );
  }
}

export default Navbar;
