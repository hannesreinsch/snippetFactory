import React, { Component } from 'react';
import api from '../api';

window.api = api

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      heading: "",
      code: "",
      snippets: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSnippetSubmit = this.handleSnippetSubmit.bind(this);
    this.handleStarSubmit = this.handleStarSubmit.bind(this);
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
    console.log(snippetId);
    api.postFavorite(snippetId)
    .then(data => {
      console.log("SUCCESS", data)
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
        {this.state.snippets.map((s, i) => {
        return(
          <div key={s._id}>
            <ul>
              <li>{s.heading}</li>
              <li>{s.code}</li>
              <li>{s._owner.username}</li>
            </ul>
            <button onClick={() => this.handleStarSubmit(s._id)}>Star</button>
          </div>
        )} )}
      </div>
    );
  }
}

export default Home;
