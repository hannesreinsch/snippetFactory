import React, { Component } from 'react';
import api from '../api';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';



class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
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
    api.login(this.state.email, this.state.password)
      .then(result => {
        console.log('SUCCESS!')
        this.props.history.push("/") // Redirect to the home page
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
          <h2>Login</h2>
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="text" value={this.state.email} onChange={(e) => {this.handleInputChange("email", e)}} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" value={this.state.password} onChange={(e) => {this.handleInputChange("password", e)}} />
        </FormGroup>
        <Button onClick={(e) => this.handleClick(e)}>Login</Button>
      </Form>
      </div>
    );
  }
}

export default Login;
