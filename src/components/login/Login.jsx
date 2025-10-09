import { useState, useEffect, useRef } from 'react';

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

      const user = await response.json();
      if (user.id) {
        setError('');
        onRouteChange('home');
      } else {
        setError('Incorrect login or email or password');
      }
    } catch {
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
    } catch {
      setError('Server error. Please try again later.');
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
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
    >
      <div className={`transition-all duration-500 ease-in-out ${isResetting ? 'rotate-y-180' : ''}`}>
        {/* LOGIN FORM */}
        <article
          ref={loginRef}
          className={`bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-500 ${
            isResetting ? 'hidden' : 'block'
          }`}
        >
          <main>
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Log In</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Login <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="login"
                  id="login"
                  required
                  onChange={onLoginChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="email"
                  id="email"
                  required
                  onChange={onEmailChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>

            <div className="mt-4 text-center text-sm">
              <p
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => onRouteChange('register')}
              >
                Register
              </p>
              <p
                className="text-blue-600 hover:underline cursor-pointer mt-1"
                onClick={() => {
                  setIsResetting(true);
                  setError('');
                  setMessage('');
                }}
              >
                Forgot your password?
              </p>
            </div>
          </main>
        </article>

        {/* RESET FORM */}
        <article
          ref={resetRef}
          className={`bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-500 ${
            isResetting ? 'block' : 'hidden'
          }`}
        >
          <main>
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Reset Password</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>

            <p
              className="text-center text-blue-600 hover:underline cursor-pointer mt-3"
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
        <p className="mt-4 text-red-600 font-semibold">
          &#10006; {error}
        </p>
      )}

      {message && (
        <p className="mt-4 text-green-600 font-semibold">
          &#10004; {message}
        </p>
      )}
    </div>
  );
}

export default Login;
