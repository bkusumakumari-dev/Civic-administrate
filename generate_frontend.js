const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src');

function writeApp() {
    const content = `import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('m1');

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 className="logo">CivicPulse Nexus</h2>
        <nav>
          <button className={activeTab === 'm1' ? 'active' : ''} onClick={() => setActiveTab('m1')}>Citizen & Grievance (M1)</button>
          <button className={activeTab === 'm2' ? 'active' : ''} onClick={() => setActiveTab('m2')}>Certificates (M2)</button>
          <button className={activeTab === 'm3' ? 'active' : ''} onClick={() => setActiveTab('m3')}>Welfare (M3)</button>
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h1>Smart Governance Dashboard</h1>
          <div className="user-profile">Admin | Logout</div>
        </header>
        <div className="dashboard-content">
          {activeTab === 'm1' && <Milestone1 />}
          {activeTab === 'm2' && <Milestone2 />}
          {activeTab === 'm3' && <Milestone3 />}
        </div>
      </div>
    </div>
  )
}

function Milestone1() {
  return (
    <div className="module">
      <h3>Citizen & Grievance Management</h3>
      <div className="stats">
        <div className="stat-card"><h4>Registered Citizens</h4><p>2.4M</p></div>
        <div className="stat-card"><h4>Grievances/Month</h4><p>12.4K</p></div>
        <div className="stat-card"><h4>Resolution Rate</h4><p>94%</p></div>
      </div>
      <div className="data-table">
        <h4>Recent Grievances</h4>
        <table>
          <thead><tr><th>ID</th><th>Citizen</th><th>Category</th><th>Status</th><th>SLA</th></tr></thead>
          <tbody>
            <tr><td>GRV-2024-847</td><td>Ramesh Kumar</td><td>Water Supply</td><td><span className="status-badge progress">In Progress</span></td><td>2 days</td></tr>
            <tr><td>GRV-2024-848</td><td>Priya Sharma</td><td>Street Light</td><td><span className="status-badge resolved">Resolved</span></td><td>0 days</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Milestone2() {
  return (
    <div className="module">
      <h3>Certificate & Permit Management</h3>
      <div className="stats">
        <div className="stat-card"><h4>Applications/Month</h4><p>24.7K</p></div>
        <div className="stat-card"><h4>Avg Approval Time</h4><p>2.4 days</p></div>
        <div className="stat-card"><h4>Certificates Issued</h4><p>847K</p></div>
      </div>
      <div className="data-table">
        <h4>Recent Applications</h4>
        <table>
          <thead><tr><th>ID</th><th>Applicant</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>APP-2024-1247</td><td>Priya Sharma</td><td>Birth Certificate</td><td><span className="status-badge approved">Approved</span></td><td><button>View</button></td></tr>
            <tr><td>APP-2024-1248</td><td>Amit Patel</td><td>Trade License</td><td><span className="status-badge pending">Pending</span></td><td><button>Review</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Milestone3() {
  return (
    <div className="module">
      <h3>Welfare & Budget Management</h3>
      <div className="stats">
        <div className="stat-card"><h4>Beneficiaries</h4><p>247K</p></div>
        <div className="stat-card"><h4>Funds Disbursed</h4><p>$24.7M</p></div>
        <div className="stat-card"><h4>Budget Utilized</h4><p>87%</p></div>
      </div>
      <div className="data-table">
        <h4>Welfare Schemes</h4>
        <table>
          <thead><tr><th>Scheme Name</th><th>Beneficiaries</th><th>Allocated</th><th>Disbursed</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>PM Awas Yojana</td><td>2,847</td><td>$2.4M</td><td>$2.1M</td><td><span className="status-badge active">Active</span></td></tr>
            <tr><td>Student Scholarship</td><td>15,000</td><td>$5.0M</td><td>$4.8M</td><td><span className="status-badge active">Active</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
`;
    fs.writeFileSync(path.join(baseDir, 'App.tsx'), content);
}

function writeCSS() {
    const content = `
:root {
  --primary: #0f172a;
  --secondary: #004b50;
  --accent: #059669;
  --text-light: #f8fafc;
  --text-dark: #334155;
  --bg-main: #f1f5f9;
  --bg-card: #ffffff;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: var(--bg-main);
  color: var(--text-dark);
}

.app-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: var(--primary);
  color: var(--text-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--accent);
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar button {
  background: transparent;
  color: var(--text-light);
  border: none;
  text-align: left;
  padding: 12px 15px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
}

.sidebar button:hover, .sidebar button.active {
  background: var(--secondary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

header {
  background: var(--secondary);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

header h1 {
  margin: 0;
  font-size: 1.25rem;
}

.dashboard-content {
  padding: 30px;
  overflow-y: auto;
}

.module h3 {
  margin-top: 0;
  color: var(--primary);
  font-size: 1.5rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid var(--accent);
}

.stat-card h4 {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-card p {
  margin: 10px 0 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.data-table {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.progress { background: #dbeafe; color: #1e40af; }
.status-badge.resolved { background: #dcfce7; color: #166534; }
.status-badge.approved { background: #dcfce7; color: #166534; }
.status-badge.pending { background: #fef9c3; color: #854d0e; }
.status-badge.active { background: #dbeafe; color: #1e40af; }

button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #047857;
}
`;
    fs.writeFileSync(path.join(baseDir, 'App.css'), content);
}

writeApp();
writeCSS();
console.log("Frontend generated successfully.");
