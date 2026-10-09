/* ============================================================
   АмГУ — Личный кабинет
   Общий модуль данных
   ============================================================ */

(function () {
  const PREFIX = 'app:';

  /* ============================================================
     ГРУППЫ И СТУДЕНТЫ
     ============================================================ */
  const GROUPS = {
    '5106-об': [
      { id: 's01', name: 'Арчаков Арсений Михайлович' },
      { id: 'bekker', name: 'Беккер Артём Станиславович' },
      { id: 's03', name: 'Быстрова Каролина Дмитриевна' },
      { id: 's04', name: 'Волочаев Константин Сергеевич' },
      { id: 's05', name: 'Гамаюнов Владислав Дмитриевич' },
      { id: 's06', name: 'Гордымова Суламита Александровна' },
      { id: 's07', name: 'Гречкин Тимофей Олегович' },
      { id: 's08', name: 'Дудин Роман Алексеевич' },
      { id: 's09', name: 'Дьяков Дмитрий Сергеевич' },
      { id: 's10', name: 'Ильин Алексей Андреевич' },
      { id: 's11', name: 'Ковалёв Ярослав Евгеньевич' },
      { id: 's12', name: 'Кожанов Тимофей Андреевич' },
      { id: 's13', name: 'Кумачёв Тимофей Павлович' },
      { id: 's14', name: 'Максимов Павел Андреевич' },
      { id: 's15', name: 'Матросова Ирина Владимировна' },
      { id: 's16', name: 'Мельников Илья Александрович' },
      { id: 's17', name: 'Мифтахов Руслан Игоревич' },
      { id: 's18', name: 'Науменко Мария Александровна' },
      { id: 's19', name: 'Сергеев Тимофей Алексеевич' },
      { id: 's20', name: 'Сорокина Анастасия Игоревна' },
      { id: 's21', name: 'Хамитов Илья Александрович' },
      { id: 's22', name: 'Хоменко Данила Антонович' },
      { id: 's23', name: 'Яйчук Максим Леонидович' }
    ],
    '5107-об': [
      { id: 's31', name: 'Абрамов Никита Сергеевич' },
      { id: 's32', name: 'Белова Екатерина Дмитриевна' },
      { id: 's33', name: 'Власов Артём Игоревич' },
      { id: 's34', name: 'Гаврилова Полина Андреевна' },
      { id: 's35', name: 'Данилов Егор Александрович' },
      { id: 's36', name: 'Ефимова Алина Витальевна' },
      { id: 's37', name: 'Жуков Максим Олегович' },
      { id: 's38', name: 'Зайцева Дарья Романовна' },
      { id: 's39', name: 'Иванов Кирилл Павлович' },
      { id: 's40', name: 'Ковалёва София Ильинична' },
      { id: 's41', name: 'Лебедев Дмитрий Алексеевич' },
      { id: 's42', name: 'Морозова Полина Сергеевна' },
      { id: 's43', name: 'Никитин Артём Владимирович' },
      { id: 's44', name: 'Орлова Ангелина Дмитриевна' },
      { id: 's45', name: 'Павлов Матвей Игоревич' },
      { id: 's46', name: 'Романова Ева Андреевна' },
      { id: 's47', name: 'Смирнов Илья Олегович' },
      { id: 's48', name: 'Тихонова Алиса Павловна' },
      { id: 's49', name: 'Фёдоров Никита Сергеевич' },
      { id: 's50', name: 'Царёва Мария Дмитриевна' }
    ],
    '5108-об': [
      { id: 's61', name: 'Андреев Владислав Игоревич' },
      { id: 's62', name: 'Борисова Яна Алексеевна' },
      { id: 's63', name: 'Воронов Кирилл Дмитриевич' },
      { id: 's64', name: 'Громова Елизавета Сергеевна' },
      { id: 's65', name: 'Дмитриев Артём Олегович' },
      { id: 's66', name: 'Егорова Виктория Андреевна' },
      { id: 's67', name: 'Жданов Максим Игоревич' },
      { id: 's68', name: 'Зимина Ксения Дмитриевна' },
      { id: 's69', name: 'Игнатов Никита Павлович' },
      { id: 's70', name: 'Королёва Анастасия Ильинична' },
      { id: 's71', name: 'Логинов Егор Сергеевич' },
      { id: 's72', name: 'Максимова Дарья Олеговна' },
      { id: 's73', name: 'Новиков Роман Андреевич' },
      { id: 's74', name: 'Осипова Полина Дмитриевна' },
      { id: 's75', name: 'Петров Даниил Игоревич' },
      { id: 's76', name: 'Родионова Ева Сергеевна' },
      { id: 's77', name: 'Соколов Артём Павлович' },
      { id: 's78', name: 'Трофимова Алина Игоревна' },
      { id: 's79', name: 'Ульянов Максим Дмитриевич' },
      { id: 's80', name: 'Фомина Екатерина Алексеевна' }
    ]
  };

  /* ============================================================
     ПРЕПОДАВАТЕЛИ
     ============================================================ */
  const TEACHERS = {
    golubeva: { id: 'golubeva', name: 'Голубева И.А.', subject: 'Физика', groups: ['5106-об', '5107-об'] },
    samarin: { id: 'samarin', name: 'Самарин А.Д.', subject: 'Технологии и методы программирования', groups: ['5106-об', '5108-об'] },
    khvorostyanoy: { id: 'khvorostyanoy', name: 'Хворостяной А.А.', subject: 'Философия', groups: ['5106-об', '5107-об', '5108-об'] }
  };

  /* ============================================================
     РАСПИСАНИЕ (3 группы)
     ============================================================ */
  const EMPTY = (time) => ({ time, name: '', teacher: '', type: '', room: '' });

  const SCHEDULE_5106 = {
    week1: {
      monday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Васильева Е.В.', type: 'practice', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Физика', teacher: 'Голубева И.А.', type: 'practice', room: '407 (1)' },
        { time: '11:35 – 13:05', name: 'Физика', teacher: 'Голубева И.А.', type: 'lecture', room: '407 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      wednesday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'practice', room: '518 (1)' },
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Иностранный язык', teacher: 'Мусаева Е.Г.', type: 'practice', room: '224 (5)' },
        { time: '11:35 – 13:05', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'practice', room: '323 (1)' },
        { time: '14:00 – 15:30', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'lecture', room: '4 (1)' },
        EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      friday: [
        { time: '08:15 – 09:45', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'lecture', room: '323 (1)' },
        { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'practice', room: '331 (1)' },
        EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    },
    week2: {
      monday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'lecture', room: '311 (5)' },
        { time: '11:35 – 13:05', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'lab', room: '334 (1)' },
        { time: '14:00 – 15:30', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'lecture', room: '1 (1)' },
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Никитина И.В.', type: 'lecture', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Физика', teacher: 'Голубева И.А.', type: 'lab', room: '416 (1)' },
        { time: '11:35 – 13:05', name: 'Физика', teacher: 'Голубева И.А.', type: 'lecture', room: '407 (1)' },
        EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'practice', room: '311 (5)' },
        EMPTY('17:20 – 18:50')],
      wednesday: [
        { time: '08:15 – 09:45', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'lecture', room: '4 (1)' },
        EMPTY('09:55 – 11:25'),
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [
        { time: '08:15 – 09:45', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'practice', room: '303 (5)' },
        { time: '09:55 – 11:25', name: 'Иностранный язык', teacher: 'Мусаева Е.Г.', type: 'practice', room: '224 (5)' },
        { time: '11:35 – 13:05', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'practice', room: '310 (8)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      friday: [
        { time: '08:15 – 09:45', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'practice', room: '323 (1)' },
        { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lab', room: '333 (1)' },
        EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    }
  };

  const SCHEDULE_5107 = {
    week1: {
      monday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Васильева Е.В.', type: 'practice', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      wednesday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Физика', teacher: 'Голубева И.А.', type: 'practice', room: '408 (1)' },
        { time: '11:35 – 13:05', name: 'Физика', teacher: 'Голубева И.А.', type: 'lecture', room: '408 (1)' },
        { time: '14:00 – 15:30', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'),
        { time: '11:35 – 13:05', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'practice', room: '518 (1)' },
        { time: '14:00 – 15:30', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'lecture', room: '4 (1)' },
        EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      friday: [
        { time: '08:15 – 09:45', name: 'Иностранный язык', teacher: 'Мусаева Е.Г.', type: 'practice', room: '225 (5)' },
        { time: '09:55 – 11:25', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'practice', room: '324 (1)' },
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'practice', room: '332 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    },
    week2: {
      monday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'lecture', room: '311 (5)' },
        EMPTY('11:35 – 13:05'),
        { time: '14:00 – 15:30', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'lecture', room: '1 (1)' },
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Никитина И.В.', type: 'lecture', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'practice', room: '312 (5)' },
        EMPTY('17:20 – 18:50')],
      wednesday: [
        { time: '08:15 – 09:45', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'lecture', room: '4 (1)' },
        { time: '09:55 – 11:25', name: 'Физика', teacher: 'Голубева И.А.', type: 'lab', room: '416 (1)' },
        { time: '11:35 – 13:05', name: 'Физика', teacher: 'Голубева И.А.', type: 'lecture', room: '408 (1)' },
        { time: '14:00 – 15:30', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [
        { time: '08:15 – 09:45', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'practice', room: '303 (5)' },
        EMPTY('09:55 – 11:25'),
        { time: '11:35 – 13:05', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'practice', room: '310 (8)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      friday: [
        { time: '08:15 – 09:45', name: 'Иностранный язык', teacher: 'Мусаева Е.Г.', type: 'practice', room: '225 (5)' },
        { time: '09:55 – 11:25', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'practice', room: '324 (1)' },
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lab', room: '333 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    }
  };

  const SCHEDULE_5108 = {
    week1: {
      monday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Васильева Е.В.', type: 'practice', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      wednesday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'practice', room: '519 (1)' },
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'lecture', room: '325 (1)' },
        { time: '11:35 – 13:05', name: 'Иностранный язык', teacher: 'Мусаева Е.Г.', type: 'practice', room: '226 (5)' },
        { time: '14:00 – 15:30', name: 'Конфликтология', teacher: 'Слюсарева Е.А.', type: 'lecture', room: '4 (1)' },
        EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      friday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'practice', room: '333 (1)' },
        { time: '11:35 – 13:05', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'practice', room: '325 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    },
    week2: {
      monday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'lecture', room: '311 (5)' },
        EMPTY('11:35 – 13:05'),
        { time: '14:00 – 15:30', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'lecture', room: '1 (1)' },
        { time: '15:40 – 17:10', name: 'Гуманитарные аспекты информационной безопасности', teacher: 'Никитина И.В.', type: 'lecture', room: '304 (7)' },
        EMPTY('17:20 – 18:50')],
      tuesday: [EMPTY('08:15 – 09:45'), EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'practice', room: '313 (5)' },
        EMPTY('17:20 – 18:50')],
      wednesday: [
        { time: '08:15 – 09:45', name: 'Основы экономических знаний', teacher: 'Плешивцев А.В.', type: 'lecture', room: '4 (1)' },
        EMPTY('09:55 – 11:25'),
        { time: '11:35 – 13:05', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lecture', room: '331 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'),
        { time: '17:20 – 18:50', name: 'Общая физическая подготовка', teacher: 'Корчевский А.М.', type: 'practice', room: 'Спортзал 1' }],
      thursday: [
        { time: '08:15 – 09:45', name: 'Функциональный процесс и организация предприятия', teacher: 'Мясоедов С.А.', type: 'practice', room: '303 (5)' },
        EMPTY('09:55 – 11:25'),
        { time: '11:35 – 13:05', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'lab', room: '335 (1)' },
        EMPTY('14:00 – 15:30'),
        { time: '15:40 – 17:10', name: 'Правовые основы антикоррупционного поведения', teacher: 'Морозов Ю.Г.', type: 'practice', room: '311 (8)' },
        EMPTY('17:20 – 18:50')],
      friday: [EMPTY('08:15 – 09:45'),
        { time: '09:55 – 11:25', name: 'Теория принятия решений', teacher: 'Самохвалова С.Г.', type: 'lab', room: '333 (1)' },
        { time: '11:35 – 13:05', name: 'Технологии и методы программирования', teacher: 'Самарин А.Д.', type: 'practice', room: '325 (1)' },
        EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')],
      saturday: [
        { time: '08:15 – 09:45', name: 'Философия', teacher: 'Хворостяной А.А.', type: 'lecture', room: 'Онлайн' },
        EMPTY('09:55 – 11:25'), EMPTY('11:35 – 13:05'), EMPTY('14:00 – 15:30'), EMPTY('15:40 – 17:10'), EMPTY('17:20 – 18:50')]
    }
  };

  const DEFAULT_SCHEDULES = {
    '5106-об': SCHEDULE_5106,
    '5107-об': SCHEDULE_5107,
    '5108-об': SCHEDULE_5108
  };

  /* ============================================================
     ОЦЕНКИ за прошлую сессию
     ============================================================ */
  const DEFAULT_PAST_GRADES = {
    bekker: [
      { subject: 'Философия', grade: 5, semester: 1, exam: true },
      { subject: 'Физика', grade: 4, semester: 1, exam: true },
      { subject: 'Технологии и методы программирования', grade: 5, semester: 1, exam: true },
      { subject: 'История', grade: 4, semester: 1, exam: true },
      { subject: 'Математический анализ', grade: 4, semester: 1, exam: true },
      { subject: 'Иностранный язык', grade: 4, semester: 1, exam: true }
    ]
  };

  /* ============================================================
     ДЕМО-ПОСЕЩАЕМОСТЬ
     Всего 234 · посещено 55 · сумма bySubject.total = 234, bySubject.attended = 55
     ============================================================ */
  const DEFAULT_ATTENDANCE_SUMMARY = {
    bekker: {
      total: 234,
      attended: 55,
      bySubject: {
        'Физика':                                            { total: 34, attended: 10 },
        'Технологии и методы программирования':              { total: 26, attended: 7 },
        'Философия':                                         { total: 26, attended: 7 },
        'Иностранный язык':                                  { total: 18, attended: 5 },
        'Конфликтология':                                    { total: 18, attended: 4 },
        'Теория принятия решений':                           { total: 26, attended: 5 },
        'Основы экономических знаний':                       { total: 16, attended: 4 },
        'Функциональный процесс и организация предприятия':  { total: 16, attended: 3 },
        'Правовые основы антикоррупционного поведения':      { total: 16, attended: 4 },
        'Гуманитарные аспекты информационной безопасности':  { total: 16, attended: 3 },
        'Общая физическая подготовка':                       { total: 22, attended: 3 }
      }
    }
  };

  /* ============================================================
     API
     ============================================================ */
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function write(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  function getSchedule(groupId) {
    const all = read('schedules', null);
    if (all && all[groupId]) return all[groupId];
    return JSON.parse(JSON.stringify(DEFAULT_SCHEDULES[groupId] || DEFAULT_SCHEDULES['5106-об']));
  }
  function saveSchedule(groupId, data) {
    const all = read('schedules', {}) || {};
    all[groupId] = data;
    write('schedules', all);
  }

  function getGrades() { return read('grades', {}); }
  function saveGrades(data) { write('grades', data); }

  function getAttendance() { return read('attendance', {}); }
  function saveAttendance(data) { write('attendance', data); }

  function getCurrentUser() { return read('currentUser', null); }
  function setCurrentUser(user) { write('currentUser', user); }
  function clearCurrentUser() { localStorage.removeItem(PREFIX + 'currentUser'); }

  function getGroups() { return GROUPS; }
  function getTeachers() { return TEACHERS; }
  function getGroupStudents(groupId) { return GROUPS[groupId] || []; }

  window.AppData = {
    getGroups,
    getTeachers,
    getGroupStudents,
    getSchedule,
    saveSchedule,
    getGrades,
    saveGrades,
    getAttendance,
    saveAttendance,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    DEFAULT_SCHEDULES,
    DEFAULT_PAST_GRADES,
    DEFAULT_ATTENDANCE_SUMMARY
  };
})();