import './UserProfile.css'

export default function UserProfile() {
  const user = {
    name: "Aryan Sharma",
    role: "Senior Operations Coordinator",
    location: "Bhopal, Madhya Pradesh",
    email: "aryan.sharma@impactbridge.org",
    joined: "March 2024",
    avatar: "AS",
    stats: [
      { label: "Tasks Managed", value: "142", icon: "task", color: "#3b82f6" },
      { label: "Volunteers Lead", value: "28", icon: "groups", color: "#10b981" },
      { label: "Hours Contributed", value: "850", icon: "schedule", color: "#f59e0b" },
      { label: "Impact Score", value: "9.2", icon: "star", color: "#8b5cf6" }
    ],
    activeAssignments: [
      { id: 'N001', title: 'Emergency Water Supply', area: 'Chhatarpur', status: 'In Progress', progress: 65 },
      { id: 'N007', title: 'Sanitation Drive', area: 'Bhopal', status: 'In Progress', progress: 40 }
    ],
    recentAchievements: [
      { title: "Crisis Master", desc: "Coordinated 5 disaster relief operations", icon: "military_tech" },
      { title: "Community Pillar", desc: "100+ positive volunteer reviews", icon: "volunteer_activism" }
    ]
  }

  return (
    <div className="page-content profile-page">
      <div className="profile-header animate-fade-in-up">
        <div className="profile-cover"></div>
        <div className="profile-info-row">
          <div className="profile-avatar-large">{user.avatar}</div>
          <div className="profile-main-meta">
            <h2 className="profile-name">{user.name}</h2>
            <div className="profile-sub-meta">
              <span>{user.role}</span>
              <span className="dot"></span>
              <span>{user.location}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-secondary">Edit Profile</button>
            <button className="btn-accent">Share Impact</button>
          </div>
        </div>
      </div>

      <div className="profile-grid stagger-children">
        {/* Left Column: Details & Achievements */}
        <div className="profile-left">
          <section className="card profile-details">
            <h3 className="section-title">About</h3>
            <p className="profile-bio">Dedicated coordinator focusing on sustainable resource allocation in central India. Specialized in rapid response logistics and tribal community engagement.</p>
            <div className="detail-list">
              <div className="detail-item">
                <span className="material-symbols-outlined">mail</span>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="material-symbols-outlined">calendar_today</span>
                <span>Joined {user.joined}</span>
              </div>
              <div className="detail-item">
                <span className="material-symbols-outlined">verified</span>
                <span>Verified Coordinator</span>
              </div>
            </div>
          </section>

          <section className="card profile-achievements">
            <h3 className="section-title">Achievements</h3>
            <div className="achievement-list">
              {user.recentAchievements.map((ach, i) => (
                <div key={i} className="achievement-item">
                  <div className="achievement-icon">
                    <span className="material-symbols-outlined">{ach.icon}</span>
                  </div>
                  <div>
                    <h4 className="ach-title">{ach.title}</h4>
                    <p className="ach-desc">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Stats & Active Work */}
        <div className="profile-right">
          <div className="stats-grid">
            {user.stats.map((stat, i) => (
              <div key={i} className="card stat-card">
                <div className="stat-icon" style={{background: `${stat.color}15`, color: stat.color}}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div className="stat-info">
                  <span className="stat-val">{stat.value}</span>
                  <span className="stat-lbl">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <section className="card active-work">
            <h3 className="section-title">Active Assignments</h3>
            <div className="assignment-list">
              {user.activeAssignments.map(asgn => (
                <div key={asgn.id} className="assignment-item">
                  <div className="asgn-info">
                    <h4 className="asgn-title">{asgn.title}</h4>
                    <span className="asgn-area">{asgn.area}</span>
                  </div>
                  <div className="asgn-progress-col">
                    <div className="asgn-prog-text">
                      <span>Progress</span>
                      <span>{asgn.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{height: 6}}>
                      <div className="progress-bar-fill" style={{width: `${asgn.progress}%`, background: 'var(--secondary-container)'}}></div>
                    </div>
                  </div>
                  <button className="icon-btn-sm">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="view-all-btn" style={{marginTop: 16, width: '100%'}}>View Task History</button>
          </section>
        </div>
      </div>
    </div>
  )
}
