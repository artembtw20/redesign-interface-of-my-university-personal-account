/* ============================================================
   ЗАЧЁТНАЯ КНИЖКА — логика record-book.html
   ============================================================ */

(function () {
  const PREFIX = 'app:';

  // ============================================================
  // ДАННЫЕ
  // ============================================================
  const DATA = {
    year1: {
      1: {
        exams: [
          { name: 'Математический анализ', hours: '144/4', grade: 'Хорошо', date: '11.02.2026', teacher: '' },
          { name: 'Основы программирования на Python', hours: '144/4', grade: 'Удовлетворительно', date: '01.06.2026', teacher: 'Акилова Ирина Михайловна' },
          { name: 'Цифровая грамотность', hours: '144/4', grade: 'Удовлетворительно', date: '08.05.2026', teacher: 'Попова Ангелина Михайловна' }
        ],
        zachets: [
          { name: 'Введение в профессию', hours: '72/2', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Иностранный язык (английский)', hours: '72/2', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Культурология', hours: '72/2', grade: 'Зачтено', date: '13.03.2026', teacher: 'Блохинская Алена Владимировна' },
          { name: 'Линейная алгебра и теория матриц', hours: '108/3', grade: 'Хорошо', date: '11.02.2026', teacher: '' },
          { name: 'Основы информационной безопасности', hours: '108/3', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Основы российской государственности', hours: '72/2', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Русский язык и деловая коммуникация', hours: '72/2', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Физическая культура и спорт', hours: '72/2', grade: 'Зачтено', date: '11.02.2026', teacher: '' },
          { name: 'Языки программирования', hours: '72/2', grade: 'Зачтено', date: '08.05.2026', teacher: 'Никифорова Лариса Владимировна' }
        ]
      },
      2: {
        exams: [
          { name: 'Дискретная математика', hours: '180/5', grade: 'Хорошо', date: '19.06.2026', teacher: 'Акилова Ирина Михайловна' },
          { name: 'Математический анализ', hours: '108/3', grade: 'Хорошо', date: '10.06.2026', teacher: 'Дудин Андрей Николаевич' },
          { name: 'Языки программирования', hours: '144/4', grade: 'Удовлетворительно', date: '15.06.2026', teacher: 'Никифорова Лариса Владимировна' }
        ],
        zachets: [
          { name: 'Иностранный язык (английский)', hours: '72/2', grade: 'Зачтено', date: '04.06.2026', teacher: 'Будник Софья Олеговна' },
          { name: 'История России', hours: '144/4', grade: 'Удовлетворительно', date: '25.05.2026', teacher: 'Лапин Андрей Валерьевич' },
          { name: 'Общая физическая подготовка', hours: '68/0', grade: 'Зачтено', date: '04.06.2026', teacher: 'Корчевский Андрей Михайлович' },
          { name: 'Основы проектной деятельности', hours: '72/2', grade: 'Зачтено', date: '29.05.2026', teacher: 'Лебедь Ольга Анатольевна' },
          { name: 'Физика', hours: '108/3', grade: 'Зачтено', date: '02.06.2026', teacher: 'Зотова Оксана Васильевна' }
        ]
      }
    }
  };

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

  function getGradeClass(grade) {
    if (!grade) return '';
    const g = grade.toLowerCase();
    if (g === 'отлично') return 'grade-otlichno';
    if (g === 'хорошо') return 'grade-khorosho';
    if (g === 'удовлетворительно') return 'grade-udovlet';
    if (g === 'зачтено') return 'grade-zachet';
    if (g === 'не зачтено') return 'grade-nezachet';
    return '';
  }

  function renderRows(tbody, items) {
    if (!tbody) return;
    if (!items || items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="rb-empty">Нет записей</td></tr>`;
      return;
    }
    tbody.innerHTML = items.map((row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHTML(row.name)}</td>
        <td>${escapeHTML(row.hours)}</td>
        <td><span class="rb-grade ${getGradeClass(row.grade)}">${escapeHTML(row.grade)}</span></td>
        <td>${escapeHTML(row.date)}</td>
        <td>${escapeHTML(row.teacher)}</td>
      </tr>
    `).join('');
  }

  // ============================================================
  // РЕНДЕР
  // ============================================================
  function render() {
    renderRows(document.getElementById('year1Sem1Exams'), DATA.year1[1].exams);
    renderRows(document.getElementById('year1Sem1Zachets'), DATA.year1[1].zachets);
    renderRows(document.getElementById('year1Sem2Exams'), DATA.year1[2].exams);
    renderRows(document.getElementById('year1Sem2Zachets'), DATA.year1[2].zachets);
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
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const user = AppData.getCurrentUser();
    if (!user || user.role !== 'student') {
      window.location.replace('index.html');
      return;
    }

    render();
    initNotifications();

    // Вкладки внутри книжки
    document.querySelectorAll('.rb-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.rb-tab').forEach(t => t.classList.toggle('active', t === tab));
        const target = tab.dataset.tab;
        ['year1', 'year2', 'elective', 'coursework', 'practice'].forEach(t => {
          document.getElementById('pane-' + t).classList.toggle('hidden', t !== target);
        });
        if (window.lucide) lucide.createIcons();
      });
    });

    // Подвкладки семестров
    document.querySelectorAll('.rb-subtabs').forEach(group => {
      const subtabs = group.querySelectorAll('.rb-subtab');
      const pane = group.parentElement;
      subtabs.forEach(subtab => {
        subtab.addEventListener('click', () => {
          subtabs.forEach(t => t.classList.toggle('active', t === subtab));
          const sem = subtab.dataset.sem;
          pane.querySelectorAll('.rb-sem').forEach(s => {
            s.classList.toggle('hidden', s.dataset.sem !== sem);
          });
        });
      });
    });

    // Публичная зачётная книжка
    const pubToggle = document.getElementById('publicToggle');
    const pubBadge = document.getElementById('publicBadge');
    if (pubToggle && pubBadge) {
      pubToggle.addEventListener('change', () => {
        if (pubToggle.checked) {
          pubBadge.classList.add('open');
          pubBadge.innerHTML = '<i data-lucide="lock-open"></i> Доступ открыт';
          if (window.lucide) lucide.createIcons();
          addNotification('Публичная зачётная книжка', 'Доступ открыт по ссылке и QR-коду');
        } else {
          pubBadge.classList.remove('open');
          pubBadge.innerHTML = '<i data-lucide="lock"></i> Доступ закрыт';
          if (window.lucide) lucide.createIcons();
          addNotification('Публичная зачётная книжка', 'Доступ закрыт');
        }
      });
    }

    // «Качество диплома» → уведомление
    const qualityLink = document.querySelector('.rb-stat-link');
    if (qualityLink) {
      qualityLink.addEventListener('click', () => {
        addNotification('Качество диплома', 'Раздел находится в разработке');
      });
    }
  });
})();