# KnittedToysShop - Магазин вязаных игрушек

Полнофункциональное веб-приложение для продажи вязаных игрушек с административной панелью для управления каталогом.

## 📋 Содержание

- [Обзор проекта](#обзор-проекта)
- [Архитектура](#архитектура)
- [Технологический стек](#технологический-стек)
- [Структура проекта](#структура-проекта)
- [Установка и запуск](#установка-и-запуск)
- [API Документация](#api-документация)
- [Фронтенд](#фронтенд)
- [Бэкенд](#бэкенд)
- [Развертывание](#развертывание)
- [Устранение неполадок](#устранение-неполадок)

---

## 🎯 Обзор проекта

**KnittedToysShop** — это веб-приложение для продажи вязаных игрушек, состоящее из:

- **Публичная часть**: Каталог игрушек для просмотра без авторизации
- **Административная панель**: Управление каталогом (CRUD операции) с JWT-аутентификацией
- **Интеграция с Telegram**: Покупка товаров ведет в Telegram-директ продавца

### Основные возможности

- ✅ Просмотр каталога игрушек без регистрации
- ✅ Детальная информация о каждой игрушке
- ✅ JWT-аутентификация для администраторов
- ✅ Полное управление каталогом (создание, редактирование, удаление)
- ✅ Защита админ-разделов
- ✅ Автоматический редирект при истечении токена

---

## 🏗 Архитектура

Проект построен по принципу **Clean Architecture** с разделением на слои:

```
┌─────────────────────────────────────┐
│      Presentation (API Layer)       │  ← Контроллеры, HTTP endpoints
├─────────────────────────────────────┤
│      Application (Business)         │  ← Сервисы, бизнес-логика
├─────────────────────────────────────┤
│      Domain (Entities)              │  ← Сущности, интерфейсы
├─────────────────────────────────────┤
│      Infrastructure (Data)         │  ← Репозитории, EF Core, БД
└─────────────────────────────────────┘
```

### Слои

1. **Domain** — доменные сущности (`Toy`, `User`)
2. **Application** — бизнес-логика и интерфейсы
3. **Infrastructure** — реализация репозиториев, работа с БД
4. **Presentation** — API контроллеры, конфигурация приложения

---

## 🛠 Технологический стек

### Backend

- **.NET 10.0** — платформа разработки
- **ASP.NET Core** — веб-фреймворк
- **Entity Framework Core** — ORM
- **PostgreSQL** — база данных
- **ASP.NET Core Identity** — система аутентификации
- **JWT Bearer** — токены для API
- **Swagger/OpenAPI** — документация API

### Frontend

- **Next.js 16** — React-фреймворк с App Router
- **TypeScript** — типизированный JavaScript
- **Tailwind CSS 4** — утилитарный CSS-фреймворк
- **Zustand** — управление состоянием
- **Axios** — HTTP-клиент

### DevOps

- **Docker** — контейнеризация
- **Docker Compose** — оркестрация контейнеров

---

## 📁 Структура проекта

```
KnittedToysShop/
├── Application/              # Слой бизнес-логики
│   ├── DTOs/                # Data Transfer Objects
│   ├── Interfaces/          # Интерфейсы репозиториев
│   └── Services/            # Сервисы приложения
│
├── Domain/                  # Доменный слой
│   └── Entities/           # Сущности (Toy, User)
│
├── Infrastructure/          # Слой инфраструктуры
│   ├── Migrations/         # Миграции БД
│   ├── Persistence/        # DbContext
│   └── Repositories/       # Реализация репозиториев
│
├── Presentation/           # Слой представления (API)
│   └── Controllers/        # API контроллеры
│
├── frontend/               # Next.js приложение
│   ├── src/
│   │   ├── app/           # App Router страницы
│   │   ├── components/    # React компоненты
│   │   ├── lib/          # Утилиты, API клиент
│   │   └── types/        # TypeScript типы
│   └── package.json
│
├── docker-compose.yml      # Docker Compose конфигурация
└── README.md              # Документация
```

---

## 🚀 Установка и запуск

### Предварительные требования

- [.NET SDK 10.0](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (или npm/yarn)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (для запуска БД)

### Шаг 1: Клонирование репозитория

```bash
git clone <repository-url>
cd KnittedToysShop
```

### Шаг 2: Настройка базы данных

Запустите PostgreSQL через Docker Compose:

```bash
docker-compose up -d db
```

Это создаст контейнер PostgreSQL с:

- Пользователь: `postgres`
- Пароль: `Giuhy56P` (измените в `docker-compose.yml` для продакшена)
- База данных: `KnittedToysDb`
- Порт: `5432`

### Шаг 3: Настройка бэкенда

1. Перейдите в папку `Presentation`:

```bash
cd Presentation
```

2. Настройте строку подключения в `appsettings.json` или через переменные окружения:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=KnittedToysDb;Username=postgres;Password=Giuhy56P"
  },
  "Jwt": {
    "Key": "your_secret_key_at_least_32_characters_long",
    "Issuer": "KnittedToysShop",
    "Audience": "KnittedToysShop"
  }
}
```

3. Примените миграции (выполняются автоматически при запуске):

```bash
dotnet ef database update --project ../Infrastructure --startup-project .
```

4. Запустите API:

```bash
dotnet run
```

API будет доступен по адресу: `http://localhost:5136` (или порт из конфигурации)

Swagger UI: `http://localhost:5136/swagger`

### Шаг 4: Настройка фронтенда

1. Перейдите в папку `frontend`:

```bash
cd ../frontend
```

2. Установите зависимости:

```bash
pnpm install
```

3. Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5136
```

4. Запустите dev-сервер:

```bash
pnpm dev
```

Фронтенд будет доступен по адресу: `http://localhost:3000`

### Шаг 5: Учетные данные администратора

По умолчанию создается администратор:

- **Логин**: `admin`
- **Пароль**: `Admin123!`

⚠️ **Важно**: Измените пароль в продакшене!

---

## 📡 API Документация

### Базовый URL

```
http://localhost:5136/api
```

### Аутентификация

Большинство эндпоинтов требуют JWT токен в заголовке:

```
Authorization: Bearer <token>
```

### Эндпоинты

#### 1. Аутентификация

##### POST `/api/Auth/login`

Вход администратора.

**Запрос:**

```json
{
  "userName": "admin",
  "password": "Admin123!"
}
```

**Ответ (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ошибки:**

- `401 Unauthorized` — неверные учетные данные

---

#### 2. Игрушки (Toys)

##### GET `/api/Toys`

Получить список всех игрушек.

**Авторизация:** Не требуется

**Ответ (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Вязаный медведь",
    "description": "Милый медвежонок из шерсти",
    "price": 500,
    "imageUrl": "https://example.com/bear.jpg"
  }
]
```

---

##### GET `/api/Toys/{id}`

Получить игрушку по ID.

**Авторизация:** Не требуется

**Параметры:**

- `id` (int) — ID игрушки

**Ответ (200 OK):**

```json
{
  "id": 1,
  "name": "Вязаный медведь",
  "description": "Милый медвежонок из шерсти",
  "price": 500,
  "imageUrl": "https://example.com/bear.jpg"
}
```

**Ошибки:**

- `404 Not Found` — игрушка не найдена

---

##### POST `/api/Toys`

Создать новую игрушку.

**Авторизация:** Требуется (роль Admin)

**Запрос:**

```json
{
  "name": "Вязаный заяц",
  "description": "Пушистый зайчик",
  "price": 400,
  "imageUrl": "https://example.com/bunny.jpg"
}
```

**Ответ (201 Created):**

```json
{
  "id": 2,
  "name": "Вязаный заяц",
  "description": "Пушистый зайчик",
  "price": 400,
  "imageUrl": "https://example.com/bunny.jpg"
}
```

**Ошибки:**

- `400 Bad Request` — неверные данные
- `401 Unauthorized` — отсутствует токен
- `403 Forbidden` — недостаточно прав

---

##### PUT `/api/Toys/{id}`

Обновить игрушку.

**Авторизация:** Требуется (роль Admin)

**Параметры:**

- `id` (int) — ID игрушки

**Запрос:**

```json
{
  "id": 2,
  "name": "Вязаный заяц (обновленный)",
  "description": "Пушистый зайчик с бантиком",
  "price": 450,
  "imageUrl": "https://example.com/bunny-updated.jpg"
}
```

**Ответ (204 No Content)**

**Ошибки:**

- `400 Bad Request` — неверные данные или несоответствие ID
- `404 Not Found` — игрушка не найдена
- `401 Unauthorized` — отсутствует токен
- `403 Forbidden` — недостаточно прав

---

##### DELETE `/api/Toys/{id}`

Удалить игрушку.

**Авторизация:** Требуется (роль Admin)

**Параметры:**

- `id` (int) — ID игрушки

**Ответ (204 No Content)**

**Ошибки:**

- `404 Not Found` — игрушка не найдена
- `401 Unauthorized` — отсутствует токен
- `403 Forbidden` — недостаточно прав

---

## 🎨 Фронтенд

### Структура

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница (каталог)
│   ├── toys/
│   │   └── [id]/page.tsx  # Страница игрушки
│   └── admin/
│       ├── layout.tsx      # Защита админ-разделов
│       ├── login/page.tsx # Страница входа
│       └── page.tsx       # Админ-панель (CRUD)
│
├── components/            # React компоненты
│   ├── AdminGuard.tsx    # Защита админ-страниц
│   ├── AdminToyForm.tsx  # Форма создания/редактирования
│   ├── Header.tsx        # Шапка сайта
│   ├── Footer.tsx        # Подвал
│   ├── ToyCard.tsx       # Карточка в каталоге
│   └── ToyDetail.tsx     # Детальная информация
│
├── lib/                  # Утилиты
│   ├── api.ts           # Axios клиент, API методы
│   └── auth-store.ts    # Zustand store для аутентификации
│
└── types/               # TypeScript типы
    └── toy.ts          # Интерфейсы Toy, ToyCreate
```

### Основные компоненты

#### AdminGuard

Компонент защиты админ-разделов. Проверяет наличие токена и выполняет редиректы:

- Неавторизованные пользователи → `/admin/login`
- Авторизованные на странице логина → `/admin`

**Исправление ошибки:** Редиректы теперь выполняются в `useEffect`, а не во время рендера.

#### auth-store (Zustand)

Управление состоянием аутентификации:

- `token` — JWT токен
- `hydrated` — флаг готовности (загрузка из localStorage)
- `hydrate()` — загрузка токена из localStorage
- `setToken()` — установка токена
- `logout()` — выход

#### API Client (lib/api.ts)

Axios инстанс с:

- Автоматическим добавлением токена в заголовки
- Обработкой 401 ошибок (автоматический logout)
- Базовым URL из переменных окружения

### Страницы

#### Главная (`/`)

Каталог всех игрушек. Отображает сетку карточек с изображением, названием и ценой.

#### Страница игрушки (`/toys/[id]`)

Детальная информация об игрушке. Кнопка "Купить" ведет в Telegram: `https://t.me/miracles211`

#### Админ-панель (`/admin`)

CRUD операции с игрушками:

- Просмотр списка
- Создание новой игрушки
- Редактирование существующей
- Удаление с подтверждением

#### Страница входа (`/admin/login`)

Форма входа администратора с полями:

- Логин (userName)
- Пароль

---

## 🔧 Бэкенд

### Архитектура слоев

#### Domain Layer

**Сущности:**

- `Toy` — игрушка (Id, Name, Description, Price, ImageUrl)
- `User` — пользователь (наследуется от `IdentityUser<int>`)

#### Application Layer

**Интерфейсы:**

- `IToyRepository` — интерфейс репозитория игрушек
- `IToyService` — интерфейс сервиса игрушек

**Сервисы:**

- `ToyService` — бизнес-логика работы с игрушками (валидация, обработка)

**DTOs:**

- `LoginDto` — данные для входа (UserName, Password)

#### Infrastructure Layer

**Реализация:**

- `ToyRepository` — работа с БД через EF Core
- `AppDbContext` — контекст базы данных

**Миграции:**

- Автоматическое применение при запуске приложения

#### Presentation Layer

**Контроллеры:**

- `ToysController` — CRUD операции с игрушками
- `AuthController` — аутентификация (JWT)

**Конфигурация:**

- `Program.cs` — настройка сервисов, middleware, seeding данных

### Безопасность

- **JWT Bearer Authentication** — токены для API
- **ASP.NET Core Identity** — управление пользователями и ролями
- **Role-based Authorization** — защита эндпоинтов ролью "Admin"
- **CORS** — настроен для разработки (AllowAnyOrigin)

### База данных

**PostgreSQL** с таблицами:

- `Toys` — каталог игрушек
- `AspNetUsers` — пользователи (Identity)
- `AspNetRoles` — роли (Identity)
- `AspNetUserRoles` — связь пользователей и ролей

---

## 🐳 Развертывание

### Docker Compose

Проект включает `docker-compose.yml` для запуска БД и API:

```bash
docker-compose up -d
```

Это запустит:

- PostgreSQL на порту `5432`
- API на порту `5000` (внутри контейнера `8080`)

### Переменные окружения

#### Backend

```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=Host=db;Database=KnittedToysDb;Username=postgres;Password=Giuhy56P
Jwt__Key=your_secret_key_at_least_32_characters_long
Jwt__Issuer=KnittedToysShop
Jwt__Audience=KnittedToysShop
```

#### Frontend

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Production Checklist

- [ ] Изменить пароль администратора
- [ ] Настроить надежный JWT ключ (минимум 32 символа)
- [ ] Настроить CORS для конкретных доменов
- [ ] Включить HTTPS
- [ ] Настроить переменные окружения
- [ ] Настроить резервное копирование БД
- [ ] Настроить мониторинг и логирование

---

## 🔍 Устранение неполадок

### Ошибка: "Cannot update a component while rendering"

**Проблема:** В компоненте `AdminGuard` происходили редиректы во время рендера.

**Решение:** ✅ Исправлено — редиректы перенесены в `useEffect`.

### Ошибка: `ERR_INVALID_ARG_VALUE` / null bytes при `pnpm dev`

**Проблема:** Проект находится в папке с символом `#` в пути.

**Решение:** Перенесите проект в каталог без `#`:

- `D:\CSharp-project\KnittedToysShop` ✅
- `D:\Projects\KnittedToysShop` ✅

### Ошибка подключения к БД

**Проблема:** Неверная строка подключения или БД не запущена.

**Решение:**

1. Убедитесь, что PostgreSQL запущен: `docker-compose ps`
2. Проверьте строку подключения в `appsettings.json`
3. Проверьте, что миграции применены

### Ошибка 401 Unauthorized

**Проблема:** Токен истек или отсутствует.

**Решение:**

1. Войдите заново через `/admin/login`
2. Проверьте, что токен добавляется в заголовки запросов
3. Проверьте настройки JWT в `appsettings.json`

### CORS ошибки

**Проблема:** Запросы блокируются CORS политикой.

**Решение:**

1. Убедитесь, что CORS настроен в `Program.cs`
2. Проверьте `NEXT_PUBLIC_API_URL` во фронтенде
3. В продакшене настройте конкретные домены вместо `AllowAnyOrigin`

---

## 📝 Дополнительная документация

- [Инструкции по фронтенду](./docs/FRONTEND_INSTRUCTIONS.md) — детальное руководство по разработке фронтенда

---

## 👥 Разработка

### Добавление новой функциональности

1. **Доменный слой**: Добавьте сущность в `Domain/Entities`
2. **Интерфейсы**: Определите интерфейсы в `Application/Interfaces`
3. **Сервисы**: Реализуйте бизнес-логику в `Application/Services`
4. **Репозиторий**: Реализуйте доступ к данным в `Infrastructure/Repositories`
5. **Контроллер**: Создайте API эндпоинт в `Presentation/Controllers`
6. **Миграции**: Создайте миграцию: `dotnet ef migrations add <Name>`
7. **Фронтенд**: Добавьте компоненты и API методы

### Коммиты

Используйте понятные сообщения коммитов:

- `feat: добавлена возможность загрузки изображений`
- `fix: исправлена ошибка редиректа в AdminGuard`
- `docs: обновлена документация API`

---

## 📄 Лицензия

Этот проект создан для демонстрационных целей.

---

## 🤝 Поддержка

При возникновении проблем создайте issue в репозитории или свяжитесь с разработчиком.

---

**Версия документации:** 1.0  
**Последнее обновление:** 28 января 2026
