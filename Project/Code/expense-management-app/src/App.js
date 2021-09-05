import React from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
  state = {
    appName: '',
  };

  componentDidMount() {
    axios.get("/appname").then((response) => {
      this.setState({ appName: response.data });
    });
  }

  render() {
    const { appName } = this.state;
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>{appName} React App</h1>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
  }
}
