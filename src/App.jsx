import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NeedsMap from './pages/NeedsMap.jsx'
import VolunteerMatching from './pages/VolunteerMatching.jsx'
import Tasks from './pages/Tasks.jsx'
import UserProfile from './pages/UserProfile.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<><TopBar title="Operations Dashboard" /><Dashboard /></>} />
            <Route path="/needs-map" element={<><TopBar title="Geographic Needs Map" /><NeedsMap /></>} />
            <Route path="/volunteer-matching" element={<><TopBar title="Smart Volunteer Matching" /><VolunteerMatching /></>} />
            <Route path="/tasks" element={<><TopBar title="Task Management" /><Tasks /></>} />
            <Route path="/profile" element={<><TopBar title="User Profile" /><UserProfile /></>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

