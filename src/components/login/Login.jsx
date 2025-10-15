import { useState, useEffect, useRef } from 'react';
import './Login.css'

function Login({ onRouteChange }) {
  const [logInEmail, setLogInEmail] = useState('');
  const [logIn, setLogIn] = useState('');
  const [logInPassword, setLogInPassword] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  function onEmailChange(e) {
    setLogInEmail(e.target.value);
  }

  function onLoginChange(e) {
    setLogIn(e.target.value);
  }

  function onPasswordChange(e) {
    setLogInPassword(e.target.value);
  }

  function onResetEmailChange(e) {
    setResetEmail(e.target.value);
  }

  async function onSubmitLogIn() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: logInEmail,
          login: logIn,
          password: logInPassword,
        }),
      });
      
      const data = await response.json();
      console.log(data);
      
      
      if (data.user.user_id) {
        setError('');
        onRouteChange('home');
      } else {
        setError('Incorrect login or email or password');
      }
    } catch (e) {
      console.log(e);
      
      setError('Server error. Please try again later.');
    }
  }

  async function onSubmitPasswordReset() {
    setError('');
    setMessage('');
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setMessage('Password reset email sent');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.log(err);
      
    }
  }

  const loginRef = useRef(null);
  const resetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = isResetting
        ? `${resetRef.current.offsetHeight}px`
        : `${loginRef.current.offsetHeight}px`;
    }
  }, [isResetting]);

  return (
    <div
      ref={containerRef} className="login-container">
      <div>
        {/* LOGIN FORM */}
        <article
          ref={loginRef}
          className={`${
            isResetting ? 'hidden' : 'block'
          }`}
        >
          <main>
            <h1>Log In</h1>
            <div>
              <div>
                <label>
                  Login <span>*</span>
                </label>
                <input
                  type="text"
                  name="login"
                  id="login"
                  required
                  onChange={onLoginChange}
                />
              </div>

              <div>
                <label>
                  Email <span>*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
                  onChange={onEmailChange}
                />
              </div>

              <div>
                <label>
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  onChange={onPasswordChange}
                />
              </div>
            </div>

            <button
              onClick={onSubmitLogIn}
            >
              Log In
            </button>

            {/* <div> */}
              <p
                onClick={() => onRouteChange('register')}
              >
                Register
              </p>
              <p
                onClick={() => {
                  setIsResetting(true);
                  setError('');
                  setMessage('');
                }}
              >
                Forgot your password?
              </p>
            {/* </div> */}
          </main>
        </article>

        {/* RESET FORM */}
        <article
          ref={resetRef}
          className={`${ isResetting ? 'block' : 'hidden'}`}
        >
          <main>
            <h1>Reset Password</h1>
            <div>
              <div>
                <label>
                  Email
                </label>
                <input
                  type="email"
                  name="reset-email"
                  id="reset-email"
                  required
                  onChange={onResetEmailChange}
                />
              </div>
            </div>

            <button
              onClick={onSubmitPasswordReset}
            >
              Send Reset Link
            </button>

            <p
              onClick={() => {
                setIsResetting(false);
                setError('');
                setMessage('');
              }}
            >
              Back to Login
            </p>
          </main>
        </article>
      </div>

      {error && (
        <p className='error-message'>
          &#10006; {error}
        </p>
      )}

      {message && (
        <p className='success-message'>
          &#10004; {message}
        </p>
      )}
    </div>
  );
}

export default Login;
