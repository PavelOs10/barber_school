import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    subtitle    TEXT DEFAULT '',
    level       TEXT DEFAULT '',
    duration    TEXT DEFAULT '',
    city        TEXT DEFAULT 'Воронеж',
    start_date  TEXT DEFAULT '',
    price       TEXT DEFAULT '',
    old_price   TEXT DEFAULT '',
    spots       INTEGER DEFAULT 10,
    total_spots INTEGER DEFAULT 10,
    color       TEXT DEFAULT '#D42B2B',
    tag         TEXT DEFAULT '',
    for_who     TEXT DEFAULT '',
    income      TEXT DEFAULT '',
    program     TEXT DEFAULT '[]',
    perks       TEXT DEFAULT '[]',
    category    TEXT DEFAULT '',
    sort_order  INTEGER DEFAULT 0,
    visible     INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    start_date  TEXT NOT NULL,
    end_date    TEXT DEFAULT '',
    time_info   TEXT DEFAULT '',
    city        TEXT DEFAULT 'Воронеж',
    format      TEXT DEFAULT 'Очно',
    spots_left  INTEGER DEFAULT 10,
    total_spots INTEGER DEFAULT 12,
    price       TEXT DEFAULT '',
    color       TEXT DEFAULT '#D42B2B',
    hot         INTEGER DEFAULT 0,
    visible     INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS model_days (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    date    TEXT NOT NULL,
    day     TEXT DEFAULT '',
    time    TEXT DEFAULT '10:00–17:00',
    spots   INTEGER DEFAULT 6,
    topic   TEXT DEFAULT '',
    visible INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS promos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    holiday     TEXT NOT NULL,
    icon        TEXT DEFAULT '🎁',
    title       TEXT NOT NULL,
    subtitle    TEXT DEFAULT '',
    discount    TEXT DEFAULT '',
    description TEXT DEFAULT '',
    start_date  TEXT NOT NULL,
    end_date    TEXT NOT NULL,
    promo_code  TEXT DEFAULT '',
    color       TEXT DEFAULT '#D42B2B',
    bg_image    TEXT DEFAULT '',
    perks       TEXT DEFAULT '[]',
    visible     INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT NOT NULL,
    name       TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    message    TEXT DEFAULT '',
    source     TEXT DEFAULT 'website',
    status     TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    excerpt    TEXT DEFAULT '',
    content    TEXT DEFAULT '',
    category   TEXT DEFAULT '',
    img        TEXT DEFAULT '',
    read_time  TEXT DEFAULT '5 мин',
    hot        INTEGER DEFAULT 0,
    visible    INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    role        TEXT DEFAULT '',
    experience  TEXT DEFAULT '',
    description TEXT DEFAULT '',
    photo       TEXT DEFAULT '',
    sort_order  INTEGER DEFAULT 0,
    visible     INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS graduates (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    course      TEXT DEFAULT '',
    year        TEXT DEFAULT '',
    quote       TEXT DEFAULT '',
    workplace   TEXT DEFAULT '',
    photo       TEXT DEFAULT '',
    sort_order  INTEGER DEFAULT 0,
    visible     INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

// ── Migration: add bg_image to promos if missing ────────
try {
  db.exec(`ALTER TABLE promos ADD COLUMN bg_image TEXT DEFAULT ''`);
} catch (e) {
  // Column already exists — ignore
}

// ── Seed defaults if empty ──────────────────────────────

function seedIfEmpty() {
  const courseCount = db.prepare('SELECT COUNT(*) as c FROM courses').get().c;
  if (courseCount === 0) {
    const ins = db.prepare(`INSERT INTO courses (title, subtitle, level, duration, city, start_date, price, old_price, spots, total_spots, color, tag, for_who, income, program, perks, category, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

    const courses = [
      ['Базовый курс барберинга', 'С нуля до профессионала за 4 недели', 'С нуля', '4 недели', 'Воронеж', '3 марта 2026', '45 000 ₽', '55 000 ₽', 3, 12, '#D42B2B', 'Популярный', 'Для тех, кто хочет сменить профессию или начать с нуля. Опыт не нужен — научим всему.', 'После курса: 60–90 000 ₽/месяц', JSON.stringify(['Теория барберинга','Работа с машинкой','Стрижка ножницами','Работа с бритвой','Уход за бородой','Коммуникация с клиентом','Практика на моделях','Итоговый экзамен']), JSON.stringify(['Рассрочка 0%','Поддержка наставника 3 месяца','Диплом установленного образца','Помощь в трудоустройстве']), 'С нуля', 1],
      ['Профессиональный курс', 'Полное погружение в профессию мастера', 'Углублённый', '8 недель', 'Воронеж', '10 марта 2026', '75 000 ₽', '', 5, 10, '#FFA500', 'Хит', 'Для тех, кто уже умеет стричь и хочет вывести мастерство на профессиональный уровень.', 'После курса: 90–150 000 ₽/месяц', JSON.stringify(['Продвинутые техники fade','Дизайн и геометрия','Работа с опасной бритвой','Окрашивание','Лечебный уход','Постановка рук','Бизнес в барберинге','Портфолио и продвижение']), JSON.stringify(['Рассрочка 0%','Поддержка наставника 6 месяцев','Международный сертификат','Гарантия трудоустройства']), 'Углублённый', 2],
      ['Мастер-класс: Барберинг за выходные', 'Интенсив для быстрого старта', 'С нуля', '2 дня', 'Воронеж', '21 марта 2026', '8 000 ₽', '', 8, 15, '#9B59B6', 'Новый', 'Для тех, кто хочет попробовать барберинг и понять, подходит ли это им.', 'Стартовый опыт для дальнейшего обучения', JSON.stringify(['Основы стрижки машинкой','Базовые техники ножницами','Работа с триммером','Базовый уход за бородой']), JSON.stringify(['Без предоплаты','Инструменты предоставляются','Сертификат участника']), 'С нуля', 3],
      ['Онлайн-интенсив', 'Теоретическая база в удобном формате', 'Онлайн', '2 недели', 'Онлайн', '1 апреля 2026', '15 000 ₽', '18 000 ₽', 20, 50, '#2A96F3', 'Онлайн', 'Для занятых людей, которые хотят получить теоретическую базу в удобном темпе.', 'Стартовый уровень знаний для перехода к очному обучению', JSON.stringify(['Видеоуроки по технике','Разборы реальных кейсов','Теория анатомии головы','Инструменты и уход','Чат с наставником','Проверочные задания']), JSON.stringify(['Доступ навсегда','Поддержка в чате','Сертификат онлайн','Скидка 15% на очный курс']), 'Онлайн', 4],
    ];
    const tx = db.transaction(() => { for (const c of courses) ins.run(...c); });
    tx();
  }

  const schedCount = db.prepare('SELECT COUNT(*) as c FROM schedule').get().c;
  if (schedCount === 0) {
    const ins = db.prepare(`INSERT INTO schedule (course_name, start_date, end_date, time_info, city, format, spots_left, total_spots, price, color, hot) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    const rows = [
      ['Базовый курс барберинга', '3 марта 2026', '31 марта 2026', 'Пн–Пт, 10:00–16:00', 'Воронеж', 'Очно', 3, 12, '45 000 ₽', '#D42B2B', 1],
      ['Профессиональный курс', '10 марта 2026', '5 мая 2026', 'Пн–Сб, 10:00–17:00', 'Воронеж', 'Очно', 5, 10, '75 000 ₽', '#FFA500', 0],
      ['Мастер-класс: Барберинг за выходные', '21 марта 2026', '22 марта 2026', 'Сб–Вс, 10:00–19:00', 'Воронеж', 'Очно', 8, 15, '8 000 ₽', '#9B59B6', 0],
      ['Онлайн-интенсив', '1 апреля 2026', '14 апреля 2026', 'Гибкое расписание', 'Онлайн', 'Онлайн', 25, 50, '15 000 ₽', '#2A96F3', 0],
      ['Базовый курс барберинга', '7 апреля 2026', '5 мая 2026', 'Пн–Пт, 10:00–16:00', 'Воронеж', 'Очно', 12, 12, '45 000 ₽', '#D42B2B', 0],
      ['Профессиональный курс', '14 апреля 2026', '9 июня 2026', 'Пн–Сб, 10:00–17:00', 'Воронеж', 'Очно', 10, 10, '75 000 ₽', '#FFA500', 0],
    ];
    const tx = db.transaction(() => { for (const r of rows) ins.run(...r); });
    tx();
  }

  const modelCount = db.prepare('SELECT COUNT(*) as c FROM model_days').get().c;
  if (modelCount === 0) {
    const ins = db.prepare(`INSERT INTO model_days (date, day, time, spots, topic) VALUES (?,?,?,?,?)`);
    const rows = [
      ['5 марта 2026', 'Четверг', '10:00–17:00', 6, 'Стрижки машинкой (fade)'],
      ['12 марта 2026', 'Четверг', '10:00–17:00', 4, 'Ножницы + комбинация'],
      ['19 марта 2026', 'Четверг', '10:00–17:00', 8, 'Работа с бородой'],
      ['26 марта 2026', 'Четверг', '10:00–17:00', 5, 'Классические стрижки'],
      ['2 апреля 2026', 'Четверг', '10:00–17:00', 6, 'Стрижки машинкой (skin fade)'],
      ['9 апреля 2026', 'Четверг', '10:00–17:00', 7, 'Укладка и финишинг'],
    ];
    const tx = db.transaction(() => { for (const r of rows) ins.run(...r); });
    tx();
  }

  const promoCount = db.prepare('SELECT COUNT(*) as c FROM promos').get().c;
  if (promoCount === 0) {
    const ins = db.prepare(`INSERT INTO promos (holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, perks) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    const rows = [
      ['23 ФЕВРАЛЯ', '🎖️', 'ДЕНЬ ЗАЩИТНИКА ОТЕЧЕСТВА', 'Стрижка для настоящих мужиков', '-15%', 'В честь праздника — скидка 15% на базовый курс. Запишись сам или подари другу!', '2026-02-15', '2026-02-28', 'DEFENDER23', '#D42B2B', JSON.stringify(['Скидка 15% на базовый курс','Бесплатный подарочный сертификат','Приоритетное расписание'])],
      ['8 МАРТА', '🌸', 'МЕЖДУНАРОДНЫЙ ЖЕНСКИЙ ДЕНЬ', 'Подарок, который останется навсегда', '-20%', 'Купи курс в подарок для неё — и она станет лучшим мастером. Скидка 20% + красивый сертификат.', '2026-03-01', '2026-03-10', 'MARCH8', '#C74B8A', JSON.stringify(['Скидка 20% на любой курс','Фирменный подарочный сертификат','Бесплатная фотосессия по окончании'])],
      ['1 МАЯ', '🌿', 'ВЕСЕННИЙ СТАРТ', 'Весна — лучшее время для нового начала', '-10%', 'Скидка 10% на всё в мае. Плюс первый месяц рассрочки — бесплатно!', '2026-05-01', '2026-05-31', 'SPRING2026', '#2D9E5A', JSON.stringify(['Скидка 10% на любой курс','Первый платёж рассрочки бесплатно','Доступ к закрытому клубу выпускников'])],
      ['12 ИЮНЯ', '🇷🇺', 'ДЕНЬ РОССИИ', 'Самый мужской праздник страны', '-12%', 'Патриотическая скидка для тех, кто хочет стать мастером своего дела.', '2026-06-05', '2026-06-14', 'RUSSIA12', '#2255CC', JSON.stringify(['Скидка 12% на базовый курс','Бесплатный набор инструментов','Фирменный фартук в подарок'])],
      ['1 СЕНТЯБРЯ', '📚', 'BACK TO SCHOOL', 'Новый сезон — новая профессия', '-10%', 'Сентябрь — лучшее время для старта! Скидка 10% на осенние потоки.', '2026-09-01', '2026-09-30', 'SEPT2026', '#E08C20', JSON.stringify(['Скидка 10% на осенние потоки','Расширенный пакет инструментов','Куратор на 6 месяцев'])],
      ['НОВЫЙ ГОД', '🎄', 'НОВОГОДНЯЯ АКЦИЯ', 'Лучший подарок — новая профессия', '-25%', 'Самая большая скидка года! Запишись или подари близкому.', '2026-12-15', '2026-12-31', 'NEWYEAR25', '#2D9E5A', JSON.stringify(['Скидка 25% — максимум года','Новогодний сертификат в подарок','Первый урок бесплатно','Рассрочка 0% на 6 месяцев'])],
    ];
    const tx = db.transaction(() => { for (const r of rows) ins.run(...r); });
    tx();
  }

  // Default settings
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;
  if (settingsCount === 0) {
    const ins = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`);
    ins.run('whatsapp_phone', '79001234567');
    ins.run('telegram_channel', 'barberhouse_vrn');
    ins.run('address', 'г. Воронеж, ул. Плехановская, 67');
    ins.run('phone', '+7 (900) 123-45-67');
    ins.run('email', 'info@barberhouse.ru');
    ins.run('work_hours', 'Пн–Сб: 9:00–20:00');
  }

  // Blog posts
  const blogCount = db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c;
  if (blogCount === 0) {
    const ins = db.prepare('INSERT INTO blog_posts (title, excerpt, category, img, read_time, hot, created_at) VALUES (?,?,?,?,?,?,?)');
    const rows = [
      ['Тренды барберинга 2026: что будет популярно в этом году', 'Разбираем главные тренды мужских стрижек и уходовых процедур, которые будут доминировать в 2026 году. Что заказывают клиенты, какие техники в моде.', 'Тренды', '/uploads/blog-trends-2026.jpg', '5 мин', 1, '2026-02-20 10:00:00'],
      ['История нашей школы: как маленький класс стал школой №1 в Воронеже', 'Рассказываем путь BARBER HOUSE: от первых 6 студентов в небольшом помещении до 500+ выпускников и собственного учебного барбершопа.', 'О школе', '/uploads/blog-history.jpg', '7 мин', 0, '2026-02-15 10:00:00'],
      ['Итоги конкурса "Золотой Шейвер 2025"', 'В декабре 2025 прошёл наш ежегодный конкурс барберов среди выпускников школы. Рассказываем о победителях и лучших работах.', 'События', '/uploads/blog-contest.jpg', '4 мин', 0, '2026-01-05 10:00:00'],
      ['Как выбрать профессиональный инструмент барбера: полный гид', 'Машинки, триммеры, бритвы, ножницы — что купить на старте карьеры и на что не стоит тратить деньги. Рекомендации наших преподавателей.', 'Советы', '/uploads/blog-tools.jpg', '8 мин', 0, '2026-01-28 10:00:00'],
      ['Выпускник Сергей: "Бросил IT в 35 лет — и ни о чём не жалею"', 'История одного из наших самых вдохновляющих выпускников. Программист с 10-летним стажем ушёл в барберинг и стал наставником в BARBER HOUSE.', 'Истории', '/uploads/blog-story-sergey.jpg', '6 мин', 0, '2026-02-10 10:00:00'],
      ['Весенние акции в школе: скидки и специальные предложения', 'К 8 марта и весеннему сезону мы подготовили специальные предложения для новых студентов. Рассрочка 0%, бонусный инструментарий и другие приятности.', 'Акции', '/uploads/blog-spring-sale.jpg', '3 мин', 1, '2026-03-01 10:00:00'],
    ];
    const tx = db.transaction(() => { for (const r of rows) ins.run(...r); });
    tx();
  }
}

seedIfEmpty();

export default db;
