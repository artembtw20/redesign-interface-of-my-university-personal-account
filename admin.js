/* ============================================================
   АДМИН — логика страницы admin.html
   Правит расписание и типы пар для выбранной группы
   ============================================================ */

(function () {
  const SEMESTER_START = new Date(2026, 7, 31);
  const TOTAL_WEEKS = 18;

  const TIME_SLOTS = [
    '08:15 – 09:45',
    '09:55 – 11:25',
    '11:35 – 13:05',
    '14:00 – 15:30',
    '15:40 – 17:10',
    '17:20 – 18:50'
  ];

  const DAY_KEYS   = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const DAY_SHORT  = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

  const TYPE_LABEL = {
    lecture:  'Лекция',
    practice: 'Практика',
    lab:      'Лабораторная'
  };

  let currentGroup = '5106-об';
  let currentMonday = getMonday(new Date());

  // ============================================================
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const user = AppData.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.replace('index.html');
      return;
    }

    // Селект групп
    const groupSelect = document.getElementById('groupSelect');
    Object.keys(AppData.getGroups()).forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      groupSelect.appendChild(opt);
    });
    groupSelect.value = currentGroup;
    groupSelect.addEventListener('change', (e) => {
      currentGroup = e.target.value;
      render();
    });

    // Стрелки недель
    document.getElementById('prevWeek').addEventListener('click', () => {
      currentMonday = addDays(currentMonday, -7);
      render();
    });
    document.getElementById('nextWeek').addEventListener('click', () => {
      currentMonday = addDays(currentMonday, 7);
      render();
    });

    render();
  });

  // ============================================================
  // УТИЛИТЫ ДАТ
  // ============================================================
  function getMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    return d;
  }
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  function formatDay(date) {
    return `${date.getDate()} ${MONTHS_GEN[date.getMonth()]}`;
  }
  function formatRange(monday) {
    const saturday = addDays(monday, 5);
    return `${monday.getDate()} – ${saturday.getDate()} ${MONTHS_GEN[saturday.getMonth()]} ${saturday.getFullYear()}`;
  }
  function getWeekNumber(monday) {
    const startMonday = getMonday(SEMESTER_START);
    const diff = Math.floor((monday - startMonday) / (7 * 24 * 60 * 60 * 1000));
    return (diff % 2 === 0) ? 1 : 2;
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
  // РЕНДЕР
  // ============================================================
  function render() {
    const weekNum = getWeekNumber(currentMonday);
    const weekKey = weekNum === 1 ? 'week1' : 'week2';
    const data = AppData.getSchedule(currentGroup);
    const weekData = data[weekKey];

    document.getElementById('weekRange').textContent = formatRange(currentMonday);
    document.getElementById('weekSub').textContent = `${weekNum}-я неделя · ${currentGroup}`;
    document.getElementById('chipWeek').textContent = `${weekNum}-я неделя`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

    // Заголовки колонок
    let headHTML = `<th>Время</th>`;
    for (let i = 0; i < DAY_KEYS.length; i++) {
      const d = addDays(currentMonday, i);
      const isToday = d.toDateString() === todayStr;
      headHTML += `
        <th class="${isToday ? 'today' : ''}">
          <span class="day-name">${DAY_SHORT[i]}</span>
          <span class="day-date">${formatDay(d)}</span>
        </th>
      `;
    }
    document.getElementById('scheduleHead').innerHTML = headHTML;

    // Тело таблицы
    let bodyHTML = '';
    for (let row = 0; row < TIME_SLOTS.length; row++) {
      bodyHTML += `<tr>`;
      bodyHTML += `<td class="time-cell">${TIME_SLOTS[row]}</td>`;

      for (let col = 0; col < DAY_KEYS.length; col++) {
        const day = DAY_KEYS[col];
        const cellDate = addDays(currentMonday, col);
        const isTodayCol = cellDate.toDateString() === todayStr;
        const todayClass = isTodayCol ? ' today-col' : '';

        const lesson = (weekData[day] && weekData[day][row]) || { time: TIME_SLOTS[row], name: '', teacher: '', room: '', type: '' };
        const hasLesson = lesson.name && lesson.name.trim();

        if (!hasLesson) {
          bodyHTML += `
            <td class="empty-cell lesson-cell${todayClass}"
                data-week="${weekKey}" data-day="${day}" data-row="${row}"
                onclick="openEditor(this)"></td>
          `;
        } else {
          const meta = [];
          if (lesson.teacher) meta.push(escapeHTML(lesson.teacher));
          if (lesson.room) meta.push('ауд. ' + escapeHTML(lesson.room));
          const typeLabel = lesson.type && TYPE_LABEL[lesson.type] ? TYPE_LABEL[lesson.type] : '';

          bodyHTML += `
            <td class="lesson-cell${todayClass}"
                data-week="${weekKey}" data-day="${day}" data-row="${row}"
                onclick="openEditor(this)">
              <div class="lesson-name">${escapeHTML(lesson.name)}</div>
              ${meta.length ? `<div class="lesson-meta">${meta.join(' · ')}</div>` : ''}
              ${typeLabel ? `<span class="badge ${lesson.type}">${typeLabel}</span>` : ''}
            </td>
          `;
        }
      }
      bodyHTML += `</tr>`;
    }
    document.getElementById('scheduleBody').innerHTML = bodyHTML;

    if (window.lucide) lucide.createIcons();
  }

  // ============================================================
  // МОДАЛКА РЕДАКТИРОВАНИЯ
  // ============================================================
  window.openEditor = function (cell) {
    const week = cell.dataset.week;
    const day = cell.dataset.day;
    const row = parseInt(cell.dataset.row, 10);

    const data = AppData.getSchedule(currentGroup);
    const lesson = (data[week] && data[week][day] && data[week][day][row]) || {
      name: '', teacher: '', room: '', type: ''
    };

    const dayName = {
      monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
      thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота'
    }[day];
    const weekLabel = week === 'week1' ? '1-я неделя' : '2-я неделя';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3><i data-lucide="pencil"></i> Редактировать пару</h3>

        <div class="field">
          <label>Название пары</label>
          <input id="editName" type="text" placeholder="Например: Физика"
                 value="${escapeHTML(lesson.name || '')}">
        </div>

        <div class="field">
          <label>Преподаватель</label>
          <input id="editTeacher" type="text" placeholder="Например: Голубева И.А."
                 value="${escapeHTML(lesson.teacher || '')}">
        </div>

        <div class="field">
          <label>Аудитория</label>
          <input id="editRoom" type="text" placeholder="Например: 407 (1)"
                 value="${escapeHTML(lesson.room || '')}">
        </div>

        <div class="field">
          <label>Тип пары</label>
          <select id="editType">
            <option value=""          ${!lesson.type ? 'selected' : ''}>— не указан —</option>
            <option value="lecture"   ${lesson.type === 'lecture'  ? 'selected' : ''}>Лекция</option>
            <option value="practice"  ${lesson.type === 'practice' ? 'selected' : ''}>Практика</option>
            <option value="lab"       ${lesson.type === 'lab'      ? 'selected' : ''}>Лабораторная</option>
          </select>
        </div>

        <div class="modal-hint">
          ${weekLabel} · ${dayName} · ${TIME_SLOTS[row]} · ${currentGroup}
        </div>

        <div class="modal-actions">
          <button class="modal-btn primary" id="modalSave">Сохранить</button>
          <button class="modal-btn ghost" id="modalCancel">Отмена</button>
          <button class="modal-btn danger" id="modalClear" title="Очистить пару">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    if (window.lucide) lucide.createIcons();

    const inputName = overlay.querySelector('#editName');
    const inputTeacher = overlay.querySelector('#editTeacher');
    const inputRoom = overlay.querySelector('#editRoom');
    const inputType = overlay.querySelector('#editType');

    setTimeout(() => inputName.focus(), 50);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    const escHandler = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', escHandler);

    const enterHandler = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        save();
      }
    };
    inputName.addEventListener('keydown', enterHandler);
    inputTeacher.addEventListener('keydown', enterHandler);
    inputRoom.addEventListener('keydown', enterHandler);

    overlay.querySelector('#modalSave').addEventListener('click', save);
    overlay.querySelector('#modalCancel').addEventListener('click', closeModal);
    overlay.querySelector('#modalClear').addEventListener('click', clear);

    function closeModal() {
      document.removeEventListener('keydown', escHandler);
      overlay.remove();
    }

    function save() {
      const name = inputName.value.trim();
      const teacher = inputTeacher.value.trim();
      const room = inputRoom.value.trim();
      const type = inputType.value;

      const fresh = AppData.getSchedule(currentGroup);
      if (!fresh[week][day][row]) {
        fresh[week][day][row] = { time: TIME_SLOTS[row], name: '', teacher: '', room: '', type: '' };
      }
      fresh[week][day][row].name = name;
      fresh[week][day][row].teacher = teacher;
      fresh[week][day][row].room = room;
      fresh[week][day][row].type = type;

      AppData.saveSchedule(currentGroup, fresh);

      closeModal();
      render();
    }

    function clear() {
      const fresh = AppData.getSchedule(currentGroup);
      if (fresh[week][day][row]) {
        fresh[week][day][row] = { time: TIME_SLOTS[row], name: '', teacher: '', room: '', type: '' };
      }
      AppData.saveSchedule(currentGroup, fresh);
      closeModal();
      render();
    }
  };
})();