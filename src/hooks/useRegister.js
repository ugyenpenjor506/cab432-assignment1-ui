import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function useRegister() {
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const validateForm = (username, email, password, confirmPassword) => {
    let isValid = true;
    let errors = {};

    // Validate username
    if (!username) {
      errors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Validate email
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = "Password must contain at least one special character";
      isValid = false;
    }

    // Validate confirmPassword
    if (!confirmPassword) {
      errors.confirmPassword = "Confirming password is required";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const registerUser = (fullname, username, email, password) => {  // Include fullname in the parameters
    const payload = { fullname, username, email, password };  // Add fullname to the payload

    fetch('http://localhost:5005/create_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200 && data.status === 'success') {
        setResponseMessage('Registration successful: ' + data.message);
        setTimeout(() => {
          navigate('/'); // Navigate to login after 2 seconds
        }, 2000);
      } else {
        setResponseMessage('Failed to register user: ' + data.message);
      }
    })
    .catch(error => {
      setResponseMessage('An error occurred. Please try again.');
    });
  };

  return { errors, responseMessage, validateForm, registerUser };
}

export default useRegister;
