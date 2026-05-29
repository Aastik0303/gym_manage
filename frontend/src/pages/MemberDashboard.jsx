import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MemberDashboard = () => {
  const { user, token, refreshProfile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout', 'diet', 'booking'
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, trainersRes, plansRes, noticesRes] = await Promise.all([
          fetch(`${API_BASE}/member/classes`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/auth/trainers`),
          fetch(`${API_BASE}/member/plans`),
          fetch(`${API_BASE}/auth/notices`)
        ]);

        const classesData = await classesRes.json();
        const trainersData = await trainersRes.json();
        const plansData = await plansRes.json();
        const noticesData = await noticesRes.json();

        if (classesData.success) setClasses(classesData.data);
        if (trainersData.success) setTrainers(trainersData.data);
        if (plansData.success) setPlans(plansData.data);
        if (noticesData.success) setNotices(noticesData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const triggerMessage = (text, type = 'success') => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handlePurchase = async (planId) => {
    try {
      const response = await fetch(`${API_BASE}/member/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage(result.message);
        refreshProfile();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to purchase plan.', 'danger');
    }
  };

  const handleSelectTrainer = async (trainerId) => {
    try {
      const response = await fetch(`${API_BASE}/member/select-trainer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trainerId })
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage(result.message);
        refreshProfile();
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to select trainer.', 'danger');
    }
  };

  const handleJoinClass = async (classId) => {
    try {
      const response = await fetch(`${API_BASE}/member/classes/${classId}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage(result.message);
        const classesRes = await fetch(`${API_BASE}/member/classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const classesData = await classesRes.json();
        if (classesData.success) setClasses(classesData.data);
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to book class.', 'danger');
    }
  };

  const handleLeaveClass = async (classId) => {
    try {
      const response = await fetch(`${API_BASE}/member/classes/${classId}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        triggerMessage(result.message);
        const classesRes = await fetch(`${API_BASE}/member/classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const classesData = await classesRes.json();
        if (classesData.success) setClasses(classesData.data);
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('Failed to cancel class booking.', 'danger');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Decrypting athlete dashboard data...</div>;
  }

  if (!user.membershipPlan || user.membershipStatus !== 'active') {
    return (
      <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          <span style={{ fontSize: '3rem' }}>🛡</span>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit' }}>Membership Inactive</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            To access custom diet protocols, workout schedules, and book live group classes, please activate a membership plan below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {plans.map(plan => (
            <div key={plan._id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff' }}>${plan.price}</span>
                <span style={{ color: 'var(--text-secondary)' }}>/ {plan.duration} mo</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>
              <button onClick={() => handlePurchase(plan._id)} className="btn btn-primary" style={{ marginTop: 'auto' }}>
                Activate Membership
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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

      <div className="dashboard-content">
        
        {/* Profile Card / Coach details & Seeding notices announcements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Athlete Profile */}
          <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span className="badge badge-success" style={{ width: 'fit-content' }}>Active Athlete Profile</span>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'Outfit' }}>{user.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div>📧 Email: {user.email}</div>
              <div style={{ marginTop: '5px' }}>💪 Plan: <span className="badge badge-info">{user.membershipPlan?.name}</span></div>
            </div>
          </div>

          {/* Personal Coach */}
          <div className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', fontFamily: 'Outfit' }}>Personal Fitness Coach</h3>
            {user.assignedTrainer ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Coach {user.assignedTrainer.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Specialty Focus: <span className="badge badge-info">{user.assignedTrainer.trainerSpecialty}</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Check below for customized workout and diet updates!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Match with a coach to unlock routine assignments:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {trainers.map(t => (
                    <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{t.name}</span>
                        <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '2px 6px', marginLeft: '5px' }}>{t.trainerSpecialty}</span>
                      </div>
                      <button onClick={() => handleSelectTrainer(t._id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 📢 Dynamic Announcements Box (New UI Enhancement) */}
          <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(168,85,247,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📢</span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontFamily: 'Outfit', margin: 0 }}>Bulletins & Notices</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
              {notices.length > 0 ? (
                notices.map(notice => (
                  <div key={notice._id} className={`notice-card notice-${notice.category}`} style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <strong style={{ color: '#fff' }}>{notice.title}</strong>
                      <span className={`badge badge-${notice.category === 'important' ? 'danger' : notice.category === 'event' ? 'warning' : 'info'}`} style={{ fontSize: '0.55rem', padding: '1px 4px' }}>
                        {notice.category}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>{notice.content}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>No bulletins broadcasted.</div>
              )}
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('workout')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'workout' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'workout' ? '#fff' : 'var(--text-secondary)',
              padding: '1rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🏋️ Workout Schedules
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'diet' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'diet' ? '#fff' : 'var(--text-secondary)',
              padding: '1rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🥗 Nutrition Protocols
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'booking' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'booking' ? '#fff' : 'var(--text-secondary)',
              padding: '1rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            📅 Book Gym Classes
          </button>
        </div>

        {/* Tab 1: Workouts */}
        {activeTab === 'workout' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Personalized Workouts Matrix</h3>
            {user.workoutPlan && user.workoutPlan.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {user.workoutPlan.map((dayPlan, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', background: 'rgba(16, 22, 38, 0.4)' }}>
                    <h4 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>{dayPlan.day} Routines</h4>
                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Exercise Name</th>
                            <th>Sets</th>
                            <th>Repetitions</th>
                            <th>Weight Load</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayPlan.exercises.map((ex, exIdx) => (
                            <tr key={exIdx}>
                              <td style={{ fontWeight: 600, color: '#fff' }}>{ex.name}</td>
                              <td>{ex.sets}</td>
                              <td>{ex.reps}</td>
                              <td><span className="badge badge-info">{ex.weight}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No workouts have been created yet. Ask your personal coach to formulate one!
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Diets */}
        {activeTab === 'diet' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Customized Diets Matrix</h3>
            {user.dietPlan && user.dietPlan.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {user.dietPlan.map((dayPlan, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', background: 'rgba(16, 22, 38, 0.4)' }}>
                    <h4 style={{ color: 'var(--secondary)', fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>{dayPlan.day} Nutrition</h4>
                    <div className="custom-table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Time Slot</th>
                            <th>Dietary Food</th>
                            <th>Calories (kcal)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayPlan.meals.map((meal, mealIdx) => (
                            <tr key={mealIdx}>
                              <td style={{ fontWeight: 600, color: '#fff' }}>{meal.time}</td>
                              <td>{meal.food}</td>
                              <td><span className="badge badge-success">{meal.calories} kcal</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No custom nutrition plan has been formulated yet. Ask your coach to create one!
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Booking */}
        {activeTab === 'booking' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Group Training Classes</h3>
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Class Title</th>
                    <th>Day Schedule</th>
                    <th>Time Slot</th>
                    <th>Coach</th>
                    <th>Capacity Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => {
                    const isEnrolled = cls.enrolledMembers.some(
                      (member) => member._id.toString() === user._id.toString()
                    );
                    const isFull = cls.enrolledMembers.length >= cls.capacity;

                    return (
                      <tr key={cls._id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{cls.name}</td>
                        <td><span className="badge badge-info">{cls.day}</span></td>
                        <td>{cls.time}</td>
                        <td>{cls.trainer?.name || 'Alpha Coach'}</td>
                        <td>
                          <span style={{ color: isFull ? 'var(--accent)' : 'var(--text-primary)' }}>
                            {cls.enrolledMembers.length} / {cls.capacity}
                          </span>
                        </td>
                        <td>
                          {isEnrolled ? (
                            <button onClick={() => handleLeaveClass(cls._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                              Cancel Booking
                            </button>
                          ) : (
                            <button onClick={() => handleJoinClass(cls._id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled={isFull}>
                              {isFull ? 'Class Full' : 'Book Seat'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
