import express from 'express';
import cors from 'cors';
import db from './db.js';
import { notifyLead } from './bot.js';

const app = express();

app.use(cors({ origin: process.env.SITE_URL || '*' }));
app.use(express.json());

// ── Public API ──────────────────────────────────────────

// Courses
app.get('/api/courses', (req, res) => {
  const rows = db.prepare('SELECT * FROM courses WHERE visible = 1 ORDER BY sort_order ASC').all();
  res.json(rows.map(r => ({
    ...r,
    program: JSON.parse(r.program || '[]'),
    perks: JSON.parse(r.perks || '[]'),
  })));
});

// Schedule
app.get('/api/schedule', (req, res) => {
  const rows = db.prepare('SELECT * FROM schedule WHERE visible = 1 ORDER BY id ASC').all();
  res.json(rows);
});

// Model days
app.get('/api/model-days', (req, res) => {
  const rows = db.prepare('SELECT * FROM model_days WHERE visible = 1 ORDER BY id ASC').all();
  res.json(rows);
});

// Promos
app.get('/api/promos', (req, res) => {
  const rows = db.prepare('SELECT * FROM promos WHERE visible = 1 ORDER BY start_date ASC').all();
  res.json(rows.map(r => ({
    ...r,
    perks: JSON.parse(r.perks || '[]'),
  })));
});

// Settings (public ones)
app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  res.json(obj);
});

// Blog posts (public)
app.get('/api/blog', (req, res) => {
  const rows = db.prepare('SELECT * FROM blog_posts WHERE visible = 1 ORDER BY created_at DESC').all();
  res.json(rows);
});

// ── Lead submission ─────────────────────────────────────

app.post('/api/lead', async (req, res) => {
  try {
    const { type, name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    const result = db.prepare(
      'INSERT INTO leads (type, name, phone, message) VALUES (?, ?, ?, ?)'
    ).run(type || 'general', name, phone, message || '');

    // Notify admin via Telegram (non-blocking — don't wait)
    notifyLead({ id: result.lastInsertRowid, type: type || 'general', name, phone, message })
      .catch(err => console.error('TG notify failed:', err.message));

    // Auto-decrement spots if model day booking
    if (type === 'model' && req.body.modelDayId) {
      db.prepare('UPDATE model_days SET spots = MAX(spots - 1, 0) WHERE id = ?').run(req.body.modelDayId);
    }

    res.json({ ok: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Lead error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── Health check ────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default app;
