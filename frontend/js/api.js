const API_BASE = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        let errorText = await response.text();
        try {
            const errJson = JSON.parse(errorText);
            errorText = errJson.message || errorText;
        } catch(e) {}
        throw new Error(errorText || 'Ошибка запроса');
    }
    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};