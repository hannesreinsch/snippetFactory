import React, { Component } from 'react';
import api from '../api';
import { Link } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Code from 'react-code-prettify';
import { Button, Col, Form, FormGroup, Row, Input, Card} from 'reactstrap';

library.add(faTrashAlt, faThumbsDown, faThumbsUp);


class CreateSnippet extends Component {
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
      showPostForm: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSnippetSubmit = this.handleSnippetSubmit.bind(this);
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




  render() {
    return (
      <div className="container mt-5">
        <h1>Create Snippet</h1>
        <Form>
        <FormGroup row>
          <Col>
          <Input 
          type="text" 
          placeholder="How to listen to click event in JavaScript" 
          onChange={this.handleInputChange} 
          value={this.state.heading} name="heading"
          className="post-heading" />
          </Col>
        </FormGroup>

      
        <FormGroup row>
          <Col>
            <Input
            onChange={this.handleInputChange} 
            value={this.state.code} 
            placeholder='element.addEventListener("click", event => {console.log("Element clicked");});' 
            type="textarea" name="code" />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col>
            <Button onClick={this.handleSnippetSubmit} type="submit">Create</Button>
          </Col>
        </FormGroup>
      </Form>
      </div>
    )
  }
}

export default CreateSnippet;
