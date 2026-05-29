import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TrainerDashboard = () => {
  const { user, token } = useAuth();
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [activePlanner, setActivePlanner] = useState('workout'); // 'workout' or 'diet'
  const [planText, setPlanText] = useState('');
  
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  const API_BASE = 'http://localhost:5000/api';

  const triggerMessage = (text, type = 'success') => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, noticesRes] = await Promise.all([
          fetch(`${API_BASE}/trainer/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE}/auth/notices`)
        ]);

        const membersData = await membersRes.json();
        const noticesData = await noticesRes.json();

        if (membersData.success) setMembers(membersData.data);
        if (noticesData.success) setNotices(noticesData.data);
      } catch (error) {
        console.error('Error loading coach details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  // Handle selecting a member to plan for
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    
    if (activePlanner === 'workout') {
      const defaultWorkoutTemplate = member.workoutPlan && member.workoutPlan.length > 0 
        ? JSON.stringify(member.workoutPlan, null, 2)
        : JSON.stringify([
            {
              "day": "Monday",
              "exercises": [
                { "name": "Barbell Bench Press", "sets": 4, "reps": "8-10", "weight": "60kg" },
                { "name": "Dumbbell Flyes", "sets": 3, "reps": "12", "weight": "14kg" }
              ]
            },
            {
              "day": "Wednesday",
              "exercises": [
                { "name": "Deadlifts", "sets": 4, "reps": "5", "weight": "100kg" },
                { "name": "Lat Pulldown", "sets": 3, "reps": "10", "weight": "55kg" }
              ]
            }
          ], null, 2);
      setPlanText(defaultWorkoutTemplate);
    } else {
      const defaultDietTemplate = member.dietPlan && member.dietPlan.length > 0
        ? JSON.stringify(member.dietPlan, null, 2)
        : JSON.stringify([
            {
              "day": "Monday",
              "meals": [
                { "time": "08:00 AM", "food": "3 Scrambled eggs + Oatmeal", "calories": 400 },
                { "time": "01:00 PM", "food": "Grilled Salmon + Quinoa", "calories": 500 }
              ]
            }
          ], null, 2);
      setPlanText(defaultDietTemplate);
    }
  };

  // Toggle Plan Type
  const handleTogglePlanner = (type) => {
    setActivePlanner(type);
    if (!selectedMember) return;

    if (type === 'workout') {
      const currentWorkout = selectedMember.workoutPlan && selectedMember.workoutPlan.length > 0
        ? JSON.stringify(selectedMember.workoutPlan, null, 2)
        : JSON.stringify([
            {
              "day": "Monday",
              "exercises": [
                { "name": "Barbell Bench Press", "sets": 4, "reps": "8-10", "weight": "60kg" }
              ]
            }
          ], null, 2);
      setPlanText(currentWorkout);
    } else {
      const currentDiet = selectedMember.dietPlan && selectedMember.dietPlan.length > 0
        ? JSON.stringify(selectedMember.dietPlan, null, 2)
        : JSON.stringify([
            {
              "day": "Monday",
              "meals": [
                { "time": "08:00 AM", "food": "3 Scrambled eggs + Oatmeal", "calories": 400 }
              ]
            }
          ], null, 2);
      setPlanText(currentDiet);
    }
  };

  // Save Plan
  const handleSavePlan = async () => {
    if (!selectedMember) return;
    try {
      const parsedPlan = JSON.parse(planText);
      
      const endpoint = activePlanner === 'workout' ? 'workout' : 'diet';
      const payloadKey = activePlanner === 'workout' ? 'workoutPlan' : 'dietPlan';

      const response = await fetch(`${API_BASE}/trainer/members/${selectedMember._id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [payloadKey]: parsedPlan })
      });

      const result = await response.json();
      if (result.success) {
        triggerMessage(`${activePlanner.toUpperCase()} Plan saved successfully!`);
        
        const updatedMembers = members.map(m => {
          if (m._id === selectedMember._id) {
            return { ...m, [payloadKey]: parsedPlan };
          }
          return m;
        });
        setMembers(updatedMembers);
        setSelectedMember({ ...selectedMember, [payloadKey]: parsedPlan });
      } else {
        triggerMessage(result.message, 'danger');
      }
    } catch (error) {
      triggerMessage('JSON format error. Please check syntax carefully.', 'danger');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Decrypting coach databases...</div>;
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
        
        {/* Header Profile card & Seeding notices announcements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Coach Details */}
          <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Coach Profile Portal</span>
              <h2 style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'Outfit' }}>{user.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>📧 Email: {user.email}</p>
              <div style={{ marginTop: '10px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>{user.trainerSpecialty}</span>
              </div>
            </div>
          </div>

          {/* Announcements Feed for Coaches */}
          <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2rem', border: '1px solid rgba(168,85,247,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span>📢</span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontFamily: 'Outfit', margin: 0 }}>Bulletins & Announcements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '120px', overflowY: 'auto', paddingRight: '5px' }}>
              {notices.length > 0 ? (
                notices.map(n => (
                  <div key={n._id} className={`notice-card notice-${n.category}`} style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ color: '#fff' }}>{n.title}</strong>
                      <span className={`badge badge-${n.category === 'important' ? 'danger' : n.category === 'event' ? 'warning' : 'info'}`} style={{ fontSize: '0.55rem', padding: '1px 4px' }}>
                        {n.category}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>{n.content}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>No bulletins broadcasted.</div>
              )}
            </div>
          </div>

        </div>

        {/* Roster & Plan Composer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2rem', minHeight: '400px' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Trainee Roster</h3>
            {members.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {members.map(m => (
                  <div key={m._id} 
                       onClick={() => handleSelectMember(m)}
                       style={{
                         padding: '1.25rem',
                         background: selectedMember?._id === m._id ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.02)',
                         border: selectedMember?._id === m._id ? '1px solid var(--primary)' : '1px solid var(--border)',
                         borderRadius: 'var(--radius-sm)',
                         cursor: 'pointer',
                         transition: 'var(--transition)'
                       }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{m.name}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{m.membershipPlan?.name || 'Standard'}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>📧 {m.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '3rem' }}>
                No active gym members have hired you as their coach yet.
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2rem', minHeight: '400px' }}>
            {selectedMember ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#fff', fontFamily: 'Outfit' }}>Routine Composer: {selectedMember.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Format routine matrices using clean structural JSON configurations</p>
                  </div>
                  
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                    <button onClick={() => handleTogglePlanner('workout')} style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: activePlanner === 'workout' ? 'var(--primary)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>Workout Plan</button>
                    
                    <button onClick={() => handleTogglePlanner('diet')} style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: activePlanner === 'diet' ? 'var(--secondary)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>Diet Plan</button>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid var(--primary)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {activePlanner === 'workout' ? (
                    <span><strong>Workout Schema:</strong> Include day and list of exercises with <code>name</code>, <code>sets</code>, <code>reps</code>, and <code>weight</code> parameters.</span>
                  ) : (
                    <span><strong>Diet Schema:</strong> Include day and list of meals with <code>time</code>, <code>food</code>, and <code>calories</code> parameters.</span>
                  )}
                </div>

                <textarea
                  value={planText}
                  onChange={(e) => setPlanText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '320px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#10b981',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    lineHeight: '1.5'
                  }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={handleSavePlan} className="btn btn-primary" style={{ width: '100%' }}>
                    Save & Deploy Plan to Trainee
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏋️‍♀️</span>
                <p>Select a member from the trainee roster to assign customized nutrition and exercise routines.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
