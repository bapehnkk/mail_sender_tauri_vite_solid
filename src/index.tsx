/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import './styles/base.css';
import './styles/components.css';
import './styles/fonts.css';
import './styles/pace.css';
import './styles/utilities.css';

import App from "./App";

render(
  () =>
  <Router>
    <App />
  </Router>,
  document.getElementById("root") as HTMLElement
)
