import express from 'express';
import crypto from 'crypto';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// ── Upload directory ───────────────────────────────────
// In production defaults to /var/www/barber/uploads (same path nginx serves)
const DEFAULT_UPLOAD_DIR = process.env.NODE_ENV === 'production'
  ? '/var/www/barber/uploads'
  : join(__dirname, '..', 'uploads');
const UPLOAD_DIR = process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

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

// ── Image Upload ───────────────────────────────────────
// Accepts base64-encoded image via JSON body
// Validates dimensions and file size
// Returns the public URL path

const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Minimal image dimension parsing from binary data
function getImageDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png') {
      // PNG: width at offset 16 (4 bytes BE), height at offset 20 (4 bytes BE)
      if (buffer.length < 24) return null;
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    if (mimeType === 'image/jpeg') {
      // JPEG: scan for SOF0/SOF2 markers (0xFF 0xC0 or 0xFF 0xC2)
      let i = 2;
      while (i < buffer.length - 9) {
        if (buffer[i] === 0xFF) {
          const marker = buffer[i + 1];
          if (marker === 0xC0 || marker === 0xC2) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height };
          }
          // Skip block
          if (marker !== 0xD8 && marker !== 0xD9 && marker !== 0x00) {
            const blockLen = buffer.readUInt16BE(i + 2);
            i += 2 + blockLen;
          } else {
            i += 2;
          }
        } else {
          i++;
        }
      }
      return null;
    }
    if (mimeType === 'image/webp') {
      // WebP: RIFF header, check VP8 chunk
      if (buffer.length < 30) return null;
      const riff = buffer.toString('ascii', 0, 4);
      const webp = buffer.toString('ascii', 8, 12);
      if (riff !== 'RIFF' || webp !== 'WEBP') return null;
      const chunk = buffer.toString('ascii', 12, 16);
      if (chunk === 'VP8 ') {
        // Lossy: width/height at offset 26/28 (little-endian 16-bit, masked)
        const width = buffer.readUInt16LE(26) & 0x3FFF;
        const height = buffer.readUInt16LE(28) & 0x3FFF;
        return { width, height };
      }
      if (chunk === 'VP8L') {
        // Lossless: 5 bytes signature at offset 21
        const bits = buffer.readUInt32LE(21);
        const width = (bits & 0x3FFF) + 1;
        const height = ((bits >> 14) & 0x3FFF) + 1;
        return { width, height };
      }
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

router.post('/upload', authMiddleware, (req, res) => {
  try {
    const { image, filename, context } = req.body;
    // image = "data:image/jpeg;base64,/9j/4A..." or just base64 string
    // context = "blog" | "teacher" | "graduate" | "promo_bg" — for dimension hints

    if (!image) {
      return res.status(400).json({ error: 'Изображение не предоставлено' });
    }

    // Parse base64
    let base64Data = image;
    let mimeType = 'image/jpeg';

    if (image.startsWith('data:')) {
      const match = image.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
      if (!match) {
        return res.status(400).json({ error: 'Неверный формат изображения' });
      }
      mimeType = match[1].toLowerCase();
      base64Data = match[2];
    }

    const ext = ALLOWED_TYPES[mimeType];
    if (!ext) {
      return res.status(400).json({ error: 'Допустимые форматы: JPEG, PNG, WebP' });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'Файл слишком большой (макс. 5 МБ)' });
    }

    // Get & validate dimensions
    const dims = getImageDimensions(buffer, mimeType);

    // Dimension requirements per context
    const requirements = {
      blog:       { minW: 600, minH: 300, maxW: 2400, maxH: 1600, label: 'Блог: 600–2400 × 300–1600 px' },
      teacher:    { minW: 300, minH: 300, maxW: 1200, maxH: 1200, label: 'Преподаватель: 300–1200 × 300–1200 px (квадрат)' },
      graduate:   { minW: 300, minH: 300, maxW: 1200, maxH: 1200, label: 'Выпускник: 300–1200 × 300–1200 px (квадрат)' },
      promo_bg:   { minW: 1200, minH: 400, maxW: 3840, maxH: 2160, label: 'Фон акции: 1200–3840 × 400–2160 px' },
    };

    const req_dims = requirements[context];
    if (dims && req_dims) {
      if (dims.width < req_dims.minW || dims.height < req_dims.minH) {
        return res.status(400).json({
          error: `Изображение слишком маленькое (${dims.width}×${dims.height}). Требуется: ${req_dims.label}`,
          dimensions: dims,
          requirements: req_dims,
        });
      }
      if (dims.width > req_dims.maxW || dims.height > req_dims.maxH) {
        return res.status(400).json({
          error: `Изображение слишком большое (${dims.width}×${dims.height}). Требуется: ${req_dims.label}`,
          dimensions: dims,
          requirements: req_dims,
        });
      }
    }

    // Generate filename
    const uniqueName = `img-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = join(UPLOAD_DIR, uniqueName);
    writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    res.json({ ok: true, url: publicUrl, dimensions: dims });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// Delete an uploaded image
router.delete('/upload', authMiddleware, (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('/uploads/')) {
    return res.status(400).json({ error: 'Неверный путь' });
  }
  const filename = url.replace('/uploads/', '');
  // Sanitize: no path traversal
  if (filename.includes('/') || filename.includes('..')) {
    return res.status(400).json({ error: 'Неверный путь' });
  }
  const filePath = join(UPLOAD_DIR, filename);
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

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

// ── Promos CRUD (now with bg_image) ────────────────────
router.get('/promos', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM promos ORDER BY start_date DESC').all();
  res.json(rows.map(r => ({ ...r, perks: JSON.parse(r.perks || '[]') })));
});

router.patch('/promos/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['holiday','icon','title','subtitle','discount','description','start_date','end_date','promo_code','color','bg_image','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (req.body.perks !== undefined) {
    updates.push('perks = ?');
    values.push(JSON.stringify(req.body.perks || []));
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE promos SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.post('/promos', authMiddleware, (req, res) => {
  const { holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, bg_image, perks } = req.body;
  if (!holiday || !title || !start_date || !end_date) return res.status(400).json({ error: 'Праздник, название и даты обязательны' });
  const result = db.prepare(
    'INSERT INTO promos (holiday, icon, title, subtitle, discount, description, start_date, end_date, promo_code, color, bg_image, perks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
  ).run(holiday, icon||'🎁', title, subtitle||'', discount||'', description||'', start_date, end_date, promo_code||'', color||'#D42B2B', bg_image||'', JSON.stringify(perks||[]));
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.delete('/promos/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM promos WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Teachers CRUD ──────────────────────────────────────
router.get('/teachers', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM teachers ORDER BY sort_order ASC, id DESC').all();
  res.json(rows);
});

router.post('/teachers', authMiddleware, (req, res) => {
  const { name, role, experience, description, photo } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM teachers').get().m || 0;
  const result = db.prepare(
    'INSERT INTO teachers (name, role, experience, description, photo, sort_order) VALUES (?,?,?,?,?,?)'
  ).run(name, role||'', experience||'', description||'', photo||'', maxOrder+1);
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.patch('/teachers/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['name','role','experience','description','photo','sort_order','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['sort_order','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE teachers SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.delete('/teachers/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM teachers WHERE id = ?').run(parseInt(req.params.id));
  res.json({ ok: true });
});

// ── Graduates CRUD ─────────────────────────────────────
router.get('/graduates', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM graduates ORDER BY sort_order ASC, id DESC').all();
  res.json(rows);
});

router.post('/graduates', authMiddleware, (req, res) => {
  const { name, course, year, quote, workplace, photo } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM graduates').get().m || 0;
  const result = db.prepare(
    'INSERT INTO graduates (name, course, year, quote, workplace, photo, sort_order) VALUES (?,?,?,?,?,?,?)'
  ).run(name, course||'', year||'', quote||'', workplace||'', photo||'', maxOrder+1);
  res.json({ ok: true, id: result.lastInsertRowid });
});

router.patch('/graduates/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const allowed = ['name','course','year','quote','workplace','photo','sort_order','visible'];
  const updates = [];
  const values = [];
  for (const [key, val] of Object.entries(req.body)) {
    if (allowed.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(['sort_order','visible'].includes(key) ? parseInt(val) : val);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'Нечего обновлять' });
  values.push(parseInt(id));
  db.prepare(`UPDATE graduates SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

router.delete('/graduates/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM graduates WHERE id = ?').run(parseInt(req.params.id));
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
  const teachersCount = db.prepare("SELECT COUNT(*) as c FROM teachers WHERE visible = 1").get().c;
  const graduatesCount = db.prepare("SELECT COUNT(*) as c FROM graduates WHERE visible = 1").get().c;

  res.json({ leadsToday, leadsWeek, leadsNew, leadsTotal, coursesActive, scheduleActive, blogPosts, teachersCount, graduatesCount });
});

export default router;
