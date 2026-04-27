import './TopBar.css'

export default function TopBar({ title }) {
  return (
    <header className="topbar glass">
      <div className="topbar-left">
        {title && <h2 className="topbar-title">{title}</h2>}
        <nav className="topbar-nav">
          <a href="#" className="topbar-link">Global Trends</a>
          <a href="#" className="topbar-link">Impact Reports</a>
        </nav>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input type="text" placeholder="Search operations..." className="search-input" />
        </div>
        <div className="topbar-actions">
          <button className="icon-btn">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="avatar-circle">
            <span>AS</span>
          </div>
        </div>
      </div>
    </header>
  )
}
