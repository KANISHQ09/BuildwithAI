import { useState, useMemo } from 'react'
import { communityNeeds, urgencyLabels, urgencyColors } from '../data/communityNeeds.js'
import { volunteers } from '../data/volunteers.js'
import { findBestMatches, getInitials, categoryIcons } from '../utils/matchingEngine.js'
import './VolunteerMatching.css'

export default function VolunteerMatching() {
  const [selectedNeed, setSelectedNeed] = useState(communityNeeds[0])
  const [assignedMap, setAssignedMap] = useState({})

  const matches = useMemo(() => findBestMatches(selectedNeed, volunteers, 8), [selectedNeed])

  const handleAssign = (volunteerId) => {
    setAssignedMap(prev => ({ ...prev, [`${selectedNeed.id}-${volunteerId}`]: true }))
  }

  return (
    <div className="page-content match-page">
      {/* Header */}
      <div className="match-header animate-fade-in-up">
        <div>
          <h2 className="text-headline-md">Smart Volunteer Matching</h2>
          <p className="match-desc">AI-powered matching engine calculates optimal volunteer-to-task assignments using skill compatibility, geographic proximity, and availability scoring.</p>
        </div>
        <div className="match-header-stats">
          <div className="header-stat-pill">
            <span className="material-symbols-outlined" style={{fontSize:16, color:'var(--secondary-container)'}}>auto_awesome</span>
            <span>{volunteers.length} Volunteers</span>
          </div>
          <div className="header-stat-pill">
            <span className="material-symbols-outlined" style={{fontSize:16, color:'var(--on-tertiary-container)'}}>task</span>
            <span>{communityNeeds.filter(n=>n.status==='Open').length} Open Needs</span>
          </div>
        </div>
      </div>

      {/* Formula display */}
      <div className="formula-card card animate-fade-in-up" style={{animationDelay:'100ms'}}>
        <div className="formula-row">
          <span className="formula-title">Matching Algorithm</span>
          <code className="formula-code">(SkillMatch × 0.40) + (Proximity × 0.35) + (Availability × 0.25) + Experience Bonus</code>
        </div>
      </div>

      <div className="match-layout">
        {/* Left: Needs selector */}
        <div className="needs-selector">
          <h4 className="selector-title">Select Community Need</h4>
          <div className="needs-scroll">
            {communityNeeds.filter(n => n.status === 'Open').slice(0, 10).map(need => (
              <div
                key={need.id}
                className={`need-select-card ${selectedNeed.id === need.id ? 'active' : ''}`}
                onClick={() => setSelectedNeed(need)}
              >
                <div className="nsc-top">
                  <div className="nsc-icon" style={{background: urgencyColors[need.urgency].bg}}>
                    <span className="material-symbols-outlined" style={{fontSize:18, color: urgencyColors[need.urgency].text}}>
                      {categoryIcons[need.category] || 'help'}
                    </span>
                  </div>
                  <span className={`badge ${need.urgency>=4?'badge-critical':need.urgency>=3?'badge-urgent':'badge-success'}`}>
                    {urgencyLabels[need.urgency]}
                  </span>
                </div>
                <h5 className="nsc-title">{need.title}</h5>
                <p className="nsc-area">{need.location.area} · {need.volunteersAssigned}/{need.volunteersNeeded} assigned</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Match Results */}
        <div className="match-results">
          <div className="match-results-header">
            <h4 className="mr-title">Best Matches for: <span style={{color:'var(--secondary-container)'}}>{selectedNeed.title}</span></h4>
            <p className="mr-desc">{matches.length} volunteers ranked by compatibility score</p>
          </div>

          <div className="match-cards stagger-children">
            {matches.map((match, index) => {
              const v = match.volunteer
              const isAssigned = assignedMap[`${selectedNeed.id}-${v.id}`]
              return (
                <div key={v.id} className={`match-card card ${isAssigned ? 'assigned' : ''}`}>
                  <div className="mc-top">
                    <div className="mc-rank">#{index + 1}</div>
                    <div className="mc-profile">
                      <div className="mc-avatar" style={{
                        background: index === 0 ? 'var(--secondary-container)' : 'var(--primary-container)'
                      }}>
                        {getInitials(v.name)}
                      </div>
                      <div>
                        <h5 className="mc-name">{v.name}</h5>
                        <p className="mc-role">{v.role} · {v.location.area}</p>
                      </div>
                    </div>
                    <div className="mc-score-circle" style={{
                      background: match.score >= 80 ? 'linear-gradient(135deg,var(--on-tertiary-container),#34d399)' :
                                  match.score >= 60 ? 'linear-gradient(135deg,var(--secondary-container),#fb923c)' :
                                  'linear-gradient(135deg,#94a3b8,#cbd5e1)'
                    }}>
                      <span className="mc-score-val">{match.score}</span>
                      <span className="mc-score-lbl">MATCH</span>
                    </div>
                  </div>

                  <div className="mc-bars">
                    <div className="mc-bar-item">
                      <div className="mc-bar-label"><span>Skill Match</span><span>{match.breakdown.skillMatch}%</span></div>
                      <div className="progress-bar"><div className="progress-bar-fill" style={{width:`${match.breakdown.skillMatch}%`,background:'var(--secondary-container)'}}></div></div>
                    </div>
                    <div className="mc-bar-item">
                      <div className="mc-bar-label"><span>Proximity</span><span>{match.breakdown.proximity}%</span></div>
                      <div className="progress-bar"><div className="progress-bar-fill" style={{width:`${match.breakdown.proximity}%`,background:'var(--on-tertiary-container)'}}></div></div>
                    </div>
                    <div className="mc-bar-item">
                      <div className="mc-bar-label"><span>Availability</span><span>{match.breakdown.availability}%</span></div>
                      <div className="progress-bar"><div className="progress-bar-fill" style={{width:`${match.breakdown.availability}%`,background:'#3b82f6'}}></div></div>
                    </div>
                  </div>

                  <div className="mc-skills">
                    {match.breakdown.matchedSkills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                    {match.breakdown.matchedSkills.length === 0 && <span className="skill-tag muted">No direct match</span>}
                  </div>

                  <div className="mc-footer">
                    <div className="mc-meta">
                      <span className="material-symbols-outlined" style={{fontSize:14}}>star</span>
                      <span>{v.rating}/5.0</span>
                      <span className="mc-meta-sep">·</span>
                      <span>{v.hoursContributed}h contributed</span>
                      <span className="mc-meta-sep">·</span>
                      <span>{match.breakdown.distance}km away</span>
                    </div>
                    {isAssigned ? (
                      <span className="badge badge-success">
                        <span className="material-symbols-outlined" style={{fontSize:12}}>check</span>
                        Assigned
                      </span>
                    ) : (
                      <button className="btn-primary mc-assign-btn" onClick={() => handleAssign(v.id)}>
                        <span className="material-symbols-outlined" style={{fontSize:16}}>person_add</span>
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
