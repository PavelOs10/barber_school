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
│   ├── admin-api.js   # Админ API (JWT-авторизация)
│   ├── bot.js         # Telegram-бот (опциональный)
│   ├── db.js          # SQLite база + сиды
│   └── .env.example   # Шаблон переменных окружения
├── admin/             # Веб-админка (отдельный HTML)
│   └── index.html     # SPA-панель управления
├── nginx/             # Конфиг nginx
├── scripts/
│   ├── deploy.sh          # Полный деплой на VPS
│   ├── download-fonts.sh  # Скачивание шрифтов локально
│   ├── download-images.sh # Скачивание Unsplash-фото локально
│   ├── setup-ssl.sh       # Установка SSL (Let's Encrypt)
│   └── finish-ssl.sh      # Завершение SSL
└── README.md
```

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

## Веб-админка

Доступна по адресу `https://ваш-домен.ru/admin/`

### Возможности

- **Дашборд** — статистика заявок (сегодня, за неделю, новые, всего)
- **Заявки** — просмотр, фильтрация по статусу, смена статуса, удаление
- **Расписание** — добавление, редактирование, удаление потоков, 🔥 и видимость
- **Курсы** — полный CRUD (все поля: название, цена, места, уровень, длительность и т.д.)
- **Дни моделей** — добавление, редактирование, удаление
- **Акции** — добавление, редактирование, удаление (праздник, скидка, промокод, даты)
- **Настройки** — телефон, email, адрес, часы работы, WhatsApp, Telegram

### Авторизация

Пароль задаётся в `.env` переменной `ADMIN_PASSWORD`. Токен действует 7 дней.

## Деплой на VPS

### Требования
- Ubuntu 22+ / Debian 12+
- Домен, направленный на IP сервера
- Node.js 20+

### Шаги

```bash
# 1. Загрузите проект на сервер
scp -r barber-project/ root@YOUR_SERVER_IP:/opt/

# 2. Настройте .env
ssh root@YOUR_SERVER_IP
cp /opt/barber-project/backend/.env.example /opt/barber-project/backend/.env
nano /opt/barber-project/backend/.env
# → Заполните:
#   ADMIN_PASSWORD=ваш_надёжный_пароль
#   JWT_SECRET=сгенерируйте: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
#   BOT_TOKEN (опционально, если нужен Telegram-бот)

# 3. Установите SSL
cd /opt/barber-project/scripts
bash setup-ssl.sh yourdomain.ru your@email.com

# 4. Деплой (скачает шрифты, картинки, соберёт фронтенд, запустит бэкенд)
bash deploy.sh
```

### Ручное обновление

```bash
cd /opt/barber-project

# Скачать шрифты и картинки (если ещё не скачаны)
bash scripts/download-fonts.sh
bash scripts/download-images.sh

# Пересобрать фронтенд
cd frontend && npm run build && cp -r dist/* /var/www/barber/dist/

# Обновить админку
cp -r admin/* /var/www/barber/admin/

# Перезапустить бэкенд
systemctl restart barber-api
```

## Решение проблем

### Картинки не загружаются
Причина: Unsplash и Google Fonts нестабильно работают из России.
Решение: запустите `bash scripts/download-images.sh` и `bash scripts/download-fonts.sh`, затем пересоберите фронтенд.

### Telegram-бот не работает
В России Telegram заблокирован на уровне серверов. Используйте веб-админку (`/admin/`) вместо бота.

## API эндпоинты

### Публичные
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/courses` | Список курсов |
| GET | `/api/schedule` | Расписание |
| GET | `/api/model-days` | Дни для моделей |
| GET | `/api/promos` | Акции |
| GET | `/api/settings` | Настройки (контакты) |
| POST | `/api/lead` | Отправка заявки |
| GET | `/api/health` | Проверка здоровья |

### Админские (требуют Bearer-токен)
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/admin/login` | Авторизация |
| GET | `/api/admin/stats` | Статистика |
| GET/PATCH/DELETE | `/api/admin/leads/:id` | Управление заявками |
| GET/POST/PATCH/DELETE | `/api/admin/schedule/:id` | Расписание |
| GET/POST/PATCH/DELETE | `/api/admin/courses/:id` | Курсы |
| GET/POST/PATCH/DELETE | `/api/admin/model-days/:id` | Дни моделей |
| GET/POST/PATCH/DELETE | `/api/admin/promos/:id` | Акции |
| GET/PATCH | `/api/admin/settings` | Настройки |

## Порты

- **3100** — Barber House API
- **80/443** — Nginx (фронтенд + проксирование API + админка)
