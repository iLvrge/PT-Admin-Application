import React from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';

import * as serviceWorker from "./serviceWorker";
import App from "./components/App";
import Themes from "./themes";
import { ThemeProvider } from "@material-ui/styles";
import store from './reducers/store/configureStore';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={Themes.default}>
        <App/>
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById("root"),
);
serviceWorker.register();
//serviceWorker.unregister();
