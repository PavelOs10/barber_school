# BARBER HOUSE — Школа барберинга (Воронеж)

## Структура проекта

```
barber-project/
├── frontend/          # React + Vite + Tailwind (фронтенд)
├── backend/           # Node.js + Express + SQLite + Telegram Bot
│   ├── server.js      # Точка входа
│   ├── api.js         # REST API
│   ├── bot.js         # Telegram-бот для управления
│   ├── db.js          # SQLite база + сиды
│   └── .env.example   # Шаблон переменных окружения
├── nginx/             # Конфиг nginx (справочный)
├── scripts/
│   ├── setup-ssl.sh   # Установка SSL (Let's Encrypt)
│   └── deploy.sh      # Полный деплой на VPS
└── README.md
```

## Быстрый старт (локально)

```bash
# 1. Бэкенд
cd backend
cp .env.example .env
# Заполните BOT_TOKEN и ADMIN_CHAT_ID в .env
npm install
npm run dev

# 2. Фронтенд (в другом терминале)
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Сайт откроется на http://localhost:5173, API на http://localhost:3100

## Деплой на VPS

### Требования
- Ubuntu 22+ / Debian 12+
- Домен, направленный на IP сервера (A-запись в reg.ru)
- На сервере уже есть сервис на порту 3000 (не конфликтует — наш API на 3100)

### Шаги

```bash
# 1. Загрузите проект на сервер
scp -r barber-project/ root@YOUR_SERVER_IP:/opt/

# 2. Настройте .env
ssh root@YOUR_SERVER_IP
cp /opt/barber-project/backend/.env.example /opt/barber-project/backend/.env
nano /opt/barber-project/backend/.env
# → Вставьте BOT_TOKEN и ADMIN_CHAT_ID

# 3. Установите SSL
cd /opt/barber-project/scripts
bash setup-ssl.sh yourdomain.ru your@email.com

# 4. Деплой
bash deploy.sh
```

## Telegram-бот — управление сайтом

После настройки бота (@BotFather → /newbot) отправьте `/start` в чат с ботом.

### Основные команды

| Команда | Описание |
|---------|----------|
| `/courses` | Список курсов |
| `/schedule` | Расписание потоков |
| `/models` | Дни для моделей |
| `/promos` | Сезонные акции |
| `/leads` | Новые заявки |
| `/spots 1 5` | Изменить кол-во мест (поток #1 → 5 мест) |
| `/spots_course 2 3` | Изменить места у курса |
| `/spots_model 3 4` | Изменить места для моделей |
| `/hot 1` | Вкл/выкл 🔥 у потока |
| `/hide schedule 1` | Скрыть поток #1 |
| `/show schedule 1` | Показать обратно |
| `/add_schedule ...` | Добавить поток |
| `/add_model ...` | Добавить день моделей |
| `/add_promo ...` | Добавить акцию |
| `/edit_schedule 1 price 50 000 ₽` | Редактировать поле |
| `/settings` | Контакты и настройки |
| `/set whatsapp_phone 79001234567` | Изменить настройку |
| `/lead_status 5 contacted` | Сменить статус заявки |
| `/delete schedule 3` | Удалить запись |
| `/help` | Полная справка |

### Уведомления о заявках

При каждой заявке с сайта бот присылает уведомление с данными клиента и кнопкой для смены статуса.

## API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/courses` | Список курсов |
| GET | `/api/schedule` | Расписание |
| GET | `/api/model-days` | Дни для моделей |
| GET | `/api/promos` | Акции |
| GET | `/api/settings` | Настройки (контакты) |
| POST | `/api/lead` | Отправка заявки |
| GET | `/api/health` | Проверка здоровья |

## Порты

- **3000** — ваша CRM (уже занят)
- **3100** — Barber House API + Telegram Bot
- **80/443** — Nginx (фронтенд + проксирование API)
