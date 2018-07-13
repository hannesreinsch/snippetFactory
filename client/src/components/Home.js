import React, { Component } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';



class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      heading: "",
      code: "",
      snippets: [],
      userFavoritesIds: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSnippetSubmit = this.handleSnippetSubmit.bind(this);
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
    .then(data => {
      console.log("STAR ADD SUCCESS", data)
    })
  }


  handleStarDelete(snippetId){
    api.removeFavorite(snippetId)
    .then(data => {
      console.log("STAR DELETE SUCCESS", data)
    })
  }


  handleSnippetSubmit(event) {
    event.preventDefault();
    let data = {
      code: this.state.code,
      heading: this.state.heading,
      _owner: api.loadUser()
    };
    api.postSnippet(data)
      .then(() => {
        this.setState({
          snippets: [...this.state.snippets, data],
          code: "",
          heading: "",
        })
      })
      .catch(err => {
        console.log('ERROR')
      })
  }


  componentDidMount() {
    api.getSnippets()
      .then(snippets => {
        this.setState({snippets})
      })
      .catch(err => console.log(err))

    let username = api.loadUser().username;
    api.getProfile(username)
      .then(profile => {
        let userFavoritesIds = profile._favorites.map(f => {
          return f._id
        })
        this.setState({userFavoritesIds});
        console.log(this.state.userFavoritesIds);    
      })
      .catch(err => console.log(err))
  }



  render() {                
    return (
      <div className="Home container">
        
        { api.isLoggedIn() &&
        <form>
          <input onChange={this.handleInputChange} value={this.state.heading} placeholder="Name your codeSnippet" name="heading" type="text"/>
          <input onChange={this.handleInputChange} value={this.state.code} placeholder="Paste codeSnippet" name="code" type="text"/>
          <input onClick={this.handleSnippetSubmit} value="Post Snippet" type="submit"/>
        </form>
        }
      
        <input onChange={this.handleInputChange} value={this.state.search} name="search" placeholder="Search snippets" type="search"/>


        <h2>Recent Posts</h2>
        {this.state.snippets.map((s) => {
        return(
          <div key={s._id}>
            <ul>
              <li>{s.heading}</li>
              <li>{s.code}</li>
              <Link to={`/profile/${s._owner.username}`}>{s._owner.username}</Link>
            </ul>

             {(this.state.userFavoritesIds.includes(s._id)) ?
            
                <button onClick={() => this.handleStarDelete(s._id)}>StarDelete</button> : 
                
                <button onClick={() => this.handleStarSubmit(s._id)}>StarAdd</button>}

          </div>
        )} )}
      </div>
    );
  }
}

export default Home;
