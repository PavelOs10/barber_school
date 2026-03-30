# BARBER HOUSE — Школа барберинга (Воронеж)

## Структура проекта

```
barber-project/
├── frontend/          # React + Vite + Tailwind (фронтенд)
│   └── public/        # Локальные шрифты и изображения
│       ├── fonts/     # Bebas Neue, Inter (скачать через скрипт)
│       └── images/    # Фото (скачать через скрипт)
├── backend/           # Node.js + Express + SQLite
│   ├── server.js      # Точка входа
│   ├── api.js         # Публичный REST API
│   ├── admin-api.js   # Админ API (JWT-авторизация + загрузка изображений)
│   ├── bot.js         # Telegram-бот (опциональный)
│   ├── db.js          # SQLite база + сиды
│   └── .env.example   # Шаблон переменных окружения
├── admin/             # Веб-админка (отдельный HTML)
│   └── index.html     # SPA-панель управления
├── nginx/             # Конфиг nginx (справочный)
├── scripts/
│   ├── full-setup.sh      # Полная установка с нуля
│   ├── deploy.sh          # Обновление / переразвёртка
│   ├── download-fonts.sh  # Скачивание шрифтов локально
│   ├── download-images.sh # Скачивание Unsplash-фото локально
│   ├── setup-ssl.sh       # Установка SSL (Let's Encrypt)
│   └── finish-ssl.sh      # Завершение SSL (если DNS был не готов)
└── README.md
```

## Пути на сервере

| Что | Путь |
|-----|------|
| Проект | `/opt/barber-project/` |
| Фронтенд (билд) | `/var/www/barber/dist/` |
| Админка | `/var/www/barber/admin/` |
| Загруженные изображения | `/var/www/barber/uploads/` |
| Nginx конфиг | `/etc/nginx/sites-available/barber` |
| Systemd сервис | `/etc/systemd/system/barber-api.service` |
| SQLite база | `/opt/barber-project/backend/data.db` |

## Быстрый старт (локально)

```bash
# 1. Бэкенд
cd backend
cp .env.example .env
# Заполните ADMIN_PASSWORD в .env
npm install
node server.js

# 2. Фронтенд (в другом терминале)
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Сайт: http://localhost:5173 | API: http://localhost:3100 | Админка: http://localhost:5173/admin/

## Деплой на VPS

### Первая установка

```bash
# 1. Загрузите проект на сервер
scp -r barber-project/ root@176.32.37.98:/opt/

# 2. Настройте .env
ssh root@176.32.37.98
cp /opt/barber-project/backend/.env.example /opt/barber-project/backend/.env
nano /opt/barber-project/backend/.env
# → ADMIN_PASSWORD=ваш_пароль
# → JWT_SECRET=сгенерируйте: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Полная установка (nginx, SSL, сборка, запуск)
cd /opt/barber-project
sudo bash scripts/full-setup.sh
```

### Обновление через git pull

```bash
ssh root@176.32.37.98
cd /opt/barber-project
git pull

# Переразвёртка
sudo bash scripts/deploy.sh
```

### Ручное обновление отдельных частей

```bash
cd /opt/barber-project

# Только фронтенд
cd frontend && npm run build && cp -r dist/* /var/www/barber/dist/

# Только админка
cp -r admin/* /var/www/barber/admin/

# Только бэкенд
systemctl restart barber-api

# Только nginx
nginx -t && systemctl reload nginx
```

## Веб-админка

Доступна: `https://barber-house.academy/admin/`

### Возможности

- **Дашборд** — статистика заявок
- **Заявки** — просмотр, фильтрация, смена статуса
- **Курсы** — полный CRUD
- **Расписание** — потоки обучения
- **Дни моделей** — расписание для моделей
- **Акции** — с фоновыми изображениями
- **Преподаватели** — с фото
- **Выпускники** — с фото и отзывами
- **Блог** — статьи с изображениями
- **Настройки** — контакты, соцсети

### Загрузка изображений

Изображения загружаются через админку в base64, сохраняются в `/var/www/barber/uploads/` и отдаются nginx по URL `/uploads/имя-файла.jpg`. Бэкенд проверяет размеры и формат (JPEG, PNG, WebP).

## API эндпоинты

### Публичные
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/courses` | Список курсов |
| GET | `/api/schedule` | Расписание |
| GET | `/api/model-days` | Дни для моделей |
| GET | `/api/promos` | Акции |
| GET | `/api/settings` | Настройки (контакты) |
| GET | `/api/blog` | Статьи блога |
| GET | `/api/teachers` | Преподаватели |
| GET | `/api/graduates` | Выпускники |
| POST | `/api/lead` | Отправка заявки |
| GET | `/api/health` | Проверка здоровья |

### Админские (Bearer-токен)
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/admin/login` | Авторизация |
| POST | `/api/admin/upload` | Загрузка изображения |
| GET | `/api/admin/stats` | Статистика |
| CRUD | `/api/admin/leads/:id` | Заявки |
| CRUD | `/api/admin/courses/:id` | Курсы |
| CRUD | `/api/admin/schedule/:id` | Расписание |
| CRUD | `/api/admin/model-days/:id` | Дни моделей |
| CRUD | `/api/admin/promos/:id` | Акции |
| CRUD | `/api/admin/teachers/:id` | Преподаватели |
| CRUD | `/api/admin/graduates/:id` | Выпускники |
| CRUD | `/api/admin/blog/:id` | Блог |
| GET/PATCH | `/api/admin/settings` | Настройки |

## Решение проблем

### Картинки не отображаются
1. Проверьте что `/var/www/barber/uploads/` существует и содержит файлы
2. Проверьте nginx: `curl -I https://barber-house.academy/uploads/имя-файла.jpg`
3. Проверьте права: `chmod -R 755 /var/www/barber/uploads/`
4. Если в БД остались старые пути `/images/...`, обновите их на `/uploads/...`

### API не отвечает
```bash
systemctl status barber-api
journalctl -u barber-api -n 50
```

### Nginx ошибки
```bash
nginx -t                          # проверка конфига
cat /var/log/nginx/error.log      # логи ошибок
```

## Порты

- **3100** — Barber House API
- **8080** — CRM (Docker)
- **80/443** — Nginx (проксирование всего)
