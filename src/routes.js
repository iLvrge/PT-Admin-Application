import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DashBoard from "./components/DashBoard/DashBoard";
import Queries from "./components/Queries";
import Auth from "./components/auth";

export default (
  <Switch>
    <Route path="/dashboard" component={DashBoard}/>
    <Route path="/queries" component={Queries}/>
    <Route path="/reset/:token" component={Auth}/>
    <Route path="/" component={Auth}/>
  </Switch> 
);