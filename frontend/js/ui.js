import { startGlobalTimers } from './timer.js';
import { openModal } from './modal.js';
import { deleteEvent, toggleComplete } from './tasks.js';

let currentFilter = 'all';
let searchQuery = '';

export function renderEventsList(events, container, emptyDiv, onDeleteCallback) {
    let filtered = [...events];
    if (currentFilter === 'active') filtered = filtered.filter(e => !e.completed);
    else if (currentFilter === 'completed') filtered = filtered.filter(e => e.completed);
    if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(e => e.title.toLowerCase().includes(q));
    }
    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyDiv.innerHTML = '📭 Нет событий. Создайте новое!';
        return;
    }
    emptyDiv.innerHTML = '';
    container.innerHTML = filtered.map(event => `
        <div class="event-card ${event.completed ? 'completed' : ''}" data-id="${event.id}">
            <div class="event-header">
                <div class="event-title">
                    ${escapeHtml(event.title)}
                    <span class="priority-badge priority-${event.priority || 'medium'}">${getPriorityLabel(event.priority)}</span>
                    <span class="private-badge">${event.is_private ? '🔒 Приватное' : '🌍 Общее'}</span>
                    ${event.completed ? '✅ Выполнено' : ''}
                </div>
                <div class="task-actions">
                    ${!event.completed ? `<button class="btn-primary complete-btn" data-id="${event.id}">✔ Готово</button>` : ''}
                    <button class="btn-danger delete-btn" data-id="${event.id}">🗑 Удалить</button>
                </div>
            </div>
            <div class="timer" data-timer-id="${event.id}">--</div>
            <div class="event-date">📅 ${new Date(event.event_date).toLocaleString()}</div>
            <div>${event.description ? escapeHtml(event.description) : ''}</div>
        </div>
    `).join('');

    startGlobalTimers(events);
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            if (confirm('Удалить событие?')) {
                await deleteEvent(id);
                onDeleteCallback();
            }
        });
    });

    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            await toggleComplete(id);
            onDeleteCallback();
        });
    });

    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn') || e.target.classList.contains('complete-btn')) return;
            const id = card.dataset.id;
            openModal(id, () => onDeleteCallback());
        });
    });
}  
export function renderStats(events, container) {
    const total = events.length;
    const completed = events.filter(e => e.completed).length;
    const active = total - completed;
    const high = events.filter(e => e.priority === 'high').length;
    const medium = events.filter(e => e.priority === 'medium').length;
    const low = events.filter(e => e.priority === 'low').length;
    container.innerHTML = `
        <div class="stat-card"><div class="stat-number">${total}</div>Всего событий</div>
        <div class="stat-card"><div class="stat-number">${active}</div>Активных</div>
        <div class="stat-card"><div class="stat-number">${completed}</div>Выполненных</div>
        <div class="stat-card"><div class="stat-number">🔥 ${high}</div>Высокий приоритет</div>
        <div class="stat-card"><div class="stat-number">🟡 ${medium}</div>Средний приоритет</div>
        <div class="stat-card"><div class="stat-number">⚪ ${low}</div>Низкий приоритет</div>
    `;
}

export function setFilter(filter) {
    currentFilter = filter;
}

export function setSearchQuery(query) {
    searchQuery = query;
}

function getPriorityLabel(priority) {
    const map = { high: '🔥 Высокий', medium: '🟡 Средний', low: '⚪ Низкий' };
    return map[priority] || '🟡 Средний';
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}