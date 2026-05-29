import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, classesRes, noticesRes] = await Promise.all([
          fetch('http://localhost:5000/api/member/plans'),
          fetch('http://localhost:5000/api/member/classes'),
          fetch('http://localhost:5000/api/auth/notices')
        ]);
        
        const plansData = await plansRes.json();
        const noticesData = await noticesRes.json();
        
        let classesData = { success: false };
        if (classesRes.status === 200) {
          classesData = await classesRes.json();
        }
        
        if (plansData.success) setPlans(plansData.data);
        if (noticesData.success) setNotices(noticesData.data);
        
        if (classesData.success) {
          setClasses(classesData.data);
        } else {
          setClasses([
            { name: 'HIIT Blast & Core', time: '08:00 AM - 09:30 AM', day: 'Monday', trainerName: 'Marcus Vance' },
            { name: 'Vinyasa Power Flow', time: '10:00 AM - 11:30 AM', day: 'Wednesday', trainerName: 'Sarah Jenkins' },
            { name: 'CrossFit Beast Mode', time: '05:00 PM - 06:30 PM', day: 'Friday', trainerName: 'Marcus Vance' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ position: 'relative', paddingBottom: '5rem', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* 🌌 High-End Cyberpunk Background Glowing Circles */}
      <div className="hero-glow-container">
        <div className="glow-circle-purple"></div>
        <div className="glow-circle-cyan"></div>
      </div>

      {/* Hero Section */}
      <header style={{
        position: 'relative',
        zIndex: 1,
        padding: '8rem 2rem 5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <span className="badge badge-success" style={{
          letterSpacing: '0.15em',
          padding: '0.5rem 1.25rem',
          fontSize: '0.75rem',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
          animation: 'pulse-glow 4s infinite'
        }}>⚡ THE CYBERNETIC ATHLETICS LAB</span>
        
        <h1 className="hero-title floating-effect" style={{
          fontSize: '4.8rem',
          lineHeight: '1.05',
          maxWidth: '900px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          color: '#fff'
        }}>
          Evolve Your <span className="text-gradient-purple">Strength</span> <br />& Rewrite Your <span className="text-gradient-cyan">Limits</span>
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          maxWidth: '650px',
          margin: '0.5rem auto 1.5rem auto',
          lineHeight: '1.7'
        }}>
          Welcome to the next generation of physical training. Sync nutrition modules, schedule routines with elite coaches, and book seats in heavy-duty group sessions.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', zIndex: 2 }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem', animation: 'pulse-glow 2s infinite' }}>
            Claim Membership Pass
          </Link>
          <a href="#plans" className="btn btn-outline" style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}>
            Explore Plans
          </a>
        </div>
      </header>

      {/* 📣 NOTICE BOARD BOARD BROADCAST (New Section) */}
      {notices.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '3rem auto', padding: '0 2rem' }}>
          <div className="glass-panel" style={{
            padding: '2.5rem',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.75rem' }}>📢</span>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', color: '#fff', margin: 0 }}>
                FACILITY <span className="text-gradient-purple">ANNOUNCEMENTS</span>
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className={`notice-card notice-${notice.category}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}>{notice.title}</h3>
                    <span className={`badge badge-${
                      notice.category === 'important' ? 'danger' : notice.category === 'event' ? 'warning' : 'info'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {notice.category}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{notice.content}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Broadcast Date: {new Date(notice.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid Features */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '5rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3.5rem', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
          OUR CYBERNETIC <span className="text-gradient-cyan">MATRIX</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem'
        }}>
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(168, 85, 247, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)' }}>🥗</div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'Outfit' }}>Diet Nutrition Protocols</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Your dedicated personal trainer drafts custom macro-balanced meal schedules updated instantly in your dashboard feed.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(6, 182, 212, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' }}>🏋️</div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'Outfit' }}>Modular Rep Regimens</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Formulate strength sets, target reps, and weights logs. Access custom routines designed exclusively for your anatomical metrics.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'var(--transition)' }}
               onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <div style={{ fontSize: '2.5rem', background: 'rgba(244, 63, 94, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(244, 63, 94, 0.2)' }}>📅</div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'Outfit' }}>Group Session Bookings</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Check real-time student capacities and reserve training spots in HIIT, CrossFit, and Power Yoga classes with one-click bookings.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="plans" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '7rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
          ELITE <span className="text-gradient-purple">MEMBERSHIP PASSES</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '4.5rem', fontSize: '1.1rem' }}>
          Select your training tier. Gain unlimited gym access, custom programs, and coaching matching.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading membership plans...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {plans.map((plan) => (
              <div key={plan._id} className="glass-panel premium-card-glow" style={{
                padding: '3.5rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'relative',
                border: plan.price > 100 ? '2px solid var(--primary)' : '1px solid var(--border)',
                boxShadow: plan.price > 100 ? '0 0 25px rgba(168, 85, 247, 0.2)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
              }}>
                {plan.price > 100 && (
                  <span className="badge badge-success" style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '0.65rem',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                  }}>VIP ACCESS</span>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff' }}>${plan.price}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>/ {plan.duration} mo</span>
                  </div>
                </div>

                <ul style={{ position: 'relative', zIndex: 1, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✔</span> {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/register" className={`btn ${plan.price > 100 ? 'btn-primary' : 'btn-outline'}`} style={{ position: 'relative', zIndex: 1, marginTop: 'auto', textAlign: 'center', textDecoration: 'none' }}>
                  Purchase Membership Pass
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Class Schedule Grid */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '5rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'Outfit' }}>
          WEEKLY <span className="text-gradient-cyan">LAB SCHEDULES</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '3.5rem' }}>
          Group training blocks open for enrollment. Claim a pass to start booking.
        </p>

        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Class Title</th>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Coach</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{cls.name}</td>
                    <td><span className="badge badge-info">{cls.day}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{cls.time}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{cls.trainer?.name || cls.trainerName || 'Alpha Coach'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
