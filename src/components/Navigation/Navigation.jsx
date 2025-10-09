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

    const avatar = user?.picture
        ? `http://localhost:3001/${user.picture}`
        : "http://localhost:3001/public/uploads/default.jpg";    

    function onSearchBarChange(event) {
        setSearchBar(event.target.value);
    }
    //search 
    function handleSearch() {
        
    }

    function onViewProfileSubmit() {
        
    }
    //return home
    if (route === 'login' || route === 'register' || route === 'verify-email' || route === 'password-reset') {
        return (
            <nav className="bb b--light-gray bg-white pa2 fixed top-0 left-0 w-100 z-5" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('home')}>Home</p>
                <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('login')}>Log In</p>
                <p className="f3 link dim black underline pa3 pointer ma0 " onClick={() => onRouteChange('register')}>Register</p>
            </nav>
        );
    }
    
    return (
        <nav 
            className=" bar bb b--light-gray pa2 fixed top-0 left-0 w-100 z-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* // LOGO */}
            <img src="../src/assets/logosvg.svg" alt="logo" className="logo"></img>
            <div 
                className="pointer ml4"
                onClick={() => onRouteChange('home')}
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#FFF1E8'
                }}
            >
                USOF
            </div>
            
            <form onSubmit={handleSearch} className="flex items-center justify-center w-50-nsc w-90">
                {/* search bar  */}
                <div className="relative w-80 ma0" style={{backgroundColor: '#FFF1E8'}}>
                    <i
                        className="fa-solid fa-magnifying-glass absolute left-1 top-50 translate--y-50 black-50"
                        style={{ top: '50%', transform: 'translateY(-50%)', left: '10px', color: '#8a3500ff'}}
                    ></i>

                    <input
                        className="pa2 pl4 input-reset ba b--black-20 w-100 outline-0 focus-b--transparent"
                        type="text"
                        placeholder="Search for..."
                        value={searchBar}
                        onChange={onSearchBarChange}
                    />
                </div>
            </form>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isSignedIn ? (
                    <>
                        <p className="f3 link dim black underline pa3 pointer ma0" onClick={() => onRouteChange('logout')}>Log Out</p>
                        {/* user av */}
                        <img
                            className="br-100 shadow-1 ml3 mr3 pointer"
                            src={avatar}
                            alt="Avatar"
                            width={40}
                            height={40}
                            style={{ objectFit: 'cover' }}
                            onClick={onViewProfileSubmit}
                        />
                    </>
                ) : (
                    // log bar
                    <>
                        <p className="f3 link dim black pa3 pointer ma1" onClick={() => onRouteChange('login')}>Log In</p>
                        <p className="f3 link dim black pa3 pointer ma1" onClick={() => onRouteChange('register')}>Register</p>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navigation;