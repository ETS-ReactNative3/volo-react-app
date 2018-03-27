import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../containers/Home.js";
import About from "../containers/About.js";
import Login from "../containers/Login.js";
import Profile from "../containers/Profile.js";
import Locations from "../containers/Locations.js";
import Calendars from "../containers/Calendars.js";
import SingleLocation from "../containers/SingleLocation.js";

export default (
  <Switch>
      <Route exact path="/" component={ Home }/>
      <Route exact path="/about" component={ About }/>
      <Route exact path="/login" component={ Login }/>
      <Route exact path="/users/:id" component={ Profile }/>
      <Route exact path="/locations" component={ Locations }/>
      <Route exact path="/locations/:id" component={ SingleLocation }/>
      <Route exact path="/calendars/:id" component={ Calendars }/>
    </Switch>
)
