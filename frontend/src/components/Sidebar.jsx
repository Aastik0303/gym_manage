import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderMemberLinks = () => (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Member Hub</div>
      <NavLink to="/member-dashboard" end style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        color: isActive ? '#fff' : 'var(--text-secondary)',
        background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'var(--transition)'
      })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
        Overview
      </NavLink>
    </>
  );

  const renderTrainerLinks = () => (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Trainer Suite</div>
      <NavLink to="/trainer-dashboard" end style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        color: isActive ? '#fff' : 'var(--text-secondary)',
        background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'var(--transition)'
      })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Assigned Roster
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Admin Suite</div>
      <NavLink to="/admin-dashboard" end style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        color: isActive ? '#fff' : 'var(--text-secondary)',
        background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'var(--transition)'
      })}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Command Center
      </NavLink>
    </>
  );

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
        <div style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: '#fff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          {user.name.charAt(0)}
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{user.name}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {user.role === 'member' && renderMemberLinks()}
        {user.role === 'trainer' && renderTrainerLinks()}
        {user.role === 'admin' && renderAdminLinks()}
      </nav>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>CONNECTED</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
