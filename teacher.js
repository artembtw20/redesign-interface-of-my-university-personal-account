/* ============================================================
   КАБИНЕТ ПРЕПОДАВАТЕЛЯ — логика
   ============================================================ */

(function () {
  const SEMESTER_START = new Date(2026, 7, 31);
  const TOTAL_WEEKS = 18;
  const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday'];

  let currentTeacher = null;
  let currentGroup = null;
  let currentDate = null; // Date или null (для таба «Посещаемость»)

  // Для черновика: хранит изменения до «Сохранить»
  let attendanceDraft = {}; // { studentId: 'present'|'absent'|'excused'|'' }
  let gradesDraft = {};     // { studentId: 5|4|3|2|null }

  // ============================================================
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const user = AppData.getCurrentUser();
    if (!user || user.role !== 'teacher') {
      window.location.replace('index.html');
      return;
    }

    currentTeacher = AppData.getTeachers()[user.id];
    if (!currentTeacher) {
      window.location.replace('index.html');
      return;
    }

    // Хедер
    document.getElementById('teacherInfo').textContent =
      `${currentTeacher.name} · ${currentTeacher.subject}`;
    const initials = currentTeacher.name
      .split(/[\s.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(s => s[0])
      .join('');
    document.getElementById('avatarBtn').textContent = initials.toUpperCase();

    // Селект групп
    const groupSelect = document.getElementById('groupSelect');
    currentTeacher.groups.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      groupSelect.appendChild(opt);
    });
    currentGroup = currentTeacher.groups[0];

    // Обработчики
    groupSelect.addEventListener('change', onGroupChange);

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.getElementById('dateSelect').addEventListener('change', onDateChange);
    document.getElementById('saveAttendance').addEventListener('click', saveAttendance);
    document.getElementById('saveGrades').addEventListener('click', saveGrades);

    // Инициализация
    buildDateSelect();
    renderAttendance();
    renderGrades();
  });

  // ============================================================
  // УПРАВЛЕНИЕ
  // ============================================================
  function onGroupChange(e) {
    currentGroup = e.target.value;
    buildDateSelect();
    attendanceDraft = {};
    gradesDraft = {};
    renderAttendance();
    renderGrades();
  }

  function switchTab(name) {
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    document.getElementById('tab-attendance').classList.toggle('hidden', name !== 'attendance');
    document.getElementById('tab-grades').classList.toggle('hidden', name !== 'grades');
  }

  function onDateChange(e) {
    currentDate = new Date(e.target.value + 'T00:00:00');
    attendanceDraft = {};
    renderAttendance();
  }

  // ============================================================
  // ДАТЫ
  // ============================================================
  // Возвращает все даты семестра, когда у группы есть пара по предмету препода
  function getAllDatesForSubject() {
    const schedule = AppData.getSchedule(currentGroup);
    const dates = [];

    for (let week = 0; week < TOTAL_WEEKS; week++) {
      const monday = new Date(SEMESTER_START);
      monday.setDate(monday.getDate() + week * 7);
      const weekKey = (week % 2 === 0) ? 'week1' : 'week2';
      const weekData = schedule[weekKey];

      for (let d = 0; d < 6; d++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + d);
        const lessons = weekData[DAY_KEYS[d]] || [];
        lessons.forEach(l => {
          if (l.name === currentTeacher.subject) {
            dates.push({
              date: new Date(date),
              time: l.time,
              type: l.type
            });
          }
        });
      }
    }
    return dates;
  }

  function buildDateSelect() {
    const select = document.getElementById('dateSelect');
    select.innerHTML = '';
    const dates = getAllDatesForSubject();

    if (dates.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'Нет занятий';
      select.appendChild(opt);
      select.disabled = true;
      currentDate = null;
      return;
    }
    select.disabled = false;

    // Сортируем по дате
    dates.sort((a, b) => a.date - b.date);

    // Находим ближайшую прошедшую (или самую раннюю будущую)
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    let defaultIdx = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i].date <= now) { defaultIdx = i; break; }
    }

    dates.forEach((d, i) => {
      const opt = document.createElement('option');
      const iso = toISO(d.date);
      opt.value = iso;
      opt.textContent = formatDateLong(d.date) + ' · ' + d.time;
      if (i === defaultIdx) opt.selected = true;
      select.appendChild(opt);
    });

    currentDate = new Date(dates[defaultIdx].date);
    attendanceDraft = {};
  }

  function toISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const DAYS_SHORT = ['вс','пн','вт','ср','чт','пт','сб'];

  function formatDateLong(d) {
    return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
  }

  // ============================================================
  // ПОСЕЩАЕМОСТЬ
  // ============================================================
  function renderAttendance() {
    const container = document.getElementById('attendanceStudents');
    const students = AppData.getGroupStudents(currentGroup);

    if (!currentDate || students.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="inbox"></i>
          <div class="title">Нет данных</div>
          <div class="desc">Выберите группу и дату</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Читаем сохранённые данные из AppData (details)
    const allAtt = AppData.getAttendance();
    const dateKey = toISO(currentDate);

    container.innerHTML = students.map((s, i) => {
      const saved = (allAtt[s.id] && allAtt[s.id].details && allAtt[s.id].details[dateKey + '_' + currentTeacher.subject]) || '';
      // Приоритет у черновика
      const status = (attendanceDraft[s.id] !== undefined) ? attendanceDraft[s.id] : saved;
      const initials = getInitials(s.name);

      return `
        <div class="student-row" data-student="${s.id}">
          <div class="student-avatar">${initials}</div>
          <div class="student-name">${escapeHTML(s.name)}</div>
          <div class="student-actions">
            <button class="status-btn present ${status === 'present' ? 'active' : ''}"
                    data-status="present" data-id="${s.id}">
              <i data-lucide="check"></i> Был
            </button>
            <button class="status-btn absent ${status === 'absent' ? 'active' : ''}"
                    data-status="absent" data-id="${s.id}">
              <i data-lucide="x"></i> Не был
            </button>
            <button class="status-btn excused ${status === 'excused' ? 'active' : ''}"
                    data-status="excused" data-id="${s.id}">
              <i data-lucide="shield"></i> Уваж.
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();

    // Обработчики
    container.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const status = btn.dataset.status;
        // toggle: если та же кнопка — сбрасываем
        if (attendanceDraft[id] === status) {
          attendanceDraft[id] = '';
        } else {
          attendanceDraft[id] = status;
        }
        // Обновляем UI этой строки
        const row = btn.closest('.student-row');
        row.querySelectorAll('.status-btn').forEach(b => {
          b.classList.toggle('active',
            b.dataset.status === attendanceDraft[id]);
        });
      });
    });
  }

  function saveAttendance() {
    if (!currentDate) return;

    const dateKey = toISO(currentDate);
    const allAtt = AppData.getAttendance();
    const students = AppData.getGroupStudents(currentGroup);

    // Обновляем details
    students.forEach(s => {
      const status = attendanceDraft[s.id];
      if (status === undefined) return; // не менялось

      if (!allAtt[s.id]) allAtt[s.id] = { total: 234, attended: 0, bySubject: {}, details: {} };
      if (!allAtt[s.id].details) allAtt[s.id].details = {};

      const key = dateKey + '_' + currentTeacher.subject;
      if (status === '') {
        delete allAtt[s.id].details[key];
      } else {
        allAtt[s.id].details[key] = status;
      }
    });

    // Пересчёт bySubject и attended для каждого затронутого студента
    students.forEach(s => {
      if (attendanceDraft[s.id] === undefined) return;
      recalcStudentAttendance(allAtt[s.id], s.id);
    });

    AppData.saveAttendance(allAtt);

    // Обратная связь
    flashSaved('saveAttendance');
    attendanceDraft = {};
    renderAttendance();
  }

  // Пересчитывает attended и bySubject из details
  function recalcStudentAttendance(studentData, studentId) {
    if (!studentData.details) return;

    // Считаем по предметам
    const bySubject = {};
    let totalAttended = 0;

    Object.entries(studentData.details).forEach(([key, status]) => {
      // key = '2026-10-06_Физика'
      const subject = key.split('_').slice(1).join('_');
      if (!bySubject[subject]) bySubject[subject] = { total: 0, attended: 0 };
      if (status === 'present') {
        bySubject[subject].attended++;
        totalAttended++;
      }
    });

    // Обновляем только те предметы, где есть отметки
    // ВАЖНО: total оставляем из демо-данных (234), иначе цифры сломаются
    studentData.attended = totalAttended;
    // bySubject.total оставляем как есть в дефолте — просто обновляем attended
    const defaultSummary = AppData.DEFAULT_ATTENDANCE_SUMMARY[studentId];
    if (defaultSummary) {
      const merged = {};
      Object.entries(defaultSummary.bySubject).forEach(([subj, d]) => {
        merged[subj] = { total: d.total, attended: d.attended };
      });
      Object.entries(bySubject).forEach(([subj, d]) => {
        if (!merged[subj]) merged[subj] = { total: d.total, attended: 0 };
        // attended берём из details
        merged[subj].attended = d.attended;
      });
      studentData.bySubject = merged;
    } else {
      studentData.bySubject = bySubject;
    }
  }

  // ============================================================
  // ОЦЕНКИ
  // ============================================================
  function renderGrades() {
    const container = document.getElementById('gradesStudents');
    const students = AppData.getGroupStudents(currentGroup);

    document.getElementById('gradesSubject').textContent =
      `${currentTeacher.subject} · ${currentGroup} · 2 семестр`;

    if (students.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="inbox"></i>
          <div class="title">Нет студентов</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const allGrades = AppData.getGrades();

    container.innerHTML = students.map(s => {
      // Находим оценку по этому предмету и семестру 2
      const studentGrades = allGrades[s.id] || [];
      const existing = studentGrades.find(g =>
        g.subject === currentTeacher.subject && g.semester === 2
      );
      const savedGrade = existing ? existing.grade : null;
      const draft = gradesDraft[s.id];
      const value = draft !== undefined ? draft : savedGrade;

      const initials = getInitials(s.name);

      return `
        <div class="student-row" data-student="${s.id}">
          <div class="student-avatar">${initials}</div>
          <div class="student-name">${escapeHTML(s.name)}</div>
          <div class="grade-buttons">
            <button class="grade-btn clear ${value === null ? 'active' : ''}" data-grade="null" data-id="${s.id}">—</button>
            <button class="grade-btn grade-2 ${value === 2 ? 'active' : ''}" data-grade="2" data-id="${s.id}">2</button>
            <button class="grade-btn grade-3 ${value === 3 ? 'active' : ''}" data-grade="3" data-id="${s.id}">3</button>
            <button class="grade-btn grade-4 ${value === 4 ? 'active' : ''}" data-grade="4" data-id="${s.id}">4</button>
            <button class="grade-btn grade-5 ${value === 5 ? 'active' : ''}" data-grade="5" data-id="${s.id}">5</button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();

    // Обработчики
    container.querySelectorAll('.grade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const grade = btn.dataset.grade === 'null' ? null : parseInt(btn.dataset.grade, 10);
        gradesDraft[id] = grade;

        const row = btn.closest('.student-row');
        row.querySelectorAll('.grade-btn').forEach(b => {
          const bGrade = b.dataset.grade === 'null' ? null : parseInt(b.dataset.grade, 10);
          b.classList.toggle('active', bGrade === grade);
        });
      });
    });
  }

  function saveGrades() {
    const all = AppData.getGrades();
    const students = AppData.getGroupStudents(currentGroup);

    students.forEach(s => {
      if (gradesDraft[s.id] === undefined) return;

      const grade = gradesDraft[s.id];
      const list = all[s.id] || [];

      // Находим существующую запись по предмету и семестру 2
      const idx = list.findIndex(g =>
        g.subject === currentTeacher.subject && g.semester === 2
      );

      if (grade === null) {
        if (idx !== -1) list.splice(idx, 1);
      } else {
        const record = {
          subject: currentTeacher.subject,
          grade,
          semester: 2,
          exam: false
        };
        if (idx !== -1) list[idx] = record;
        else list.push(record);
      }

      all[s.id] = list;
    });

    AppData.saveGrades(all);

    flashSaved('saveGrades');
    gradesDraft = {};
    renderGrades();
  }

  // ============================================================
  // УТИЛИТЫ
  // ============================================================
  function getInitials(name) {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
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

  function flashSaved(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const originalHTML = btn.innerHTML;
    btn.classList.add('saved');
    btn.innerHTML = '<i data-lucide="check"></i> Сохранено';
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      btn.classList.remove('saved');
      btn.innerHTML = originalHTML;
      if (window.lucide) lucide.createIcons();
    }, 1500);
  }
})();