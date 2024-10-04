import { useState } from 'react';

const useAuth = (navigate) => {
  const [errors, setErrors] = useState({});

  const login = (username, password) => {
    if (!username || !password) {
      setErrors({ form: "Username and password are required" });
      return;
    }

    const loginData = {
      username: username,
      password: password
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(response => {
      if (response.status === 401) {
        // If the server responds with 401 (Unauthorized), handle it
        return response.json().then(data => {
          setErrors({ form: "Invalid username or password" });
        });
      } else if (response.status === 200) {
        // If successful, return the JSON data
        return response.json();
      } else {
        // For any other non-200 status, show a generic error
        return response.json().then(data => {
          setErrors({ form: "Login failed: " + data.error });
        });
      }
    })
    .then(data => {
      if (data && data.code === 200) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);  // Store the token
        localStorage.setItem('username', data.username);  // Store the username
        navigate('/home'); // Navigate to home page on success
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      setErrors({ form: "Login request failed. Please try again later." });
    });
  };

  return {
    login,
    errors
  };
};

export default useAuth;
