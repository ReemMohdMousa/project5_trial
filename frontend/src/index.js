import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import { Provider } from "react-redux";
import store from "./components/redux/stor";

import "mdb-react-ui-kit/dist/css/mdb.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);
