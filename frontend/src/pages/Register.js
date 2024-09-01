import React, { useState } from 'react';
import '../styles/Register.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, company }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
        setName('');
        setEmail('');
        setPassword('');
        setCompany('');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="sm-container">
        <h2 className="title">Create an account</h2>
      </div>

      <div className="form-container">
        <form className="form" onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-group">
            <label htmlFor="name" className="label">Name</label>
            <div className="input-container">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="label">Email address</label>
            <div className="input-container">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <div className="input-container">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="company" className="label">Company (optional)</label>
            <div className="input-container">
              <input
                id="company"
                name="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button">Register</button>
          </div>
        </form>

        <p className="footer-text">
          Already a member? <a href="/" className="signin-link">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
