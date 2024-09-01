import { useState } from 'react';

const useAuth = (navigate) => {
  const [errors, setErrors] = useState({});

  const login = (email, password) => {
    if (!email || !password) {
      setErrors({ form: "Email and password are required" });
      return;
    }

    const loginData = {
      username_or_email: email,
      password: password
    };

    fetch('http://192.168.4.204:5005/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);  // Store the token
        localStorage.setItem('username', data.user.UserName);  // Store the username
        navigate('/home'); // Navigate to home page on success
      } else {
        console.log('Login failed:', data.message);
        setErrors({ form: "Login failed: " + data.message });
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      setErrors({ form: "Login request failed" });
    });
  };

  return {
    login,
    errors
  };
};

export default useAuth;
