#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════
#  BARBER HOUSE — Полный деплой на VPS
#  Запуск: sudo bash deploy.sh
#
#  Предварительно:
#  1. Залейте проект в /opt/barber-project/
#  2. Настройте /opt/barber-project/backend/.env
#  3. SSL должен быть уже настроен (setup-ssl.sh / finish-ssl.sh)
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/opt/barber-project"
FRONTEND_DIR="${PROJECT_DIR}/frontend"
BACKEND_DIR="${PROJECT_DIR}/backend"
WEB_ROOT="/var/www/barber/dist"
UPLOADS_DIR="/var/www/barber/uploads"
ADMIN_DIR="/var/www/barber/admin"
DOMAIN="barber-house.academy"
SERVER_IP="176.32.37.98"

echo "🚀 Деплой BARBER HOUSE"
echo ""

# ── 1. Проверки ─────────────────────────────────────────
if [ ! -f "${BACKEND_DIR}/.env" ]; then
  echo "❌ Файл ${BACKEND_DIR}/.env не найден!"
  echo "   Скопируйте .env.example → .env и заполните"
  exit 1
fi

# ── 2. Установка Node.js (если нет) ────────────────────
if ! command -v node &> /dev/null; then
  echo "📦 Установка Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "📦 Node.js: $(node -v)"

# ── 3. Создание директорий ─────────────────────────────
echo "📁 Создание директорий..."
mkdir -p "$WEB_ROOT"
mkdir -p "$UPLOADS_DIR"
mkdir -p "$ADMIN_DIR"
echo "   ✅ /var/www/barber/{dist,uploads,admin}"

# ── 4. Скачивание шрифтов и изображений ────────────────
echo "📸 Скачивание шрифтов и изображений..."
cd "$PROJECT_DIR"
bash scripts/download-fonts.sh 2>/dev/null || echo "   ⚠️  Шрифты не скачаны (проверьте интернет)"
bash scripts/download-images.sh 2>/dev/null || echo "   ⚠️  Изображения не скачаны (проверьте интернет)"

# ── 5. Сборка фронтенда ────────────────────────────────
echo "🔨 Сборка фронтенда..."
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps
npm run build

# Копируем билд в web root
rm -rf "${WEB_ROOT:?}/"*
cp -r dist/* "$WEB_ROOT/"
echo "   ✅ Фронтенд → $WEB_ROOT"

# ── 6. Копируем админку ────────────────────────────────
rm -rf "${ADMIN_DIR:?}/"*
cp -r "${PROJECT_DIR}/admin/"* "$ADMIN_DIR/"
echo "   ✅ Админка → $ADMIN_DIR"

# ── 7. Установка зависимостей бэкенда ──────────────────
echo "📦 Бэкенд: npm install..."
cd "$BACKEND_DIR"
npm install

# ── 8. Nginx конфиг ────────────────────────────────────
echo "⚙️  Настройка nginx..."

# Проверяем наличие SSL
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  SSL_ENABLED=1
  echo "   🔐 SSL сертификат найден"
else
  SSL_ENABLED=0
  echo "   ⚠️  SSL не найден, настраиваем HTTP"
fi

if [ "$SSL_ENABLED" = "1" ]; then
cat > /etc/nginx/sites-available/barber << NGINXEOF
# ══ barber-house.academy — Школа барберинга ══
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /.well-known/acme-challenge/ { root /var/www/certbot; allow all; }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    add_header Strict-Transport-Security "max-age=63072000" always;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 256;

    client_max_body_size 10m;

    root /var/www/barber/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 30s;
        client_max_body_size 10m;
    }

    # Uploaded images
    location /uploads/ {
        alias /var/www/barber/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # Admin panel
    location /admin/ {
        alias /var/www/barber/admin/;
        index index.html;
        try_files \$uri \$uri/ /admin/index.html;
    }

    # SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# ══ CRM — доступ по IP ══
server {
    listen 80 default_server;
    server_name ${SERVER_IP} _;
    location /.well-known/acme-challenge/ { root /var/www/certbot; allow all; }
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
NGINXEOF

else
# ─── Без SSL ───
cat > /etc/nginx/sites-available/barber << NGINXEOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /.well-known/acme-challenge/ { root /var/www/certbot; allow all; }

    client_max_body_size 10m;

    root /var/www/barber/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        client_max_body_size 10m;
    }

    location /uploads/ {
        alias /var/www/barber/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    location /admin/ {
        alias /var/www/barber/admin/;
        index index.html;
        try_files \$uri \$uri/ /admin/index.html;
    }

    location / { try_files \$uri \$uri/ /index.html; }
}

server {
    listen 80 default_server;
    server_name ${SERVER_IP} _;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
NGINXEOF
fi

ln -sf /etc/nginx/sites-available/barber /etc/nginx/sites-enabled/barber
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo "   ✅ Nginx настроен"

# ── 9. Systemd сервис ──────────────────────────────────
echo "⚙️  Настройка systemd..."
cat > /etc/systemd/system/barber-api.service << EOF
[Unit]
Description=Barber House API
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
sleep 3
if systemctl is-active --quiet barber-api; then
  echo "   ✅ API запущен"
else
  echo "   ❌ Ошибка! Логи: journalctl -u barber-api -n 30"
  exit 1
fi

# ── 10. Права на файлы ─────────────────────────────────
echo "🔒 Настройка прав..."
chmod -R 755 /var/www/barber/
chmod -R 755 "$UPLOADS_DIR"
echo "   ✅ Права установлены"

# ── 11. Проверки ───────────────────────────────────────
echo ""
echo "🔍 Проверки..."

# API health
HEALTH=$(curl -s http://127.0.0.1:3100/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "   ✅ API: $HEALTH"
else
  echo "   ⚠️  API не отвечает"
fi

# Nginx
if nginx -t 2>/dev/null; then
  echo "   ✅ Nginx конфиг валиден"
fi

# Uploads dir
if [ -d "$UPLOADS_DIR" ]; then
  UPLOAD_COUNT=$(ls "$UPLOADS_DIR" 2>/dev/null | wc -l)
  echo "   ✅ Uploads: ${UPLOAD_COUNT} файл(ов) в $UPLOADS_DIR"
fi

# ── ИТОГ ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ ДЕПЛОЙ ЗАВЕРШЁН!"
echo "═══════════════════════════════════════════════════════"
echo ""
if [ "$SSL_ENABLED" = "1" ]; then
  echo "  🌐 Сайт:    https://${DOMAIN}"
else
  echo "  🌐 Сайт:    http://${DOMAIN} (без SSL)"
fi
echo "  🔧 Админка:  https://${DOMAIN}/admin/"
echo "  📊 CRM:      http://${SERVER_IP}"
echo "  📂 Uploads:  ${UPLOADS_DIR}"
echo ""
echo "  📋 Команды:"
echo "  journalctl -u barber-api -f      — логи"
echo "  systemctl restart barber-api     — рестарт API"
echo "  nginx -t && systemctl reload nginx — рестарт nginx"
echo ""
