import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import "./index.css";
import App from "./App";
import axios from "axios";
import store from "../src/redux/store";
import {Provider} from "react-redux";
import "./index.css"
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
