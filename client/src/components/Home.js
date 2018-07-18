import React, { Component } from 'react';
import api from '../api';
import "./Home.css";
import { Link } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt, faThumbsDown, faThumbsUp);



class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      heading: "",
      code: "",
      snippets: [],
      mostPopularSnippets: [],
      userFavoritesIds: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSnippetSubmit = this.handleSnippetSubmit.bind(this);
    this.handleSnippetDelete = this.handleSnippetDelete.bind(this);
    this.handleStarSubmit = this.handleStarSubmit.bind(this);
    this.handleStarDelete = this.handleStarDelete.bind(this);
  }


  handleInputChange(event) {
    const target = event.target;
    const code = event.target.value;
    const heading = event.target.value;
    const search = event.target.value;
    const name = target.name;

    this.setState({
      [name]: search,
      [name]: heading,
      [name]: code,
    });
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


  handleSnippetSubmit(event) {
    event.preventDefault();
    let data = {
      code: this.state.code,
      heading: this.state.heading,
      _owner: api.loadUser()
    };
    api.postSnippet(data)
      .then(res => {
        this.setState({
          snippets: [...this.state.snippets, res.snippet],
          code: "",
          heading: ""
        })
        api.getSnippets()
        .then(snippets => {
          this.setState({snippets})
        }) 
        api.getPopularSnippets()
        .then(mostPopularSnippets => {
          this.setState({mostPopularSnippets})
        })
        .catch(err => console.log(err))
      })
      .catch(err => {
        console.log('ERROR', err)
      })
  }


  handleSnippetDelete(snippetId) {
    api.deleteSnippet(snippetId)
    .then(_ => {
        api.getSnippets()
        .then(snippets => {
          this.setState({snippets})
        }) 
        api.getPopularSnippets()
        .then(mostPopularSnippets => {
          this.setState({mostPopularSnippets})
        })
        .catch(err => console.log(err))
      })
      .catch(err => {
        console.log('ERROR', err)
      })
  }


  componentDidMount() {
    api.getSnippets()
      .then(snippets => {
        this.setState({snippets})
      })
      .catch(err => console.log(err))

      api.getPopularSnippets()
      .then(mostPopularSnippets => {
        this.setState({mostPopularSnippets})
      })
      .catch(err => console.log(err))

    let username = api.loadUser().username;
    api.getProfile(username)
      .then(profile => {
        let userFavoritesIds = profile._favorites.map(f => {
          return f._id
        })
        this.setState({userFavoritesIds});    
      })
      .catch(err => console.log(err))
  }



  render() {                
    return (
      <div className="body">
        <div className="general-container">
      
          <div className="header width">
          <h1>=> Search for the Snippet you need <br/>=> Copy <br/>=> Paste</h1>
          </div>
        
    


        <div id='search-box'>
          <form id='search-form'>

            <input onChange={this.handleInputChange} value={this.state.search} 
            name="search" placeholder="Iterate over array js..." 
            type="text" id='search-text'/>

            {/* <button id='search-button' type='submit'>                     
               <span>Search</span>
            </button> */}
          </form>
        </div>


        
        { api.isLoggedIn() &&
        <form className="post-form">
          <h4>Share a Snippet</h4>

    
          <label className="post-form-label" htmlFor="heading">Heading</label>
          <input 
          type="text" 
          placeholder="How to listen to click event in JavaScript" 
          onChange={this.handleInputChange} 
          value={this.state.heading} name="heading"
          className="post-heading" />


          <label className="post-form-label" htmlFor="code">Paste your Code</label>
          <input 
          onChange={this.handleInputChange} 
          value={this.state.code} 
          placeholder='element.addEventListener("click", event => {console.log("Element clicked");});' 
          name="code" type="text"
          className="post-code" />
        
          <button className="post-button" onClick={this.handleSnippetSubmit} type="submit">Submit</button>
        </form>
        }



      <div className="all-snippets-container">
        <h2>Recent</h2>

        {this.state.snippets.map((s) => {
        return(

        <div className="snippet-card" key={s._id}>

          <div className="flex-header">
            <div>
              <h4>{s.heading}</h4>
            </div>
            <div className="star">
              {(this.state.userFavoritesIds.includes(s._id)) ?
              <a onClick={() => this.handleStarDelete(s._id)}>
              <FontAwesomeIcon icon="thumbs-down" />
              </a> :
              <a onClick={() => this.handleStarSubmit(s._id)}>
              <FontAwesomeIcon icon="thumbs-up" />
              </a>}
            </div>
          </div>


          <pre>
            <code>
            {s.code}
            </code>
          </pre>

          <div className="flex-header">
          <Link to={`/profile/${s._owner.username}`}>{s._owner.username}</Link> 

          {(api.loadUser().username === s._owner.username) &&
          <a onClick={() => this.handleSnippetDelete(s._id)}>
          <FontAwesomeIcon icon="trash-alt" />
          </a>
          }
          </div>
          <p>{api.formatDate(s.createdAt)}</p>

        </div>
  
        )} )}
      </div>





      



        <div className="all-snippets-container">
        <h2>Popular</h2>

        {this.state.mostPopularSnippets.map((s) => {
        return(

        <div className="snippet-card" key={s._id}>

          <div className="flex-header">
            <div>
              <h4>{s.heading}</h4>
            </div>
            <div className="star">
              {(this.state.userFavoritesIds.includes(s._id)) ?
              <a onClick={() => this.handleStarDelete(s._id)}>
              <FontAwesomeIcon icon="thumbs-down" />
              </a> :
              <a onClick={() => this.handleStarSubmit(s._id)}>
              <FontAwesomeIcon icon="thumbs-up" />
              </a>}
            </div>
          </div>


          <pre>
            <code>
            {s.code}
            </code>
          </pre>

          <div className="flex-header">
          <Link to={`/profile/${s._owner.username}`}>{s._owner.username}</Link> 

          {(api.loadUser().username === s._owner.username) &&
          <a onClick={() => this.handleSnippetDelete(s._id)}>
          <FontAwesomeIcon icon="trash-alt" />
          </a>
          }
          </div>
          <p>{api.formatDate(s.createdAt)}</p>

        </div>
  
        )} )}
      </div>



      </div>
    </div>
    );
  }
}

export default Home;
