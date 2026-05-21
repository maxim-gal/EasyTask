import { api } from './api.js';

export async function getEvents(filter = 'all', search = '') {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.append('filter', filter);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/events${query}`);
}

export async function addEvent(event) {
    return api.post('/events', event);
}

export async function updateEvent(event) {
    return api.put(`/events/${event.id}`, event);
}

export async function deleteEvent(id) {
    return api.delete(`/events/${id}`);
}

export async function toggleComplete(id) {
    return api.post(`/events/${id}/toggle-complete`);
}

// Для совместимости с существующим UI, но они будут переопределены в app.js
// Мы не будем использовать старый модуль events.js