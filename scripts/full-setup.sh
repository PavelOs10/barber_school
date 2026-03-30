#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════
#  BARBER HOUSE — Полная установка
#  Домен: barber-house.academy
#  IP: 176.32.37.98
#  CRM остаётся на :8080, новый сайт на домене через nginx
# ═══════════════════════════════════════════════════════════

DOMAIN="barber-house.academy"
EMAIL="admin@barber-house.academy"
SERVER_IP="176.32.37.98"
CRM_DIR="/opt/barber-crm-app"
PROJECT_DIR="/opt/barber-project"

echo "═══════════════════════════════════════════════════════"
echo "  🚀 BARBER HOUSE — Полная установка"
echo "  🌐 Домен: $DOMAIN"
echo "  📦 CRM порт: 80 → 8080"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── 1. Переводим CRM Docker с порта 80 на 8080 ─────────
echo "📦 [1/8] Перенастройка CRM Docker (80 → 8080)..."

# Бэкап
cp "${CRM_DIR}/docker-compose.yml" "${CRM_DIR}/docker-compose.yml.bak"

# Меняем порт
sed -i 's/"80:80"/"8080:80"/' "${CRM_DIR}/docker-compose.yml"

# Перезапускаем CRM контейнеры
cd "$CRM_DIR"
docker compose down
docker compose up -d

# Ждём запуска
echo "   Ждём запуска CRM..."
sleep 10

# Проверяем
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080 | grep -qE "200|301|302"; then
  echo "   ✅ CRM работает на порту 8080"
else
  echo "   ⚠️  CRM может ещё запускаться, проверим позже"
fi

# ── 2. Установка Node.js ───────────────────────────────
echo ""
echo "📦 [2/8] Установка Node.js..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
echo "   ✅ Node.js $(node -v)"

# ── 3. Установка nginx + certbot ───────────────────────
echo ""
echo "📦 [3/8] Установка nginx + certbot..."
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx
mkdir -p /var/www/certbot /var/www/barber/dist /var/www/barber/uploads /var/www/barber/admin

# ── 4. Временный nginx конфиг (HTTP only, для certbot) ──
echo ""
echo "⚙️  [4/8] Настройка nginx (временный HTTP)..."

cat > /etc/nginx/sites-available/barber << NGINXEOF
# Временный конфиг для получения SSL
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 200 'Barber House — настройка SSL...';
        add_header Content-Type text/plain;
    }
}

# CRM — доступ по IP (без домена)
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

ln -sf /etc/nginx/sites-available/barber /etc/nginx/sites-enabled/barber
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl start nginx 2>/dev/null || systemctl reload nginx
systemctl enable nginx
echo "   ✅ Nginx запущен"

# Проверяем что CRM доступна через nginx
echo "   Проверка CRM через nginx (http://${SERVER_IP})..."
CRM_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1" -H "Host: ${SERVER_IP}" 2>/dev/null || echo "000")
echo "   CRM ответ: HTTP ${CRM_CODE}"

# ── 5. Получение SSL сертификата ────────────────────────
echo ""
echo "🔐 [5/8] Получение SSL сертификата..."
echo "   Проверяем DNS..."
RESOLVED_IP=$(dig +short ${DOMAIN} 2>/dev/null | head -1)
echo "   ${DOMAIN} → ${RESOLVED_IP:-НЕ НАЙДЕН}"

if [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
  echo ""
  echo "   ⚠️  DNS ещё не обновился!"
  echo "   ${DOMAIN} резолвится в '${RESOLVED_IP}' вместо '${SERVER_IP}'"
  echo ""
  echo "   Варианты:"
  echo "   1. Подождать 5-30 минут и запустить скрипт заново"
  echo "   2. Продолжить без SSL (сайт будет на HTTP)"
  echo ""
  read -p "   Попробовать получить сертификат всё равно? (y/n): " TRY_SSL
  if [ "$TRY_SSL" != "y" ]; then
    echo "   Пропускаем SSL. Запустите позже:"
    echo "   bash /opt/barber-project/scripts/finish-ssl.sh"
    SKIP_SSL=1
  fi
fi

if [ "${SKIP_SSL:-0}" != "1" ]; then
  certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.${DOMAIN}" && SSL_OK=1 || SSL_OK=0

  if [ "$SSL_OK" = "1" ]; then
    echo "   ✅ SSL сертификат получен!"
  else
    echo "   ❌ SSL не получен. DNS может ещё не обновился."
    echo "   Запустите позже: bash /opt/barber-project/scripts/finish-ssl.sh"
    SKIP_SSL=1
  fi
fi

# ── 6. Финальный nginx конфиг ───────────────────────────
echo ""
echo "⚙️  [6/8] Финальный nginx конфиг..."

if [ "${SKIP_SSL:-0}" != "1" ]; then
# ─── С SSL ───
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
    location ^~ /uploads/ {
        alias /var/www/barber/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # Admin panel
    location ^~ /admin/ {
        alias /var/www/barber/admin/;
        index index.html;
        try_files \$uri \$uri/ /admin/index.html;
    }

    # SPA fallback
    location / { try_files \$uri \$uri/ /index.html; }

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

  # Автообновление сертификата
  (crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

else
# ─── Без SSL (временно) ───
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

    location ^~ /uploads/ {
        alias /var/www/barber/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    location ^~ /admin/ {
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

nginx -t && systemctl reload nginx
echo "   ✅ Nginx настроен"

# ── 7. Сборка и деплой фронтенда ───────────────────────
echo ""
echo "🔨 [7/8] Сборка фронтенда..."
cd "${PROJECT_DIR}/frontend"
npm install --legacy-peer-deps 2>&1 | tail -3
npm run build 2>&1 | tail -5

mkdir -p /var/www/barber/dist
rm -rf /var/www/barber/dist/*
cp -r dist/* /var/www/barber/dist/
echo "   ✅ Фронтенд собран → /var/www/barber/dist/"

# Копируем админку
rm -rf /var/www/barber/admin/*
cp -r "${PROJECT_DIR}/admin/"* /var/www/barber/admin/
echo "   ✅ Админка → /var/www/barber/admin/"

# ── 8. Запуск бэкенда ──────────────────────────────────
echo ""
echo "🤖 [8/8] Запуск бэкенда..."
cd "${PROJECT_DIR}/backend"

if [ ! -f .env ]; then
  echo "   ❌ Файл .env не найден!"
  echo "   Скопируйте: cp .env.example .env && nano .env"
  exit 1
fi

npm install 2>&1 | tail -3

cat > /etc/systemd/system/barber-api.service << EOF
[Unit]
Description=Barber House API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${PROJECT_DIR}/backend
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

sleep 3
if systemctl is-active --quiet barber-api; then
  echo "   ✅ API запущен"
else
  echo "   ⚠️  Проверьте: journalctl -u barber-api -n 30"
fi

# ── Права на файлы ─────────────────────────────────────
chmod -R 755 /var/www/barber/

# ── Проверка API ───────────────────────────────────────
HEALTH=$(curl -s http://127.0.0.1:3100/api/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
  echo "   ✅ API отвечает: $HEALTH"
else
  echo "   ⚠️  API пока не отвечает"
fi

# ── ИТОГ ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo "═══════════════════════════════════════════════════════"
echo ""
if [ "${SKIP_SSL:-0}" != "1" ]; then
  echo "  🌐 Сайт:    https://${DOMAIN}"
else
  echo "  🌐 Сайт:    http://${DOMAIN} (без SSL)"
  echo "  🔐 SSL:     запустите finish-ssl.sh когда DNS обновится"
fi
echo "  🔧 Админка:  https://${DOMAIN}/admin/"
echo "  📊 CRM:      http://${SERVER_IP}"
echo "  📂 Uploads:  /var/www/barber/uploads/"
echo ""
echo "  📋 Полезные команды:"
echo "  journalctl -u barber-api -f     — логи"
echo "  systemctl restart barber-api    — перезапуск"
echo "  nginx -t && systemctl reload nginx"
echo ""
