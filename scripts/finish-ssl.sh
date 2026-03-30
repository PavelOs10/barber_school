#!/bin/bash
set -e

DOMAIN="barber-house.academy"
EMAIL="admin@barber-house.academy"
SERVER_IP="176.32.37.98"

echo "🔐 Получение SSL для ${DOMAIN}..."

# Проверка DNS
RESOLVED=$(dig +short ${DOMAIN} 2>/dev/null | head -1)
echo "DNS: ${DOMAIN} → ${RESOLVED}"

if [ "$RESOLVED" != "$SERVER_IP" ]; then
  echo "❌ DNS ещё не обновился. ${DOMAIN} → '${RESOLVED}', нужен '${SERVER_IP}'"
  echo "Подождите и попробуйте снова."
  exit 1
fi

certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.${DOMAIN}"

# Создаём директории если нет
mkdir -p /var/www/barber/uploads /var/www/barber/admin

# Обновляем nginx на SSL версию
cat > /etc/nginx/sites-available/barber << NGINXEOF
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
    location / { try_files \$uri \$uri/ /index.html; }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

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

nginx -t && systemctl reload nginx

(crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

echo ""
echo "✅ SSL установлен!"
echo "🌐 https://${DOMAIN}"
echo "🔧 Админка: https://${DOMAIN}/admin/"
echo "📊 CRM: http://${SERVER_IP}"
