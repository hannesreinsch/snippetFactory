import React, { Component } from 'react';
import api from '../api';
import "./Home.css";
import { Link } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Code from 'react-code-prettify';
import { Button, Col, Form, FormGroup, Row, Input, Card} from 'reactstrap';

library.add(faTrashAlt, faThumbsDown, faThumbsUp);


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      heading: "",
      code: "",
      snippets: [],
      recentSnippets: [],
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
          recentSnippets: [...this.state.recentSnippets, res.snippet],
          code: "",
          heading: ""
        })

        api.getSnippets()
        .then(snippets => {
          this.setState({snippets})
        })
        .catch(err => console.log(err))

        api.getRecentSnippets()
        .then(recentSnippets => {
          this.setState({recentSnippets})
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
        api.getRecentSnippets()
        .then(recentSnippets => {
          this.setState({recentSnippets})
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

    api.getRecentSnippets()
      .then(recentSnippets => {
        this.setState({recentSnippets})
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
        <div>
      

          <div className="header align-center">


            <h1 className="mb-5">Search... {this.state.search} </h1>
            <Input className="mb-5" onChange={this.handleInputChange} value={this.state.search} 
            name="search" placeholder="Iterate over array js..." 
            type="text" id='search-text'/>


    </div>





   {this.state.search !== "" &&
        <div className="all-snippets-container">

        <h2>Search Results for {this.state.search}</h2>
        {this.state.snippets.filter(e => {return e.heading.toLowerCase().includes(this.state.search.toLocaleLowerCase())}).map((s) => {
        return(

      

        <div className="snippet-card" key={s._id}>

          <div className="flex-header">
            <div>
              <h4>{s.heading}</h4>
            </div>

          {api.isLoggedIn() &&
            <div className="star">
              {(this.state.userFavoritesIds.includes(s._id)) ?
              <a onClick={() => this.handleStarDelete(s._id)}>
              <FontAwesomeIcon icon="thumbs-down" />
              </a> :
              <a onClick={() => this.handleStarSubmit(s._id)}>
              <FontAwesomeIcon icon="thumbs-up" />
              </a>}
            </div>}



          </div>

      

          <Code codeString={s.code} language="javascript" />

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
  }


 {this.state.search === "" &&
 <div>
   

        <h2 className="category-heading">Recent</h2>
        <hr/>

        {this.state.recentSnippets.map((s) => {
        return(

        <div className="mb-5" key={s._id}>

          <Card className="p-5 d-flex justify-content-center">

          <Row className="mb-3">
            <Col>
              <h4>{s.heading}</h4>
            </Col>
            <Col className="d-flex justify-content-end">
              {api.isLoggedIn() &&
                <div>
                  {(this.state.userFavoritesIds.includes(s._id)) ?
                  <a onClick={() => this.handleStarDelete(s._id)}>
                  <FontAwesomeIcon icon="thumbs-down" />
                  </a> :
                  <a onClick={() => this.handleStarSubmit(s._id)}>
                  <FontAwesomeIcon icon="thumbs-up" />
                  </a>}
                </div>}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <p>{api.formatDate(s.createdAt)}</p>
              <hr/>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Code codeString={s.code} language="javascript" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="mb-1">
              <Link to={`/profile/${s._owner.username}`}>{s._owner.username}</Link> 
            </Col>
            
          </Row>
          <Row>
            <Col>
              {(api.loadUser().username === s._owner.username) &&
              <a onClick={() => this.handleSnippetDelete(s._id)}>
              <FontAwesomeIcon icon="trash-alt" />
              </a>}
              </Col>
          </Row>
          
        </Card>

        </div>
        )} )}
        


</div>
 }





      


 {this.state.search === "" &&
 <div>
   

        <h2>Popular</h2>
        <br/>

        {this.state.mostPopularSnippets.map((s) => {
        return(

        <div className="mb-5" key={s._id}>
          <Row>
            <Col>
              <h4>{s.heading}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Code codeString={s.code} language="javascript" />
            </Col>
            <Col>
              {api.isLoggedIn() &&
                <div>
                  {(this.state.userFavoritesIds.includes(s._id)) ?
                  <a onClick={() => this.handleStarDelete(s._id)}>
                  <FontAwesomeIcon icon="thumbs-down" />
                  </a> :
                  <a onClick={() => this.handleStarSubmit(s._id)}>
                  <FontAwesomeIcon icon="thumbs-up" />
                  </a>}
                </div>}
            </Col>
          </Row>
          <Row>
            <Col>
              <p>{api.formatDate(s.createdAt)}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Link to={`/profile/${s._owner.username}`}>{s._owner.username}</Link> 
            </Col>
            
            <Col>
              {(api.loadUser().username === s._owner.username) &&
              <a onClick={() => this.handleSnippetDelete(s._id)}>
              <FontAwesomeIcon icon="trash-alt" />
              </a>
              }
              </Col>
          </Row>
        </div>
        )} )}


</div>
 }










      </div>
    </div>
    );
  }
}

export default Home;
