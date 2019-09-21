import React from 'react';
import logo from './logo.png';
import './App.css';
import { Navbar } from 'react-bootstrap'
import OrderSubmission from './OrderSubmission';
function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <img style={{ height: '100%', width: '2em', marginRight: '0.5em' }} alt="logo" src={logo} />

        <Navbar.Brand href="#home">Chevron | WorkOrders</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
      <OrderSubmission />
    </div>
  );
}

export default App;
