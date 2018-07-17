import React, { Component } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, CardLink, Button, Card, CardTitle, CardText } from 'reactstrap';



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
        // mostPopularSnippets: [...this.state.mostPopularSnippets, snippetId]
      })
    })
  }


  handleStarDelete(snippetId){
    api.removeFavorite(snippetId)
    .then(_ => {
      const newFavoritesIds= [...this.state.userFavoritesIds];
      // const newMostPopularSnippets = [...this.state.mostPopularSnippets];

      newFavoritesIds.forEach((e, i) => {
        if (e === snippetId){
          newFavoritesIds.splice(i, 1)
        }
      })

      // newMostPopularSnippets.forEach((e, i) => {
      //   if (e === snippetId){
      //     newMostPopularSnippets.splice(i, 1)
      //   }
      // })

    this.setState({
      userFavoritesIds: newFavoritesIds,
      // mostPopularSnippets: newMostPopularSnippets
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
      <div className="container mt-5">
        
      
        <Form className="mt-5">
        <FormGroup>
          <h4>Search all codeSnippets</h4>
        </FormGroup>
        <FormGroup>
        <Input onChange={this.handleInputChange} value={this.state.search} name="search" placeholder="Search snippets" type="search"/>
        </FormGroup>
        </Form>
        
        { api.isLoggedIn() &&
        <Form>
        <FormGroup>
          <h4>Share a Snippet</h4>
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Heading</Label>
          <Input type="text" placeholder="How to listen to click event in JavaScript
" onChange={this.handleInputChange} value={this.state.heading} name="heading" />
        </FormGroup>
        <FormGroup>
          <Label>Past your Code</Label>
          <Input onChange={this.handleInputChange} value={this.state.code} placeholder='element.addEventListener("click", event => {
  console.log("Element clicked");
});' name="code" type="text" />
        </FormGroup>
        <Button onClick={this.handleSnippetSubmit} type="submit">Submit</Button>
        </Form>
        }



        <h2>Recently posted Snippets</h2>
        {this.state.snippets.map((s) => {
        return(

        <div key={s._id}>
        <Card body>
          <CardLink href={`/profile/${s._owner.username}`}>{s._owner.username}</CardLink> 
          <CardTitle>{s.heading}</CardTitle>
          <CardText><pre>{s.code}</pre></CardText>

          {(this.state.userFavoritesIds.includes(s._id)) ?
          <Button onClick={() => this.handleStarDelete(s._id)}>StarDelete</Button> :  
          <Button onClick={() => this.handleStarSubmit(s._id)}>StarAdd</Button>}

          {(api.loadUser().username === s._owner.username) &&
          <Button onClick={() => this.handleSnippetDelete(s._id)}>Delete Snippet</Button>}
        </Card>
           
        </div>


          
        )} )}

        <h2>Most popular Snippets</h2>
        {this.state.mostPopularSnippets.map((s) => {
        return(

        <div key={s._id}>
        <Card body>
          <CardLink href={`/profile/${s._owner.username}`}>{s._owner.username}</CardLink> 
          <CardTitle>{s.heading}</CardTitle>
          <CardText><pre>{s.code}</pre></CardText>

          {(this.state.userFavoritesIds.includes(s._id)) ?
          <Button onClick={() => this.handleStarDelete(s._id)}>StarDelete</Button> :  
          <Button onClick={() => this.handleStarSubmit(s._id)}>StarAdd</Button>}

          {(api.loadUser().username === s._owner.username) &&
          <Button onClick={() => this.handleSnippetDelete(s._id)}>Delete Snippet</Button>}
        </Card> 
        </div>

         )} )}
      </div>
    );
  }
}

export default Home;
