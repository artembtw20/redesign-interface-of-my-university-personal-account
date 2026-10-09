/* ============================================================
   УСПЕВАЕМОСТЬ — логика страницы
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';

  // ============================================================
  // ДАННЫЕ
  // ============================================================
  function getStudentGrades() {
    // Сначала — реальные оценки из localStorage (если препод выставил)
    const all = AppData.getGrades();
    if (all && all[STUDENT_ID] && all[STUDENT_ID].length) {
      return all[STUDENT_ID];
    }
    // Fallback — демо-оценки за прошлую сессию из data.js
    return (AppData.DEFAULT_PAST_GRADES && AppData.DEFAULT_PAST_GRADES[STUDENT_ID]) || [];
  }

  // ============================================================
  // УТИЛИТЫ
  // ============================================================
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
  function renderStats(list) {
    const count = list.length;
    const avg = count ? (list.reduce((s, g) => s + g.grade, 0) / count) : 0;

    document.getElementById('statCount').textContent = count;
    document.getElementById('statAvg').textContent = count
      ? avg.toFixed(2)
      : '—';
  }

  function renderSemesters(allGrades) {
    const select = document.getElementById('semesterSelect');
    const semesters = [...new Set(allGrades.map(g => g.semester))].sort((a, b) => a - b);

    // Очищаем старые опции (кроме "Все семестры")
    select.innerHTML = '<option value="all">Все семестры</option>';

    semesters.forEach(sem => {
      const opt = document.createElement('option');
      opt.value = String(sem);
      opt.textContent = `${sem} семестр`;
      select.appendChild(opt);
    });
  }

  function renderList(list) {
    const container = document.getElementById('gradesList');

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="inbox"></i>
          <div class="title">Оценок нет</div>
          <div class="desc">За этот семестр пока нет оценок за экзамены</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Сортировка: сначала по семестру (убывание), потом по названию
    list.sort((a, b) => {
      if (a.semester !== b.semester) return b.semester - a.semester;
      return a.subject.localeCompare(b.subject, 'ru');
    });

    container.innerHTML = list.map(g => {
      const gradeNum = Math.min(5, Math.max(2, g.grade || 0));
      const gradeClass = `grade-${gradeNum}`;
      const examBadge = g.exam
        ? '<span class="badge lecture" style="font-size:10px;padding:2px 8px;margin-left:6px;">Экзамен</span>'
        : '';

      return `
        <div class="grade-card ${gradeClass}">
          <div class="grade-body">
            <div class="grade-subject">${escapeHTML(g.subject)}${examBadge}</div>
            <div class="grade-meta">
              <span><i data-lucide="calendar"></i>${g.semester} семестр</span>
            </div>
          </div>
          <div class="grade-value">${g.grade}</div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  }

  function render() {
    const all = getStudentGrades();
    const selected = document.getElementById('semesterSelect').value || 'all';
    const filtered = selected === 'all'
      ? all
      : all.filter(g => String(g.semester) === selected);

    renderStats(filtered);
    renderList(filtered);
  }

  // ============================================================
  // СТАРТ
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    const all = getStudentGrades();
    renderSemesters(all);
    render();

    document.getElementById('semesterSelect').addEventListener('change', render);
  });
})();