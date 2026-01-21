const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  /* ================= AUTH ================= */
  login: async (email: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  /* ================= INCIDENTS ================= */
  getIncidents: async () => {
    const res = await fetch(`${BASE_URL}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  getIncidentById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/incidents/${id}`);
    if (!res.ok) throw new Error('Incident not found');
    return res.json();
  },

  createIncident: async (data: {
    title: string;
    description: string;
    priority: string;
    createdBy: string;
    creatorName: string;
  }) => {
    const res = await fetch(`${BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to create incident');
    return res.json(); // { id }
  },

  updateIncidentStatus: async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/incidents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!res.ok) throw new Error('Failed to update incident status');
  },

  /* ================= COMMENTS ================= */
  getCommentsByIncident: async (incidentId: string) => {
    const res = await fetch(`${BASE_URL}/comments/${incidentId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  addComment: async (data: {
    incidentId: string;
    userId: string;
    userName: string;
    content: string;
  }) => {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to add comment');
    return res.json(); // { id, created_at }
  },

  /* ================= AUDIT LOGS ================= */
  createAuditLog: async (data: {
    userId: string;
    userName: string;
    action: string;
    entityId: string;
    entityType: string;
    details: string;
  }) => {
    const res = await fetch(`${BASE_URL}/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to record audit log');
  },

  getAuditLogs: async () => {
    const res = await fetch(`${BASE_URL}/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  /* ================= USERS ================= */
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  updateUserRole: async (id: string, role: string) => {
    const res = await fetch(`${BASE_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  toggleUserStatus: async (id: string, enabled: boolean) => {
    const res = await fetch(`${BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return res.json();
  }
};
