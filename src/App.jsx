import { useState } from 'react'
import './App.css'
import 'tachyons'
import Login from './components/login/Login.jsx'
// import Register from './components/register/Register.jsx'
import Home from './components/middlePart/Home.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      <Login/>
      {/* <Register/> */}
      <Home/>
    </>
  )
}

export default App
