import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Roommates</h1>
          <div className="loginBox">
            <input type="email" placeholder="email"/>
            <input type="password" placeholder="password"/>
            <button>Submit</button>
          </div>
          <hr/>
          <button>Sign Uo</button>
        </header>
      </div>
    );
  }
}

export default App;
