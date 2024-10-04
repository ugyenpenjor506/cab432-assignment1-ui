import React, { useState } from 'react';
import './Auth.css';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, errors } = useAuth(navigate);

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}/login_with_google`; // Redirect to your backend route
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/avatar.jpeg" alt="Logo" className="logo"/>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          {errors.form && <p className="error">{errors.form}</p>}
          <button type="submit">Login</button>
        </form>
        <button className="google-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
