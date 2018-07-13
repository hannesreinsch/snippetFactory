import React, { Component } from 'react';
import api from '../api';

class Profile extends Component {
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
  

  render() {   
    return (
      
      this.state.profile &&
       <div>
        <h1>Profile</h1>
        <p>{this.state.profile.username}</p>
        <p>{this.state.profile.email}</p>

        {this.state.profile._favorites.map(f => {
          return(
            <div key={f._id}>
              <ul>
                <li>{f.heading}</li>
                <li>{f.code}</li>
              </ul>
            </div>
          )
        })}

      </div>
    );
  }
}

export default Profile;
