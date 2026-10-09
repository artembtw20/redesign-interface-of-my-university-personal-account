/* ============================================================
   ОБРАЗОВАТЕЛЬНЫЕ ПРОГРАММЫ — логика страницы
   ============================================================ */

(function () {
  const PREFIX = 'app:';

  // ============================================================
  // СПИСОК ДИСЦИПЛИН (для «Рабочих программ»)
  // ============================================================
  const DISCIPLINES = [
    'Python. Анализ данных',
    'Адаптивный курс математики',
    'Аналитический контроль качества нефтепродуктов',
    'Аппаратные средства вычислительной техники',
    'Безопасность вычислительных сетей',
    'Безопасность жизнедеятельности',
    'Безопасность операционных систем',
    'Безопасность систем баз данных',
    'Введение в профессию',
    'Гуманитарные аспекты информационной безопасности',
    'Деловой иностранный язык (английский)',
    'Деловой этикет на Востоке',
    'Дизайн оформления документов',
    'Дизайн цифровых продуктов',
    'Дискретная математика',
    'Документоведение и конфиденциальное делопроизводство',
    'Защита информации от утечки по техническим каналам',
    'Защита речевой (акустической) информации',
    'Имидж, стиль и мода в профессиональной деятельности',
    'Инвестиционный менеджмент',
    'Иностранный язык',
    'Иностранный язык для путешествий',
    'Иностранный язык для специальных целей',
    'Интеллектуальная собственность: от идеи до патента',
    'История и культура Дальнего Востока',
    'История культуры и искусства Амурской области',
    'История России',
    'Комплексное обеспечение информационной безопасности автоматизированных систем',
    'Контроль защищенности автоматизированных систем',
    'Конфликтология',
    'Культурология',
    'Легкая атлетика',
    'Линейная алгебра и теория матриц',
    'Логистика в международном бизнесе',
    'Маркетинговые исследования и ситуационный анализ',
    'Мастерство публичного выступления',
    'Математический анализ',
    'Методы и средства криптографической защиты информации',
    'Неразрушающие методы контроля',
    'Обеспечение безопасности информации в автоматизированных системах',
    'Общая физическая подготовка',
    'Операционные системы',
    'Организационное и правовое обеспечение информационной безопасности',
    'Основы визуализации данных',
    'Основы информационной безопасности',
    'Основы программирования на Python',
    'Основы проектной деятельности',
    'Основы российской государственности',
    'Основы управления информационной безопасностью',
    'Основы экономических знаний',
    'Правовое регулирование деятельности в сети интернет',
    'Правовое регулирование цифровых финансовых активов, цифровой валюты',
    'Правовые основы антикоррупционного поведения',
    'Право интеллектуальной собственности',
    'Прикладные пакеты векторной графики',
    'Программно-аппаратные средства защиты информации',
    'Проектирование защищенных автоматизированных систем',
    'Производственная и энергетическая безопасность',
    'Профессиональный иностранный язык',
    'Психология личностного роста и развития',
    'Русский язык и деловая коммуникация',
    'Сети и системы передачи информации',
    'Системы искусственного интеллекта',
    'Современная электроэнергетика',
    'Создание медиатекстов',
    'Софт скиллз',
    'Спортивные игры',
    'Стандарты информационной безопасности',
    'Тайм-менеджмент',
    'Теория вероятности и математическая статистика',
    'Теория информации',
    'Теория принятия решений',
    'Технологии бизнес-проектирования',
    'Технологии и методы программирования',
    'Угрозы информационной безопасности автоматизированных систем',
    'Физика',
    'Физическая культура и спорт',
    'Философия',
    'Функциональный процесс и организация предприятия',
    'Цифровая грамотность',
    'Цифровая трансформация бизнес-процессов',
    'Цифровые технологии в профессиональной деятельности',
    'Экономическая политика РФ',
    'Электротехника, электроника и схемотехника',
    'Энергосбережение и энергоэффективность',
    'Языки программирования'
  ];

  // ============================================================
  // КУРСЫ ПО ВЫБОРУ
  // ============================================================
  const COURSES = [
    {
      group: 'Б1.В',
      items: [
        { name: 'Безопасность вычислительных сетей', year: '2027-2028, Курс 3', checked: true },
        { name: 'Обеспечение безопасности информации в автоматизированных системах', year: '2028-2029, Курс 4', checked: true },
        { name: 'Стандарты информационной безопасности', year: '2027-2028, Курс 3', checked: true },
        { name: 'Угрозы информационной безопасности автоматизированных систем', year: '2027-2028, Курс 3', checked: true }
      ]
    },
    {
      group: 'Б1.В.ДВ.01',
      items: [
        { name: 'Безопасность операционных систем', year: '2028-2029, Курс 4', checked: false },
        { name: 'Контроль защищенности автоматизированных систем', year: '2028-2029, Курс 4', checked: false }
      ]
    },
    {
      group: 'Б1.В.ДВ.02',
      items: [
        { name: 'Легкая атлетика', year: '2025-2026, Курс 1', checked: false },
        { name: 'Легкая атлетика', year: '2026-2027, Курс 2', checked: false },
        { name: 'Легкая атлетика', year: '2027-2028, Курс 3', checked: false },
        { name: 'Общая физическая подготовка', year: '2025-2026, Курс 1', checked: false },
        { name: 'Общая физическая подготовка', year: '2026-2027, Курс 2', checked: false },
        { name: 'Общая физическая подготовка', year: '2027-2028, Курс 3', checked: false },
        { name: 'Спортивные игры', year: '2026-2027, Курс 2', checked: false },
        { name: 'Спортивные игры', year: '2027-2028, Курс 3', checked: false },
        { name: 'Спортивные игры', year: '2025-2026, Курс 1', checked: false }
      ]
    },
    {
      group: 'Б1.В.ДВ.03',
      items: [
        { name: 'Аналитический контроль качества нефтепродуктов', year: '2027-2028, Курс 3', checked: false },
        { name: 'Деловой иностранный язык (английский)', year: '2027-2028, Курс 3', checked: false },
        { name: 'Деловой этикет на Востоке', year: '2027-2028, Курс 3', checked: false },
        { name: 'Дизайн цифровых продуктов', year: '2027-2028, Курс 3', checked: false },
        { name: 'Инвестиционный менеджмент', year: '2027-2028, Курс 3', checked: false },
        { name: 'Иностранный язык для путешествий', year: '2027-2028, Курс 3', checked: false },
        { name: 'Интеллектуальная собственность: от идеи до патента', year: '2027-2028, Курс 3', checked: false },
        { name: 'История и культура Дальнего Востока', year: '2027-2028, Курс 3', checked: false },
        { name: 'История культуры и искусства Амурской области', year: '2027-2028, Курс 3', checked: false },
        { name: 'Логистика в международном бизнесе', year: '2027-2028, Курс 3', checked: false },
        { name: 'Маркетинговые исследования и ситуационный анализ', year: '2027-2028, Курс 3', checked: false },
        { name: 'Мастерство публичного выступления', year: '2027-2028, Курс 3', checked: false },
        { name: 'Неразрушающие методы контроля', year: '2027-2028, Курс 3', checked: false },
        { name: 'Право интеллектуальной собственности', year: '2027-2028, Курс 3', checked: false },
        { name: 'Правовое регулирование цифровых финансовых активов, цифровой валюты', year: '2027-2028, Курс 3', checked: false },
        { name: 'Прикладные пакеты векторной графики', year: '2027-2028, Курс 3', checked: false },
        { name: 'Психология личностного роста и развития', year: '2027-2028, Курс 3', checked: false },
        { name: 'Современная электроэнергетика', year: '2027-2028, Курс 3', checked: false },
        { name: 'Софт скиллз', year: '2027-2028, Курс 3', checked: false },
        { name: 'Технологии бизнес-проектирования', year: '2027-2028, Курс 3', checked: false },
        { name: 'Цифровая трансформация бизнес-процессов', year: '2027-2028, Курс 3', checked: false },
        { name: 'Цифровые технологии в профессиональной деятельности', year: '2027-2028, Курс 3', checked: false }
      ]
    }
  ];

  // ============================================================
  // ХРАНИЛИЩЕ ВЫБРАННЫХ КУРСОВ
  // ============================================================
  function loadCourseSelection() {
    try {
      const raw = localStorage.getItem(PREFIX + 'courseSelection');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveCourseSelection(data) {
    localStorage.setItem(PREFIX + 'courseSelection', JSON.stringify(data));
  }

  // ============================================================
  // ЭКРАНЫ
  // ============================================================
  const VIEW_META = {
    menu: { title: 'Образовательные программы', subtitle: 'Документы, курсы по выбору, история' },
    documents: { title: 'Документы образовательных программ', subtitle: 'Рабочие программы и методические материалы' },
    courses: { title: 'Дисциплины по выбору', subtitle: 'Запись на курсы по выбору' },
    history: { title: 'История мероприятий', subtitle: 'Приказы' }
  };

  function showScreen(name) {
    ['menu', 'documents', 'courses', 'history'].forEach(v => {
      document.getElementById('view-' + v).classList.toggle('hidden', v !== name);
    });
    const meta = VIEW_META[name];
    if (meta) {
      document.getElementById('pageTitle').textContent = meta.title;
      document.getElementById('pageSubtitle').textContent = meta.subtitle;
    }
    if (window.lucide) lucide.createIcons();
  }

  // ============================================================
  // РЕНДЕР ДИСЦИПЛИН
  // ============================================================
  function renderDisciplines() {
    const list = document.getElementById('disciplinesList');
    list.innerHTML = DISCIPLINES.map(d =>
      `<li><span class="doc-link">${escapeHTML(d)}</span> <span class="ext">(.sig)</span></li>`
    ).join('');
  }

  // ============================================================
  // РЕНДЕР КУРСОВ
  // ============================================================
  function renderCourses() {
    const tbody = document.getElementById('coursesBody');
    const selection = loadCourseSelection();

    let html = '';
    COURSES.forEach((group, gIdx) => {
      html += `<tr class="courses-group-head"><td colspan="2">${escapeHTML(group.group)}</td></tr>`;
      group.items.forEach((item, iIdx) => {
        const key = `${group.group}_${iIdx}`;
        const isChecked = (selection[key] !== undefined) ? selection[key] : item.checked;
        html += `
          <tr class="courses-row">
            <td>${escapeHTML(item.name)} (${escapeHTML(item.year)})</td>
            <td class="check-cell">
              <input type="checkbox" class="courses-check" data-key="${key}" ${isChecked ? 'checked' : ''}>
            </td>
          </tr>
        `;
      });
    });

    tbody.innerHTML = html;

    tbody.querySelectorAll('.courses-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const sel = loadCourseSelection();
        sel[cb.dataset.key] = cb.checked;
        saveCourseSelection(sel);
      });
    });
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
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const user = AppData.getCurrentUser();
    if (!user || user.role !== 'student') {
      window.location.replace('index.html');
      return;
    }

    renderDisciplines();
    renderCourses();
    initNotifications();

    // Меню подразделов
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(item.dataset.view);
      });
    });

    // Кнопки "Назад"
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => showScreen(btn.dataset.back));
    });

    // Аккордеон «Документы»
    const acc = document.getElementById('accDocsHead');
    if (acc) {
      acc.classList.add('open'); // по умолчанию раскрыт
      acc.parentElement.classList.add('open');
      acc.addEventListener('click', () => {
        acc.parentElement.classList.toggle('open');
      });
    }

    // Обработчик на ссылки-документы (уведомление)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.doc-link');
      if (link) {
        addNotification('Файл недоступен', 'В демо-режиме скачивание документов отключено');
      }
    });

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
  });
})();