import { useState, useEffect } from 'react'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail'
import PasswordReset from './components/PasswordReset/PasswordReset'
import About from './components/About/About'

import Navigation from './components/Navigation/Navigation'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import Content from './components/Content/Content'
import Post from './components/Post/Post'
import Footer from './components/Footer/Footer'

// import CreatePost from './components/CreatePost/CreatePost'

// import Profile from './components/Profile/Profile'

import './App.css'

function App() {
  const [route, setRoute] = useState('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [userId, setUserId] = useState(null);

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
    home: <Content onRouteChange={onRouteChange} />,
    login: <Login onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    register: <Register onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />, 
    'verify-email': <ConfirmEmail onRouteChange={onRouteChange} />, 
    'password-reset': <PasswordReset token={passwordResetToken} />,
    about: <About onRouteChange={onRouteChange} onLoginSuccess={onLoginSuccess} />,
    // 'create-post': <CreatePost onRouteChange={onRouteChange} userId={userId} />,
    // 'profile': <Profile userId={routeUserId} currentUserId={userId} onRouteChange={onRouteChange} />
  };

  let mainContent;
  if (route.startsWith('post:')) {
    const postId = route.split(':')[1];
    mainContent = <Post postId={postId} onRouteChange={onRouteChange} isSignedIn={isSignedIn} userId={userId} />;
  } else {
    mainContent = routes[route] || routes.home;
  }

  return (
    <>
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} route={route} userId={userId} />

      <div className="main" style={{ flex: 1 }}>
        {!authRoutes.includes(route) && (
            <LeftSidebar onRouteChange={onRouteChange} />
        )}
        <div  className="main-content">
          {mainContent}
        </div>
        {!authRoutes.includes(route) && (
          <RightSidebar onRouteChange={onRouteChange} />
        )}
      </div>
      
     <Footer onRouteChange={onRouteChange} />
    </>
  )
}

export default App