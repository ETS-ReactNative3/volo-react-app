import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Instagram from "../images/social_icons/instagram-logo.png";
import Twitter from "../images/social_icons/twitter-logo.png";
import Facebook from "../images/social_icons/facebook-logo.png";
import ContactModal from "./ContactModal.js";
import Alerts from "./Alerts.js"

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      showContactModal: false,
      email: "",
      alert: false,
      alertStyle: "",
      alertMsg: "",
    }
    this.showContactModal = this.showContactModal.bind(this);
    this.closeContactModal = this.closeContactModal.bind(this);
    this.onEmailInputChange = this.onEmailInputChange.bind(this);
    this.onEmailListSubmit = this.onEmailListSubmit.bind(this);
  }

  showContactModal() {
    this.setState({
      showContactModal: true
    });
  }

  closeContactModal() {
    this.setState({
      showContactModal: false
    });
  }

  onEmailInputChange(e) {
    this.setState({
        showContactModal: this.state.showContactModal,
        email: e.target.value,
    })
  }

  onEmailListSubmit(e) {
    e.preventDefault();
    console.log(this.state.email)
    let email = this.state.email
    this.setState({
      showContactModal: this.state.showContactModal,
      email: "",
    })
    $.post({
      url: `${process.env.REACT_APP_BACKEND_URL}/subscribe`,
      data: {
        email: email
      },
      success: (data) => {
        this.setState({
          alert: true,
          alertStyle: "alert alert-success",
          alertMsg: "Thank you!",
        })
      },
      error: (error) => {
        this.setState({
          alert: true,
          alertStyle: "alert alert-danger",
          alertMsg: "Oops...",
        })
      }
    })
  }

  render() {
    return(
      <div className="row justify-content-center footer-background">
        <div className="container">
          { this.state.showContactModal ? <ContactModal close={ this.closeContactModal }/> : null }
          <div className="row justify-content-center">
            <div className="col-lg-2 col-md-6">
              <p>VOLO</p>
              <div className="row">
                <ul>
                  <li><Link to={ '/locations' } className="footer-link" >Locations</Link></li>
                  <li><Link to={ '/about' } className="footer-link" >About</Link></li>
                  <li><Link to={ '/login' } className="footer-link" >Log In</Link></li>
                  <li><Link to={ '/login' } className="footer-link" >Sign Up</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <p>CONNECT</p>
              <br></br>
              <div className="row">
                <div className="col-3">
                  <a href="..."><img src={ Instagram } alt="instagram-icon"></img></a>
                </div>
                <div className="col-3">
                  <a href="..."><img src={ Twitter } alt="twitter-icon"></img></a>
                </div>
                <div className="col-3">
                  <img src={ Facebook } alt="facebook-icon"></img>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <p>STAY TUNED</p>
              <br></br>
              <div className="row">
                <div className="col-12">
                  { this.state.alert ?
                  <Alerts style={ this.state.alertStyle } alert={ this.state.alertMsg } /> : null
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <input
                    type="email"
                    className="form-control"
                    onChange={this.onEmailInputChange}
                    placeholder="Join our email list"
                  />
                </div>
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-light"
                    onClick={ this.onEmailListSubmit }>Submit</button>
                </div>
              </div>
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="col-lg-2 col-md-6 offset-md-1">
                <p>CONTACT</p>
                <br></br>
                <button className="plain-button" onClick={ this.showContactModal }>Contact Us</button>
            </div>
          </div>
          <div className="row justify-content-center copyright">
            <small>&copy; 2018 VOLO All rights reserved</small>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer;
