import React, { Component } from 'react';
import api from '../api';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

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
        <Navbar color="light" light expand="sm">
          <div className="container">
          <NavbarBrand href="/">snippetFactory</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
               {api.isLoggedIn() &&
                <NavItem>
                <NavLink href={`/profile/${user}`}>My Profile</NavLink>
                </NavItem>}

                {api.isLoggedIn() &&
                <NavItem>
                <NavLink onClick={(e) => this.handleLogoutClick(e)} href="/">Logout</NavLink>
                </NavItem>}

                {!api.isLoggedIn() &&
                <NavItem>
                <NavLink href="/login">Login</NavLink>
                </NavItem>}
                
                {!api.isLoggedIn() &&
                <NavItem>
                <NavLink href="/signup">Sign Up</NavLink>
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
