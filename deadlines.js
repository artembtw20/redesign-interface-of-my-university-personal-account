/* ============================================================
   ДЕДЛАЙНЫ — логика страницы
   ============================================================ */

(function () {
  const STORAGE_KEY = 'deadlines';

  // ============================================================
  // ДАННЫЕ
  // ============================================================
  function getDeadlines() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function saveDeadlines(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ============================================================
  // УТИЛИТЫ ДАТ
  // ============================================================
  function getDaysLeft(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + 'T00:00:00');
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]}`;
  }

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function getStatus(daysLeft) {
    if (daysLeft < 0) return { text: '❌ Просрочено', cls: 'status-danger', color: 'danger' };
    if (daysLeft === 0) return { text: '⚠️ Сегодня!', cls: 'status-danger', color: 'danger' };
    if (daysLeft <= 2) return { text: '🔴 Срочно!', cls: 'status-danger', color: 'danger' };
    if (daysLeft <= 5) return { text: '🟠 Скоро', cls: 'status-warn', color: 'warn' };
    if (daysLeft <= 14) return { text: '🟡 Не забыть', cls: 'status-info', color: 'info' };
    return { text: '🟢 Есть время', cls: 'status-success', color: 'success' };
  }

  const PRIORITY_LABEL = {
    high: '🔴 Высокий',
    medium: '🟡 Средний',
    low: '🟢 Низкий'
  };

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================================
  // РЕНДЕР
  // ============================================================
  function renderStats() {
    const list = getDeadlines();
    const total = list.length;
    const overdue = list.filter(d => getDaysLeft(d.date) < 0).length;
    const soon = list.filter(d => {
      const dl = getDaysLeft(d.date);
      return dl >= 0 && dl <= 5;
    }).length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSoon').textContent = soon;
    document.getElementById('statOverdue').textContent = overdue;
  }

  function renderList() {
    const container = document.getElementById('deadlinesList');
    const list = getDeadlines();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="party-popper"></i>
          <div class="title">Дедлайнов нет</div>
          <div class="desc">Добавь первый — и он появится здесь</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Сортировка по дате (ближайшие сверху)
    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = list.map(d => {
      const daysLeft = getDaysLeft(d.date);
      const status = getStatus(daysLeft);
      const isOverdue = daysLeft < 0;
      const priority = d.priority || 'medium';

      let daysText = '';
      if (daysLeft < 0) daysText = `просрочено на ${Math.abs(daysLeft)} ${plural(Math.abs(daysLeft), 'день', 'дня', 'дней')}`;
      else if (daysLeft === 0) daysText = 'сегодня последний день';
      else daysText = `осталось ${daysLeft} ${plural(daysLeft, 'день', 'дня', 'дней')}`;

      return `
        <div class="deadline-card priority-${priority}${isOverdue ? ' overdue' : ''}">
          <div class="deadline-body">
            <div class="deadline-top">
              <div class="deadline-subject">${escapeHTML(d.subject)}</div>
              <span class="deadline-status ${status.cls}">${status.text}</span>
            </div>
            <div class="deadline-task">${escapeHTML(d.task)}</div>
            <div class="deadline-meta">
              <span><i data-lucide="calendar"></i>${formatDate(d.date)} · ${daysText}</span>
              <span><i data-lucide="flag"></i>${PRIORITY_LABEL[priority] || '🟡 Средний'}</span>
            </div>
          </div>
          <div class="deadline-actions">
            <button class="icon-action" data-action="edit" data-id="${d.id}" title="Редактировать">
              <i data-lucide="pencil"></i>
            </button>
            <button class="icon-action danger" data-action="delete" data-id="${d.id}" title="Удалить">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  function render() {
    renderStats();
    renderList();
  }

  // ============================================================
  // МОДАЛКА
  // ============================================================
  let modalOverlay = null;

  function openModal(deadlineId) {
    const isEdit = deadlineId != null;
    const list = getDeadlines();
    const item = isEdit ? list.find(d => d.id === deadlineId) : null;

    const data = item || {
      subject: '',
      task: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    };

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3><i data-lucide="${isEdit ? 'pencil' : 'plus'}"></i> ${isEdit ? 'Редактировать дедлайн' : 'Новый дедлайн'}</h3>

        <div class="field">
          <label>Предмет</label>
          <input id="dlSubject" type="text" placeholder="Например: Базы данных"
                 value="${escapeHTML(data.subject || '')}">
        </div>

        <div class="field">
          <label>Задача</label>
          <input id="dlTask" type="text" placeholder="Например: Курсовая работа"
                 value="${escapeHTML(data.task || '')}">
        </div>

        <div class="field">
          <label>Дата сдачи</label>
          <input id="dlDate" type="date" value="${data.date || ''}">
        </div>

        <div class="field">
          <label>Приоритет</label>
          <select id="dlPriority">
            <option value="high"   ${data.priority === 'high'   ? 'selected' : ''}>🔴 Высокий</option>
            <option value="medium" ${data.priority === 'medium' ? 'selected' : ''}>🟡 Средний</option>
            <option value="low"    ${data.priority === 'low'    ? 'selected' : ''}>🟢 Низкий</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="modal-btn primary" id="dlSave">${isEdit ? 'Сохранить' : 'Добавить'}</button>
          <button class="modal-btn ghost" id="dlCancel">Отмена</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    if (window.lucide) lucide.createIcons();

    const inputSubject = modalOverlay.querySelector('#dlSubject');
    const inputTask    = modalOverlay.querySelector('#dlTask');
    const inputDate    = modalOverlay.querySelector('#dlDate');
    const inputPriority = modalOverlay.querySelector('#dlPriority');

    setTimeout(() => inputSubject.focus(), 50);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    const escHandler = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', escHandler);

    const enterHandler = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        save();
      }
    };
    inputSubject.addEventListener('keydown', enterHandler);
    inputTask.addEventListener('keydown', enterHandler);

    modalOverlay.querySelector('#dlSave').addEventListener('click', save);
    modalOverlay.querySelector('#dlCancel').addEventListener('click', closeModal);

    function closeModal() {
      document.removeEventListener('keydown', escHandler);
      if (modalOverlay) {
        modalOverlay.remove();
        modalOverlay = null;
      }
    }

    function save() {
      const subject = inputSubject.value.trim();
      const task = inputTask.value.trim();
      const date = inputDate.value;
      const priority = inputPriority.value;

      if (!subject || !task || !date) {
        alert('⚠️ Заполни все поля');
        return;
      }

      const fresh = getDeadlines();

      if (isEdit) {
        const idx = fresh.findIndex(d => d.id === deadlineId);
        if (idx !== -1) {
          fresh[idx] = { ...fresh[idx], subject, task, date, priority };
        }
      } else {
        fresh.push({
          id: Date.now(),
          subject,
          task,
          date,
          priority,
          createdAt: new Date().toISOString()
        });
      }

      saveDeadlines(fresh);
      closeModal();
      render();
    }
  }

  function deleteDeadline(id) {
    if (!confirm('Удалить дедлайн?')) return;
    const fresh = getDeadlines().filter(d => d.id !== id);
    saveDeadlines(fresh);
    render();
  }

  // ============================================================
  // СОБЫТИЯ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    render();

    // Кнопка "Добавить"
    document.getElementById('btnAdd').addEventListener('click', () => openModal(null));

    // Делегирование событий на список
    document.getElementById('deadlinesList').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = parseInt(btn.dataset.id, 10);
      const action = btn.dataset.action;

      if (action === 'edit') openModal(id);
      if (action === 'delete') deleteDeadline(id);
    });
  });
})();