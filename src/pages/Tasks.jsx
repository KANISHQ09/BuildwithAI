import { useState } from 'react'
import { communityNeeds, urgencyLabels, urgencyColors } from '../data/communityNeeds.js'
import { categoryIcons } from '../utils/matchingEngine.js'
import './Tasks.css'

const statusColumns = [
  { key: 'Open', label: 'Open', icon: 'radio_button_unchecked', color: '#64748b' },
  { key: 'In Progress', label: 'In Progress', icon: 'autorenew', color: 'var(--secondary-container)' },
  { key: 'Review', label: 'Under Review', icon: 'rate_review', color: '#8b5cf6' },
  { key: 'Completed', label: 'Completed', icon: 'check_circle', color: 'var(--on-tertiary-container)' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    // Generate some Review/Completed tasks from the data
    return communityNeeds.map(n => {
      let status = n.status
      if (n.id === 'N021' || n.id === 'N019') status = 'Completed'
      if (n.id === 'N020' || n.id === 'N010') status = 'Review'
      return { ...n, status }
    })
  })

  const [dragItem, setDragItem] = useState(null)

  const handleDragStart = (e, task) => {
    setDragItem(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (!dragItem) return
    setTasks(prev => prev.map(t => t.id === dragItem.id ? { ...t, status: newStatus } : t))
    setDragItem(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <div className="page-content tasks-page">
      {/* Header */}
      <div className="tasks-header animate-fade-in-up">
        <div>
          <h2 className="text-headline-md">Task Management</h2>
          <p className="tasks-desc">Drag & drop tasks between columns to update status. Track all community needs operations.</p>
        </div>
        <div className="tasks-header-actions">
          <button className="btn-secondary">
            <span className="material-symbols-outlined" style={{fontSize:16}}>filter_list</span>
            Filter
          </button>
          <button className="btn-accent">
            <span className="material-symbols-outlined" style={{fontSize:16}}>add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board stagger-children">
        {statusColumns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div
              key={col.key}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span className="material-symbols-outlined" style={{fontSize:18, color: col.color}}>{col.icon}</span>
                  <span>{col.label}</span>
                  <span className="kanban-count">{colTasks.length}</span>
                </div>
                <button className="icon-btn-sm">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>

              <div className="kanban-cards">
                {colTasks.slice(0, 6).map(task => (
                  <div
                    key={task.id}
                    className="kanban-card card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="kc-top">
                      <span className={`badge ${task.urgency>=4?'badge-critical':task.urgency>=3?'badge-urgent':task.urgency>=2?'badge-success':'badge-neutral'}`}>
                        {urgencyLabels[task.urgency]}
                      </span>
                      <span className="kc-id">{task.id}</span>
                    </div>
                    <h5 className="kc-title">{task.title}</h5>
                    <p className="kc-area">
                      <span className="material-symbols-outlined" style={{fontSize:14}}>location_on</span>
                      {task.location.area}
                    </p>
                    <div className="kc-footer">
                      <div className="kc-volunteers">
                        <span className="material-symbols-outlined" style={{fontSize:14}}>group</span>
                        <span>{task.volunteersAssigned}/{task.volunteersNeeded}</span>
                      </div>
                      <div className="kc-progress-wrap">
                        <div className="progress-bar" style={{height:4, width:60}}>
                          <div className="progress-bar-fill" style={{
                            width: `${Math.min(100, (task.volunteersAssigned/task.volunteersNeeded)*100)}%`,
                            background: col.color
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
