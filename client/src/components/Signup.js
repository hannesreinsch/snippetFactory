import React, { Component } from 'react';
import api from '../api';
import { Form, FormGroup, Label, Input, FormFeedback, FormText, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css'




class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      username: "",
      password: "",
    }
  }

  handleInputChange(stateFieldName, event) {
    let newState = {}
    newState[stateFieldName] = event.target.value
  
    this.setState(newState)
  }

  handleClick(e) {
    e.preventDefault()
    let data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    }
    api.signup(data)
      .then(result => {
        console.log('SUCCESS!')
        this.props.history.push("/login") // Redirect to the login page
      })
      .catch(err => {
        console.log('ERROR')
      })
  }




  render() {
    return (
      <div class="container mt-5">
      <Form>
        <FormGroup>
          <h1>Sign Up</h1>
        </FormGroup>
        <FormGroup>
          <Label>Username</Label>
          <Input value={this.state.username} onChange={(e) => {this.handleInputChange("username", e)}} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="text" value={this.state.email} onChange={(e) => {this.handleInputChange("email", e)}} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" value={this.state.password} onChange={(e) => {this.handleInputChange("password", e)}} />
        </FormGroup>
        <Button onClick={(e) => this.handleClick(e)}>Signup</Button>
        
      </Form>
      </div>
    );
  }
}





export default Signup;
