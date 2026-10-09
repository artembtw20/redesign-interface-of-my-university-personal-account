/* ============================================================
   ПОВЫШЕННАЯ СТИПЕНДИЯ — логика scholarship.html
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
  // ТАБЫ (ВСЕ / ПОДТВЕРЖДЕННЫЕ)
  // ============================================================
  function initTabs() {
    document.querySelectorAll('.sch-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sch-tab').forEach(t =>
          t.classList.toggle('active', t === tab)
        );
        // Пока таблица пустая — переключение ничего не меняет,
        // но при появлении данных будет использоваться data-filter
        renderTable(tab.dataset.filter);
      });
    });
  }

  function renderTable(filter) {
    // Демо-данных нет — всегда показываем пустое состояние.
    // Фильтр сохранён на будущее.
    const tbody = document.getElementById('schTableBody');
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="sch-empty">Отсутствуют заявления</td>
      </tr>
    `;
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

    initNotifications();
    initTabs();

    // Кнопка «Перейти в Портфолио»
    const goBtn = document.getElementById('btnGoPortfolio');
    if (goBtn) {
      goBtn.addEventListener('click', () => {
        window.location.href = 'portfolio.html';
      });
    }
  });
})();