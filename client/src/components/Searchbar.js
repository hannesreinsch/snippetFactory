import React, { Component } from "react";
import "./Searchbar.css";
import { Input } from "reactstrap";

class Searchbar extends Component {
  render() {
    return (
      <div className="mb-5 mt-5">
        <h1 className="mb-5">Search... {this.props.search}</h1>
        <Input
          onChange={this.props.handleInputChange}
          value={this.props.search}
          name="search"
          placeholder="Iterate over array js..."
          type="text"
        />
      </div>
    );
  }
}

export default Searchbar;
