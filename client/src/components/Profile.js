import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import "./Home.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt, faThumbsDown, faThumbsUp);


class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      profile: null,
      userFavoritesIds: [],

    }
    this.handleStarDelete = this.handleStarDelete.bind(this);
    this.handleSnippetDelete = this.handleSnippetDelete.bind(this);
  }


  handleSnippetDelete(snippetId) {
    api.deleteSnippet(snippetId)
    .then(_=> {
    let username = this.props.match.params.username;

      api.getProfile(username)
      .then(profile => {
        this.setState({profile})   
        let userFavoritesIds = profile._favorites.map(f => {
          return f._id
        })
        this.setState({userFavoritesIds});         
      })
      .catch(err => console.log(err))
    })
  }



  handleStarSubmit(snippetId){
    api.postFavorite(snippetId)
    .then(_ => {
      this.setState({
        userFavoritesIds: [...this.state.userFavoritesIds, snippetId],
      })
    })
  }

  handleStarDelete(snippetId){
    api.removeFavorite(snippetId)
    .then(_ => {
      const newFavoritesIds= [...this.state.userFavoritesIds];

      newFavoritesIds.forEach((e, i) => {
        if (e === snippetId){
          newFavoritesIds.splice(i, 1)
        }
      })

    this.setState({
      userFavoritesIds: newFavoritesIds,
      })
     } )
  } 



  componentDidMount() {
    let username = this.props.match.params.username;

    api.getProfile(username)
      .then(profile => {
        this.setState({profile})   
        let userFavoritesIds = profile._favorites.map(f => {
          return f._id
        })
        this.setState({userFavoritesIds});         
      })
      .catch(err => console.log(err))

    }
  

  render() {   
    return (
      
      this.state.profile &&
       <div className="body">
       <div className="general-container">
         <div className="width">


        <h1>{this.state.profile.username}</h1>
        
      {(api.loadUser().username === this.state.profile.username) &&
       <Link to={`/profile/${this.state.profile.username}/edit`}>Edit</Link>
       }

  <div className="all-snippets-container">
        <h2>Saved Snippets</h2>
        

        {this.state.profile._favorites.map(f => {
        return(

        <div className="snippet-card" key={f._id}>

          <div className="flex-header">
            <div>
              <h4>{f.heading}</h4>
            </div>

            <div className="star">
            {(this.state.userFavoritesIds.includes(f._id)) ?
              <a onClick={() => this.handleStarDelete(f._id)}>
              <FontAwesomeIcon icon="thumbs-down" />
              </a> :
              <a onClick={() => this.handleStarSubmit(f._id)}>
              <FontAwesomeIcon icon="thumbs-up" />
              </a>}
            </div>
          </div>


          <pre>
            <code>
            {f.code}
            </code>
          </pre>

          <div className="flex-header">
          <Link to={`/profile/${f._owner.username}`}>{f._owner.username}</Link> 

          {(api.loadUser().username === f._owner.username) &&
          <a onClick={() => this.handleSnippetDelete(f._id)}>
          <FontAwesomeIcon icon="trash-alt" />
          </a>
          }

          </div>
            <p>{api.formatDate(f.createdAt)}</p> 
          </div> 
  
        )
        })}

        </div>

         

         
      </div>
      </div>
      </div>
    );
  }
}

export default Profile;
