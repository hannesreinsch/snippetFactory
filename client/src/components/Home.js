import React, { Component } from 'react';
import api from '../api';


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


  handleStarSubmit(event){
    event.preventDefault();

  }


  handleSnippetSubmit(event) {
    event.preventDefault();
    let data = {
      code: this.state.code,
      heading: this.state.heading,
      _owner: api.loadUser()
    };
    console.log("DATAAAAAA", data);
    api.postSnippet(data)
      .then(() => {
        console.log('Snippet Posted!')
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
        <form key={i+.4}>
        <ul key={i}>
          <li key={i+.3}>{s.heading}</li>
          <li key={i+.1}>{s.code}</li>
          <li key={i+.2}>{s._owner.username}</li>
        </ul>
        <input onClick={this.handleStarSubmit} value="Star" type="submit"/>
        </form>
        )} )}
      </div>
    );
  }
}

export default Home;
