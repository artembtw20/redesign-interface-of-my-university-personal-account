/* ============================================================
   СООБЩЕНИЯ — логика страницы messages.html
   ============================================================ */

(function () {
  const STUDENT_ID = 'bekker';
  const GROUP_ID = '5106-об';
  const PREFIX = 'app:';

  // Преподаватели (из расписания)
  const TEACHERS = [
    { id: 't-golubeva',        name: 'Голубева Ирина Александровна' },
    { id: 't-samarin',         name: 'Самарин Александр Дмитриевич' },
    { id: 't-khvorostyanoy',   name: 'Хворостяной Артём Александрович' },
    { id: 't-musaeva',         name: 'Мусаева Елена Георгиевна' },
    { id: 't-slyusareva',      name: 'Слюсарева Елена Александровна' },
    { id: 't-pleshivtsev',     name: 'Плешивцев Андрей Валентинович' },
    { id: 't-rybakova',        name: 'Рыбакова Лина Васильевна' },
    { id: 't-cherepkova',      name: 'Черепкова Олеся Олеговна' },
    { id: 't-vasilyeva',       name: 'Васильева Елена Владимировна' },
    { id: 't-nikitina',        name: 'Никитина Ирина Владимировна' },
    { id: 't-morozov',         name: 'Морозов Юрий Геннадьевич' },
    { id: 't-samokhvalova',    name: 'Самохвалова Светлана Геннадьевна' }
  ];

  let currentChatId = null;

  // ============================================================
  // ХРАНИЛИЩЕ
  // ============================================================
  function getChats() {
    try {
      const raw = localStorage.getItem(PREFIX + 'chats');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed[STUDENT_ID] || [];
      }
    } catch { }
    return [];
  }

  function saveChats(list) {
    let all = {};
    try { all = JSON.parse(localStorage.getItem(PREFIX + 'chats')) || {}; } catch { }
    all[STUDENT_ID] = list;
    localStorage.setItem(PREFIX + 'chats', JSON.stringify(all));
  }

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
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
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

  function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  // ============================================================
  // ПОЛУЧЕНИЕ СПИСКОВ ЛЮДЕЙ
  // ============================================================
  function getClassmates() {
    const groups = AppData.getGroups();
    const list = groups[GROUP_ID] || [];
    return list.filter(s => s.id !== STUDENT_ID);
  }

  // ============================================================
  // ЭКРАНЫ
  // ============================================================
  function showScreen(name) {
    document.getElementById('view-list').classList.toggle('hidden', name !== 'list');
    document.getElementById('view-new').classList.toggle('hidden', name !== 'new');
    document.getElementById('view-chat').classList.toggle('hidden', name !== 'chat');
    if (window.lucide) lucide.createIcons();
  }

  // ============================================================
  // РЕНДЕР СПИСКА ЧАТОВ
  // ============================================================
  function renderChats() {
    const container = document.getElementById('chatsList');
    const list = getChats();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="message-circle"></i>
          <div class="title">Пока нет чатов</div>
          <div class="desc">Нажмите «Новая комната», чтобы начать общение</div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Сортировка по последнему сообщению
    list.sort((a, b) => {
      const la = a.messages[a.messages.length - 1]?.time || a.createdAt || '';
      const lb = b.messages[b.messages.length - 1]?.time || b.createdAt || '';
      return (lb || '').localeCompare(la || '');
    });

    container.innerHTML = list.map(chat => {
      const last = chat.messages[chat.messages.length - 1];
      const lastText = last ? last.text : 'Нет сообщений';
      const lastTime = last ? formatTime(last.time) : '';

      return `
        <div class="chat-card" data-id="${chat.id}">
          <div class="chat-avatar" style="background: ${colorFromName(chat.title)}">
            ${getInitials(chat.title)}
          </div>
          <div class="chat-info">
            <div class="chat-name">${escapeHTML(chat.title)}</div>
            <div class="chat-last">${escapeHTML(lastText)}</div>
          </div>
          <div class="chat-time">${lastTime}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.chat-card').forEach(card => {
      card.addEventListener('click', () => openChat(parseInt(card.dataset.id, 10)));
    });
  }

  // ============================================================
  // ЭКРАН СОЗДАНИЯ ЧАТА
  // ============================================================
  function renderPeople() {
    // Одногруппники
    const classmates = getClassmates();
    const cContainer = document.getElementById('classmatesList');
    document.getElementById('groupCount').textContent = classmates.length;

    cContainer.innerHTML = classmates.map(s => `
      <div class="person-item" data-id="${s.id}" data-name="${escapeHTML(s.name)}">
        <div class="person-avatar" style="background: ${colorFromName(s.name)}">
          ${getInitials(s.name)}
        </div>
        <div class="person-name">${escapeHTML(s.name)}</div>
        <i data-lucide="message-circle" class="person-chat-icon"></i>
      </div>
    `).join('');

    // Преподаватели
    const tContainer = document.getElementById('teachersList');
    tContainer.innerHTML = TEACHERS.map(t => `
      <div class="person-item" data-id="${t.id}" data-name="${escapeHTML(t.name)}">
        <div class="person-avatar" style="background: ${colorFromName(t.name)}">
          ${getInitials(t.name)}
        </div>
        <div class="person-name">${escapeHTML(t.name)}</div>
        <i data-lucide="message-circle" class="person-chat-icon"></i>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    // Обработчики
    document.querySelectorAll('.person-item').forEach(item => {
      item.addEventListener('click', () => {
        createPersonalChat(item.dataset.id, item.dataset.name);
      });
    });
  }

  // ============================================================
  // СОЗДАНИЕ ЧАТА
  // ============================================================
  function createPersonalChat(participantId, participantName) {
    const list = getChats();

    // Проверяем — есть ли уже чат с этим человеком
    const existing = list.find(c => c.participantId === participantId);
    if (existing) {
      openChat(existing.id);
      return;
    }

    const chat = {
      id: Date.now(),
      title: participantName,
      participantId,
      participants: [STUDENT_ID, participantId],
      messages: [
        {
          id: Date.now() + 1,
          from: 'system',
          text: `Это начало вашего чата с ${participantName}`,
          time: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    list.push(chat);
    saveChats(list);
    openChat(chat.id);
    addNotification('Чат создан', `Открыт чат с ${participantName}`);
  }

  // ============================================================
  // ОТКРЫТИЕ ЧАТА
  // ============================================================
  function openChat(chatId) {
    currentChatId = chatId;
    const list = getChats();
    const chat = list.find(c => c.id === chatId);
    if (!chat) return;

    document.getElementById('chatTitle').textContent = chat.title;
    renderChatBody(chat);
    showScreen('chat');
    setTimeout(() => {
      const body = document.getElementById('chatBody');
      body.scrollTop = body.scrollHeight;
      document.getElementById('chatInput').focus();
    }, 100);
  }

  function renderChatBody(chat) {
    const container = document.getElementById('chatBody');

    if (!chat.messages || chat.messages.length === 0) {
      container.innerHTML = `<div class="message-system">Нет сообщений</div>`;
      return;
    }

    container.innerHTML = chat.messages.map(m => {
      if (m.from === 'system') {
        return `<div class="message-system">${escapeHTML(m.text)}</div>`;
      }
      const isOutgoing = m.from === STUDENT_ID;
      return `
        <div class="message ${isOutgoing ? 'outgoing' : 'incoming'}">
          <div>
            <div class="message-bubble">${escapeHTML(m.text)}</div>
            <div class="message-time">${formatTime(m.time)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================================================
  // ОТПРАВКА СООБЩЕНИЯ
  // ============================================================
  function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || !currentChatId) return;

    const list = getChats();
    const chat = list.find(c => c.id === currentChatId);
    if (!chat) return;

    chat.messages.push({
      id: Date.now(),
      from: STUDENT_ID,
      text,
      time: new Date().toISOString()
    });

    saveChats(list);
    input.value = '';
    renderChatBody(chat);

    setTimeout(() => {
      const body = document.getElementById('chatBody');
      body.scrollTop = body.scrollHeight;
    }, 50);
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

    renderChats();
    renderPeople();
    initNotifications();

    // Кнопка "Новая комната"
    document.getElementById('btnNewChat').addEventListener('click', () => {
      showScreen('new');
    });

    // Кнопка "Электронная почта" — заглушка
    document.getElementById('btnEmail').addEventListener('click', () => {
      addNotification('Электронная почта', 'Раздел находится в разработке');
    });

    // Кнопка "Назад" из формы создания
    document.getElementById('btnBack').addEventListener('click', () => {
      showScreen('list');
      renderChats();
    });

    // Кнопка "Назад" из чата
    document.getElementById('btnChatBack').addEventListener('click', () => {
      currentChatId = null;
      showScreen('list');
      renderChats();
    });

    // Отправка сообщения
    document.getElementById('btnSend').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  });
})();