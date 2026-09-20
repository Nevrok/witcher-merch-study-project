# WitcherMerch 🐺

> **Учебный проект** интернет-магазина фан-мерча по вселенной «Ведьмака».

Full-stack приложение: backend на **ASP.NET Core 8** (Clean Architecture) и frontend на **Vite + Vanilla JS** с анимациями GSAP. Проект создан в учебных целях для демонстрации навыков full-stack разработки.

## Возможности

- 📦 Каталог товаров с категориями, страница товара с галереей, избранное (wishlist)
- 🛒 Корзина покупок и оформление заказа
- 👤 Регистрация и вход (JWT-аутентификация, обновление токена)
- 📋 История заказов пользователя
- 🌍 Мультиязычный интерфейс (i18n)
- ✨ Плавные анимации и параллакс-эффекты (GSAP)
- 📖 Автогенерируемая документация API (Swagger)
- 🌱 Автоматическое создание БД и наполнение тестовыми данными (23 товара в 4 категориях)

## Стек технологий

**Backend**
- ASP.NET Core 8 (Web API)
- Entity Framework Core + PostgreSQL (Npgsql)
- JWT Bearer аутентификация
- Serilog — логирование
- Swagger / Swashbuckle — документация API
- Архитектура: Domain / Application / Infrastructure / API (Clean Architecture)

**Frontend**
- Vite 5
- Vanilla JavaScript (без фреймворка, собственный роутер на хэшах)
- SCSS
- GSAP — анимации

## Структура проекта

```
witcher-merch/
├── backend/
│   ├── WitcherMerch.slnx
│   └── src/
│       ├── WitcherMerch.API/            # Контроллеры, middleware, конфигурация, точка входа
│       ├── WitcherMerch.Application/    # Сервисы, DTO, интерфейсы (бизнес-логика)
│       ├── WitcherMerch.Domain/         # Сущности, enum'ы
│       └── WitcherMerch.Infrastructure/ # EF Core, DbContext, SeedData, реализации сервисов
└── frontend/
    ├── index.html
    ├── vite.config.js                   # Dev-сервер :5173, прокси /api → :5117
    └── src/
        ├── pages/         # Home, Catalog, ProductDetail, Cart, Checkout, Auth, Orders, Wishlist
        ├── components/    # Header, Footer, ProductCard, CartDrawer, icons
        ├── animations/    # GSAP-анимации (scroll, parallax)
        ├── styles/        # SCSS-стили
        ├── router.js      # Простой hash-роутер
        ├── store.js       # Состояние приложения
        ├── i18n.js        # Переводы интерфейса
        └── api.js         # Обёртка для запросов к backend API
```

## Быстрый старт

### Требования

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- PostgreSQL — установленный локально **или** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. База данных (PostgreSQL)

**Вариант А — через Docker (проще всего):**

```bash
docker run -d --name witcher-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
```

**Вариант Б — локальная установка:** скачайте [PostgreSQL](https://www.postgresql.org/download/), запомните пароль пользователя `postgres` и порт (по умолчанию `5432`). Убедитесь, что служба запущена.

Создавать саму базу вручную **не нужно** — приложение создаст `WitcherMerchDb` при первом запуске.

### 2. Backend

1. Скопируйте шаблон конфигурации:

   ```bash
   cd backend/src/WitcherMerch.API
   cp appsettings.Example.json appsettings.json
   ```

   Для Windows (cmd / PowerShell): `copy appsettings.Example.json appsettings.json`

2. Откройте `appsettings.json` и укажите свои данные:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=12345;Database=WitcherMerchDb;Username=postgres;Password=ВАШ_ПАРОЛЬ"
     },
     "JwtSettings": {
       "Secret": "ваш_собственный_длинный_случайный_ключ_минимум_32_символа"
     }
   }
   ```

   > ⚠️ **Никогда не коммитьте `appsettings.json` с реальными паролями** — файл добавлен в `.gitignore`.

3. Запустите API из папки `backend`:

   ```bash
   cd backend
   dotnet run --project src/WitcherMerch.API/WitcherMerch.API.csproj
   ```

   При первом запуске БД создастся и заполнится тестовыми данными автоматически (`EnsureCreated()` + `SeedData`).

4. Swagger-документация: **http://localhost:5117/swagger**

### 3. Frontend

В **отдельном** окне терминала:

```bash
cd frontend
npm install
npm run dev
```

Откройте **http://localhost:5173**. Запросы к `/api` dev-сервер Vite автоматически проксирует на backend (`http://localhost:5117`).

> Backend и frontend нужно запускать **одновременно**. CORS настроен на `http://localhost:5173` и `http://127.0.0.1:5173`; при использовании другого порта поправьте `Program.cs` и `vite.config.js`.

## Возможные проблемы

| Ошибка | Причина и решение |
|---|---|
| `Не найдена строка подключения 'ConnectionStrings:DefaultConnection'` | Нет файла `appsettings.json`. Скопируйте его из `appsettings.Example.json` (шаг 2.1) |
| `'JwtSettings:Secret' не задан или короче 32 символов` | Задайте более длинный секретный ключ в `appsettings.json` |
| `Failed to connect to 127.0.0.1:5432` / `SocketException (10061)` | PostgreSQL не запущен или работает на другом порту. Запустите службу / контейнер, проверьте `Port=` в строке подключения |
| `password authentication failed` | Неверный пароль в `appsettings.json` |
| `"vite" не является внутренней или внешней командой` | Не установлены зависимости фронтенда — выполните `npm install` в папке `frontend` |
| Изменил ссылки на фото в `SeedData.cs`, а на сайте всё по-старому | `SeedData` срабатывает только при создании БД. Удалите базу `WitcherMerchDb` и перезапустите backend, либо поправьте данные в таблице `Products` |

## API

Основные группы эндпоинтов (`/api/...`):

| Контроллер | Методы | Описание |
|---|---|---|
| `Auth` | `POST /register`, `POST /login`, `POST /refresh` | Регистрация и аутентификация |
| `Products` | `GET /`, `GET /featured`, `GET /{slug}`, `GET /categories`, `POST`, `PUT /{id}`, `DELETE /{id}` | Товары и категории |
| `Cart` | `GET`, `POST`, `PUT /{itemId}`, `DELETE /{itemId}`, `DELETE` | Корзина пользователя |
| `Wishlist` | `GET`, `POST /{productId}`, `DELETE /{productId}`, `GET /{productId}/check` | Избранное |
| `Orders` | `POST`, `GET`, `GET /{orderId}`, `PUT /{orderId}/status` | Заказы |

Полное описание всех эндпоинтов доступно в Swagger UI после запуска backend.

## Известные ограничения

Это учебный проект, поэтому есть допущения, которые не стоит переносить в продакшн без доработки:

- Пароли и секретные ключи из примера конфига нужно заменить на собственные.
- Нет полноценной миграционной стратегии БД (используется `EnsureCreated`, а не EF-миграции).
- Изображения товаров подгружаются по внешним ссылкам, которые могут стать недоступны.

## Лицензия

Учебный проект. Все права на вселенную «Ведьмака» принадлежат CD Projekt RED / Анджею Сапковскому — используется исключительно в некоммерческих учебных целях.
