import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//redux
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./store/PostFetch";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

import App from './App.jsx'
import 'tachyons'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
  </StrictMode>,
)
