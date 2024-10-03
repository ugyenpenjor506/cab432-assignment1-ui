import React, { useState } from 'react';
import './Auth.css';
import useRegister from '../hooks/useRegister'; // Adjust the import path as needed
import { Link } from 'react-router-dom';

function Register() {
  const [fullname, setFullname] = useState('');  // Add state for full name
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { errors, responseMessage, validateForm, registerUser } = useRegister();

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register button clicked');
    console.log('Fullname:', fullname);  // Log fullname
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    if (validateForm(username, email, password, confirmPassword)) {
      console.log('Form is valid, calling registerUser');
      // Pass fullname along with username, email, and password
      registerUser(fullname, username, email, password);
    } else {
      console.log('Form validation failed');
      console.log('Validation errors:', errors); // Log errors for further debugging
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/avatar.jpeg" alt="Logo" className="logo"/>
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name:</label>  {/* Add Full Name input field */}
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            {errors.fullname && <p className="error">{errors.fullname}</p>}
          </div>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit">Register</button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
