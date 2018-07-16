import React, { Component } from 'react';
import api from '../api';


class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {
      profile: null,
      email: "",
      password: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);

  }

  componentDidMount() {
    let username = this.props.match.params.username;
    api.getProfile(username)
      .then(profile => {
        this.setState({
          profile: profile,
          username: profile.username,
          email: profile.email,
          password: profile.password
        })        
      })
      .catch(err => console.log(err))
    }


    handleInputChange(event) {
      const target = event.target;
      const email = event.target.value;
      const password = event.target.value;
      const name = target.name;
  
      this.setState({
        [name]: email,
        [name]: password,
      });
    }

    handleUserUpdate(e){
      e.preventDefault();
      let username = this.state.profile.username;
      api.updateProfile(username, {username: this.state.username, email: this.state.email, password: this.state.password})
      .then(_ => {
        alert("handleUserInput:" + this.state.password);
        this.props.history.push("/");
      })
    }


    handleProfileDelete(){
      api.deleteProfile(this.state.profile.username)
      .then(_ => {
        api.logout();
        this.props.history.push("/")
      })
    }
  

  render() {   
    return (
      
      this.state.profile &&
        <div>
         <h1>Edit Profile</h1>
         <form>
          <input value={this.state.username} name="username" type="text"></input>
          <input onChange={this.handleInputChange} value={this.state.email} name="email" type="email"/>
          <input onChange={this.handleInputChange} value={this.state.password} name="password" type="text"/>
          <input onClick={this.handleUserUpdate} value="Save Changes" type="submit"/>
        </form>
          <button onClick={() => this.handleProfileDelete(this.state.profile.username)}>Delete Profile</button>
        </div>
    );
  }
}

export default Edit;
