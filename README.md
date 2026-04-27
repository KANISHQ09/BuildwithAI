# 🌍 ImpactBridge: Smart Resource Allocation System

**ImpactBridge** is a high-fidelity, data-driven volunteer coordination platform designed to bridge the gap between community needs and social impact resources. Focused on the Madhya Pradesh region, it leverages an AI-powered matching engine to ensure that the right volunteers are deployed to the most urgent tasks.

🚀 **Live Demo**: [https://impact-bridge-553815255020.us-central1.run.app/](https://impact-bridge-553815255020.us-central1.run.app/)

---

## ✨ Key Features

### 📊 Operations Dashboard
A centralized "Mission Control" for NGO coordinators.
- **Urgency Heatmap**: 24-segment regional grid visualizing priority levels.
- **Social Impact Score**: Real-time KPI tracking community improvement metrics.
- **Live Monitor**: Geospatial simulation of active coordination nodes.

### 🗺️ Geographic Needs Map
Interactive Leaflet-based visualization of community requirements.
- **Urgency-Coded Markers**: 30+ realistic needs mapped across Madhya Pradesh (Bhopal, Jhabua, Chhatarpur, etc.).
- **Smart Filtering**: Filter by category (Healthcare, Education, Water, Infrastructure).
- **Need Depth**: Detailed panels for specific community reports and current allocation status.

### 🤖 Smart Volunteer Matching
An AI-driven engine that calculates weighted compatibility scores (0-100%):
- **Skill Alignment (40%)**: Matches volunteer expertise with task requirements.
- **Proximity Score (35%)**: Calculates distance using the Haversine formula.
- **Availability Match (25%)**: Ensures volunteers are free during task windows.
- **Expertise Multiplier**: Priority routing for senior/expert volunteers.

### 📋 Task Management (Kanban)
A modern operational board for tracking task lifecycles:
- **Status Columns**: Open → In Progress → Review → Completed.
- **Drag & Drop**: Seamlessly update task status via a fluid Kanban interface.
- **Allocation Tracking**: Real-time progress bars showing volunteer fulfillment.

### 👤 Coordinator Profiles
A premium dashboard for internal staff to track their personal impact and managed operations.

---

## 🛠️ Technology Stack

- **Core**: React 18+, Vite, React Router
- **Design System**: Custom Vanilla CSS (Glassmorphism, Material 3 Tokens)
- **Maps**: Leaflet.js
- **Icons**: Google Material Symbols, Lucide React
- **Deployment**: Docker, Google Cloud Run, Artifact Registry
- **CI/CD**: GitHub, Google Cloud Build

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KANISHQ09/BuildwithAI.git
   cd BuildwithAI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Production Build
```bash
npm run build
```

---

## ☁️ Deployment

The project is containerized and ready for Google Cloud Run.

### 1. Build and Push Image
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/impact-bridge
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy impact-bridge \
  --image gcr.io/[PROJECT_ID]/impact-bridge \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI (Sidebar, TopBar)
│   ├── data/             # Mock datasets (Needs, Volunteers, Feed)
│   ├── pages/            # Page-level components & styles
│   ├── utils/            # Matching logic & distance helpers
│   ├── App.jsx           # Main routing and shell
│   └── index.css         # Global Design System tokens
├── Dockerfile            # Cloud Run container definition
├── nginx.conf            # SPA routing configuration
└── vite.config.js        # Vite configuration
```

---

## 🤝 Contributing
ImpactBridge is designed to be an open framework for social impact coordination. Feel free to fork and adapt it for your local community!

---
*Built with ❤️ for Social Impact by [Your Name/Organization]*
