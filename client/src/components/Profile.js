import React, { Component } from 'react';
import api from '../api';

class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      profiles: []
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
  

  render() {   
    return (
      <div>
        <h1>Profile</h1>
        {JSON.stringify(this.state.profile)}
      </div>
    );
  }
}

export default Profile;
