import ReactDOM from "react-dom";

import App from "./App";

import {AuthProvider} from "./store/AuthProvider";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
