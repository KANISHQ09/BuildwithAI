import { useState, useEffect, useRef } from 'react'
import { communityNeeds, urgencyColors, urgencyLabels, categories } from '../data/communityNeeds.js'
import { categoryIcons } from '../utils/matchingEngine.js'
import './NeedsMap.css'

export default function NeedsMap() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedNeed, setSelectedNeed] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])

  const filteredNeeds = activeFilter === 'All'
    ? communityNeeds
    : communityNeeds.filter(n => n.category === activeFilter)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [23.5, 78.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    })
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map)

    mapInstance.current = map
    setMapLoaded(true)

    return () => { map.remove(); mapInstance.current = null; }
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !window.L) return
    const L = window.L
    const map = mapInstance.current

    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    filteredNeeds.forEach(need => {
      const colors = urgencyColors[need.urgency]
      const size = need.urgency >= 4 ? 16 : need.urgency >= 3 ? 12 : 10
      const pulse = need.urgency >= 4 ? `<div class="map-pulse" style="border-color:${colors.border}"></div>` : ''

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-dot" style="width:${size}px;height:${size}px;background:${colors.border};box-shadow:0 0 8px ${colors.border}66">${pulse}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      })

      const marker = L.marker([need.location.lat, need.location.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedNeed(need))

      markersRef.current.push(marker)
    })
  }, [filteredNeeds, mapLoaded])

  const urgencyCounts = [5,4,3,2,1].map(u => ({
    level: u,
    label: urgencyLabels[u],
    count: filteredNeeds.filter(n => n.urgency === u).length,
    color: urgencyColors[u].border
  }))

  return (
    <div className="map-page">
      {/* Left Panel */}
      <div className="map-left-panel">
        <div className="map-panel-header">
          <h2 className="text-headline-md">Geographic Needs</h2>
          <p className="map-panel-desc">Interactive mapping of community needs across Madhya Pradesh</p>
        </div>

        {/* Filters */}
        <div className="map-filters">
          <button
            className={`chip ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >All</button>
          {['Healthcare','Education','Water & Sanitation','Infrastructure','Disaster Relief'].map(cat => (
            <button
              key={cat}
              className={`chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              <span className="material-symbols-outlined" style={{fontSize:14}}>{categoryIcons[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Urgency Legend */}
        <div className="urgency-legend">
          <h4 className="legend-title">Urgency Distribution</h4>
          <div className="legend-items">
            {urgencyCounts.map(u => (
              <div key={u.level} className="legend-item">
                <div className="legend-dot" style={{background: u.color}}></div>
                <span className="legend-label">{u.label}</span>
                <span className="legend-count">{u.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Need Detail */}
        {selectedNeed && (
          <div className="need-detail-panel animate-slide-in">
            <div className="need-detail-header">
              <span className={`badge ${selectedNeed.urgency>=4?'badge-critical':'badge-neutral'}`}>
                {urgencyLabels[selectedNeed.urgency]}
              </span>
              <button className="icon-btn-sm" onClick={() => setSelectedNeed(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <h4 className="need-detail-title">{selectedNeed.title}</h4>
            <p className="need-detail-desc">{selectedNeed.description}</p>
            <div className="need-detail-meta">
              <div className="meta-row">
                <span className="material-symbols-outlined" style={{fontSize:16}}>location_on</span>
                <span>{selectedNeed.location.area}</span>
              </div>
              <div className="meta-row">
                <span className="material-symbols-outlined" style={{fontSize:16}}>person</span>
                <span>{selectedNeed.reportedBy}</span>
              </div>
              <div className="meta-row">
                <span className="material-symbols-outlined" style={{fontSize:16}}>group</span>
                <span>{selectedNeed.volunteersAssigned}/{selectedNeed.volunteersNeeded} volunteers</span>
              </div>
            </div>
            <div className="progress-bar" style={{marginTop:12}}>
              <div className="progress-bar-fill" style={{
                width: `${(selectedNeed.volunteersAssigned/selectedNeed.volunteersNeeded)*100}%`,
                background: 'var(--secondary-container)'
              }}></div>
            </div>
            <button className="btn-accent" style={{marginTop:16, width:'100%'}}>
              <span className="material-symbols-outlined" style={{fontSize:18}}>person_add</span>
              Assign Volunteers
            </button>
          </div>
        )}

        {/* Needs List */}
        <div className="needs-list">
          {filteredNeeds.slice(0,8).map(need => (
            <div
              key={need.id}
              className={`need-list-item ${selectedNeed?.id === need.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedNeed(need)
                if (mapInstance.current) {
                  mapInstance.current.flyTo([need.location.lat, need.location.lng], 9, { duration: 0.8 })
                }
              }}
            >
              <div className="need-list-dot" style={{background: urgencyColors[need.urgency].border}}></div>
              <div className="need-list-info">
                <span className="need-list-title">{need.title.substring(0,30)}</span>
                <span className="need-list-area">{need.location.area}</span>
              </div>
              <span className={`badge ${need.urgency>=4?'badge-critical':need.urgency>=3?'badge-urgent':'badge-success'}`}>
                {urgencyLabels[need.urgency]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <div ref={mapRef} className="leaflet-map-wrap"></div>
        {/* Map overlay stats */}
        <div className="map-overlay-stats glass">
          <div className="map-stat">
            <span className="map-stat-value">{filteredNeeds.length}</span>
            <span className="map-stat-label">Active Needs</span>
          </div>
          <div className="map-stat">
            <span className="map-stat-value">{filteredNeeds.filter(n=>n.urgency>=4).length}</span>
            <span className="map-stat-label">Critical</span>
          </div>
          <div className="map-stat">
            <span className="map-stat-value">{filteredNeeds.reduce((s,n)=>s+n.volunteersAssigned,0)}</span>
            <span className="map-stat-label">Deployed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
