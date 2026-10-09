/* ============================================================
   ПОСЕЩАЕМОСТЬ — логика страницы
   Логика:
   - Всего пар за семестр = 234 (фикс из data.js)
   - Прошло пар — считаем по расписанию от 31 августа до сегодня
   - Посещено = 55 (фикс из data.js)
   - Пропущено = прошло − 55
   - Впереди = 234 − прошло
   - Процент в круге = 55 / 234
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';
  const GROUP_ID = '5106-об';
  const SEMESTER_START = new Date(2026, 7, 31); // 31 августа 2026, понедельник

  const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday'];
  const TOTAL_WEEKS = 18;

  // ============================================================
  // ДАННЫЕ
  // ============================================================
  function getSummary() {
    const real = AppData.getAttendance();
    if (real && real[STUDENT_ID] && real[STUDENT_ID].total) {
      return real[STUDENT_ID];
    }
    return (AppData.DEFAULT_ATTENDANCE_SUMMARY && AppData.DEFAULT_ATTENDANCE_SUMMARY[STUDENT_ID]) || {
      total: 0, attended: 0, bySubject: {}
    };
  }

  // ============================================================
  // ПОДСЧЁТ ПРОШЕДШИХ ПАР
  // ============================================================
  function getSchedule() {
    return AppData.getSchedule(GROUP_ID);
  }

  // Считает сколько всего пар было с 31 августа по сегодня (включительно)
  function countElapsedAll(schedule) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let count = 0;
    for (let week = 0; week < TOTAL_WEEKS; week++) {
      const monday = new Date(SEMESTER_START);
      monday.setDate(monday.getDate() + week * 7);
      const weekKey = (week % 2 === 0) ? 'week1' : 'week2';
      const weekData = schedule[weekKey];

      for (let d = 0; d < 6; d++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + d);
        if (date > today) continue;

        const lessons = weekData[DAY_KEYS[d]] || [];
        lessons.forEach(l => {
          if (l.name && l.name.trim()) count++;
        });
      }
    }
    return count;
  }

  // Считает сколько было пар по конкретному предмету
  function countElapsedForSubject(schedule, subjectName) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let count = 0;
    for (let week = 0; week < TOTAL_WEEKS; week++) {
      const monday = new Date(SEMESTER_START);
      monday.setDate(monday.getDate() + week * 7);
      const weekKey = (week % 2 === 0) ? 'week1' : 'week2';
      const weekData = schedule[weekKey];

      for (let d = 0; d < 6; d++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + d);
        if (date > today) continue;

        const lessons = weekData[DAY_KEYS[d]] || [];
        lessons.forEach(l => {
          if (l.name === subjectName) count++;
        });
      }
    }
    return count;
  }

  // Список прошедших дат по предмету
  function getPastDatesForSubject(schedule, subjectName) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dates = [];
    for (let week = 0; week < TOTAL_WEEKS; week++) {
      const monday = new Date(SEMESTER_START);
      monday.setDate(monday.getDate() + week * 7);
      const weekKey = (week % 2 === 0) ? 'week1' : 'week2';
      const weekData = schedule[weekKey];

      for (let d = 0; d < 6; d++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + d);
        if (date > today) continue;

        const lessons = weekData[DAY_KEYS[d]] || [];
        lessons.forEach(l => {
          if (l.name === subjectName) {
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

  // ============================================================
  // УТИЛИТЫ
  // ============================================================
  const MONTHS_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];

  function formatDate(d) {
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  }

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
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
  function renderCircle(percent) {
    const R = 84;
    const C = 2 * Math.PI * R;
    const circle = document.getElementById('attCircleFg');
    circle.style.strokeDasharray = C.toFixed(2);
    circle.style.strokeDashoffset = (C * (1 - percent / 100)).toFixed(2);
    document.getElementById('attPercent').textContent = `${percent}%`;
  }

  function renderStats(summary) {
    const schedule = getSchedule();
    const elapsed = countElapsedAll(schedule);

    // Процент посещаемости от ВСЕХ пар за семестр
    const percentFromAll = summary.total > 0
      ? Math.round((summary.attended / summary.total) * 100)
      : 0;

    const missed = Math.max(0, elapsed - summary.attended);
    const ahead = Math.max(0, summary.total - elapsed);

    document.getElementById('statTotal').textContent = summary.total;
    document.getElementById('statElapsed').textContent = elapsed;
    document.getElementById('statPresent').textContent = summary.attended;
    document.getElementById('statAbsent').textContent = missed;
    document.getElementById('statAhead').textContent = ahead;

    document.getElementById('attFraction').textContent =
      `${summary.attended} / ${summary.total} ${plural(summary.total, 'пара', 'пары', 'пар')}`;

    renderCircle(percentFromAll);
  }

  function renderSubjects(summary) {
    const container = document.getElementById('attList');
    const schedule = getSchedule();
    const entries = Object.entries(summary.bySubject || {});

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="inbox"></i>
          <div class="title">Данных нет</div>
          <div class="desc">Преподаватели ещё не отметили посещаемость</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Сортировка: по проценту посещаемости от прошедших (лучшие сверху)
    entries.sort((a, b) => {
      const elapsedA = countElapsedForSubject(schedule, a[0]) || 1;
      const elapsedB = countElapsedForSubject(schedule, b[0]) || 1;
      const pA = a[1].attended / elapsedA;
      const pB = b[1].attended / elapsedB;
      return pB - pA;
    });

    container.innerHTML = entries.map(([subject, data], idx) => {
      const total = data.total || 0;
      const attended = data.attended || 0;
      const elapsed = countElapsedForSubject(schedule, subject);
      const percentOfElapsed = elapsed > 0 ? Math.round((attended / elapsed) * 100) : 0;

      // Список дат
      const dates = getPastDatesForSubject(schedule, subject);
      const missedTotal = Math.max(0, dates.length - attended);

      // Раскидываем пропуски детерминированно (не подряд)
      const absentIndexes = new Set();
      if (missedTotal > 0 && dates.length > 0) {
        const step = dates.length / (missedTotal + 1);
        for (let i = 1; i <= missedTotal; i++) {
          absentIndexes.add(Math.floor(i * step) - 1);
        }
      }

      const datesHTML = dates.map((d, i) => {
        const isAbsent = absentIndexes.has(i);
        const status = isAbsent ? 'absent' : 'present';
        const label = isAbsent ? 'Не был' : 'Был';
        return `
          <div class="date-row">
            <span class="date">${formatDate(d.date)}</span>
            <span class="time">${d.time}</span>
            <span class="status status-${status}">${label}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="subject-card" data-idx="${idx}">
          <div class="subject-head" onclick="toggleSubject(${idx})">
            <div class="subject-name">${escapeHTML(subject)}</div>
            <div class="subject-progress">
              <span class="num">${attended} из ${elapsed || total}</span>
              <div class="subject-bar"><div style="width: ${percentOfElapsed}%"></div></div>
              <span class="subject-percent">${percentOfElapsed}%</span>
            </div>
            <i data-lucide="chevron-down" class="subject-chevron"></i>
          </div>
          <div class="subject-body">
            <div class="subject-dates">${datesHTML}</div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  window.toggleSubject = function (idx) {
    const card = document.querySelector(`.subject-card[data-idx="${idx}"]`);
    if (!card) return;
    card.classList.toggle('open');

    const body = card.querySelector('.subject-body');
    if (card.classList.contains('open')) {
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = '0';
    }
  };

  // ============================================================
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const summary = getSummary();
    renderStats(summary);
    renderSubjects(summary);
  });
})();