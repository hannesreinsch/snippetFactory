import React, { Component } from 'react';
import api from '../api';


class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {
      profile: null
    }
  }

  componentDidMount() {
    let username = this.props.match.params.username;
    api.getProfile(username)
      .then(profile => {
        this.setState({profile})        
      })
      .catch(err => console.log(err))
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
          <p>{this.state.profile.username}</p>
          <p>{this.state.profile.email}</p>
          <button onClick={() => this.handleProfileDelete(this.state.profile.username)}>Delete Profile</button>
        </div>
    );
  }
}

export default Edit;
