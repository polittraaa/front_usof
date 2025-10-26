import { useEffect, useState } from 'react';
import './LeftSidebar.css';

function LeftSidebar({ onRouteChange, isSignedIn, userId }) {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch categories on mount
  useEffect(() => {        
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data?.cat) setCategories(data.cat);
        else console.error('Incorrect data format:', data);
      })
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  // Fetch user info when signed in
  useEffect(() => {
    if (isSignedIn && userId) {
      fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Error loading user data:', err));
    }
  }, [isSignedIn, userId]);

  return (
    <div className="left-sidebar-container">
      <div className="left-sidebar-links-container tl ml3 mr3">
        <span 
          className="left-sidebar-link"
          onClick={() => onRouteChange('about')}
        >
          About
        </span>
        <span 
          className="left-sidebar-link"
          onClick={() => onRouteChange('help')}
        >
          Help
        </span>
        <span 
          className="left-sidebar-link"
          onClick={() => onRouteChange('home')}
        >
          Home
        </span>
        <span 
          className="left-sidebar-link"
          onClick={() => onRouteChange('categories')}
        >
          Categories
        </span>

        <hr className="mr3 ml3 bg-green" />

        {/* Conditional rendering for admin */}
        {user?.role === 'admin' && (
          <>
            <a href="http://localhost:3001/admin/" className="left-sidebar-link"> Admin Panel</a>
            <span 
              className="left-sidebar-link"
              onClick={() => onRouteChange('userList')}
            >
              User List
            </span>
          </>
        )}

         <span 
          className="left-sidebar-link"
          onClick={() => onRouteChange('favorites')}
        >
          Favorites
        </span>
      </div>
    </div>
  );
}

export default LeftSidebar;
