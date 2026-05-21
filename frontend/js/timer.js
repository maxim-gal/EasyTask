export function updateTimer(element, targetDate) {
    const now = new Date();
    const diff = new Date(targetDate) - now;
    if (diff <= 0) {
        element.innerText = '⏰ Событие прошло';
        return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    element.innerText = `${days}д ${hours}ч ${mins}м ${secs}с`;
}

export function startGlobalTimers(events) {
    const timers = document.querySelectorAll('[data-timer-id]');
    timers.forEach(el => {
        const id = el.dataset.timerId;   // ← строка
        const event = events.find(e => e.id == id);
        if (event) updateTimer(el, event.event_date);
    });
}