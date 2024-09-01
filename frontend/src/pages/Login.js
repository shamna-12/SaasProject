import React, { useState } from 'react';
import '../styles/Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token); // Save the token in localStorage
        setSuccess('Login successful');
        // Redirect to profile page or another route
        window.location.href = '/profile';
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="sm-container">
        <h2 className="title">Sign in to your account</h2>
      </div>

      <div className="form-container">
        <form className="form" onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-group">
            <label htmlFor="email" className="label">Email address</label>
            <div className="input-container">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-header">
              <label htmlFor="password" className="label">Password</label>
            </div>
            <div className="input-container">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button">Sign in</button>
          </div>
        </form>

        <p className="footer-text">
          Not a member? <a href="/register" className="signup-link">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
