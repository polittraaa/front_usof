import { useState, useEffect } from "react"
import './Navigation.css'

function Navigation({ onRouteChange, isSignedIn, route, userId }) {
  const [searchBar, setSearchBar] = useState('');
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
    
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

  function onSearchBarChange(event) {
    setSearchBar(event.target.value);
  }
  //search 
  function handleSearch(event) {
    event.preventDefault();

    const searchTerm = searchBar.trim();
    if (!searchTerm) return;

    const page = 1;
    const limit = 5;

    setIsSearching(true);

    fetch(`${import.meta.env.VITE_API_URL}/posts/search?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        // console.log('Search results:', data.posts);
        setSearchResults(data.posts || []);
      })
      .catch(err => console.error('Search error:', err))
      .finally(() => setIsSearching(false));
  }

  function onViewProfileSubmit() {
    onRouteChange('registers')
  }

  //return home
  if (route === 'login' || route === 'register' || route === 'verify-email' || route === 'password-reset') {
  // if (route !== 'home') {
    return (
      <nav className="bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7em'}}>
        <img src="./src/assets/logosvg.svg" alt="logo" className="logo"></img>
        <p onClick={() => onRouteChange('home')} className="usof">USOF</p>
      </div>

        <div className="links">
          <p className="logtext" onClick={() => onRouteChange('home')}>Home</p>
          <p className="logtext" onClick={() => onRouteChange('login')}>Log In</p>
          <p className="logtext" onClick={() => onRouteChange('register')}>Register</p>
        </div>
      </nav>
    );
  }
    
  return (
    <div>

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
              
        <div className="log-options">
          {isSignedIn ? (
            <>
              {/* loged */}
                <button className="logbox max-width-5" onClick={() => onRouteChange('create-post')}>
                  <p className="logtext">Create +</p>
                </button>
                <p className="logtext link pointer" onClick={() => onRouteChange('logout')}>Log Out</p>
                {/* <img className="ava mr2" src={avatar} onClick={onViewProfileSubmit} /> */}
                <a  href={`/users/${user?.login}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onRouteChange(`user:${userId}`);
                  }}
                >   
                  <img src={avatar} className="ava mr2" />
                </a>
              </>
            ) : (
              // not loged
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

      {isSearching && <p className="search-status">Searching...</p>}

      {searchResults.length > 0 && (
        <div 
          className="search-results"
        >
          <h3>Search results:</h3>
          <ul>
            {searchResults.map(post => (
              <li key={post.post_id} className="search-item" onClick={() => {
                onRouteChange(`post:${post.post_id}`)
                setSearchResults([]);
                setSearchBar('');
              }}>
                <h4 className="tl">{post.title}</h4>
                <p className="tl">{post.content?.slice(0, 80)}...</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length === 0 && !isSearching && searchBar && (
        <p className="search-status">No results found</p>
      )}
    </div>
  );
}

export default Navigation;