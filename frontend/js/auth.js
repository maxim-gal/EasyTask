import { api } from './api.js';

export async function login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

export async function register(username, email, password, fullName) {
    const data = await api.post('/auth/register', { username, email, password, full_name: fullName });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}