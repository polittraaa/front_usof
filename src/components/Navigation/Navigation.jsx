import { useState, useEffect } from "react"
import './Navigation.css'

function Navigation({ onRouteChange, isSignedIn, route, userId }) {
  const [searchBar, setSearchBar] = useState('');
  const [user, setUser] = useState(null);
    
  //user data
  useEffect(() => {
    if (isSignedIn && userId) {
      
      fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {setUser(data); console.log(data)})
        .catch(err => console.error("Error fetching user:", err));
    } else {
      setUser(null);
    }
  }, [isSignedIn, userId]);

  const avatar = user?.picture ? `http://localhost:3001/${user?.picture}` : 'http://localhost:3001/public/uploads/base_default.png'
  
  // console.log(avatar);
  // console.log(user);

  function onSearchBarChange(event) {
    setSearchBar(event.target.value);
  }
  //search 
  function handleSearch() {
      
  }

  function onViewProfileSubmit() {
    onRouteChange('registers')
  }

  //return home
  if (route === 'login' || route === 'register' || route === 'verify-email' || route === 'password-reset') {
  // if (route !== 'home') {
    return (
      <nav className="bar">
        <img src="./src/assets/logosvg.svg" alt="logo" className="logo"></img>
        <div className="links">
          <p className="logtext" onClick={() => onRouteChange('home')}>Home</p>
          <p className="logtext" onClick={() => onRouteChange('login')}>Log In</p>
          <p className="logtext" onClick={() => onRouteChange('register')}>Register</p>
        </div>
      </nav>
    );
  }
    
  return (
    <nav 
      className="bar">
      {/* // LOGO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7em'}}>
        <img src="./src/assets/logosvg.svg" alt="logo" className="logo"></img>
        <p onClick={() => onRouteChange('home')} className="usof">USOF</p>
      </div>
            
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            className="search-input"
            type="text"
            placeholder="Search for..."
            value={searchBar}
            onChange={onSearchBarChange}
          />
        </div>
      </form>
            
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7em', justifyContent: 'space-around' }}>
        {isSignedIn ? (
          <>
            {/* loged */}
              <button className="logbox" onClick={() => onRouteChange('create-post')}>
                <p className="logtext">Create +</p>
              </button>
              <p className="logtext link pointer" onClick={() => onRouteChange('logout')}>Log Out</p>
              <img className="ava mr2" src={avatar} onClick={onViewProfileSubmit} />
            </>
          ) : (
            // log
          <>
            <div className="logbox">
              <p className="logtext" onClick={() => onRouteChange('login')}>Log In</p>
            </div>
            <div className="logbox">
              <p className="logtext" onClick={() => onRouteChange('register')}>Register</p>
            </div>    
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;