/* ============================================================
   ПРОФИЛЬ — логика страницы
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';

  // Демо-данные профиля (потом заменим на реальные)
  const DEFAULT_PROFILE = {
    bekker: {
      birthDate: '15 марта 2006',
      email: 'id0056809@amursu.ru',
      phone: '+7 (914) 555-12-34',
      recordBook: '№ 2024-5106-1234',
      studentCard: '№ 2024-5106-5678'
    }
  };

  const PREFIX = 'app:';

  // ============================================================
  // ХРАНИЛИЩЕ
  // ============================================================
  function getProfile() {
    try {
      const raw = localStorage.getItem(PREFIX + 'profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[STUDENT_ID]) return parsed[STUDENT_ID];
      }
    } catch { }
    return { ...DEFAULT_PROFILE[STUDENT_ID] };
  }

  function saveProfile(data) {
    let all = {};
    try { all = JSON.parse(localStorage.getItem(PREFIX + 'profile')) || {}; } catch { }
    all[STUDENT_ID] = data;
    localStorage.setItem(PREFIX + 'profile', JSON.stringify(all));
  }

  // ============================================================
  // УВЕДОМЛЕНИЯ
  // ============================================================
  function getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(PREFIX + 'notifications')) || [];
    } catch { return []; }
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
    const dropdown = document.getElementById('notifDropdown');
    const listEl = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');

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
  // ДАННЫЕ ПРОФИЛЯ
  // ============================================================
  function getInitials(name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0] || '').slice(0, 2).toUpperCase();
  }

  function getStudentName() {
    const groups = AppData.getGroups();
    const list = groups['5106-об'] || [];
    const me = list.find(s => s.id === STUDENT_ID);
    return me ? me.name : 'Беккер Артём Станиславович';
  }

  function getShortName(fullName) {
    // Беккер Артём Станиславович → Беккер А. С.
    const parts = fullName.split(' ').filter(Boolean);
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
    }
    return fullName;
  }

  function renderProfile() {
    const profile = getProfile();
    const fullName = getStudentName();
    const shortName = getShortName(fullName);

    document.getElementById('profileAvatar').textContent = getInitials(fullName);
    document.getElementById('profileName').textContent = shortName;
    document.getElementById('profileSub').textContent = `Студент 5106-об · 2 курс`;

    document.getElementById('fio').textContent = fullName;
    document.getElementById('birthDate').textContent = profile.birthDate || '—';
    document.getElementById('group').textContent = '5106-об';
    document.getElementById('email').textContent = profile.email || '—';
    document.getElementById('phone').textContent = profile.phone || '—';
    document.getElementById('recordBook').textContent = profile.recordBook || '—';
    document.getElementById('studentCard').textContent = profile.studentCard || '—';

    const eduType = localStorage.getItem('eduType') || 'budget';
    document.getElementById('eduType').textContent = eduType === 'paid' ? 'Платное' : 'Бюджет';
  }

  // ============================================================
  // МОДАЛКИ
  // ============================================================
  function openEditModal() {
    const profile = getProfile();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3><i data-lucide="pencil"></i> Редактировать профиль</h3>

        <div class="field">
          <label>Дата рождения</label>
          <input id="pfBirth" type="text" value="${escapeHTML(profile.birthDate || '')}">
        </div>
        <div class="field">
          <label>Email</label>
          <input id="pfEmail" type="email" value="${escapeHTML(profile.email || '')}">
        </div>
        <div class="field">
          <label>Телефон</label>
          <input id="pfPhone" type="tel" value="${escapeHTML(profile.phone || '')}">
        </div>

        <div class="modal-actions">
          <button class="modal-btn primary" id="pfSave">Сохранить</button>
          <button class="modal-btn ghost" id="pfCancel">Отмена</button>
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

    overlay.querySelector('#pfCancel').addEventListener('click', close);
    overlay.querySelector('#pfSave').addEventListener('click', () => {
      const next = {
        ...profile,
        birthDate: overlay.querySelector('#pfBirth').value.trim(),
        email: overlay.querySelector('#pfEmail').value.trim(),
        phone: overlay.querySelector('#pfPhone').value.trim()
      };
      saveProfile(next);
      close();
      renderProfile();
    });
  }

  function openPasswordModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3><i data-lucide="key-round"></i> Сменить пароль</h3>

        <div class="field">
          <label>Текущий пароль</label>
          <input id="pfOld" type="password" placeholder="••••••••">
        </div>
        <div class="field">
          <label>Новый пароль</label>
          <input id="pfNew" type="password" placeholder="••••••••">
        </div>
        <div class="field">
          <label>Повторите новый пароль</label>
          <input id="pfNew2" type="password" placeholder="••••••••">
        </div>

        <div class="modal-actions">
          <button class="modal-btn primary" id="pfGo">Сменить</button>
          <button class="modal-btn ghost" id="pfCancel">Отмена</button>
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

    overlay.querySelector('#pfCancel').addEventListener('click', close);
    overlay.querySelector('#pfGo').addEventListener('click', () => {
      const oldP = overlay.querySelector('#pfOld').value;
      const newP = overlay.querySelector('#pfNew').value;
      const newP2 = overlay.querySelector('#pfNew2').value;

      if (!oldP || !newP) {
        alert('Заполни все поля');
        return;
      }
      if (newP !== newP2) {
        alert('Новые пароли не совпадают');
        return;
      }
      close();
      addNotification('Пароль изменён', 'Новый пароль успешно установлен');
    });
  }

  function handleDownload() {
    addNotification(
      'Справка об обучении',
      'Справка сформирована и отправлена на ваш email'
    );
  }

  // ============================================================
  // УТИЛИТЫ
  // ============================================================
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

    renderProfile();
    initNotifications();

    document.getElementById('btnEdit').addEventListener('click', openEditModal);
    document.getElementById('btnPassword').addEventListener('click', openPasswordModal);
    document.getElementById('btnDownload').addEventListener('click', handleDownload);
  });
})();