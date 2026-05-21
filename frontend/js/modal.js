import { updateTimer } from './timer.js';
import { getEvents, toggleComplete } from './tasks.js';
import { getComments, addComment } from './comments.js';

let activeEventId = null;
let timerInterval = null;

export async function openModal(eventId, onCloseCallback) {
    activeEventId = eventId;
    const modal = document.getElementById('eventModal');
    const events = await getEvents();
    const event = events.find(e => e.id == eventId);
    if (!event) return;

    document.getElementById('modalEventTitle').innerText = event.title;
    const contentDiv = document.getElementById('modalEventContent');
    const targetDate = event.event_date;
    const priorityLabel = { high: '🔥 Высокий', medium: '🟡 Средний', low: '⚪ Низкий' }[event.priority] || 'Средний';
    contentDiv.innerHTML = `
        <p><strong>Дата:</strong> ${new Date(targetDate).toLocaleString()}</p>
        <p><strong>Таймер:</strong> <span id="modalTimer">--</span></p>
        <p><strong>Приоритет:</strong> ${priorityLabel}</p>
        <p><strong>Статус:</strong> ${event.completed ? '✅ Выполнено' : '🟡 Активно'}</p>
        <p><strong>Описание:</strong> ${event.description || '—'}</p>
        <p><strong>Доступ:</strong> ${event.is_private ? '🔒 Приватное' : '🌍 Общее'}</p>
        ${!event.completed ? '<button id="modalCompleteBtn" class="btn-primary" style="margin-top: 10px;">✔ Отметить выполненным</button>' : ''}
    `;
    const timerSpan = document.getElementById('modalTimer');
    if (timerSpan) updateTimer(timerSpan, targetDate);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (activeEventId !== eventId) return;
        const timerSpanNow = document.getElementById('modalTimer');
        if (timerSpanNow) updateTimer(timerSpanNow, targetDate);
    }, 1000);

    // Загружаем комментарии
    await refreshComments(eventId);

    modal.style.display = 'flex';
    window.modalOnClose = () => {
        if (timerInterval) clearInterval(timerInterval);
        if (onCloseCallback) onCloseCallback();
    };

    const completeBtn = document.getElementById('modalCompleteBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', async () => {
            await toggleComplete(eventId);
            if (onCloseCallback) await onCloseCallback();
            await openModal(eventId, onCloseCallback);
        });
    }
}

async function refreshComments(eventId) {
    const comments = await getComments(eventId);
    const commentsDiv = document.getElementById('modalCommentsList');
    if (!commentsDiv) return;
    if (!comments.length) {
        commentsDiv.innerHTML = '<p><em>Нет комментариев</em></p>';
        return;
    }
    commentsDiv.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-author">${escapeHtml(c.author)}</div>
            <div class="comment-text">${escapeHtml(c.content)}</div>
            <div style="font-size:0.7rem; color:gray;">${new Date(c.created_at).toLocaleString()}</div>
        </div>
    `).join('');
}

export function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
    if (timerInterval) clearInterval(timerInterval);
    if (window.modalOnClose) window.modalOnClose();
    activeEventId = null;
}

export function getActiveEventId() {
    return activeEventId;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

// Функция для добавления комментария вызывается из app.js
export async function handleAddComment(eventId, text) {
    if (!text.trim()) return false;
    await addComment(eventId, text);
    await refreshComments(eventId);
    return true;
}