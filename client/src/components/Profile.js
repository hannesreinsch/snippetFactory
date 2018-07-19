import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import "./Home.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faStarHalf, faStar } from '@fortawesome/free-solid-svg-icons';
import Code from 'react-code-prettify';
import { Button, Col, Row, Card} from 'reactstrap';


library.add(faTrashAlt, faStarHalf, faStar);


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

  componentDidUpdate(prevProps) {
    if (this.props.match.params.username === prevProps.match.params.username) return;
    
    this.componentDidMount()
  }
  
  
  render() {  
    return (
      
      this.state.profile &&
       <div className="container mt-5">

       <h1 className="margin-top-7">{this.state.profile.username}</h1>
        
      {(api.loadUser().username === this.state.profile.username) &&
       <Link to={`/profile/${this.state.profile.username}/edit`}>Edit</Link>
       }

  <div>
        <h2 className="margin-top-7 category-heading">Saved Snippets</h2>
        <hr/>

        {this.state.profile._favorites.slice(0).reverse().map(f => {
        return(
        
          <div className="mb-5" key={f._id}>

<Card className="p-5 d-flex justify-content-center">

<Row className="mb-3">
  <Col>
    <h4>{f.heading}</h4>
  </Col>

  <Col className="d-flex justify-content-end">
    {api.isLoggedIn() &&
      <div>
        {(this.state.userFavoritesIds.includes(f._id)) ?
        <Button onClick={() => this.handleStarDelete(f._id)}>
        <FontAwesomeIcon icon="star" />
        </Button> :
        <Button onClick={() => this.handleStarSubmit(f._id)}>
        <FontAwesomeIcon icon="star-half" />
        </Button>}
      </div>}
  </Col>
</Row>

<Row className="mb-4">
  <Col>
    <p>{api.formatDate(f.createdAt)}</p>
    <hr/>
  </Col>
</Row>

<Row className="mb-4">
  <Col>
    <Code codeString={f.code} language="javascript" />
  </Col>
</Row>
<Row className="mb-3">
  <Col className="mb-1">
    <Link to={`/profile/${f._owner.username}`}>{f._owner.username}</Link> 
  </Col>
  
</Row>
<Row>
  <Col>
    {(api.loadUser().username === f._owner.username) &&
    <Button onClick={() => this.handleSnippetDelete(f._id)}>
    <FontAwesomeIcon icon="trash-alt" />
    </Button>}
    </Col>
</Row>

</Card>

</div>
)
        })}

        </div>

         

         
      </div>
    );
  }
}

export default Profile;
