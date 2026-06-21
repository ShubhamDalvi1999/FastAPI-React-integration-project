import React, { useState } from 'react';
import { registerUser } from '../api';

interface RegisterProps {
  onRegistrationSuccess: () => void;
}

const EyeIcon: React.FC<{ visible: boolean }> = ({ visible }) =>
  visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live validation rules - kept in sync with the backend checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isUsernameValid = username.trim().length >= 3;
  const isEmailValid = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please fix the highlighted fields before registering.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({ username, email, password });
      // Registration successful
      onRegistrationSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        // Handle axios error
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      {/* Dynamic greeting that updates as the user types their username */}
      <p className="register-greeting">
        {username.trim()
          ? <>Welcome, <strong>{username}</strong>!</>
          : 'Welcome! Choose a username to get started.'}
      </p>

      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {username.length > 0 && !isUsernameValid && (
            <small className="field-hint invalid">
              Username must be at least 3 characters long.
            </small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {email.length > 0 && !isEmailValid && (
            <small className="field-hint invalid">
              Please enter a valid email address.
            </small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          <ul className="password-checklist">
            <li className={passwordChecks.length ? 'valid' : 'invalid'}>
              {passwordChecks.length ? '✓' : '○'} At least 8 characters
            </li>
            <li className={passwordChecks.uppercase ? 'valid' : 'invalid'}>
              {passwordChecks.uppercase ? '✓' : '○'} One uppercase letter
            </li>
            <li className={passwordChecks.lowercase ? 'valid' : 'invalid'}>
              {passwordChecks.lowercase ? '✓' : '○'} One lowercase letter
            </li>
            <li className={passwordChecks.number ? 'valid' : 'invalid'}>
              {passwordChecks.number ? '✓' : '○'} One number
            </li>
          </ul>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showConfirmPassword} />
            </button>
          </div>
          {confirmPassword.length > 0 && (
            <small className={`field-hint ${doPasswordsMatch ? 'match' : 'invalid'}`}>
              {doPasswordsMatch ? '✓ Passwords match' : 'Passwords do not match'}
            </small>
          )}
        </div>
        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
