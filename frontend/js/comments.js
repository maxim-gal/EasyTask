import { api } from './api.js';

export async function getComments(eventId) {
    return api.get(`/comments/${eventId}`);
}

export async function addComment(eventId, content) {
    return api.post(`/comments/${eventId}`, { content });
}