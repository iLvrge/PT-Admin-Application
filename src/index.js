import React from "react";
import ReactDOM from "react-dom";

import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import * as serviceWorker from "./serviceWorker";
import App from "./components/App";
import GlobalLoading from "./components/common/GlobalLoading";
import Themes from "./themes";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import store from './reducers/store/configureStore';
import { queryClient } from './lib/queryClient';

/*
 * Stylesheets are imported here, in the order they must apply.
 *
 * Create React App bundled every imported stylesheet up front, so source order
 * across files barely mattered. Vite orders CSS by the module graph instead, so
 * a sheet imported inside a component lands AFTER this file's and wins ties
 * against the app's own rules. Keeping the app's index.css last leaves it in
 * control, as it was under CRA.
 */
import './styles/tailwind.css';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={Themes.default}>
            {/* Reports what the app is waiting for; renders nothing when idle. */}
            <GlobalLoading/>
            <App/>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </Router>
  </Provider>,
  document.getElementById("root"),
);
serviceWorker.register();
//serviceWorker.unregister();
