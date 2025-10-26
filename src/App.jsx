import { useState, useEffect } from 'react'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail'
import PasswordReset from './components/PasswordReset/PasswordReset'
import About from './components/About/About'

import UserList from './components/UserList/UserList'
import CategoriesPage from './components/CategoryList/CategoryList'
import UserPage from './components/UserPage/UserPage'
import Post from './components/Post/Post'
import CreatePost from './components/CreatePost/CreatePost'
import CategoryPage from './components/CategoryPage/CategoryPost'
import EditProfile from './components/EditProfile/EditProfile'
import Favorites from './components/Favorite/Favorite'

import Navigation from './components/Navigation/Navigation'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import Content from './components/Content/Content'
import Footer from './components/Footer/Footer'

import EditPost from './components/EditPost/EditPost'

import './App.css'

function App() {
  const [route, setRoute] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [loggedUserId, setUserId] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/api/auth/password-reset/")) {
      const token = path.split("/")[4];
      setPasswordResetToken(token);
      setRoute("password-reset");
    }

    if (path.startsWith("/posts/")) {
      const id = path.split("/")[2];
      if (id) setRoute(`post:${id}`);
    }
  }, []);

  function onLoginSuccess(userId) {
    setIsSignedIn(true);
    setUserId(userId);
  }

  function onRouteChange(route) {
    if (route === 'logout') {
      setIsSignedIn(false);
    }
    setRoute(route);
  }

  const authRoutes = ['login', 'register', 'verify-email', 'password-reset'];

  const routes = { 
    home: <Content onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={loggedUserId}/>,
    login: <Login onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    register: <Register onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    about: <About onRouteChange={onRouteChange}/>,
    categories: <CategoriesPage onRouteChange={onRouteChange}/>,
    userList: <UserList onRouteChange={onRouteChange}/>,
    'verify-email': <ConfirmEmail onRouteChange={onRouteChange} />, 
    'password-reset': <PasswordReset token={passwordResetToken} />,
    'create-post': <CreatePost onRouteChange={onRouteChange} userId={loggedUserId} />,
    userPage: <UserPage currentUserId={loggedUserId} onRouteChange={onRouteChange} />,
    favorites: <Favorites UserId={loggedUserId} onRouteChange={onRouteChange}  isSignedIn={isSignedIn} />
  };

  let mainContent;
  if (route.startsWith('post:')) {
    const postId = route.split(':')[1];
    mainContent = <Post postId={postId} onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={loggedUserId} />;
  } else if (route.startsWith('user:')) {
    const authorId = route.split(':')[1];
    mainContent = <UserPage authorId={authorId} userId={loggedUserId} onRouteChange={onRouteChange} isSignedIn={isSignedIn} />;
  } else if (route.startsWith('category:')) {
    const catId = route.split(':')[1];
    mainContent = <CategoryPage catId={catId} userId={loggedUserId} onRouteChange={onRouteChange} isSignedIn={isSignedIn} />;
  } else if (route.startsWith('edit-profile/')) {
    mainContent = <EditProfile onRouteChange={onRouteChange} currentUserId={loggedUserId} />;
  } else if (route.startsWith('edit-post/')) {
    mainContent = <EditPost onRouteChange={onRouteChange} postId={route.split('/')[1]} />;
  } else {
    mainContent = routes[route] || routes.home;
  }

  return (
    <>
    <div className='page'>
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} route={route} userId={loggedUserId} />

      {/* <div className="main" style={{ flex: 1 }}> */}
       <div className="main" style={{ flex: '1', gap: '0'}}>
        {!authRoutes.includes(route) && (
            <LeftSidebar onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={loggedUserId} />
        )}
        <div className="main-content">
          {mainContent}
        </div>
        {!authRoutes.includes(route) && (
          <RightSidebar onRouteChange={onRouteChange} />
        )}
      </div>
      
     </div>
     <Footer onRouteChange={onRouteChange} route={route} />
    </>
  )
}

export default App