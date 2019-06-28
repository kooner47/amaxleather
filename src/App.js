import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Topbar from "./components/Topbar";
import Contact from "./components/Contact";
import "./css/main.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import * as utils from "./components/animations";
import Bottombar from "./components/Bottombar";
import Retailers from "./components/retailers/Retailers";
import Lightbox from "./components/LightBox";
import uuid from "uuidv4";
import ContentScreen from "./components/ContentScreen";
import HeadersScreen from "./components/HeadersScreen";
import CollectionScreen from "./components/CollectionScreen";

class App extends Component {
  state = {
    data: [],
    contactOpen: false,
    retailersOpen: false,
    isIE: false,
    lightBoxClicked: false,
    lightbox: false,
    lightboximg: null
  };
  componentWillMount = () => {
    const data = require("./data.json");
    this.setState({
      data: data,
      isIE: this.checkBrowser()
    });
  };
  openContact = () => {
    if (this.state.contactOpen === false) {
      this.setState({
        contactOpen: true,
        retailersOpen: false
      });
    } else {
      this.setState({
        contactOpen: false
      });
    }
  };
  openRetailers = () => {
    if (this.state.retailersOpen === false) {
      this.setState({
        retailersOpen: true,
        contactOpen: false
      });
    } else {
      this.setState({
        retailersOpen: false
      });
    }
  };
  checkOnHome = () => {
    return this.props.location.pathname === "/";
  };
  checkBrowser = () => {
    return /*@cc_on!@ || */ !!document.documentMode;
  };
  toggleLightBox = () => {
    this.setState({ lightBoxClicked: !this.state.lightBoxClicked });
  };
  showLightbox = () => {
    this.toggleLightBox();
    if (!this.state.lightbox) {
      this.setState({
        lightbox: true
      });
    } else {
      this.setState({
        lightbox: false
      });
    }
  };
  changeLightBox = imagesrc => {
    this.toggleLightBox();
    this.setState({ lightbox: true, lightboximg: imagesrc });
  };

  render() {
    const routes = Object.keys(this.state.data.headers).map(key =>
      <Route
        key={uuid()}
        path={"/" + key}
        render={(props) => {
          const data = this.state.data.headers[key];
          if (data.type === 0) {
            return (<ContentScreen
              data={data}
            />);
          } else if (data.type === 1) {
            return (<HeadersScreen
              data={data}
            />);
          } else {
            return (<CollectionScreen
              data={data}
              {...props}
              changeLightBox={this.changeLightBox}
            />);
          }
        }}
      />);
    return (
      <div className="App">
        {this.state.isIE ? (
          <React.Fragment>
            <div>
              <img
                src={require("./images/logo-tm.png")}
                className="logo-image"
                alt="logo"
                width="200px"
              />
            </div>
            <br />
            <br />
            <div>
              We apologize valued customer, but this website does not support
              Internet Explorer.
            </div>
            <br />
            <div>
              We recommend using Google Chrome, Mozilla Firefox, or Microsoft
              Edge instead.
            </div>
            <br />
            <div>
              Once again we are very sorry and thank you for visiting AMAX
              Leather!
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Topbar />
            <div className="main-container">
              {this.state.lightbox && (
                <Lightbox
                  image={this.state.lightboximg}
                  onClick={this.showLightbox}
                />
              )}
              <Navbar data={this.state.data.headers} onHome={this.checkOnHome()} />
              <TransitionGroup appear={true}>
                <CSSTransition
                  key={this.props.location.key}
                  timeout={500}
                  classNames="fade"
                  onEnter={node =>
                    utils.introPageAnimation(node, this.props.location.pathname)
                  }
                  onExit={node =>
                    utils.outroPageAnimation(node, this.props.location.pathname)
                  }
                >
                  <Switch location={this.props.location}>
                    {routes}
                    <Route
                      path="*"
                      render={() => (
                        <Home />
                      )}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
              <Contact
                open={this.state.contactOpen ? this.state.contactOpen : false}
                contact={this.openContact}
                data={this.state.data.contact}
              />
              <Retailers
                open={
                  this.state.retailersOpen ? this.state.retailersOpen : false
                }
                retailers={this.openRetailers}
                data={this.state.data.retailers}
              />
            </div>
            <Bottombar
              contact={this.openContact}
              retailers={this.openRetailers}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
