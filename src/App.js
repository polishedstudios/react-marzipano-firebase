import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { If, Then } from 'react-if-elseif-else-render';
import './style/Nav.css';

import { logo } from './images/images';
import LoginPage from './components/Login';
import TourPage from './components/Tour';

const user = localStorage.getItem("user");

export default function AppRouter() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Router>
      <div className="router">
        <Navbar bg="light" expand="lg">
          <Container>
            {/* Logo */}
            <Navbar.Brand className="navbar-brand">
              <div className="logo">
                <img
                  src={logo}
                  height="100%"
                  alt="Polished Studios"
                />
              </div>
              <div className="vertical-bar"></div>
              <div className="title">Interactive Virtual Tour</div>
            </Navbar.Brand>
            {/* Nav items */}
            <If condition={user}>
              <Then>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Nav>
                    <Nav.Link onClick={handleShow} className="nav-profile">
                      Profile
                    </Nav.Link>
                    <Nav.Link as={Link} to="/signout">
                      Sign out
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                {/* Mobile menu button */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </Then>
            </If>
          </Container>
        </Navbar>

        <div id="profile">
          <Offcanvas placement="start" show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <h2>{user}</h2>
              Profile information can be displayed here.
            </Offcanvas.Body>
          </Offcanvas>
        </div>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Home />
          </Route>
          <Route exact path="/tour">
            <Home />
          </Route>
          <Route path="/signout">
            <Signout />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  if (!user) {
    window.history.replaceState(null, "Login", "/login");
    return Login();
  }
  else if (user) {
    window.history.replaceState(null, "Tour", "/tour");
    return Tour();
  }
}

function Login() {
  return (
    <div style={{ backgroundColor: "black", height: '100%' }}>
      <LoginPage />
    </div>
  );
}

function Tour() {
  return (
    <div style={{ backgroundColor: "black", height: '100%' }}>
      <TourPage />
    </div>
  );
}

function Signout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}