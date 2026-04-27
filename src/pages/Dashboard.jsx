import { useState, useEffect } from 'react'
import { communityNeeds, urgencyColors } from '../data/communityNeeds.js'
import { volunteers } from '../data/volunteers.js'
import { activityFeed } from '../data/activityFeed.js'
import './Dashboard.css'

function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseInt(value)
    const duration = 1200
    const step = Math.max(1, Math.floor(end / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span>{display.toLocaleString()}{suffix}</span>
}

export default function Dashboard() {
  const totalNeeds = communityNeeds.length
  const activeVolunteers = volunteers.filter(v => v.assignedTasks.length > 0).length
  const criticalNeeds = communityNeeds.filter(n => n.urgency >= 4).length
  const completionRate = Math.round((communityNeeds.filter(n => n.status === 'In Progress').length / totalNeeds) * 100)
  const totalHours = volunteers.reduce((sum, v) => sum + v.hoursContributed, 0)

  // Urgency distribution for heatmap
  const urgencyDist = [5,4,3,2,1].map(u => ({
    level: u,
    count: communityNeeds.filter(n => n.urgency === u).length,
    label: ['','Minimal','Low','Medium','High','Critical'][u]
  }))

  // Category counts
  const catCounts = {}
  communityNeeds.forEach(n => { catCounts[n.category] = (catCounts[n.category] || 0) + 1 })

  // Generate heatmap cells
  const heatmapCells = Array.from({ length: 24 }, (_, i) => {
    const opacities = [0.2,0.4,0.1,0.9,0.6,0.3,0.8,0.5,1,0.4,0.7,0.2,0.1,0.5,0.7,0.9,0.2,0.6,0.1,0.4,0.3,0.5,0.8,0.1]
    return opacities[i]
  })

  return (
    <div className="page-content">
      {/* Header */}
      <div className="dash-header animate-fade-in-up">
        <div>
          <div className="dash-header-title-row">
            <h2 className="text-headline-md">System Overview</h2>
            <div className="live-badge">
              <span className="live-dot"></span>
              <span>Live</span>
            </div>
          </div>
          <p className="dash-subtitle">Real-time engagement metrics and operational status across all active hubs.</p>
        </div>
        <div className="dash-header-actions">
          <div className="avatar-stack">
            <div className="avatar-sm">AS</div>
            <div className="avatar-sm">PV</div>
            <div className="avatar-sm cnt">+4</div>
          </div>
          <button className="btn-secondary">Export Report</button>
        </div>
      </div>

      {/* Primary Grid: Heatmap + Impact Score */}
      <div className="dash-primary-grid stagger-children">
        {/* Urgency Heatmap */}
        <section className="card heatmap-card">
          <div className="heatmap-header">
            <div>
              <h3 className="card-title">Urgency Heatmap</h3>
              <p className="card-desc">Regional priority levels based on current pending request volume.</p>
            </div>
            <div className="intensity-scale">
              <span className="intensity-label">Intensity Scale</span>
              <div className="intensity-dots">
                <div className="idot" style={{background:'#eff4ff'}}></div>
                <div className="idot" style={{background:'#ffb690'}}></div>
                <div className="idot" style={{background:'#fd761a'}}></div>
                <div className="idot" style={{background:'#9d4300'}}></div>
              </div>
            </div>
          </div>
          <div className="heatmap-grid">
            {heatmapCells.map((op, i) => (
              <div key={i} className="heatmap-cell" style={{
                background: `rgba(253,118,26,${op})`,
                animationDelay: `${i * 30}ms`
              }}></div>
            ))}
          </div>
          <div className="heatmap-footer">
            <div className="heatmap-stats">
              <div>
                <span className="stat-label">Total Urgent</span>
                <div className="stat-value-row">
                  <span className="stat-value" style={{color:'var(--secondary-container)'}}><AnimatedCounter value={criticalNeeds} /></span>
                  <span className="stat-trend trend-up">+4.2%</span>
                </div>
              </div>
              <div>
                <span className="stat-label">Active Deployments</span>
                <span className="stat-value"><AnimatedCounter value={communityNeeds.filter(n=>n.status==='In Progress').length} /></span>
              </div>
            </div>
            <button className="btn-primary">
              Detailed Analytics
              <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Impact Score Card */}
        <section className="card-dark impact-card">
          <div className="impact-header">
            <span className="impact-label">Impact Metrics</span>
            <span className="material-symbols-outlined" style={{opacity:0.4}}>hub</span>
          </div>
          <h3 className="impact-subtitle">Social Impact Score</h3>
          <div className="impact-score-row">
            <span className="impact-score"><AnimatedCounter value={89} />.4</span>
            <span className="impact-badge">
              <span className="material-symbols-outlined" style={{fontSize:12}}>trending_up</span>
              12%
            </span>
          </div>
          <p className="impact-desc">Top performing quarter against community sustainability goals.</p>
          <div className="impact-sparkline">
            {[12,20,16,24,22,32,28].map((h,i) => (
              <div key={i} className="spark-bar" style={{
                height: `${h * 4}px`,
                background: i >= 5 ? 'var(--tertiary-fixed-dim)' : `rgba(255,255,255,${0.05 + i*0.03})`,
                boxShadow: i === 5 ? '0 0 15px rgba(78,222,163,0.3)' : 'none'
              }}></div>
            ))}
          </div>
          <div className="impact-glow-1"></div>
          <div className="impact-glow-2"></div>
        </section>
      </div>

      {/* Secondary Grid: Volunteer Capacity, Priority Requests, Activity */}
      <div className="dash-secondary-grid stagger-children">
        {/* Volunteer Capacity */}
        <section className="card capacity-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Volunteer Capacity</h3>
              <p className="card-desc">Resource allocation status.</p>
            </div>
            <select className="filter-select">
              <option>Next 7 Days</option>
              <option>Next 30 Days</option>
            </select>
          </div>
          <div className="capacity-bars">
            {[
              { label: 'Medical Response', pct: 82, color: 'var(--secondary-container)' },
              { label: 'Logistics & Transport', pct: 45, color: 'var(--secondary-fixed-dim)' },
              { label: 'General Support', pct: 98, color: 'var(--on-tertiary-container)' }
            ].map((bar, i) => (
              <div key={i} className="cap-bar-item">
                <div className="cap-bar-labels">
                  <span>{bar.label}</span>
                  <span className="cap-pct">{bar.pct}%</span>
                </div>
                <div className="progress-bar" style={{height:10}}>
                  <div className="progress-bar-fill" style={{width:`${bar.pct}%`, background:bar.color}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="predictive-alert">
            <span className="material-symbols-outlined" style={{color:'var(--secondary)', fontSize:18}}>auto_awesome</span>
            <div>
              <p className="alert-title">Predictive Alert</p>
              <p className="alert-desc">Logistics drop predicted Friday.</p>
            </div>
          </div>
        </section>

        {/* Priority Requests */}
        <section className="card priority-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Priority Requests</h3>
              <p className="card-desc">Immediate action items.</p>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          <table className="priority-table">
            <thead>
              <tr>
                <th>Type</th>
                <th style={{textAlign:'right'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {communityNeeds.filter(n=>n.urgency>=4).slice(0,4).map(need => (
                <tr key={need.id} className="priority-row">
                  <td>
                    <div className="priority-type">
                      <div className="priority-icon-wrap" style={{
                        background: urgencyColors[need.urgency].bg
                      }}>
                        <span className="material-symbols-outlined" style={{
                          fontSize:18, color: urgencyColors[need.urgency].text
                        }}>
                          {need.category === 'Healthcare' ? 'medical_services' :
                           need.category === 'Water & Sanitation' ? 'water_drop' :
                           need.category === 'Education' ? 'school' :
                           need.category === 'Disaster Relief' ? 'emergency' :
                           need.category === 'Food Security' ? 'restaurant' : 'warning'}
                        </span>
                      </div>
                      <span className="priority-label">{need.title.split(' - ')[0].substring(0,18)}</span>
                    </div>
                  </td>
                  <td style={{textAlign:'right'}}>
                    <span className={`badge ${need.status === 'In Progress' ? 'badge-high' : 'badge-neutral'}`}>
                      {need.status === 'In Progress' ? 'Deploying' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Activity Feed */}
        <section className="card activity-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Recent Activity</h3>
              <p className="card-desc">Live operational updates.</p>
            </div>
            <button className="icon-btn-sm">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="activity-list">
            {activityFeed.slice(0,4).map((item, i) => (
              <div key={item.id} className="activity-item" style={{animationDelay:`${i*100}ms`}}>
                <div className="activity-icon-col">
                  <div className="activity-icon" style={{background:item.bgColor, color:item.color, borderColor: `${item.color}22`}}>
                    <span className="material-symbols-outlined" style={{fontSize:18}}>{item.icon}</span>
                  </div>
                  {i < 3 && <div className="activity-line"></div>}
                </div>
                <div className="activity-text">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-desc">{item.description}</p>
                  <p className="activity-time">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Live Activity Monitor */}
      <section className="card monitor-section animate-fade-in-up" style={{animationDelay:'400ms'}}>
        <div className="monitor-grid">
          <div className="monitor-info">
            <div className="monitor-title-row">
              <span className="monitor-dot"></span>
              <h4 className="monitor-title">Live Activity Monitor</h4>
            </div>
            <p className="monitor-desc">Real-time geospatial processing of sensor data from active deployment nodes across Madhya Pradesh.</p>
            <div className="monitor-stats">
              <div className="monitor-stat">
                <span>Active Nodes</span>
                <span className="monitor-stat-value"><AnimatedCounter value={1240} /></span>
              </div>
              <div className="monitor-stat">
                <span>Sync Frequency</span>
                <span className="monitor-stat-value">250ms</span>
              </div>
              <div className="monitor-stat-bar">
                <div className="monitor-stat-bar-labels">
                  <span>Signal Stability</span><span>98%</span>
                </div>
                <div className="progress-bar" style={{height:6}}>
                  <div className="progress-bar-fill" style={{width:'98%',background:'var(--on-tertiary-container)'}}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="monitor-map">
            <div className="monitor-map-bg"></div>
            <div className="monitor-ping p1"><div className="ping-ring"></div><div className="ping-dot" style={{background:'var(--secondary-container)'}}></div></div>
            <div className="monitor-ping p2"><div className="ping-ring green"></div><div className="ping-dot" style={{background:'var(--on-tertiary-container)'}}></div></div>
            <div className="monitor-coords">LAT: 23.25° N, LONG: 77.41° E</div>
          </div>
        </div>
      </section>
    </div>
  )
}
