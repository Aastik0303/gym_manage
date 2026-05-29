import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all credentials.');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Re-fetch routing logic based on user role (cached from login)
      // Since context is immediately synced, let's load role from localStorage or fetch details
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      if (result.success) {
        const role = result.data.role;
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'trainer') navigate('/trainer-dashboard');
        else navigate('/member-dashboard');
      }
    } else {
      setError(res.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>⚡</span>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Access Alpha Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your security credentials to synchronize your training</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label className="form-label">Secure Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. member@alpha.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Portal Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Decrypting Access...' : 'Authenticate Credentials'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          New to the facility?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Join Facility
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
