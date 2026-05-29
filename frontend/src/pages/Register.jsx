import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [specialty, setSpecialty] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all required credentials.');
      setLoading(false);
      return;
    }

    const res = await register(name, email, password, role, specialty);
    setLoading(false);

    if (res.success) {
      if (role === 'trainer') navigate('/trainer-dashboard');
      else navigate('/member-dashboard');
    } else {
      setError(res.message || 'Registration failed. Email might already be registered.');
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>⚡</span>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Join Alpha Facility</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deploy a digital fitness identity to customize your plans</p>
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secure Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="•••••••• (Min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facility Access Role</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: 'var(--bg-card)', color: '#fff' }}
            >
              <option value="member">Gym Member / Athlete</option>
              <option value="trainer">Personal Fitness Coach / Trainer</option>
            </select>
          </div>

          {role === 'trainer' && (
            <div className="form-group">
              <label className="form-label">Trainer Focus Specialty</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bodybuilding, Yoga Flow, CrossFit"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required={role === 'trainer'}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Deploying Security Credentials...' : 'Register & Log in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Access Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
