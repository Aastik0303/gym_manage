import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '1rem',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 'var(--radius-sm)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.75rem' }}>⚡</span>
        <span style={{
          fontFamily: 'Outfit',
          fontWeight: 800,
          fontSize: '1.5rem',
          letterSpacing: '-0.03em',
          color: '#fff',
          textTransform: 'uppercase'
        }}>
          Alpha<span className="text-gradient-purple">Gym</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'var(--transition)' }}
              onMouseOver={(e) => e.target.style.color = '#fff'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Home
        </Link>
        
        {user ? (
          <>
            {user.role === 'member' && (
              <Link to="/member-dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
                    onMouseOver={(e) => e.target.style.color = '#fff'}
                    onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                My Dashboard
              </Link>
            )}
            {user.role === 'trainer' && (
              <Link to="/trainer-dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
                    onMouseOver={(e) => e.target.style.color = '#fff'}
                    onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                Trainer Portal
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin-dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
                    onMouseOver={(e) => e.target.style.color = '#fff'}
                    onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
                Admin Panel
              </Link>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{user.name}</span>
                <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '0px 6px', marginTop: '2px' }}>{user.role}</span>
              </div>
              
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
