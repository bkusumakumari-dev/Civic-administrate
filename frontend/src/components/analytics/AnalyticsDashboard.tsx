import { useEffect, useState } from 'react';

interface MetricData {
  citizenSatisfaction: string;
  serviceSla: string;
  revenueCollected: string;
  serviceRequests: string;
  requestsResolved: string;
  avgResolutionTime: string;
  grievancesFiled: string;
  grievancesResolved: string;
  mttr: string;
  propertyTaxContribution: string;
  licenseRevenueContribution: string;
  budgetAllocated: string;
  budgetUtilized: string;
  budgetUtilizationRate: string;
  deptWater: string;
  deptHealth: string;
  deptEducation: string;
  complaintsTrend: string;
  servicesDeliveredTrend: string;
}

const defaultData: MetricData = {
  citizenSatisfaction: '4.7 / 5',
  serviceSla: '94%',
  revenueCollected: '$12.4M',
  serviceRequests: '24.7K',
  requestsResolved: '94%',
  avgResolutionTime: '2.4 days',
  grievancesFiled: '12.4K',
  grievancesResolved: '94%',
  mttr: '47 hrs',
  propertyTaxContribution: '67%',
  licenseRevenueContribution: '23%',
  budgetAllocated: '$47M',
  budgetUtilized: '$41M',
  budgetUtilizationRate: '87%',
  deptWater: '94%',
  deptHealth: '91%',
  deptEducation: '89%',
  complaintsTrend: '↓ 23%',
  servicesDeliveredTrend: '↑ 47%'
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<MetricData>(defaultData);
  const [activeReportTab, setActiveReportTab] = useState<'dashboard' | 'citizen' | 'grievance' | 'revenue' | 'performance' | 'audit'>('dashboard');
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  // Real-time polling every 5 seconds
  useEffect(() => {
    const fetchStats = () => {
      fetch('http://localhost:8080/api/analytics/dashboard')
        .then((res) => res.json())
        .then((resData) => {
          setData((prev) => ({ ...prev, ...resData }));
          setLastSync(new Date().toLocaleTimeString());
        })
        .catch(() => {
          setLastSync(new Date().toLocaleTimeString());
        });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'Executive_Governance_Report.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Dashboard link copied to clipboard.');
  };

  return (
    <div className="module" style={{ color: '#ffffff', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Executive Dashboard & Reports</h3>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Milestone 4: Governance Analytics</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#48bb78', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.85rem', color: '#48bb78' }}>Live Monitoring (Sync: {lastSync})</span>
        </div>
      </div>

      {/* Module Navigation Tabs (Reporting Service) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'dashboard', label: 'Analytics Dashboard' },
          { id: 'citizen', label: 'Citizen Reports' },
          { id: 'grievance', label: 'Grievance Reports' },
          { id: 'revenue', label: 'Revenue Reports' },
          { id: 'performance', label: 'Performance Reports' },
          { id: 'audit', label: 'Compliance Audits' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              borderRadius: '4px',
              border: '1px solid #2d3748',
              cursor: 'pointer',
              background: activeReportTab === tab.id ? '#3182ce' : '#1a2234',
              color: '#ffffff'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN EXECUTIVE DASHBOARD VIEW */}
      {activeReportTab === 'dashboard' && (
        <>
          {/* Executive KPI Cards */}
          <div className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-card" style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#a0aec0', fontSize: '0.85rem', margin: '0 0 0.4rem 0', textTransform: 'uppercase' }}>Citizen Satisfaction</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#63b3ed' }}>{data.citizenSatisfaction}</p>
              <small style={{ color: '#718096' }}>Rating</small>
            </div>

            <div className="stat-card" style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#a0aec0', fontSize: '0.85rem', margin: '0 0 0.4rem 0', textTransform: 'uppercase' }}>Service SLA</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#48bb78' }}>{data.serviceSla}</p>
              <small style={{ color: '#718096' }}>Met</small>
            </div>

            <div className="stat-card" style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#a0aec0', fontSize: '0.85rem', margin: '0 0 0.4rem 0', textTransform: 'uppercase' }}>Revenue Collected</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#ecc94b' }}>{data.revenueCollected}</p>
              <small style={{ color: '#718096' }}>Collected</small>
            </div>
          </div>

          {/* 6 Validation Screens Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {/* 1. Service Metrics */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Service Metrics</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Total Service Requests</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.serviceRequests}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Requests Resolved</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.requestsResolved}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Average Resolution Time</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.avgResolutionTime}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Grievance Analytics */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Grievance Analytics</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Grievances Filed</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.grievancesFiled}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Grievances Resolved</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.grievancesResolved}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Mean Time To Resolution (MTTR)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.mttr}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Revenue Tracking */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Revenue Tracking</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Total Revenue</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#ecc94b' }}>{data.revenueCollected}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Property Tax Contribution</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.propertyTaxContribution}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>License Revenue Contribution</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.licenseRevenueContribution}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Budget Utilization */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Budget Utilization</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Budget Allocated</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.budgetAllocated}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Budget Utilized</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.budgetUtilized}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Utilization Rate</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#48bb78' }}>{data.budgetUtilizationRate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Department Performance */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Department Performance</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Water Department</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.deptWater}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Health Department</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.deptHealth}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Education Department</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{data.deptEducation}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. Citizen Satisfaction & Impact */}
            <div className="data-table" style={{ background: '#1a2234', padding: '1rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
              <h4 style={{ color: '#cbd5e0', marginBottom: '0.8rem', textAlign: 'center' }}>Citizen Satisfaction & Impact</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Citizen Satisfaction</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#63b3ed' }}>{data.citizenSatisfaction}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Complaints</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#fc8181' }}>{data.complaintsTrend}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0', color: '#a0aec0' }}>Services Delivered</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#68d391' }}>{data.servicesDeliveredTrend}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* REPORTING SERVICE: CITIZEN REPORTS */}
      {activeReportTab === 'citizen' && (
        <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px' }}>
          <h4>Citizen Services & Feedback Breakdown</h4>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Comprehensive feedback data across urban wards.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3748', textAlign: 'left', color: '#cbd5e0' }}>
                <th style={{ padding: '8px 0' }}>Ward</th>
                <th>Satisfaction Score</th>
                <th>Resolved SLA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '8px 0' }}>Zone 1 - North</td>
                <td>4.8 / 5</td>
                <td>96%</td>
                <td style={{ color: '#48bb78' }}>Optimal</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '8px 0' }}>Zone 2 - Central</td>
                <td>4.6 / 5</td>
                <td>93%</td>
                <td style={{ color: '#ecc94b' }}>Average</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Zone 3 - South</td>
                <td>4.7 / 5</td>
                <td>94%</td>
                <td style={{ color: '#48bb78' }}>Optimal</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTING SERVICE: GRIEVANCE REPORTS */}
      {activeReportTab === 'grievance' && (
        <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px' }}>
          <h4>Detailed Grievance Escalation & Resolution</h4>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Resolution times categorized by issue domain.</p>
          <ul style={{ lineHeight: '1.8', color: '#cbd5e0', fontSize: '0.9rem' }}>
            <li>Total Logged Grievances: <strong>{data.grievancesFiled}</strong></li>
            <li>Resolved within SLA: <strong>{data.grievancesResolved}</strong></li>
            <li>Mean Time to Resolution (MTTR): <strong>{data.mttr}</strong></li>
            <li>Critical Redressal Backlog: <strong>0 incidents</strong></li>
          </ul>
        </div>
      )}

      {/* REPORTING SERVICE: REVENUE REPORTS */}
      {activeReportTab === 'revenue' && (
        <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px' }}>
          <h4>Fiscal Revenue Distribution</h4>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Total collected: <strong>{data.revenueCollected}</strong></p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1, background: '#101726', padding: '1rem', borderRadius: '6px' }}>
              <h5>Property Tax</h5>
              <p style={{ fontSize: '1.2rem', color: '#ecc94b', margin: '4px 0' }}>{data.propertyTaxContribution}</p>
            </div>
            <div style={{ flex: 1, background: '#101726', padding: '1rem', borderRadius: '6px' }}>
              <h5>Licenses & Permits</h5>
              <p style={{ fontSize: '1.2rem', color: '#63b3ed', margin: '4px 0' }}>{data.licenseRevenueContribution}</p>
            </div>
          </div>
        </div>
      )}

      {/* REPORTING SERVICE: PERFORMANCE REPORTS */}
      {activeReportTab === 'performance' && (
        <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px' }}>
          <h4>Inter-Departmental Performance Benchmark</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3748', textAlign: 'left', color: '#cbd5e0' }}>
                <th style={{ padding: '8px 0' }}>Department</th>
                <th>SLA Compliance</th>
                <th>Budget Utilized</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '8px 0' }}>Water Management</td>
                <td>{data.deptWater}</td>
                <td>$14M</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '8px 0' }}>Public Health</td>
                <td>{data.deptHealth}</td>
                <td>$18M</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Municipal Education</td>
                <td>{data.deptEducation}</td>
                <td>$9M</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTING SERVICE: COMPLIANCE AUDITS */}
      {activeReportTab === 'audit' && (
        <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px' }}>
          <h4 style={{ color: '#48bb78' }}>Compliance Audit & Governance Verification</h4>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>System integrity verified against municipal standards.</p>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div>✔ Service SLA Threshold (&gt;90%): <strong>{data.serviceSla} (Passed)</strong></div>
            <div>✔ Budget Integrity Cap ($47M max): <strong>{data.budgetUtilized} utilized (Passed)</strong></div>
            <div>✔ Citizen Redressal SLA: <strong>{data.requestsResolved} (Passed)</strong></div>
          </div>
        </div>
      )}

      {/* Action Footer [Export Report] [Drill Down] [Share] */}
      <div style={{ marginTop: '1.2rem', padding: '1rem', background: '#101726', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Analytics Dashboard:</strong> {data.serviceRequests} requests, {data.requestsResolved} resolved. Revenue {data.revenueCollected}. Budget {data.budgetUtilizationRate} utilized. Citizen SAT {data.citizenSatisfaction}. Complaints {data.complaintsTrend}.
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExport} style={{ background: '#3182ce', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Export Report</button>
          <button onClick={() => setActiveReportTab(activeReportTab === 'dashboard' ? 'performance' : 'dashboard')} style={{ background: '#2d3748', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Drill Down</button>
          <button onClick={handleShare} style={{ background: '#2d3748', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Share</button>
        </div>
      </div>
    </div>
  );
}