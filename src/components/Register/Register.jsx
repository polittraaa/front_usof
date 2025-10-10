import { useState } from 'react';
import './Register.css';

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
          password_confirm: logInPasswordConfirm,
          full_name: fullName,
        }),
      });

      const user = await response.json();
      if (user.id) {
        setError('');
        setMessage('Confirmation email has been sent.');
        onRouteChange('login');
      } else {
        setError(user);
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <hr />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitRegister();
        }}
      >
        <div className="form-group">
          <label htmlFor="login">
            Login <span className="required">*</span>
          </label>
          <input
            type="text"
            id="login"
            name="login"
            required
            onChange={onLoginChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={onEmailChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fullName">
            Full name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            onChange={onNameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={onPasswordChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConf">
            Confirm password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            required
            onChange={onPasswordConfirmChange}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{' '}
        <span onClick={() => onRouteChange('login')}>Log In</span>
      </p>

      {error && (
        <p className="error-message">
          &#10006; {error}
        </p>
      )}

      {message && (
        <p className="success-message">
          &#10004; {message}
        </p>
      )}
    </div>
  );
}

export default Register;
