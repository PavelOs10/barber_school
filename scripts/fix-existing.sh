#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════
#  BARBER HOUSE — Быстрый фикс для работающего сервера
#  Исправляет проблему с изображениями
#  Запуск: sudo bash scripts/fix-existing.sh
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/opt/barber-project"
BACKEND_DIR="${PROJECT_DIR}/backend"
UPLOADS_SRC="${PROJECT_DIR}/uploads"
UPLOADS_DST="/var/www/barber/uploads"

echo "🔧 Фикс загруженных изображений"
echo ""

# ── 1. Создаём /var/www/barber/uploads/ ────────────────
echo "📁 [1/5] Создание директории uploads..."
mkdir -p "$UPLOADS_DST"

# Если были файлы в старой директории — копируем
if [ -d "$UPLOADS_SRC" ] && [ "$(ls -A $UPLOADS_SRC 2>/dev/null)" ]; then
  echo "   Копирование файлов из $UPLOADS_SRC → $UPLOADS_DST ..."
  cp -n "${UPLOADS_SRC}/"* "$UPLOADS_DST/" 2>/dev/null || true
  COPIED=$(ls "$UPLOADS_DST" | wc -l)
  echo "   ✅ ${COPIED} файл(ов) в $UPLOADS_DST"
else
  echo "   ℹ️  Старая директория пуста или не существует"
fi

# ── 2. Права ───────────────────────────────────────────
echo "🔒 [2/5] Права доступа..."
chmod -R 755 /var/www/barber/
echo "   ✅ OK"

# ── 3. Обновляем пути /images/ → /uploads/ в БД ───────
echo "📝 [3/5] Обновление путей в БД..."
DB_PATH="${BACKEND_DIR}/data.db"
if [ -f "$DB_PATH" ]; then
  # Обновляем blog_posts.img
  sqlite3 "$DB_PATH" "UPDATE blog_posts SET img = REPLACE(img, '/images/', '/uploads/') WHERE img LIKE '/images/%';" 2>/dev/null && \
    echo "   ✅ blog_posts обновлены" || echo "   ⚠️  sqlite3 не найден, обновите вручную"
else
  echo "   ℹ️  БД не найдена (при перезапуске API создастся заново)"
fi

# ── 4. Перезапуск API ──────────────────────────────────
echo "🔄 [4/5] Перезапуск API..."
systemctl restart barber-api 2>/dev/null || echo "   ⚠️  barber-api сервис не найден"
sleep 2
if systemctl is-active --quiet barber-api 2>/dev/null; then
  echo "   ✅ API запущен"
else
  echo "   ⚠️  Проверьте: journalctl -u barber-api -n 20"
fi

# ── 5. Перезагрузка nginx ──────────────────────────────
echo "🔄 [5/5] Перезагрузка nginx..."
nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null && \
  echo "   ✅ Nginx перезагружен" || echo "   ⚠️  Проверьте конфиг: nginx -t"

# ── Проверки ───────────────────────────────────────────
echo ""
echo "🔍 Проверки:"

# Uploads
UPLOAD_COUNT=$(ls "$UPLOADS_DST" 2>/dev/null | wc -l)
echo "   📂 Uploads: ${UPLOAD_COUNT} файл(ов)"

# API
HEALTH=$(curl -s http://127.0.0.1:3100/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "   ✅ API работает"
else
  echo "   ⚠️  API не отвечает"
fi

# Test image
FIRST_IMG=$(ls "$UPLOADS_DST" 2>/dev/null | head -1)
if [ -n "$FIRST_IMG" ]; then
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1/uploads/${FIRST_IMG}" -H "Host: barber-house.academy" 2>/dev/null || echo "000")
  if [ "$CODE" = "200" ]; then
    echo "   ✅ Nginx отдаёт изображения (HTTP $CODE)"
  else
    echo "   ⚠️  Nginx возвращает HTTP $CODE для /uploads/${FIRST_IMG}"
    echo "      Проверьте location /uploads/ в nginx конфиге"
  fi
fi

echo ""
echo "✅ Фикс завершён!"
echo ""
echo "Если изображения всё ещё не работают, проверьте nginx конфиг:"
echo "   cat /etc/nginx/sites-available/barber | grep -A3 'uploads'"
echo ""
echo "Должен быть блок:"
echo '   location /uploads/ {'
echo '       alias /var/www/barber/uploads/;'
echo '   }'
echo ""
