import express from 'express';
import crypto from 'crypto';
import db from './db.js';

const router = express.Router();

// ── Auth helpers ────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

function makeToken() {
  const payload = { admin: true, iat: Date.now() };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token) {
  if (!token) return false;
  const [data, sig] = token.split('.');
  if (!data || !sig) return false;
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  if (sig !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    // Token valid for 7 days
    if (Date.now() - payload.iat > 7 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── Login ───────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  res.json({ token: makeToken() });
});

// ── Check auth ──────────────────────────────────────────
router.get('/check', authMiddleware, (req, res) => {
  res.json({ ok: true });
});

// ── Leads ───────────────────────────────────────────────
router.get('/leads', authMiddleware, (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  let query = 'SELECT * FROM leads';
  const params = [];

  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const rows = db.prepare(query).all(...params);

  // Counts by status
  const counts = {
    all: db.prepare('SELECT COUNT(*) as c FROM leads').get().c,
    new: db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'").get().c,
    contacted: db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'contacted'").get().c,
    done: db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'done'").get().c,
    cancelled: db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'cancelled'").get().c,
  };

  res.json({ leads: rows, counts });
});

router.patch('/leads/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'done', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Статус: ${allowed.join(', ')}` });
  }
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, parseInt(id));
  res.json({ ok: true });
});

router.delete('/leads/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM leads WHERE id = ?').run(parseInt(id));
  res.json({ ok: true });
});

// ── Schedule CRUD ───────────────────────────────────────
router.get('/schedule', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM schedule ORDER BY id DESC').all();
  res.json(rows);
});

router.patch('/schedule/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['course_name','start_date','end_date','time_info','city','format','spots_left','total_spots','price','color','hot','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['spots_left','total_spots','hot','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE schedule SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.post('/schedule', authMiddleware, (req, res) => {
  const { course_name, start_date, end_date, time_info, city, format, spots_left, total_spots, price, color } = req.body;
  if (!course_name || !start_date) return res.status(400).json({ error: 'Название и дата обязательны' });
  const result = db.prepare(
    'INSERT INTO schedule (course_name, start_date, end_date, time_info, city, format, spots_left, total_spots, price, color) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).run(course_name, start_date, end_date || '', time_info || '', city || 'Воронеж', format || 'Очно', parseInt(spots_left)||10, parseInt(total_spots)||10, price || '', color || '#D42B2B');
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.delete('/schedule/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM schedule WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Courses CRUD ────────────────────────────────────────
router.get('/courses', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM courses ORDER BY sort_order ASC').all();
  res.json(rows.map(r => ({ ...r, program: JSON.parse(r.program || '[]'), perks: JSON.parse(r.perks || '[]') })));
});

router.patch('/courses/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['title','subtitle','price','old_price','spots','total_spots','start_date','color','tag','for_who','income','category','duration','level','sort_order','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['spots','total_spots','sort_order','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.post('/courses', authMiddleware, (req, res) => {
  const { title, subtitle, price, old_price, spots, total_spots, start_date, color, tag, for_who, income, category, duration, level } = req.body;
  if (!title) return res.status(400).json({ error: 'Название обязательно' });
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM courses').get().m || 0;
  const result = db.prepare(
    'INSERT INTO courses (title, subtitle, price, old_price, spots, total_spots, start_date, color, tag, for_who, income, category, duration, level, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  ).run(title, subtitle||'', price||'', old_price||'', parseInt(spots)||10, parseInt(total_spots)||10, start_date||'', color||'#D42B2B', tag||'', for_who||'', income||'', category||'', duration||'', level||'', maxOrder+1);
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.delete('/courses/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM courses WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Model days CRUD ─────────────────────────────────────
router.get('/model-days', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM model_days ORDER BY id DESC').all();
  res.json(rows);
});

router.patch('/model-days/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['date','day','time','spots','topic','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['spots','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE model_days SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.post('/model-days', authMiddleware, (req, res) => {
  const { date, day, time, spots, topic } = req.body;
  if (!date) return res.status(400).json({ error: 'Дата обязательна' });
  const result = db.prepare('INSERT INTO model_days (date, day, time, spots, topic) VALUES (?,?,?,?,?)').run(date, day||'', time||'10:00–17:00', parseInt(spots)||6, topic||'');
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.delete('/model-days/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM model_days WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Promos CRUD ─────────────────────────────────────────
router.get('/promos', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM promos ORDER BY start_date DESC').all();
  res.json(rows.map(r => ({ ...r, perks: JSON.parse(r.perks || '[]') })));
});

router.patch('/promos/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['holiday','icon','title','subtitle','discount','description','start_date','end_date','promo_code','color','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE promos SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.post('/promos', authMiddleware, (req, res) => {
  const { holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, perks } = req.body;
  if (!holiday || !title || !start_date || !end_date) return res.status(400).json({ error: 'Праздник, название и даты обязательны' });
  const result = db.prepare(
    'INSERT INTO promos (holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, perks) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  ).run(holiday, icon||'🎁', title, subtitle||'', discount||'', description||'', start_date, end_date, promo_code||'', color||'#D42B2B', JSON.stringify(perks||[]));
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.delete('/promos/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM promos WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Settings ────────────────────────────────────────────
router.get('/settings', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  res.json(obj);
});

router.patch('/settings', authMiddleware, (req, res) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(req.body)) {
    stmt.run(key, String(value));
  }
  res.json({ ok: true });
});

// ── Blog CRUD ───────────────────────────────────────────
router.get('/blog', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/blog', authMiddleware, (req, res) => {
  const { title, excerpt, content, category, img, read_time, hot } = req.body;
  if (!title) return res.status(400).json({ error: 'Заголовок обязателен' });
  const result = db.prepare(
    'INSERT INTO blog_posts (title, excerpt, content, category, img, read_time, hot) VALUES (?,?,?,?,?,?,?)'
  ).run(title, excerpt||'', content||'', category||'', img||'', read_time||'5 мин', hot ? 1 : 0);
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.patch('/blog/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['title','excerpt','content','category','img','read_time','hot','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['hot','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.delete('/blog/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Stats (dashboard) ───────────────────────────────────
router.get('/stats', authMiddleware, (req, res) => {
  const leadsToday = db.prepare("SELECT COUNT(*) as c FROM leads WHERE date(created_at) = date('now')").get().c;
  const leadsWeek = db.prepare("SELECT COUNT(*) as c FROM leads WHERE created_at >= datetime('now', '-7 days')").get().c;
  const leadsNew = db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'new'").get().c;
  const leadsTotal = db.prepare("SELECT COUNT(*) as c FROM leads").get().c;
  const coursesActive = db.prepare("SELECT COUNT(*) as c FROM courses WHERE visible = 1").get().c;
  const scheduleActive = db.prepare("SELECT COUNT(*) as c FROM schedule WHERE visible = 1").get().c;
  const blogPosts = db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE visible = 1").get().c;

  res.json({ leadsToday, leadsWeek, leadsNew, leadsTotal, coursesActive, scheduleActive, blogPosts });
});

export default router;
