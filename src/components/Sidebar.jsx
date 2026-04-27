import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/needs-map', icon: 'map', label: 'Map View' },
  { path: '/volunteer-matching', icon: 'diversity_3', label: 'Volunteer Matching' },
  { path: '/tasks', icon: 'assignment', label: 'Tasks' },
  { path: '/profile', icon: 'account_circle', label: 'User Profile' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span className="material-symbols-outlined">diversity_3</span>
          </div>
          <div>
            <h1 className="brand-name">ImpactBridge</h1>
            <p className="brand-subtitle">Community Ops</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-brief">
            <div className="avatar-sm">AS</div>
            <div className="user-text">
              <p className="user-name">Aryan Sharma</p>
              <p className="user-role">Coordinator</p>
            </div>
          </div>
          <button className="btn-new-request" style={{ marginTop: '16px' }}>
            <span className="material-symbols-outlined">add</span>
            New Request
          </button>
        </div>
      </div>
    </aside>
  )
}

