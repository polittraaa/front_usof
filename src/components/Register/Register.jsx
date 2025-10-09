import { useState, useEffect, useRef } from 'react';

function Register({ onRouteChange }) {
  const [logInEmail, setLogInEmail] = useState('');
  const [logIn, setLogIn] = useState('');
  const [logInPassword, setLogInPassword] = useState('');
  const [logInPasswordConfirm, setLogInPasswordConfirm] = useState('');
  const [fullName, setName] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  function onEmailChange(e) {
    setLogInEmail(e.target.value);
  }

  function onLoginChange(e) {
    setLogIn(e.target.value);
  }

  function onNameChange(e) {
    setName(e.target.value);
  }
  
  function onPasswordChange(e) {
    setLogInPassword(e.target.value);
  }

  function onPasswordConfirmChange(e) {
    setLogInPasswordConfirm(e.target.value);
  }


  async function onSubmitRegister() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: logInEmail,
          login: logIn,
          password: logInPassword,
          password_confirm:logInPasswordConfirm,
          full_name: fullName,
        }),
      });

      const user = await response.json();
      if (user.id) {
        setError('');
        setMessage('Confirmation email is send')
        onRouteChange('login');
      } else {
        setError(user);
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
    >
        {/* Register FORM */}
        <article>
          <main>
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Register</h1>
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
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="fullName"
                  id="fullName"
                  onChange={onNameChange}
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password confirm<span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="passwordConf"
                  id="passwordConf"
                  required
                  onChange={onPasswordConfirmChange}
                />
              </div>
            </div>

            <button
              onClick={onSubmitRegister}
              className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </button>

            <div className="mt-4 text-center text-sm">
              <p
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => onRouteChange('login')}
              >
                Log In
              </p>
            </div>
          </main>
        </article>

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

export default Register;
