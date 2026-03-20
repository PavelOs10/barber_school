import TelegramBot from 'node-telegram-bot-api';
import db from './db.js';

const token = process.env.BOT_TOKEN;
const adminId = parseInt(process.env.ADMIN_CHAT_ID);

let bot;

export function startBot() {
  if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
    console.warn('⚠️  BOT_TOKEN не задан — бот не запущен');
    return;
  }

  bot = new TelegramBot(token, { polling: true });
  console.log('🤖 Telegram-бот запущен');

  // ── Auth middleware ──────────────────────────────────
  function isAdmin(msg) {
    return msg.chat.id === adminId;
  }

  // ── /start ──────────────────────────────────────────
  bot.onText(/\/start/, (msg) => {
    if (!isAdmin(msg)) {
      return bot.sendMessage(msg.chat.id, '🙅 Доступ запрещён. Этот бот только для администратора.');
    }
    bot.sendMessage(msg.chat.id, `
🏠 *BARBER HOUSE — Панель управления*

📋 *Расписание и курсы:*
/courses — список курсов
/schedule — расписание потоков
/models — расписание моделей

🎁 *Акции:*
/promos — сезонные акции

📊 *Заявки:*
/leads — новые заявки
/leads\\_all — все заявки

⚙️ *Управление:*
/spots \\[ID\\] \\[кол-во\\] — изменить места (расписание)
/spots\\_course \\[ID\\] \\[кол-во\\] — изменить места (курс)
/spots\\_model \\[ID\\] \\[кол-во\\] — изменить места (модели)
/hot \\[ID\\] — вкл/выкл 🔥 (расписание)
/hide \\[таблица\\] \\[ID\\] — скрыть запись
/show \\[таблица\\] \\[ID\\] — показать запись

➕ *Добавление:*
/add\\_schedule — новый поток
/add\\_model — день для моделей
/add\\_promo — новая акция

✏️ *Редактирование:*
/edit\\_schedule \\[ID\\] поле значение
/edit\\_course \\[ID\\] поле значение
/edit\\_promo \\[ID\\] поле значение

📞 *Контакты:*
/settings — текущие настройки
/set \\[ключ\\] \\[значение\\] — изменить настройку

/lead\\_status \\[ID\\] \\[статус\\] — сменить статус заявки

/help — эта справка
`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/help/, (msg) => {
    if (!isAdmin(msg)) return;
    bot.sendMessage(msg.chat.id, `
📖 *Подробная справка*

*Изменить кол-во мест:*
\`/spots 1 3\` — у потока #1 теперь 3 места
\`/spots_course 2 8\` — у курса #2 теперь 8 мест
\`/spots_model 3 5\` — у модельного дня #3 теперь 5 мест

*Скрыть/показать:*
\`/hide schedule 1\` — скрыть поток #1
\`/show schedule 1\` — показать обратно
Таблицы: schedule, courses, model\\_days, promos

*Добавить поток:*
\`/add_schedule\`
Название | Начало | Конец | Время | Город | Формат | Мест | Всего | Цена | Цвет
Пример:
\`/add_schedule Базовый курс | 1 июня 2026 | 30 июня 2026 | Пн-Пт 10-16 | Воронеж | Очно | 12 | 12 | 45 000 ₽ | #D42B2B\`

*Добавить день моделей:*
\`/add_model 15 апреля 2026 | Среда | 10:00–17:00 | 6 | Тема занятия\`

*Добавить акцию:*
\`/add_promo\`
Праздник | Иконка | Название | Подзаголовок | Скидка | Описание | Начало | Конец | Промокод | Цвет | Бонус1; Бонус2

*Редактирование:*
\`/edit_schedule 1 price 50 000 ₽\`
\`/edit_course 2 spots 3\`
\`/edit_promo 1 discount -20%\`

*Поля schedule:* course\\_name, start\\_date, end\\_date, time\\_info, city, format, spots\\_left, total\\_spots, price, color
*Поля courses:* title, subtitle, price, old\\_price, spots, total\\_spots, start\\_date, color, tag, for\\_who, income, category, duration, level
*Поля promos:* holiday, icon, title, subtitle, discount, description, start\\_date, end\\_date, promo\\_code, color

*Настройки:*
\`/set whatsapp_phone 79001234567\`
\`/set telegram_channel barberhouse_vrn\`
\`/set address г. Воронеж, ул. Ленина, 1\`
\`/set phone +7 (900) 111-22-33\`
\`/set email mail@site.ru\`
\`/set work_hours Пн-Сб 9:00-20:00\`
`, { parse_mode: 'Markdown' });
  });

  // ── LIST COMMANDS ───────────────────────────────────

  bot.onText(/\/courses$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT id, title, spots, total_spots, price, start_date, visible FROM courses ORDER BY sort_order').all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, 'Курсов нет');
    const text = rows.map(r => {
      const vis = r.visible ? '✅' : '🚫';
      const urgency = r.spots <= 3 ? '🔴' : r.spots <= r.total_spots / 2 ? '🟡' : '🟢';
      return `${vis} #${r.id} *${r.title}*\n   ${urgency} Мест: ${r.spots}/${r.total_spots} | ${r.price} | Старт: ${r.start_date}`;
    }).join('\n\n');
    bot.sendMessage(msg.chat.id, `📚 *Курсы:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/schedule$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT * FROM schedule ORDER BY id').all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, 'Расписание пустое');
    const text = rows.map(r => {
      const vis = r.visible ? '✅' : '🚫';
      const fire = r.hot ? '🔥' : '';
      const urgency = r.spots_left <= 3 ? '🔴' : r.spots_left <= r.total_spots / 2 ? '🟡' : '🟢';
      return `${vis}${fire} #${r.id} *${r.course_name}*\n   ${urgency} Мест: ${r.spots_left}/${r.total_spots} | ${r.price}\n   📅 ${r.start_date} — ${r.end_date} | ${r.time_info}`;
    }).join('\n\n');
    bot.sendMessage(msg.chat.id, `📅 *Расписание:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/models$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT * FROM model_days ORDER BY id').all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, 'Дней для моделей нет');
    const text = rows.map(r => {
      const vis = r.visible ? '✅' : '🚫';
      return `${vis} #${r.id} *${r.date}* (${r.day})\n   💇 ${r.topic} | Мест: ${r.spots} | ${r.time}`;
    }).join('\n\n');
    bot.sendMessage(msg.chat.id, `💇 *Дни для моделей:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/promos$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT * FROM promos ORDER BY start_date').all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, 'Акций нет');
    const now = new Date().toISOString().split('T')[0];
    const text = rows.map(r => {
      const vis = r.visible ? '✅' : '🚫';
      let status = '⏳';
      if (now >= r.start_date && now <= r.end_date) status = '🟢 Активна';
      else if (now > r.end_date) status = '⬜ Завершена';
      else status = '🔜 Ожидает';
      return `${vis} #${r.id} ${r.icon} *${r.holiday}* ${r.discount}\n   ${status} | ${r.start_date} — ${r.end_date}\n   Промокод: \`${r.promo_code}\``;
    }).join('\n\n');
    bot.sendMessage(msg.chat.id, `🎁 *Акции:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  // ── SPOTS COMMANDS ──────────────────────────────────

  bot.onText(/\/spots (\d+) (\d+)$/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, count] = match;
    db.prepare('UPDATE schedule SET spots_left = ? WHERE id = ?').run(parseInt(count), parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Поток #${id} — мест: ${count}`);
  });

  bot.onText(/\/spots_course (\d+) (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, count] = match;
    db.prepare('UPDATE courses SET spots = ? WHERE id = ?').run(parseInt(count), parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Курс #${id} — мест: ${count}`);
  });

  bot.onText(/\/spots_model (\d+) (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, count] = match;
    db.prepare('UPDATE model_days SET spots = ? WHERE id = ?').run(parseInt(count), parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ День моделей #${id} — мест: ${count}`);
  });

  // ── HOT toggle ──────────────────────────────────────

  bot.onText(/\/hot (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const id = parseInt(match[1]);
    const row = db.prepare('SELECT hot FROM schedule WHERE id = ?').get(id);
    if (!row) return bot.sendMessage(msg.chat.id, '❌ Поток не найден');
    const newVal = row.hot ? 0 : 1;
    db.prepare('UPDATE schedule SET hot = ? WHERE id = ?').run(newVal, id);
    bot.sendMessage(msg.chat.id, `✅ Поток #${id} — 🔥 ${newVal ? 'ВКЛ' : 'ВЫКЛ'}`);
  });

  // ── HIDE / SHOW ─────────────────────────────────────

  bot.onText(/\/hide (\w+) (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, table, id] = match;
    const allowed = ['schedule', 'courses', 'model_days', 'promos'];
    if (!allowed.includes(table)) return bot.sendMessage(msg.chat.id, `❌ Таблица: ${allowed.join(', ')}`);
    db.prepare(`UPDATE ${table} SET visible = 0 WHERE id = ?`).run(parseInt(id));
    bot.sendMessage(msg.chat.id, `🚫 ${table} #${id} скрыт`);
  });

  bot.onText(/\/show (\w+) (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, table, id] = match;
    const allowed = ['schedule', 'courses', 'model_days', 'promos'];
    if (!allowed.includes(table)) return bot.sendMessage(msg.chat.id, `❌ Таблица: ${allowed.join(', ')}`);
    db.prepare(`UPDATE ${table} SET visible = 1 WHERE id = ?`).run(parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ ${table} #${id} виден`);
  });

  // ── ADD COMMANDS ────────────────────────────────────

  bot.onText(/\/add_schedule (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const parts = match[1].split('|').map(s => s.trim());
    if (parts.length < 9) {
      return bot.sendMessage(msg.chat.id, '❌ Формат: Название | Начало | Конец | Время | Город | Формат | Мест | Всего | Цена | Цвет(опц.)');
    }
    const [name, start, end, time, city, format, spots, total, price, color] = parts;
    db.prepare(
      'INSERT INTO schedule (course_name, start_date, end_date, time_info, city, format, spots_left, total_spots, price, color) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ).run(name, start, end, time, city, format, parseInt(spots), parseInt(total), price, color || '#D42B2B');
    bot.sendMessage(msg.chat.id, `✅ Поток добавлен: ${name} (${start})`);
  });

  bot.onText(/\/add_model (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const parts = match[1].split('|').map(s => s.trim());
    if (parts.length < 5) {
      return bot.sendMessage(msg.chat.id, '❌ Формат: Дата | День | Время | Мест | Тема');
    }
    const [date, day, time, spots, topic] = parts;
    db.prepare('INSERT INTO model_days (date, day, time, spots, topic) VALUES (?,?,?,?,?)').run(date, day, time, parseInt(spots), topic);
    bot.sendMessage(msg.chat.id, `✅ День моделей добавлен: ${date} — ${topic}`);
  });

  bot.onText(/\/add_promo (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const parts = match[1].split('|').map(s => s.trim());
    if (parts.length < 10) {
      return bot.sendMessage(msg.chat.id, '❌ Формат: Праздник | Иконка | Название | Подзаголовок | Скидка | Описание | Начало(YYYY-MM-DD) | Конец | Промокод | Цвет | Бонус1; Бонус2');
    }
    const [holiday, icon, title, subtitle, discount, desc, start, end, code, color, ...perksArr] = parts;
    const perks = perksArr.join('|').split(';').map(s => s.trim()).filter(Boolean);
    db.prepare(
      'INSERT INTO promos (holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, perks) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    ).run(holiday, icon, title, subtitle, discount, desc, start, end, code, color || '#D42B2B', JSON.stringify(perks));
    bot.sendMessage(msg.chat.id, `✅ Акция добавлена: ${holiday} — ${title}`);
  });

  // ── EDIT COMMANDS ───────────────────────────────────

  bot.onText(/\/edit_schedule (\d+) (\S+) (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, field, value] = match;
    const allowed = ['course_name','start_date','end_date','time_info','city','format','spots_left','total_spots','price','color'];
    if (!allowed.includes(field)) return bot.sendMessage(msg.chat.id, `❌ Поля: ${allowed.join(', ')}`);
    const val = ['spots_left','total_spots','hot'].includes(field) ? parseInt(value) : value;
    db.prepare(`UPDATE schedule SET ${field} = ? WHERE id = ?`).run(val, parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Поток #${id}: ${field} = ${value}`);
  });

  bot.onText(/\/edit_course (\d+) (\S+) (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, field, value] = match;
    const allowed = ['title','subtitle','price','old_price','spots','total_spots','start_date','color','tag','for_who','income','category','duration','level','sort_order'];
    if (!allowed.includes(field)) return bot.sendMessage(msg.chat.id, `❌ Поля: ${allowed.join(', ')}`);
    const val = ['spots','total_spots','sort_order'].includes(field) ? parseInt(value) : value;
    db.prepare(`UPDATE courses SET ${field} = ? WHERE id = ?`).run(val, parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Курс #${id}: ${field} = ${value}`);
  });

  bot.onText(/\/edit_promo (\d+) (\S+) (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, field, value] = match;
    const allowed = ['holiday','icon','title','subtitle','discount','description','start_date','end_date','promo_code','color'];
    if (!allowed.includes(field)) return bot.sendMessage(msg.chat.id, `❌ Поля: ${allowed.join(', ')}`);
    db.prepare(`UPDATE promos SET ${field} = ? WHERE id = ?`).run(value, parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Акция #${id}: ${field} = ${value}`);
  });

  // ── LEADS ───────────────────────────────────────────

  bot.onText(/\/leads$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare("SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC LIMIT 20").all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, '📭 Новых заявок нет');
    const text = rows.map(r =>
      `📩 #${r.id} [${r.type}] *${r.name}*\n   📱 ${r.phone}\n   💬 ${r.message || '—'}\n   🕐 ${r.created_at}`
    ).join('\n\n');
    bot.sendMessage(msg.chat.id, `📬 *Новые заявки (${rows.length}):*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/leads_all/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 50').all();
    if (!rows.length) return bot.sendMessage(msg.chat.id, '📭 Заявок нет');
    const text = rows.map(r => {
      const st = r.status === 'new' ? '🆕' : r.status === 'contacted' ? '📞' : r.status === 'done' ? '✅' : '📋';
      return `${st} #${r.id} [${r.type}] ${r.name} — ${r.phone} (${r.created_at})`;
    }).join('\n');
    bot.sendMessage(msg.chat.id, `📋 *Все заявки:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/lead_status (\d+) (\S+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, id, status] = match;
    const allowed = ['new', 'contacted', 'done', 'cancelled'];
    if (!allowed.includes(status)) return bot.sendMessage(msg.chat.id, `❌ Статусы: ${allowed.join(', ')}`);
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, parseInt(id));
    bot.sendMessage(msg.chat.id, `✅ Заявка #${id} — статус: ${status}`);
  });

  // ── SETTINGS ────────────────────────────────────────

  bot.onText(/\/settings$/, (msg) => {
    if (!isAdmin(msg)) return;
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const text = rows.map(r => `*${r.key}:* ${r.value}`).join('\n');
    bot.sendMessage(msg.chat.id, `⚙️ *Настройки:*\n\n${text}`, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/set (\S+) (.+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, key, value] = match;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
    bot.sendMessage(msg.chat.id, `✅ ${key} = ${value}`);
  });

  // ── Delete commands ─────────────────────────────────

  bot.onText(/\/delete (\w+) (\d+)/, (msg, match) => {
    if (!isAdmin(msg)) return;
    const [, table, id] = match;
    const allowed = ['schedule', 'courses', 'model_days', 'promos'];
    if (!allowed.includes(table)) return bot.sendMessage(msg.chat.id, `❌ Таблица: ${allowed.join(', ')}`);
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(parseInt(id));
    bot.sendMessage(msg.chat.id, `🗑️ ${table} #${id} удалён`);
  });
}

// ── Notify admin about new lead ─────────────────────────

export async function notifyLead({ id, type, name, phone, message }) {
  if (!bot || !adminId) return;

  const typeLabels = {
    popup: '🔔 Всплывающее окно',
    contact: '📨 Страница контактов',
    model: '💇 Запись модели',
    general: '📩 Заявка',
  };

  const text = `
${typeLabels[type] || '📩 Новая заявка'} #${id}

👤 *${name}*
📱 ${phone}
${message ? `💬 ${message}` : ''}

⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

Сменить статус: /lead\\_status ${id} contacted
`;

  try {
    await bot.sendMessage(adminId, text, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Telegram notify error:', err.message);
  }
}
