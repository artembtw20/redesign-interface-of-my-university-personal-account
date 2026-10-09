/* ============================================================
   СТУДЕНЧЕСКИЙ БИЛЕТ — логика student-card.html
   ============================================================ */

(function () {
  const PREFIX = 'app:';

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
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================================
  // ЛОГИКА «ОБНОВИТЬ СТАТУС»
  // ============================================================
  let needsRenew = false;

  function toggleStatus() {
    needsRenew = !needsRenew;
    const badge = document.getElementById('scStatusBadge');
    const desc = document.getElementById('scStatusDesc');
    const statusText = document.querySelector('.sc-status-active-text');

    if (needsRenew) {
      badge.classList.add('warning');
      badge.innerHTML = '<i data-lucide="alert-circle"></i> <span>Требуется продление</span>';
      desc.textContent = 'Срок действия истекает. Обратитесь в деканат для продления билета.';
      if (statusText) statusText.textContent = 'Требуется продление';
      addNotification('Студенческий билет', 'Требуется продление — обратитесь в деканат');
    } else {
      badge.classList.remove('warning');
      badge.innerHTML = '<i data-lucide="check-circle-2"></i> <span>Действителен</span>';
      desc.textContent = 'Билет активен, продление не требуется';
      if (statusText) statusText.textContent = 'Действителен';
      addNotification('Студенческий билет', 'Статус обновлён: действителен');
    }
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

    // Тип обучения — из data-edu-type на body
    const eduType = localStorage.getItem('eduType') || 'budget';
    const el = document.getElementById('scEduType');
    if (el) el.textContent = eduType === 'paid' ? 'Платное' : 'Бюджет';

    initNotifications();

        // Кнопка "Назад"
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        window.location.href = 'process.html';
      });
    }

    document.getElementById('btnDownload').addEventListener('click', () => {
      addNotification('Скачать PDF', 'Документ будет доступен в ближайшее время');
    });
    document.getElementById('btnRenew').addEventListener('click', toggleStatus);
  });
})();