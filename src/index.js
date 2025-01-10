import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// index에 root라는 id를 가진 div에 app 컴포넌트를 렌더링
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
