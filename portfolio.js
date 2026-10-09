/* ============================================================
   ПОРТФОЛИО — логика страницы
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';
  const PREFIX = 'app:';

  // ============================================================
  // ХРАНИЛИЩЕ
  // ============================================================
  function getAchievements() {
    try {
      const raw = localStorage.getItem(PREFIX + 'portfolio');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed[STUDENT_ID] || [];
      }
    } catch { }
    return [];
  }

  function saveAchievements(list) {
    let all = {};
    try { all = JSON.parse(localStorage.getItem(PREFIX + 'portfolio')) || {}; } catch { }
    all[STUDENT_ID] = list;
    localStorage.setItem(PREFIX + 'portfolio', JSON.stringify(all));
  }

  // ============================================================
  // УВЕДОМЛЕНИЯ
  // ============================================================
  function getNotifications() {
    try { return JSON.parse(localStorage.getItem(PREFIX + 'notifications')) || []; }
    catch { return []; }
  }
  function saveNotifications(list) {
    localStorage.setItem(PREFIX + 'notifications', JSON.stringify(list));
  }
  function addNotification(title, text) {
    const list = getNotifications();
    list.unshift({
      id: Date.now(),
      title,
      text,
      time: new Date().toLocaleString('ru-RU', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    });
    saveNotifications(list);
    renderNotifications();
  }

  function renderNotifications() {
    const list = getNotifications();
    const listEl = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');
    if (!listEl) return;

    if (list.length === 0) {
      dot.style.display = 'none';
      listEl.innerHTML = `
        <div class="notif-empty">
          <i data-lucide="bell-off"></i>
          <div>Нет уведомлений</div>
        </div>
      `;
    } else {
      dot.style.display = 'block';
      listEl.innerHTML = list.map(n => `
        <div class="notif-item">
          <div class="ico"><i data-lucide="info"></i></div>
          <div class="body">
            <div class="title">${escapeHTML(n.title)}</div>
            <div class="text">${escapeHTML(n.text)}</div>
            <div class="time">${escapeHTML(n.time)}</div>
          </div>
        </div>
      `).join('');
    }
    if (window.lucide) lucide.createIcons();
  }

  function initNotifications() {
    const btn = document.getElementById('notifBtn');
    const dropdown = document.getElementById('notifDropdown');
    const clear = document.getElementById('notifClear');
    if (!btn || !dropdown) return;

    renderNotifications();

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('open');
      }
    });
    clear.addEventListener('click', (e) => {
      e.stopPropagation();
      saveNotifications([]);
      renderNotifications();
    });
  }

  // ============================================================
  // УТИЛИТЫ
  // ============================================================
  function getInitials(name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0] || '').slice(0, 2).toUpperCase();
  }

  function getShortName(fullName) {
    const parts = fullName.split(' ').filter(Boolean);
    if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
    return fullName;
  }

  function getStudentName() {
    const groups = AppData.getGroups();
    const list = groups['5106-об'] || [];
    const me = list.find(s => s.id === STUDENT_ID);
    return me ? me.name : 'Беккер Артём Станиславович';
  }

  function getProfile() {
    try {
      const raw = localStorage.getItem(PREFIX + 'profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[STUDENT_ID]) return parsed[STUDENT_ID];
      }
    } catch { }
    return {
      birthDate: '15 марта 2006',
      email: 'id0056809@amursu.ru',
      phone: '+7 (914) 555-12-34'
    };
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  }

  const TYPE_LABEL = {
    olympiad:    'Олимпиада',
    certificate: 'Сертификат',
    course:      'Курс',
    publication: 'Публикация',
    project:     'Проект'
  };
  const TYPE_ICON = {
    olympiad:    'trophy',
    certificate: 'file-badge',
    course:      'book-open',
    publication: 'file-text',
    project:     'target'
  };

  // ============================================================
  // ТАБЫ
  // ============================================================
  function initTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById('tab-' + tab).classList.remove('hidden');
      });
    });
  }

  function switchToTab(name) {
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (btn) btn.click();
  }

  // ============================================================
  // РЕНДЕР ДОСТИЖЕНИЙ
  // ============================================================
  function renderAchievements() {
    const container = document.getElementById('achievementsList');
    const list = getAchievements();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-badge">
          <i data-lucide="alert-circle"></i>
          <span>В портфолио отсутствуют достижения</span>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Сортировка: сначала новые
    list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    container.innerHTML = list.map((a, idx) => {
      const type = a.type || 'certificate';
      const icon = TYPE_ICON[type] || 'file-badge';
      const typeLabel = TYPE_LABEL[type] || 'Достижение';
      const desc = a.description ? `<div class="achievement-desc">${escapeHTML(a.description)}</div>` : '';
      const link = a.link ? `<a href="${escapeHTML(a.link)}" class="achievement-link" target="_blank" rel="noopener">Открыть ссылку →</a>` : '';

      return `
        <div class="achievement-card">
          <div class="achievement-icon type-${type}">
            <i data-lucide="${icon}"></i>
          </div>
          <div class="achievement-body">
            <div class="achievement-title">${escapeHTML(a.title)}</div>
            <div class="achievement-meta">
              <span><i data-lucide="tag"></i>${typeLabel}</span>
              <span><i data-lucide="calendar"></i>${formatDate(a.date)}</span>
            </div>
            ${desc}
            ${link}
          </div>
          <button class="achievement-delete" data-idx="${idx}" title="Удалить">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();

    // Обработчики удаления
    container.querySelectorAll('.achievement-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (confirm('Удалить это достижение?')) {
          const list = getAchievements();
          list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          list.splice(idx, 1);
          saveAchievements(list);
          renderAchievements();
          addNotification('Достижение удалено', 'Запись удалена из портфолио');
        }
      });
    });
  }

  // ============================================================
  // МОДАЛКА ДОБАВЛЕНИЯ
  // ============================================================
  function openAddModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3><i data-lucide="plus-circle"></i> Добавить достижение</h3>

        <div class="field">
          <label>Название</label>
          <input id="achTitle" type="text" placeholder="Например: Призёр олимпиады по математике">
        </div>

        <div class="field">
          <label>Тип</label>
          <select id="achType">
            <option value="olympiad">🏆 Олимпиада</option>
            <option value="certificate">📜 Сертификат</option>
            <option value="course">📚 Курс</option>
            <option value="publication">📝 Публикация</option>
            <option value="project">🎯 Проект</option>
          </select>
        </div>

        <div class="field">
          <label>Дата</label>
          <input id="achDate" type="date" value="${new Date().toISOString().split('T')[0]}">
        </div>

        <div class="field">
          <label>Описание (необязательно)</label>
          <textarea id="achDesc" placeholder="Краткое описание достижения"></textarea>
        </div>

        <div class="field">
          <label>Ссылка (необязательно)</label>
          <input id="achLink" type="url" placeholder="https://...">
        </div>

        <div class="modal-actions">
          <button class="modal-btn primary" id="achSave">Сохранить</button>
          <button class="modal-btn ghost" id="achCancel">Отмена</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    if (window.lucide) lucide.createIcons();

    const close = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    overlay.querySelector('#achCancel').addEventListener('click', close);
    overlay.querySelector('#achSave').addEventListener('click', () => {
      const title = overlay.querySelector('#achTitle').value.trim();
      if (!title) { alert('Введи название'); return; }

      const item = {
        id: Date.now(),
        title,
        type: overlay.querySelector('#achType').value,
        date: overlay.querySelector('#achDate').value,
        description: overlay.querySelector('#achDesc').value.trim(),
        link: overlay.querySelector('#achLink').value.trim()
      };

      const list = getAchievements();
      list.push(item);
      saveAchievements(list);
      close();
      renderAchievements();
      switchToTab('achievements');
      addNotification('Достижение добавлено', `«${title}» сохранено в портфолио`);
    });
  }

  // ============================================================
  // ОБЩИЕ СВЕДЕНИЯ
  // ============================================================
  function renderGeneral() {
    const fullName = getStudentName();
    const profile = getProfile();

    const nameEl = document.getElementById('studentName');
    const subEl = document.getElementById('studentSub');
    const avatarEl = document.getElementById('studentAvatar');

    if (nameEl) nameEl.textContent = getShortName(fullName);
    if (subEl) subEl.textContent = 'Студент 5106-об';
    if (avatarEl) avatarEl.textContent = getInitials(fullName);

    document.getElementById('genFio').textContent = fullName;
    document.getElementById('genBirth').textContent = profile.birthDate || '—';
  }

  // ============================================================
  // ДОКУМЕНТЫ
  // ============================================================
  function renderDocuments() {
    const tbody = document.getElementById('docsBody');
    const empty = document.getElementById('docsEmpty');
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
  }

  // ============================================================
  // РЕЙТИНГ
  // ============================================================
  const RATING = [
    { place: 1, name: 'Устинов Никита Сергеевич',        faculty: 'Институт компьютерных и инженерных наук', group: '5107-об', points: 2450 },
    { place: 2, name: 'Колосов Максим Алексеевич',        faculty: 'Институт компьютерных и инженерных наук', group: '5105-ом', points: 2380 },
    { place: 3, name: 'Бахтина Кристина Дмитриевна',      faculty: 'Факультет международных отношений',       group: '432-об',  points: 2310 },
    { place: 4, name: 'Бреев Борис Алексеевич',           faculty: 'Институт компьютерных и инженерных наук', group: '5105-ом', points: 2240 },
    { place: 5, name: 'Пресняков Ярослав Юрьевич',        faculty: 'Юридический факультет',                   group: '621-об',  points: 2180 },
    { place: 6, name: 'Соколова Валерия Олеговна',        faculty: 'Филологический факультет',                group: '312-об',  points: 2110 },
    { place: 7, name: 'Морозов Артём Дмитриевич',         faculty: 'Институт компьютерных и инженерных наук', group: '5106-об', points: 2040 },
    { place: 8, name: 'Антонова Полина Сергеевна',        faculty: 'Экономический факультет',                 group: '215-об',  points: 1970 },
    { place: 9, name: 'Хабаров Егор Владимирович',        faculty: 'Институт компьютерных и инженерных наук', group: '5108-об', points: 1900 },
    { place: 10, name: 'Лебедева Екатерина Игоревна',     faculty: 'Психолого-педагогический факультет',      group: '411-об',  points: 1830 }
  ];

  function renderRating() {
    const tbody = document.getElementById('ratingBody');

    tbody.innerHTML = RATING.map(r => {
      const placeIcon = r.place <= 3 ? 'trophy' : 'medal';
      const placeClass = `place-${r.place}`;

      return `
        <tr>
          <td>
            <span class="rating-place ${placeClass}">
              <i data-lucide="${placeIcon}"></i>
              ${r.place}
            </span>
          </td>
          <td><div class="rating-fio">${escapeHTML(r.name)}</div></td>
          <td><div class="rating-sub">${escapeHTML(r.faculty)}</div></td>
          <td>${escapeHTML(r.group)}</td>
          <td><span class="rating-points">${r.points}</span></td>
        </tr>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  // ============================================================
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const user = AppData.getCurrentUser();
    if (!user || user.role !== 'student') {
      window.location.replace('index.html');
      return;
    }

    renderGeneral();
    renderAchievements();
    renderDocuments();
    renderRating();
    initTabs();
    initNotifications();

    document.getElementById('btnAddAchievement').addEventListener('click', openAddModal);
  });
})();