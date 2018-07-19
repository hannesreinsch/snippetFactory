import React, { Component } from 'react';
import api from '../api';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink
} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.css'






class NavbarTop extends Component {
  constructor(props) {
    super(props);
    api.loadUser();

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleLogoutClick(e) {
    api.logout()
  }


  render() {
    let user= api.loadUser().username

    return (
      <div>
        <Navbar color="white" light expand="sm">
          <div className="container">
          <NavbarBrand to="/" tag={Link}>snippetFactoryJS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
               { api.isLoggedIn() &&
                <NavItem>
                  <NavLink to="/create-snippet" className="nav-link border-right">Create a Snippet</NavLink>
                </NavItem>}


               {api.isLoggedIn() &&
                <NavItem>
                <NavLink to={`/profile/${user}`}  className="nav-link border-right">My Profile</NavLink>
                </NavItem>}

                {api.isLoggedIn() &&
                <NavItem>
                  <a className="nav-link" href="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</a>
                </NavItem>}

                {!api.isLoggedIn() &&
                <NavItem>
                <NavLink to="/login" className="nav-link border-right">Login</NavLink>
                </NavItem>}
                
                {!api.isLoggedIn() &&
                <NavItem>
                <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
                </NavItem>}
            </Nav>
          </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}


export default NavbarTop;
