import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notices, setNotices] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    totalTrainers: 0,
    totalClasses: 0,
    activeMemberships: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'classes', 'plans', 'notices'
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  // Forms states
  const [classForm, setClassForm] = useState({ name: '', trainer: '', day: 'Monday', time: '', capacity: 15 });
  const [planForm, setPlanForm] = useState({ name: '', price: '', duration: '', features: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', category: 'general', content: '' });

  const API_BASE = 'http://localhost:5000/api';

  const triggerMessage = (text, type = 'success') => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadData = async () => {
    try {
      const [usersRes, classesRes, plansRes, noticesRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/member/classes`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/member/plans`),
        fetch(`${API_BASE}/auth/notices`),
        fetch(`${API_BASE}/admin/analytics`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const usersData = await usersRes.json();
      const classesData = await classesRes.json();
      const plansData = await plansRes.json();
      const noticesData = await noticesRes.json();
      const analyticsData = await analyticsRes.json();

      if (usersData.success) setUsers(usersData.data);
      if (classesData.success) setClasses(classesData.data);
      if (plansData.success) setPlans(plansData.data);
      if (noticesData.success) setNotices(noticesData.data);
      if (analyticsData.success) setAnalytics(analyticsData.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Handle changing user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('User role modified successfully');
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to modify user role.', 'danger');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this user from the databases? This action is irreversible.')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('User account purged from systems');
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to delete user.', 'danger');
    }
  };

  // Handle creating a gym class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classForm.name || !classForm.trainer || !classForm.time || !classForm.capacity) {
      triggerMessage('Please fill in all class details.', 'danger');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(classForm)
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('New gym class successfully scheduled');
        setClassForm({ name: '', trainer: '', day: 'Monday', time: '', capacity: 15 });
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to schedule class.', 'danger');
    }
  };

  // Handle cancelling / deleting a class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Cancel this class slot? All current attendee bookings will be dissolved.')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/classes/${classId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('Gym class slot cancelled successfully');
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to cancel class.', 'danger');
    }
  };

  // Handle creating a membership plan
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name || !planForm.price || !planForm.duration || !planForm.features) {
      triggerMessage('Please fill in all plan parameters.', 'danger');
      return;
    }

    try {
      const featuresArr = planForm.features.split(',').map(f => f.trim()).filter(Boolean);

      const response = await fetch(`${API_BASE}/admin/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: planForm.name,
          price: Number(planForm.price),
          duration: Number(planForm.duration),
          features: featuresArr
        })
      });
      
      const result = await response.json();
      if (result.success) {
        triggerMessage('New membership pass created');
        setPlanForm({ name: '', price: '', duration: '', features: '' });
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to create plan.', 'danger');
    }
  };

  // Handle deleting a membership plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Delete this membership plan pass from catalogs?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('Membership plan purged successfully');
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to delete plan.', 'danger');
    }
  };

  // Handle creating a notice
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      triggerMessage('Please fill in notice details.', 'danger');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noticeForm)
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('New facility notice published successfully!');
        setNoticeForm({ title: '', category: 'general', content: '' });
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to publish notice.', 'danger');
    }
  };

  // Handle deleting a notice
  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice broadcast?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage('Facility notice purged successfully');
        loadData();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to delete notice.', 'danger');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Decrypting command center mainframe...</div>;
  }

  const trainers = users.filter(u => u.role === 'trainer');

  return (
    <div className="dashboard-container">
      {/* Toast Alert */}
      {message && (
        <div className={`badge badge-${msgType}`} style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {/* Main command center board */}
      <div className="dashboard-content">
        <h2 style={{ fontSize: '2.25rem', color: '#fff', marginBottom: '2rem', fontFamily: 'Outfit' }}>
          ALPHA <span className="text-gradient-purple">COMMAND CENTER</span>
        </h2>

        {/* Analytics Aggregates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <span style={{ fontSize: '1.75rem' }}>👥</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '5px 0' }}>{analytics.totalMembers}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Registered Members</div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--success)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <span style={{ fontSize: '1.75rem' }}>⚡</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '5px 0' }}>{analytics.activeMemberships}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active memberships</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <span style={{ fontSize: '1.75rem' }}>🏋️</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '5px 0' }}>{analytics.totalTrainers}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Coaches Roster</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', transition: 'var(--transition)', boxShadow: '0 0 10px rgba(6,182,212,0.1)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <span style={{ fontSize: '1.75rem' }}>💰</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', margin: '5px 0' }}>${analytics.totalRevenue}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Potential Revenue / mo</div>
          </div>
        </div>

        {/* Tab System selection */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('users')} style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)',
            padding: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}>👤 User Accounts Grid</button>
          
          <button onClick={() => setActiveTab('classes')} style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'classes' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'classes' ? '#fff' : 'var(--text-secondary)',
            padding: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}>📅 Class Schedulers</button>
          
          <button onClick={() => setActiveTab('plans')} style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'plans' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'plans' ? '#fff' : 'var(--text-secondary)',
            padding: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}>🎟 Membership Plans Catalog</button>

          <button onClick={() => setActiveTab('notices')} style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'notices' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'notices' ? '#fff' : 'var(--text-secondary)',
            padding: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}>📢 Notice Board Console</button>
        </div>

        {/* Tab Content 1: User Accounts */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Users Mainframe Databases</h3>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User Identity</th>
                    <th>Email</th>
                    <th>Facility Role</th>
                    <th>Assigned Plan / Status</th>
                    <th>Coach Assigned</th>
                    <th>Purge Account</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                          className="form-input"
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.8rem',
                            background: 'var(--bg-dark)',
                            color: '#fff'
                          }}
                          disabled={u._id.toString() === user._id.toString()}
                        >
                          <option value="member">Member</option>
                          <option value="trainer">Trainer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {u.role === 'member' ? (
                          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <span className="badge badge-info">{u.membershipPlan?.name || 'No Plan'}</span>
                            <span className={`badge badge-${u.membershipStatus === 'active' ? 'success' : 'danger'}`}>
                              {u.membershipStatus}
                            </span>
                          </div>
                        ) : u.role === 'trainer' ? (
                          <span className="badge badge-info">{u.trainerSpecialty}</span>
                        ) : (
                          <span className="badge badge-success">ALL OVERSEER</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {u.role === 'member' ? (u.assignedTrainer?.name || 'Unassigned') : 'N/A'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          disabled={u._id.toString() === user._id.toString()}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Classes Scheduler */}
        {activeTab === 'classes' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Schedule New Gym Class</h3>
              <form onSubmit={handleCreateClass}>
                <div className="form-group">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CrossFit Blast"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Coach</label>
                  <select
                    className="form-input"
                    value={classForm.trainer}
                    onChange={(e) => setClassForm({ ...classForm, trainer: e.target.value })}
                    style={{ background: 'var(--bg-dark)', color: '#fff' }}
                    required
                  >
                    <option value="">Select a coach...</option>
                    {trainers.map(t => (
                      <option key={t._id} value={t._id}>Coach {t.name} ({t.trainerSpecialty})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Day Schedule</label>
                  <select
                    className="form-input"
                    value={classForm.day}
                    onChange={(e) => setClassForm({ ...classForm, day: e.target.value })}
                    style={{ background: 'var(--bg-dark)', color: '#fff' }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 08:00 AM - 09:30 AM"
                    value={classForm.time}
                    onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Max Student Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Deploy Class & Live Bookings
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Active Class Schedules</h3>
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Class Title</th>
                      <th>Day</th>
                      <th>Time Slot</th>
                      <th>Trainer Assigned</th>
                      <th>Attendees</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(cls => (
                      <tr key={cls._id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{cls.name}</td>
                        <td><span className="badge badge-info">{cls.day}</span></td>
                        <td>{cls.time}</td>
                        <td>{cls.trainer?.name || 'Alpha Coach'}</td>
                        <td>{cls.enrolledMembers.length} / {cls.capacity}</td>
                        <td>
                          <button onClick={() => handleDeleteClass(cls._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Cancel Class
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Plan Creator */}
        {activeTab === 'plans' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Configure Membership Pass</h3>
              <form onSubmit={handleCreatePlan}>
                <div className="form-group">
                  <label className="form-label">Plan Title Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Titanium VIP Power"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price Load ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 199"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration Term (months)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 12"
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Features Catalog (comma-separated)</label>
                  <textarea
                    className="form-input"
                    placeholder="e.g. 24/7 Access, Free Towel Service, SPA Entry"
                    value={planForm.features}
                    onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                    style={{ minHeight: '100px' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Inject Plan Pass to Mainframe
                </button>
              </form>
            </div>

            <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Current Plan Offerings</h3>
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Term</th>
                      <th>Price Rate</th>
                      <th>Features</th>
                      <th>Purge Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{p.name}</td>
                        <td><span className="badge badge-info">{p.duration} mo</span></td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>${p.price}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.features.join(', ')}
                        </td>
                        <td>
                          <button onClick={() => handleDeletePlan(p._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 📢 Tab Content 4: Notice Board Management (New Section) */}
        {activeTab === 'notices' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* Notice Creator Form */}
            <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Publish Announcement Notice</h3>
              <form onSubmit={handleCreateNotice}>
                <div className="form-group">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Closed for Holiday"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notice Category Category</label>
                  <select
                    className="form-input"
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    style={{ background: 'var(--bg-dark)', color: '#fff' }}
                  >
                    <option value="general">General Update</option>
                    <option value="event">Gym Event</option>
                    <option value="important">Important Alert / Emergency</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Notice Bulletin Content</label>
                  <textarea
                    className="form-input"
                    placeholder="Provide details about the announcement..."
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    style={{ minHeight: '120px' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Broadcast Announcement
                </button>
              </form>
            </div>

            {/* Current Notices Lists */}
            <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Active Notice Bulletins</h3>
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Notice Header</th>
                      <th>Category</th>
                      <th>Announced On</th>
                      <th>Purge Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map(notice => (
                      <tr key={notice._id}>
                        <td style={{ fontWeight: 600, color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={notice.content}>
                          {notice.title}
                        </td>
                        <td>
                          <span className={`badge badge-${
                            notice.category === 'important' ? 'danger' : notice.category === 'event' ? 'warning' : 'info'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {notice.category}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button onClick={() => handleDeleteNotice(notice._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
