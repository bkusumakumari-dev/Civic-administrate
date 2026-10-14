import { useState } from 'react';

export interface GrievanceItem {
  id: number;
  citizenName: string;
  department: string;
  category: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  dateFiled: string;
}

const initialGrievances: GrievanceItem[] = [
  {
    id: 101,
    citizenName: 'Aarav Sharma',
    department: 'Water Supply',
    category: 'Pipeline Leakage',
    description: 'Main distribution valve leaking near Ward 4.',
    status: 'IN_PROGRESS',
    dateFiled: '2026-10-01'
  },
  {
    id: 102,
    citizenName: 'Kavita Reddy',
    department: 'Public Works',
    category: 'Pothole Repair',
    description: 'Road damage near Sector 9 market junction.',
    status: 'PENDING',
    dateFiled: '2026-10-02'
  },
  {
    id: 103,
    citizenName: 'Rahul Varma',
    department: 'Electricity',
    category: 'Streetlight Failure',
    description: 'Streetlight pole #14 non-functional for 3 days.',
    status: 'RESOLVED',
    dateFiled: '2026-09-28'
  }
];

export default function GrievanceManager() {
  const [grievances, setGrievances] = useState<GrievanceItem[]>(initialGrievances);
  const [form, setForm] = useState({
    citizenName: '',
    department: 'Water Supply',
    category: '',
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.citizenName || !form.category) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingId !== null) {
      setGrievances((prev) =>
        prev.map((g) =>
          g.id === editingId
            ? { ...g, citizenName: form.citizenName, department: form.department, category: form.category, description: form.description }
            : g
        )
      );
      setEditingId(null);
    } else {
      const newEntry: GrievanceItem = {
        id: Date.now(),
        citizenName: form.citizenName,
        department: form.department,
        category: form.category,
        description: form.description,
        status: 'PENDING',
        dateFiled: new Date().toISOString().split('T')[0]
      };
      setGrievances([newEntry, ...grievances]);
    }

    setForm({ citizenName: '', department: 'Water Supply', category: '', description: '' });
  };

  const handleToggleStatus = (id: number) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextStatus =
            g.status === 'PENDING' ? 'IN_PROGRESS' : g.status === 'IN_PROGRESS' ? 'RESOLVED' : 'PENDING';
          return { ...g, status: nextStatus };
        }
        return g;
      })
    );
  };

  const handleEditClick = (item: GrievanceItem) => {
    setEditingId(item.id);
    setForm({
      citizenName: item.citizenName,
      department: item.department,
      category: item.category,
      description: item.description
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this grievance record?')) {
      setGrievances((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <div style={{ color: '#ffffff', width: '100%', padding: '1rem' }}>
      <div style={{ marginBottom: '1.2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Citizen & Grievance Management</h3>
        <p style={{ color: '#a0aec0', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
          Operational CRUD Module (Create, Read, Update, Delete)
        </p>
      </div>

      {/* CREATE / UPDATE FORM */}
      <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px', border: '1px solid #2d3748', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: editingId ? '#ecc94b' : '#63b3ed' }}>
          {editingId ? '✎ Update Existing Grievance' : '＋ Log New Citizen Grievance (CREATE)'}
        </h4>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0aec0', marginBottom: '4px' }}>Citizen Name *</label>
            <input
              type="text"
              required
              value={form.citizenName}
              onChange={(e) => setForm({ ...form, citizenName: e.target.value })}
              placeholder="Citizen name"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#101726', border: '1px solid #2d3748', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0aec0', marginBottom: '4px' }}>Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#101726', border: '1px solid #2d3748', color: '#fff' }}
            >
              <option value="Water Supply">Water Supply</option>
              <option value="Public Works">Public Works</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Revenue & Tax">Revenue & Tax</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0aec0', marginBottom: '4px' }}>Category *</label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Leakage, Streetlight"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#101726', border: '1px solid #2d3748', color: '#fff' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0aec0', marginBottom: '4px' }}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief summary..."
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#101726', border: '1px solid #2d3748', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1', marginTop: '4px' }}>
            <button
              type="submit"
              style={{
                background: editingId ? '#d69e2e' : '#3182ce',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {editingId ? 'Save Update' : 'Submit Grievance'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ citizenName: '', department: 'Water Supply', category: '', description: '' });
                }}
                style={{ background: '#4a5568', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* READ DATA TABLE */}
      <div style={{ background: '#1a2234', padding: '1.2rem', borderRadius: '8px', border: '1px solid #2d3748' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Active Grievance Ledger (READ)</h4>
          <span style={{ fontSize: '0.8rem', color: '#68d391' }}>{grievances.length} Records</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #2d3748', textAlign: 'left', color: '#a0aec0' }}>
              <th style={{ padding: '8px 4px' }}>ID</th>
              <th>Citizen</th>
              <th>Department</th>
              <th>Category</th>
              <th>Status (UPDATE)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '10px 4px', color: '#a0aec0' }}>#{item.id.toString().slice(-4)}</td>
                <td style={{ fontWeight: 600 }}>{item.citizenName}</td>
                <td>{item.department}</td>
                <td>{item.category}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background:
                        item.status === 'RESOLVED' ? '#276749' : item.status === 'IN_PROGRESS' ? '#7b341e' : '#744210',
                      color:
                        item.status === 'RESOLVED' ? '#9ae6b4' : item.status === 'IN_PROGRESS' ? '#feebc8' : '#faf089'
                    }}
                  >
                    {item.status} ↻
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '6px', padding: '10px 0' }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    style={{ background: '#2b6cb0', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: '#c53030', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}