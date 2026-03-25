const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth header
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthHeadersNoContentType(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Handle API response
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ data: { user: any; token: string } }>(response);
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse<{ data: { user: any } }>(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: { user: any } }>(response);
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_URL}/auth/avatar`, {
      method: 'POST',
      headers: getAuthHeadersNoContentType(),
      body: formData,
    });

    return handleResponse<{ data: any }>(response);
  },
};

// Alerts API
export const alertsAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; deviceId?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.deviceId) query.set('deviceId', params.deviceId);

    const response = await fetch(`${API_URL}/alerts?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[]; pagination: any }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: {
    deviceId: string;
    temperature: number;
    smokeLevel: number;
    status: string;
    location?: string;
    notes?: string;
  }) => {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: Partial<{
    deviceId: string;
    temperature: number;
    smokeLevel: number;
    status: string;
    location: string;
    notes: string;
  }>) => {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/alerts/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: { total: number; safe: number; warning: number; alert: number } }>(response);
  },

  getRecent: async (hours?: number) => {
    const query = hours ? `?hours=${hours}` : '';
    const response = await fetch(`${API_URL}/alerts/recent${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },
};

// Contacts API
export const contactsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: {
    name: string;
    number: string;
    type: string;
    role?: string;
  }) => {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: Partial<{
    name: string;
    number: string;
    type: string;
    role: string | null;
  }>) => {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// Devices API
export const devicesAPI = {
  getAll: async (params?: { householdId?: string; status?: string; isOnline?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.householdId) query.set('householdId', params.householdId);
    if (params?.status) query.set('status', params.status);
    if (params?.isOnline !== undefined) query.set('isOnline', String(params.isOnline));

    const response = await fetch(`${API_URL}/devices?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/devices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },
};

// Households API
export const householdsAPI = {
  getAll: async (params?: { riskLevel?: string }) => {
    const query = new URLSearchParams();
    if (params?.riskLevel) query.set('riskLevel', params.riskLevel);

    const response = await fetch(`${API_URL}/households?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/households/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/households`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/households/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/households/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: { type?: string; priority?: string; read?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.read !== undefined) query.set('read', String(params.read));

    const response = await fetch(`${API_URL}/notifications?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },
};

// Network API
export const networkAPI = {
  getNodes: async () => {
    const response = await fetch(`${API_URL}/network/nodes`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getNodeById: async (id: string) => {
    const response = await fetch(`${API_URL}/network/nodes/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  createNode: async (data: any) => {
    const response = await fetch(`${API_URL}/network/nodes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  updateNode: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/network/nodes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  deleteNode: async (id: string) => {
    const response = await fetch(`${API_URL}/network/nodes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },

  getEvents: async (params?: { nodeId?: string }) => {
    const query = new URLSearchParams();
    if (params?.nodeId) query.set('nodeId', params.nodeId);

    const response = await fetch(`${API_URL}/network/events?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  createEvent: async (data: any) => {
    const response = await fetch(`${API_URL}/network/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  deleteEvent: async (id: string) => {
    const response = await fetch(`${API_URL}/network/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },
};

// Fire Incidents API
export const fireIncidentsAPI = {
  getAll: async (params?: { severity?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.severity) query.set('severity', params.severity);
    if (params?.status) query.set('status', params.status);

    const response = await fetch(`${API_URL}/fire-incidents?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any[] }>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/fire-incidents/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: any }>(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/fire-incidents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/fire-incidents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ data: any }>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/fire-incidents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{}>(response);
  },
};

export default {
  authAPI,
  alertsAPI,
  contactsAPI,
  devicesAPI,
  householdsAPI,
  notificationsAPI,
  networkAPI,
  fireIncidentsAPI,
};
