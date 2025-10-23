import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'tachyons'

//redux
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./store/PostFetch";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
