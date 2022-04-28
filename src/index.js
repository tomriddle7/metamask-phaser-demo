import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import { events } from "./stores/store";
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={events}>
    <div id="game-container">
      <App />
    </div>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
