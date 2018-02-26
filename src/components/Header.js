import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Auth from 'j-toker';

class Header extends Component {
  constructor() {
    super();
    this.onUserLogOut = this.onUserLogOut.bind(this);
  }

  onUserLogOut(e) {
    Auth.signOut()
    .then((resp) => {
      console.log(resp)

    })
    .fail((resp) => {
      console.log(resp)
    });
  }

  render() {
    return (
      <div className="row justify-content-center">
        <nav className="navbar navbar-expand-lg navbar-light">
            <Link to={ '/' } className="navbar-brand" >VOLO</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to={ '/locations' } className="nav-link" >Locations</Link>
                </li>
                <li className="nav-item">
                  <Link to={ '/login' } className="nav-link" >Sign Up | Log In</Link>
                </li>
                <li className="nav-item">
                  <button onClick={ this.onUserLogOut } className="nav-link">Log Out</button>
                </li>
              </ul>
            </div>
          </nav>
      </div>
    );
  }
}

export default Header;
