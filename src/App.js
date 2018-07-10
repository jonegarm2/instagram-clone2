import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to my nightmare</h1>
        </header>
        <p className="App-intro">
          To get started, edit your life <code>src/App.js</code> and save to reload.
        </p>
        <p>
          These are getting shorter and shorter
        </p>
      </div>
    );
  }
}

export default App;
