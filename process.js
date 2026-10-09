/* ============================================================
   УЧЕБНЫЙ ПРОЦЕСС — логика process.html
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';
  const GROUP_ID = '5106-об';
  const PREFIX = 'app:';

  // ============================================================
  // ДАННЫЕ ДЛЯ ПРОМЕЖУТОЧНОЙ АТТЕСТАЦИИ (3 семестр, пустые оценки)
  // ============================================================
  const ATTESTATION = [
    { name: 'Гуманитарные аспекты информационной безопасности', hours: '36/108', control: 'Зачет с оценкой', competencies: 'ОПК-1 Способен оценивать роль информации, информационных технологий и информационной безопасности в современном обществе, их значение для обеспечения...' },
    { name: 'Гуманитарные аспекты информационной безопасности', hours: '36/108', control: 'Контроль теоретического обучения', competencies: 'ОПК-1 Способен оценивать роль информации, информационных технологий и информационной безопасности в современном обществе, их значение для обеспечения...' },
    { name: 'Иностранный язык (английский)', hours: '34/72', control: 'Зачет', competencies: 'УК-4 Способен осуществлять деловую коммуникацию в устной и письменной формах на государственном языке Российской Федерации и иностранном(ых) языке(ах)' },
    { name: 'Иностранный язык (английский)', hours: '34/72', control: 'Контроль теоретического обучения', competencies: 'УК-4 Способен осуществлять деловую коммуникацию в устной и письменной формах на государственном языке Российской Федерации и иностранном(ых) языке(ах)' },
    { name: 'Конфликтология', hours: '34/72', control: 'Зачет', competencies: 'УК-3 Способен осуществлять социальное взаимодействие и реализовывать свою роль в команде. УК-5 Способен воспринимать межкультурное разнообразие общества в социально-историческом, этическом и философском контекстах' },
    { name: 'Конфликтология', hours: '34/72', control: 'Контроль теоретического обучения', competencies: 'УК-3 Способен осуществлять социальное взаимодействие и реализовывать свою роль в команде. УК-5 Способен воспринимать межкультурное разнообразие общества в социально-историческом, этическом и философском контекстах' },
    { name: 'Легкая атлетика', hours: '34/68', control: 'Зачет', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Легкая атлетика', hours: '34/68', control: 'Контроль теоретического обучения', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Общая физическая подготовка', hours: '34/68', control: 'Зачет', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Общая физическая подготовка', hours: '34/68', control: 'Контроль теоретического обучения', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Основы экономических знаний', hours: '34/72', control: 'Зачет', competencies: 'УК-9 Способен принимать обоснованные экономические решения в различных областях жизнедеятельности' },
    { name: 'Основы экономических знаний', hours: '34/72', control: 'Контроль теоретического обучения', competencies: 'УК-9 Способен принимать обоснованные экономические решения в различных областях жизнедеятельности' },
    { name: 'Правовые основы антикоррупционного поведения', hours: '34/72', control: 'Зачет', competencies: 'УК-10 Способен формировать нетерпимое отношение к проявлениям экстремизма, терроризма, коррупционному поведению и противодействовать им в профессиональной деятельности' },
    { name: 'Правовые основы антикоррупционного поведения', hours: '34/72', control: 'Контроль теоретического обучения', competencies: 'УК-10 Способен формировать нетерпимое отношение к проявлениям экстремизма, терроризма, коррупционному поведению и противодействовать им в профессиональной деятельности' },
    { name: 'Спортивные игры', hours: '34/68', control: 'Зачет', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Спортивные игры', hours: '34/68', control: 'Контроль теоретического обучения', competencies: 'УК-7 Способен поддерживать должный уровень физической подготовленности для обеспечения полноценной социальной и профессиональной деятельности' },
    { name: 'Теория принятия решений', hours: '68/144', control: 'Экзамен', competencies: 'ОПК-3 Способен использовать необходимые математические методы для решения задач профессиональной деятельности' },
    { name: 'Технологии и методы программирования', hours: '52/144', control: 'Экзамен', competencies: 'ОПК-7 Способен использовать языки программирования и технологии разработки программных средств для решения задач профессиональной деятельности' },
    { name: 'Физика', hours: '68/144', control: 'Экзамен', competencies: 'ОПК-4 Способен применять необходимые физические законы и модели для решения задач профессиональной деятельности' },
    { name: 'Философия', hours: '50/108', control: 'Зачет с оценкой', competencies: 'УК-1 Способен осуществлять поиск, критический анализ и синтез информации, применять системный подход для решения поставленных задач. УК-5 Способен воспринимать межкультурное разнообразие общества в социально-историческом, этическом и философском контекстах' },
    { name: 'Философия', hours: '50/108', control: 'Контроль теоретического обучения', competencies: 'УК-1 Способен осуществлять поиск, критический анализ и синтез информации, применять системный подход для решения поставленных задач. УК-5 Способен воспринимать межкультурное разнообразие общества в социально-историческом, этическом и философском контекстах' },
    { name: 'Функциональный процесс и организация предприятия', hours: '36/108', control: 'Зачет с оценкой', competencies: 'ОПК-5 Способен применять нормативные правовые акты, нормативные и методические документы, регламентирующие деятельность по защите информации. УК-2 Способен определять круг задач в рамках поставленной цели и выбирать оптимальные способы их решения, исходя из действующих правовых норм, имеющихся...' },
    { name: 'Функциональный процесс и организация предприятия', hours: '36/108', control: 'Контроль теоретического обучения', competencies: 'ОПК-5 Способен применять нормативные правовые акты, нормативные и методические документы, регламентирующие деятельность по защите информации. УК-2 Способен определять круг задач в рамках поставленной цели и выбирать оптимальные способы их решения, исходя из действующих правовых норм, имеющихся...' }
  ];

  // ============================================================
  // ТЕКУЩАЯ УСПЕВАЕМОСТЬ (оценки 4/5, без серого)
  // ============================================================
  const CURRENT_GRADES = [
    { name: 'Гуманитарные аспекты информационной безопасности', grades: [5], final: 'Зачет с оценкой' },
    { name: 'Иностранный язык (английский)', grades: [], final: 'Зачет' },
    { name: 'Конфликтология', grades: [], final: 'Зачет' },
    { name: 'Легкая атлетика', grades: [], final: 'Зачет' },
    { name: 'Общая физическая подготовка', grades: [5], final: 'Зачет' },
    { name: 'Основы экономических знаний', grades: [], final: 'Зачет' },
    { name: 'Правовые основы антикоррупционного поведения', grades: [], final: 'Зачет' },
    { name: 'Спортивные игры', grades: [], final: 'Зачет' },
    { name: 'Теория принятия решений', grades: [], final: 'Экзамен' },
    { name: 'Технологии и методы программирования', grades: [4], final: 'Экзамен' },
    { name: 'Физика', grades: [5], final: 'Экзамен' },
    { name: 'Философия', grades: [], final: 'Зачет с оценкой' },
    { name: 'Функциональный процесс и организация предприятия', grades: [4], final: 'Зачет с оценкой' }
  ];

  // ============================================================
  // ИНДИВИДУАЛЬНЫЕ ЗАДАНИЯ (предмет + преподаватель)
  // ============================================================
  const TASKS_SUBJECTS = [
    'Гуманитарные аспекты информационной безопасности (Васильева Елена Владимировна)',
    'Иностранный язык (английский) (Мусаева Елена Георгиевна)',
    'Конфликтология (Слюсарева Елена Александровна)',
    'Общая физическая подготовка (Корчевский Андрей Михайлович)',
    'Основы экономических знаний (Плешивцев Андрей Валентинович)',
    'Технологии и методы программирования (Самарин Александр Дмитриевич)',
    'Физика (Голубева Ирина Анатольевна)',
    'Философия (Хворостяной Артём Александрович)',
    'Функциональный процесс и организация предприятия (Рыбакова Лина Васильевна)'
  ];

  // ============================================================
  // ЦВЕТА АВАТАРОВ
  // ============================================================
  const AVATAR_COLORS = [
    '#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4',
    '#10B981', '#F59E0B', '#EF4444', '#14B8A6',
    '#6366F1', '#84CC16', '#F97316', '#A855F7'
  ];
  function colorFromName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }
  function getInitials(name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0] || '').slice(0, 2).toUpperCase();
  }
  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================================
  // ЭКРАНЫ
  // ============================================================
  const VIEW_META = {
    menu: { title: 'Учебный процесс', subtitle: 'Электронное обучение, аттестация, задания' },
    elearning: { title: 'Электронное обучение в СДО Moodle', subtitle: 'Учётная запись, приложение, курсы' },
    attestation: { title: 'Результаты промежуточной аттестации и результаты освоения программы', subtitle: 'Третий семестр' },
    current: { title: 'Текущая успеваемость', subtitle: 'Оценки за третий семестр' },
    tasks: { title: 'Индивидуальные задания', subtitle: 'Третий семестр' },
    group: { title: 'Ваша группа', subtitle: '5106-об' }
  };

  function showScreen(name) {
    ['menu', 'elearning', 'attestation', 'current', 'tasks', 'group'].forEach(v => {
      const el = document.getElementById('view-' + v);
      if (el) el.classList.toggle('hidden', v !== name);
    });
    const meta = VIEW_META[name];
    if (meta) {
      document.getElementById('pageTitle').textContent = meta.title;
      document.getElementById('pageSubtitle').textContent = meta.subtitle;
    }
    if (window.lucide) lucide.createIcons();
  }

  // ============================================================
  // РЕНДЕР: ПРОМЕЖУТОЧНАЯ АТТЕСТАЦИЯ
  // ============================================================
  function renderAttestation() {
    const tbody = document.getElementById('attestationBody');
    tbody.innerHTML = ATTESTATION.map(row => `
      <tr>
        <td>${escapeHTML(row.name)}</td>
        <td>${escapeHTML(row.hours)}</td>
        <td>${escapeHTML(row.control)}</td>
        <td></td>
        <td>
          <ul class="doc-list" style="list-style:none;padding:0;margin:0;">
            <li style="position:relative;padding-left:14px;">
              <span style="position:absolute;left:2px;top:7px;width:4px;height:4px;border-radius:50%;background:var(--text-muted);"></span>
              ${escapeHTML(row.competencies)}
            </li>
          </ul>
        </td>
        <td></td>
      </tr>
    `).join('');
  }

  // ============================================================
  // РЕНДЕР: ТЕКУЩАЯ УСПЕВАЕМОСТЬ
  // ============================================================
  function renderCurrent() {
    const tbody = document.getElementById('currentBody');
    tbody.innerHTML = CURRENT_GRADES.map(row => {
      const gradesHTML = row.grades.length
        ? row.grades.map(g => `<span class="grade-badge num">${g}</span>`).join(' ')
        : '';
      return `
        <tr>
          <td>${escapeHTML(row.name)}</td>
          <td>${gradesHTML}</td>
          <td>-</td>
          <td>${escapeHTML(row.final)}</td>
        </tr>
      `;
    }).join('');
  }

  // ============================================================
  // РЕНДЕР: ИНДИВИДУАЛЬНЫЕ ЗАДАНИЯ
  // ============================================================
  function renderTasks() {
    const container = document.getElementById('tasksList');
    container.innerHTML = TASKS_SUBJECTS.map((subject, i) => `
      <div class="task-row" data-idx="${i}">
        <div class="task-head">
          <span>${escapeHTML(subject)}</span>
          <i data-lucide="chevron-down" class="arrow"></i>
        </div>
        <div class="task-body">
          <div class="task-empty">Нет индивидуальных заданий</div>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    container.querySelectorAll('.task-head').forEach(head => {
      head.addEventListener('click', () => {
        head.parentElement.classList.toggle('open');
      });
    });
  }

  // ============================================================
  // РЕНДЕР: СПИСОК ГРУППЫ
  // ============================================================
  function renderGroup() {
    const container = document.getElementById('groupList');
    const students = AppData.getGroupStudents(GROUP_ID);

    container.innerHTML = students.map(s => {
      const isSelf = s.id === STUDENT_ID;
      return `
        <div class="group-person">
          <div class="gp-avatar" style="background: ${colorFromName(s.name)}">
            ${getInitials(s.name)}
          </div>
          <div class="gp-name">${escapeHTML(s.name)}</div>
          ${isSelf ? '<span class="gp-self">Это вы</span>' : ''}
        </div>
      `;
    }).join('');
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

    renderAttestation();
    renderCurrent();
    renderTasks();
    renderGroup();
    initNotifications();

    // Меню — пропускаем ссылки с настоящим href
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href') || '';
        if (href && href !== '#') return; // пусть браузер сам перейдёт

        e.preventDefault();
        const view = item.dataset.view;
        if (view === 'stub') {
          addNotification(item.dataset.stub, 'Раздел находится в разработке');
          return;
        }
        showScreen(view);
      });
    });

    // Назад
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => showScreen(btn.dataset.back));
    });

    // Заглушки-ссылки (Moodle, инструкции, приложения)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-stub-link]');
      if (link) {
        e.preventDefault();
        addNotification('Внешняя ссылка', `«${link.dataset.stubLink}» недоступна в демо-режиме`);
      }
    });
  });
})();