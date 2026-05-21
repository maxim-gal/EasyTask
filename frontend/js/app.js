import { getEvents, addEvent, updateEvent } from './tasks.js';
import { renderEventsList, renderStats, setFilter, setSearchQuery } from './ui.js';
import { closeModal, getActiveEventId, openModal, handleAddComment } from './modal.js';
import { startGlobalTimers } from './timer.js';
import { login, register, isAuthenticated, logout, getCurrentUser } from './auth.js';

// DOM элементы
const eventsContainer = document.getElementById('eventsContainer');
const noEventsDiv = document.getElementById('noEvents');
const statsContainer = document.getElementById('statsInfo');
const filterBtns = document.querySelectorAll('#filterButtons .filter-btn');
const searchInput = document.getElementById('searchInput');
const addEventForm = document.getElementById('eventForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const screens = document.querySelectorAll('.screen');
const modalClose = document.getElementById('closeModalBtn');
const addCommentBtn = document.getElementById('addCommentBtn');
const newCommentText = document.getElementById('newCommentText');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const editIdInput = document.getElementById('editId');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventDesc = document.getElementById('eventDesc');
const eventPriority = document.getElementById('eventPriority');
const eventPrivate = document.getElementById('eventPrivate');
const eventCompleted = document.getElementById('eventCompleted');
const completedGroup = document.getElementById('completedGroup');
const logoutBtn = document.getElementById('logoutBtn');

// Аuth elements
const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authLoginTab = document.getElementById('authLoginTab');
const authRegisterTab = document.getElementById('authRegisterTab');
const loginError = document.getElementById('loginError');
const regError = document.getElementById('regError');

let currentEvents = [];

async function refreshUI() {
    if (!isAuthenticated()) return;
    const filterActive = document.querySelector('#filterButtons .filter-btn.active-filter')?.dataset.filter || 'all';
    const search = searchInput.value;
    
    // Для списка – отфильтрованные события
    const filteredEvents = await getEvents(filterActive, search);
    renderEventsList(filteredEvents, eventsContainer, noEventsDiv, () => refreshUI());
    
    // Для статистики – все события (без фильтра)
    const allEvents = await getEvents('all', '');
    renderStats(allEvents, statsContainer);
    
    startGlobalTimers(filteredEvents);
    currentEvents = filteredEvents; // если нужно для других мест
}
// Фильтры и поиск
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        setFilter(btn.dataset.filter);
        refreshUI();
    });
});

searchInput.addEventListener('input', (e) => {
    setSearchQuery(e.target.value);
    refreshUI();
});

function resetForm() {
    editIdInput.value = '';
    eventTitle.value = '';
    eventDate.value = '';
    eventTime.value = '';
    eventDesc.value = '';
    eventPriority.value = 'medium';
    eventPrivate.value = 'false';
    eventCompleted.checked = false;
    completedGroup.style.display = 'none';
    formTitle.innerText = 'Новое событие';
}

async function loadEventForEdit(id) {
    const event = currentEvents.find(e => e.id == id);
    if (!event) return;
    editIdInput.value = event.id;
    eventTitle.value = event.title;
    const dateTime = new Date(event.event_date);
    const datePart = dateTime.toISOString().slice(0,10);
    const timePart = dateTime.toTimeString().slice(0,5);
    eventDate.value = datePart;
    eventTime.value = timePart;
    eventDesc.value = event.description || '';
    eventPriority.value = event.priority || 'medium';
    eventPrivate.value = event.is_private ? 'true' : 'false';
    eventCompleted.checked = event.completed || false;
    completedGroup.style.display = 'block';
    formTitle.innerText = 'Редактировать событие';
    document.querySelector('[data-screen="addEvent"]').click();
}

addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = eventTitle.value.trim();
    const dateStr = eventDate.value;
    const timeStr = eventTime.value;
    if (!title || !dateStr || !timeStr) {
        alert('Заполните название, дату и время');
        return;
    }
    const eventDateTime = `${dateStr}T${timeStr}:00`;
    const eventDateObj = new Date(eventDateTime);
    if (isNaN(eventDateObj.getTime())) {
        alert('Некорректная дата или время');
        return;
    }
    if (eventDateObj < new Date()) {
        alert('Нельзя создать событие в прошлом');
        return;
    }
    const id = editIdInput.value ? editIdInput.value : null;   // ← теперь строка (UUID)
    const eventData = {
        title,
        description: eventDesc.value,
        eventDateTime,
        priority: eventPriority.value,
        is_private: eventPrivate.value === 'true',
        completed: eventCompleted.checked,
    };
    if (id) {
        eventData.id = id;   // ← передаём строку UUID
        await updateEvent(eventData);
    } else {
        await addEvent(eventData);
    }
    refreshUI();
    resetForm();
    document.querySelector('[data-screen="eventsList"]').click();
});

cancelEditBtn.addEventListener('click', () => {
    resetForm();
    document.querySelector('[data-screen="eventsList"]').click();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const screenId = btn.dataset.screen;
        screens.forEach(s => s.classList.remove('active-screen'));
        document.getElementById(screenId).classList.add('active-screen');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (screenId === 'stats') {
            const allEvents = await getEvents('all', '');
            renderStats(allEvents, statsContainer);
        }
        if (screenId === 'eventsList') refreshUI();
        if (screenId === 'addEvent') resetForm();
    });
});

modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
});

addCommentBtn.addEventListener('click', async () => {
    const activeId = getActiveEventId();
    if (!activeId) return;
    const text = newCommentText.value.trim();
    if (!text) return;
    await handleAddComment(activeId, text);
    newCommentText.value = '';
    // Обновить модальное окно (комментарии обновятся внутри handleAddComment)
});

// Auth logic
function showAuth() {
    authScreen.style.display = 'block';
    appScreen.style.display = 'none';
    authScreen.classList.add('active-screen');
    appScreen.classList.remove('active-screen');
}

function showApp() {
    authScreen.style.display = 'none';
    appScreen.style.display = 'block';
    authScreen.classList.remove('active-screen');
    appScreen.classList.add('active-screen');
    refreshUI();
}

authLoginTab.addEventListener('click', () => {
    authLoginTab.classList.add('active');
    authRegisterTab.classList.remove('active');
    loginForm.classList.add('active-form');
    registerForm.classList.remove('active-form');
});

authRegisterTab.addEventListener('click', () => {
    authRegisterTab.classList.add('active');
    authLoginTab.classList.remove('active');
    registerForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await login(username, password);
        showApp();
    } catch (err) {
        loginError.innerText = err.message;
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value;
    try {
        await register(username, email, password, fullName);
        showApp();
    } catch (err) {
        regError.innerText = err.message;
    }
});

logoutBtn.addEventListener('click', () => {
    logout();
    showAuth();
});

// Инициализация
if (isAuthenticated()) {
    showApp();
} else {
    showAuth();
}