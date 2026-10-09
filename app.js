/* ============================================================
   АмГУ — Личный кабинет
   Общий JS для всех страниц
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Проверка авторизации
  if (document.querySelector('.login-page')) {
    // это стартовая — ничего не делаем
  } else {
    const user = window.AppData && AppData.getCurrentUser ? AppData.getCurrentUser() : null;
    if (!user) {
      window.location.replace('index.html');
      return;
    }
  }

  applyTheme(localStorage.getItem('theme') || 'light');
  applyEduType(localStorage.getItem('eduType') || 'budget');
  setGreeting();
  renderDate();
  renderMainMetrics();
  renderTodaySchedule();
  renderUrgentDeadlines();
  refreshIcons();
  initSidebar();
  initSidebarActive();
  initThemeToggle();
  initEduType();
  initDropdown();
  initProfileLink();
});

function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function setGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const h = new Date().getHours();
  let phrase;
  if (h >= 5 && h < 12) phrase = 'Доброе утро';
  else if (h >= 12 && h < 18) phrase = 'Добрый день';
  else if (h >= 18 && h < 23) phrase = 'Добрый вечер';
  else phrase = 'Доброй ночи';
  el.textContent = `${phrase}, Артём 👋`;
}

function renderDate() {
  const el = document.querySelector('header .date');
  if (!el) return;
  const now = new Date();
  const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const day = days[now.getDay()];
  const dayCap = day.charAt(0).toUpperCase() + day.slice(1);
  el.textContent = `${dayCap}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · 2 курс, 5106-об`;
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  refreshIcons();
}
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

function applyEduType(type) {
  document.body.setAttribute('data-edu-type', type);
  const metric = document.getElementById('adaptiveMetric');
  if (metric) {
    if (type === 'paid') {
      metric.innerHTML = `
        <div class="label">Оплата обучения</div>
        <div class="value">0 ₽</div>
        <div class="trend">Задолженностей нет</div>
      `;
    } else {
      metric.innerHTML = `
        <div class="label">Стипендия</div>
        <div class="value">✓</div>
        <div class="trend">Начислена</div>
      `;
    }
  }
  document.querySelectorAll('#eduType button').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
}
function initEduType() {
  document.querySelectorAll('#eduType button').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      localStorage.setItem('eduType', type);
      applyEduType(type);
    });
  });
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (!sidebar) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const expand = () => {
    sidebar.classList.add('expanded');
    overlay?.classList.add('active');
  };
  const collapse = () => {
    sidebar.classList.remove('expanded');
    overlay?.classList.remove('active');
  };

  if (canHover) {
    sidebar.addEventListener('mouseenter', expand);
    sidebar.addEventListener('mouseleave', collapse);
  } else {
    sidebar.addEventListener('click', () => {
      if (!sidebar.classList.contains('expanded')) expand();
    });
  }
  overlay?.addEventListener('click', collapse);
}

/* ============================================================
   АКТИВНЫЙ ПУНКТ САЙДБАРА — по URL
   ============================================================ */
function initSidebarActive() {
  const map = {
    'main.html': 'main.html',
    'messages.html': 'messages.html',
    'survey.html': 'survey.html',
    'portfolio.html': 'portfolio.html',
    'schedule.html': 'schedule.html',
    'deadlines.html': 'deadlines.html',
    'grades.html': 'grades.html',
    'attendance.html': 'attendance.html',
    'profile.html': 'profile.html',
    'programs.html': 'programs.html',
    'process.html': 'process.html',
    'record-book.html': 'record-book.html',
    'library.html': 'library.html',
    'cybersport.html': 'cybersport.html',
    'scholarship.html': 'scholarship.html'
  };

  const path = window.location.pathname.split('/').pop() || 'main.html';
  const targetHref = map[path] || null;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  if (!targetHref) return;

  document.querySelectorAll('.nav-item').forEach(item => {
    const href = (item.getAttribute('href') || '').trim();
    if (href === targetHref) {
      item.classList.add('active');
    }
  });
}

function initDropdown() {
  const btn = document.getElementById('avatarBtn');
  const dropdown = document.getElementById('dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove('open');
    }
  });

  // «Выход» → сброс роли + редирект на index.html
  const logout = dropdown.querySelector('.danger');
  if (logout) {
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.AppData) AppData.clearCurrentUser();
      window.location.replace('index.html');
    });
  }
}

/* ============================================================
   ССЫЛКА НА ПРОФИЛЬ В ВЫПАДАШКЕ АВАТАРА
   ============================================================ */
function initProfileLink() {
  const dropdown = document.getElementById('dropdown');
  if (!dropdown) return;

  const user = window.AppData && AppData.getCurrentUser ? AppData.getCurrentUser() : null;
  if (!user) return;

  let target = 'profile.html';
  if (user.role === 'teacher') target = 'teacher.html';
  else if (user.role === 'admin') target = 'admin.html';

  const links = dropdown.querySelectorAll('a');
  links.forEach(link => {
    const text = (link.textContent || '').trim().toLowerCase();
    if (text === 'профиль') {
      link.setAttribute('href', target);
    }
  });
}

/* ============================================================
   РАСПИСАНИЕ НА ГЛАВНОЙ
   ============================================================ */
const SEMESTER_START = new Date(2026, 7, 31);
const DAY_KEYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const DAY_NAMES = {
  monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
  thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
};

const TYPE_COLOR = {
  lecture:  'var(--info)',
  practice: 'var(--success)',
  lab:      'var(--danger)',
  seminar:  'var(--warning)'
};
const TYPE_LABEL = {
  lecture:  'Лекция',
  practice: 'Практика',
  lab:      'Лабораторная',
  seminar:  'Семинар'
};

function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekNumberByDate(date) {
  const monday = getMondayOf(date);
  const startMonday = getMondayOf(SEMESTER_START);
  const diff = Math.floor((monday - startMonday) / (7 * 24 * 60 * 60 * 1000));
  return (diff % 2 === 0) ? 1 : 2;
}

function renderTodaySchedule() {
  const container = document.getElementById('todaySchedule');
  const titleEl = document.getElementById('todayTitle');
  if (!container) return;

  const now = new Date();
  const dayKey = DAY_KEYS[now.getDay()];
  const weekNum = getWeekNumberByDate(now);
  const weekKey = weekNum === 1 ? 'week1' : 'week2';

  if (titleEl) titleEl.textContent = `${DAY_NAMES[dayKey]} · ${weekNum}-я неделя`;

  let data = null;
  if (window.AppData) {
    data = AppData.getSchedule('5106-об');
  }

  const emptyHtml = `<div class="empty" style="padding:20px 0;">
    <i data-lucide="coffee"></i>
    <div>Сегодня пар нет 🎉</div>
  </div>`;

  if (!data || !data[weekKey] || !data[weekKey][dayKey]) {
    container.innerHTML = emptyHtml;
    refreshIcons();
    return;
  }

  const lessons = data[weekKey][dayKey].filter(l => l.name && l.name.trim());
  if (lessons.length === 0) {
    container.innerHTML = emptyHtml;
    refreshIcons();
    return;
  }

  container.innerHTML = lessons.map(l => {
    const parts = (l.time || '').split('–').map(s => s.trim());
    const color = TYPE_COLOR[l.type] || 'var(--text-muted)';
    const typeLabel = TYPE_LABEL[l.type] || '';

    return `
      <div class="lesson">
        <div class="time">${parts[0] || ''}<small>${parts[1] || ''}</small></div>
        <div class="bar" style="background: ${color}"></div>
        <div class="info">
          <div class="name">${escapeHTML(l.name)}</div>
          ${l.teacher ? `<div class="meta">${escapeHTML(l.teacher)}${l.room ? ' · ауд. ' + escapeHTML(l.room) : ''}</div>` : ''}
        </div>
        ${typeLabel ? `<span class="badge ${l.type}">${typeLabel}</span>` : ''}
      </div>
    `;
  }).join('');

  refreshIcons();
}

/* ============================================================
   СРОЧНЫЕ ДЕДЛАЙНЫ НА ГЛАВНОЙ (максимум 3)
   ============================================================ */
function renderUrgentDeadlines() {
  const container = document.getElementById('urgentDeadlinesList');
  const counter = document.getElementById('deadlinesCount');
  if (!container) return;

  let list = [];
  try { list = JSON.parse(localStorage.getItem('deadlines')) || []; } catch { list = []; }

  const getDaysLeft = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(dateStr + 'T00:00:00') - today) / (1000 * 60 * 60 * 24));
  };

  const urgent = list
    .filter(d => getDaysLeft(d.date) <= 14)
    .sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date))
    .slice(0, 3);

  if (counter) counter.textContent = urgent.length;

  if (urgent.length === 0) {
    container.innerHTML = `<div class="empty" style="padding:20px 0;">
      <i data-lucide="party-popper"></i>
      <div>Срочных дедлайнов нет</div>
    </div>`;
    refreshIcons();
    return;
  }

  container.innerHTML = urgent.map(d => {
    const dl = getDaysLeft(d.date);
    let dotClass = 'ok';
    let dateText = '';
    if (dl < 0) { dotClass = 'danger'; dateText = `Просрочено на ${Math.abs(dl)} дн.`; }
    else if (dl === 0) { dotClass = 'danger'; dateText = 'Сегодня'; }
    else if (dl <= 2) { dotClass = 'danger'; dateText = `Через ${dl} дн.`; }
    else if (dl <= 5) { dotClass = 'warn'; dateText = `Через ${dl} дн.`; }
    else { dotClass = 'ok'; dateText = `Через ${dl} дн.`; }

    return `
      <div class="deadline">
        <div class="dot ${dotClass}"></div>
        <div>
          <div class="title">${escapeHTML(d.task)}</div>
          <div class="sub">${escapeHTML(d.subject)}</div>
          <div class="date">${dateText}</div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

/* ============================================================
   МЕТРИКИ НА ГЛАВНОЙ
   ============================================================ */
function renderMainMetrics() {
  if (!window.AppData) return;

  // ---- Успеваемость ----
  const avgEl = document.getElementById('metricAvg');
  const avgTrendEl = document.getElementById('metricAvgTrend');
  if (avgEl) {
    const grades = AppData.getGrades();
    const studentGrades = (grades && grades.bekker) || AppData.DEFAULT_PAST_GRADES.bekker || [];
    if (studentGrades.length) {
      const avg = studentGrades.reduce((s, g) => s + g.grade, 0) / studentGrades.length;
      avgEl.textContent = avg.toFixed(2);
      if (avgTrendEl) avgTrendEl.textContent = 'За прошлую сессию';
    } else {
      avgEl.textContent = '—';
    }
  }

  // ---- Посещаемость ----
  const attEl = document.getElementById('metricAttendance');
  const attBar = document.getElementById('metricAttendanceBar');
  if (attEl) {
    const real = AppData.getAttendance();
    const summary = (real && real.bekker && real.bekker.total)
      ? real.bekker
      : (AppData.DEFAULT_ATTENDANCE_SUMMARY && AppData.DEFAULT_ATTENDANCE_SUMMARY.bekker);

    if (summary && summary.total) {
      const percent = Math.round((summary.attended / summary.total) * 100);
      attEl.innerHTML = `${percent}<span>%</span>`;
      if (attBar) attBar.style.width = percent + '%';
    }
  }
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}