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
    
    let user= api.loadUser().username
    console.log(user)
    
    return (
      
      <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">

          <Link className="navbar-brand" to="/">snippetFactory</Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">

                <Link className="nav-link" to="/secret">Secret</Link>

              </li>
              {api.isLoggedIn() &&
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${user}`}>My Profile</Link> 
                </li>}

              {api.isLoggedIn() && 
                <li className="nav-item">
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
          </div>
        </div>
      </nav>
      </div>

    );
  }
}

export default Navbar;
