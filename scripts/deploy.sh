#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════
#  BARBER HOUSE — Полный деплой на VPS
#  Запуск: sudo bash deploy.sh
#
#  Предварительно:
#  1. Залейте проект в /opt/barber-project/
#  2. Настройте /opt/barber-project/backend/.env
#  3. Запустите setup-ssl.sh для получения сертификата
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/opt/barber-project"
FRONTEND_DIR="${PROJECT_DIR}/frontend"
BACKEND_DIR="${PROJECT_DIR}/backend"
WEB_ROOT="/var/www/barber/dist"

echo "🚀 Деплой BARBER HOUSE"
echo ""

# ── 1. Проверки ─────────────────────────────────────────
if [ ! -f "${BACKEND_DIR}/.env" ]; then
  echo "❌ Файл ${BACKEND_DIR}/.env не найден!"
  echo "   Скопируйте .env.example → .env и заполните BOT_TOKEN и ADMIN_CHAT_ID"
  exit 1
fi

# ── 2. Установка Node.js (если нет) ────────────────────
if ! command -v node &> /dev/null; then
  echo "📦 Установка Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "📦 Node.js: $(node -v)"

# ── 3. Скачивание локальных ресурсов ──────────────────
echo "📸 Скачивание шрифтов и изображений..."
cd "$PROJECT_DIR"
bash scripts/download-fonts.sh 2>/dev/null || echo "⚠️  Не удалось скачать шрифты (проверьте интернет)"
bash scripts/download-images.sh 2>/dev/null || echo "⚠️  Не удалось скачать изображения (проверьте интернет)"

# ── 4. Сборка фронтенда ────────────────────────────────
echo "🔨 Сборка фронтенда..."
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps
npm run build

# Копируем билд в web root
mkdir -p "$WEB_ROOT"
rm -rf "${WEB_ROOT:?}/"*
cp -r dist/* "$WEB_ROOT/"
echo "✅ Фронтенд собран → $WEB_ROOT"

# ── 3.5. Копируем админку ─────────────────────────────
ADMIN_DIR="/var/www/barber/admin"
mkdir -p "$ADMIN_DIR"
cp -r "${PROJECT_DIR}/admin/"* "$ADMIN_DIR/"
echo "✅ Админка скопирована → $ADMIN_DIR"

# ── 4. Установка зависимостей бэкенда ──────────────────
echo "📦 Установка зависимостей бэкенда..."
cd "$BACKEND_DIR"
npm install

# ── 5. Systemd сервис для бэкенда ──────────────────────
echo "⚙️  Настройка systemd сервиса..."
cat > /etc/systemd/system/barber-api.service << EOF
[Unit]
Description=Barber House API + Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${BACKEND_DIR}
ExecStart=$(which node) server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable barber-api
systemctl restart barber-api

# Ждём запуска
sleep 2
if systemctl is-active --quiet barber-api; then
  echo "✅ API сервер запущен"
else
  echo "❌ Ошибка запуска API! Проверьте: journalctl -u barber-api -n 20"
  exit 1
fi

# ── 6. Перезагрузка nginx ───────────────────────────────
echo "🔄 Перезагрузка nginx..."
nginx -t && systemctl reload nginx
echo "✅ Nginx перезагружен"

# ── 7. Проверка ─────────────────────────────────────────
echo ""
echo "🔍 Проверка API..."
HEALTH=$(curl -s http://127.0.0.1:3100/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "✅ API работает: $HEALTH"
else
  echo "⚠️  API не отвечает. Проверьте: journalctl -u barber-api -n 30"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ ДЕПЛОЙ ЗАВЕРШЁН!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Полезные команды:"
echo "  📋 Логи API:     journalctl -u barber-api -f"
echo "  🔄 Рестарт API:  systemctl restart barber-api"
echo "  📊 Статус:       systemctl status barber-api"
echo "  🔧 Пересборка:   cd $FRONTEND_DIR && npm run build && cp -r dist/* $WEB_ROOT/"
echo ""
