import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the code from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Send the code to the backend to exchange it for tokens
      fetch('http://localhost:5005/callback?code=' + code)
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            // Save the token and user details in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            navigate('/home'); // Redirect to the home page
          } else {
            console.error('Failed to log in with Google:', data.error);
          }
        })
        .catch(error => {
          console.error('Error during the Google login process:', error);
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Logging in with Google...</h1>
    </div>
  );
}

export default Callback;
