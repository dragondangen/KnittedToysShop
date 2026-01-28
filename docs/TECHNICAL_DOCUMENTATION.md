# Техническая документация KnittedToysShop

Детальное описание архитектуры, компонентов и реализации проекта.

## 📋 Содержание

- [Архитектура бэкенда](#архитектура-бэкенда)
- [Архитектура фронтенда](#архитектура-фронтенда)
- [Компоненты и их взаимодействие](#компоненты-и-их-взаимодействие)
- [Потоки данных](#потоки-данных)
- [Безопасность](#безопасность)
- [База данных](#база-данных)

---

## 🏗 Архитектура бэкенда

### Clean Architecture

Проект следует принципам Clean Architecture с четким разделением ответственности:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers, HTTP, Configuration)     │
├─────────────────────────────────────────┤
│         Application Layer               │
│  (Services, Business Logic, DTOs)      │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│  (Entities, Interfaces)                 │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│  (Repositories, EF Core, Persistence)   │
└─────────────────────────────────────────┘
```

### Domain Layer

**Назначение:** Содержит бизнес-сущности и интерфейсы, не зависящие от инфраструктуры.

#### Сущности

**Toy.cs**

```csharp
public class Toy
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
```

**User.cs** (наследуется от `IdentityUser<int>`)

- Расширяет стандартного пользователя ASP.NET Core Identity
- Используется для аутентификации и авторизации

### Application Layer

**Назначение:** Содержит бизнес-логику и интерфейсы для работы с данными.

#### Интерфейсы

**IToyRepository.cs**

```csharp
public interface IToyRepository
{
    Task<IEnumerable<Toy>> GetAllAsync();
    Task<Toy?> GetByIdAsync(int id);
    Task AddAsync(Toy toy);
    Task UpdateAsync(Toy toy);
    Task DeleteAsync(int id);
}
```

**IToyService.cs**

```csharp
public interface IToyService
{
    Task<IEnumerable<Toy>> GetAllToysAsync();
    Task<Toy?> GetByIdAsync(int id);
    Task AddToyAsync(Toy toy);
    Task UpdateToyAsync(Toy toy);
    Task DeleteToyAsync(int id);
}
```

#### Сервисы

**ToyService.cs**

- Валидация данных перед сохранением
- Проверка на null и пустые значения
- Проверка корректности цен и ID
- Делегирование операций репозиторию

**Особенности:**

- Валидация имени (не может быть пустым)
- Валидация цены (должна быть положительной)
- Валидация ID (должен быть положительным)

#### DTOs

**LoginDto.cs**

```csharp
public class LoginDto
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

### Infrastructure Layer

**Назначение:** Реализация доступа к данным и работа с внешними библиотеками.

#### AppDbContext.cs

Контекст Entity Framework Core:

- Наследуется от `IdentityDbContext<User, IdentityRole<int>, int>`
- Содержит `DbSet<Toy> Toys`
- Настройка модели через `OnModelCreating`
- Seed данные для начальных игрушек

#### ToyRepository.cs

Реализация `IToyRepository`:

- Использует `AppDbContext` для доступа к БД
- Асинхронные операции через EF Core
- Метод `UpdateAsync` обновляет существующую сущность (не заменяет)

**Особенности:**

- `UpdateAsync` загружает существующую сущность и обновляет поля
- `DeleteAsync` проверяет существование перед удалением

### Presentation Layer

**Назначение:** HTTP API, контроллеры, конфигурация приложения.

#### Controllers

**ToysController.cs**

- `GET /api/Toys` — получить все игрушки (публичный)
- `GET /api/Toys/{id}` — получить игрушку по ID (публичный)
- `POST /api/Toys` — создать игрушку (требует роль Admin)
- `PUT /api/Toys/{id}` — обновить игрушку (требует роль Admin)
- `DELETE /api/Toys/{id}` — удалить игрушку (требует роль Admin)

**AuthController.cs**

- `POST /api/Auth/login` — аутентификация и получение JWT токена
- Использует `UserManager` и `SignInManager` для проверки учетных данных
- Генерирует JWT токен с claims (имя пользователя, ID, роли)

#### Program.cs

Конфигурация приложения:

1. **Сервисы:**
   - Controllers, Swagger
   - DbContext с PostgreSQL
   - ASP.NET Core Identity
   - JWT Bearer Authentication
   - CORS (AllowAnyOrigin для разработки)
   - Регистрация репозиториев и сервисов

2. **Middleware Pipeline:**
   - Swagger (только в Development)
   - HTTPS Redirection
   - CORS
   - Authentication
   - Authorization
   - Controllers

3. **Seeding:**
   - Автоматическое применение миграций
   - Создание роли "Admin" (если не существует)
   - Создание пользователя "admin" с паролем "Admin123!" (если не существует)
   - Назначение роли "Admin" пользователю

---

## 🎨 Архитектура фронтенда

### Next.js App Router

Проект использует App Router (Next.js 13+) с файловой маршрутизацией:

```
app/
├── layout.tsx          # Корневой layout (Header, Footer)
├── page.tsx            # Главная страница (/)
├── toys/
│   └── [id]/
│       └── page.tsx    # Динамический маршрут (/toys/:id)
└── admin/
    ├── layout.tsx      # Layout для админ-разделов
    ├── login/
    │   └── page.tsx    # Страница входа (/admin/login)
    └── page.tsx        # Админ-панель (/admin)
```

### Управление состоянием

**Zustand Store** (`lib/auth-store.ts`):

```typescript
type AuthState = {
  token: string | null;
  hydrated: boolean;
  hydrate: () => void;
  setToken: (t: string | null) => void;
  logout: () => void;
};
```

**Особенности:**

- Токен хранится в `localStorage`
- Флаг `hydrated` предотвращает рендеринг до загрузки токена
- Метод `hydrate()` загружает токен из `localStorage` при инициализации

### API Client

**Axios Instance** (`lib/api.ts`):

1. **Request Interceptor:**
   - Автоматически добавляет токен в заголовок `Authorization`
   - Работает только в браузере (`typeof window !== "undefined"`)

2. **Response Interceptor:**
   - Обрабатывает 401 ошибки
   - Автоматически выполняет logout при 401 (кроме страницы логина)
   - Редирект на `/admin/login`

3. **API Методы:**
   - `getToys()` — GET /api/Toys
   - `getToyById(id)` — GET /api/Toys/:id
   - `createToy(data)` — POST /api/Toys
   - `updateToy(id, data)` — PUT /api/Toys/:id
   - `deleteToy(id)` — DELETE /api/Toys/:id
   - `login(userName, password)` — POST /api/Auth/login

### Компоненты

#### AdminGuard.tsx

**Назначение:** Защита админ-разделов от неавторизованного доступа.

**Логика:**

1. Загружает токен из store через `hydrate()`
2. Показывает загрузку, пока `hydrated === false`
3. Если на странице `/admin/login` и есть токен → редирект на `/admin`
4. Если не на странице логина и нет токена → редирект на `/admin/login`
5. Иначе → рендерит `children`

**Исправление ошибки:**

- Редиректы выполняются в `useEffect`, а не во время рендера
- Предотвращает ошибку "Cannot update a component while rendering"

#### AdminToyForm.tsx

**Назначение:** Форма создания и редактирования игрушек.

**Поля:**

- Название (обязательное)
- Описание
- Цена (обязательное, число)
- URL изображения

**Режимы:**

- Создание: `toy === undefined`
- Редактирование: `toy` передан

#### ToyCard.tsx

**Назначение:** Карточка игрушки в каталоге.

**Отображает:**

- Изображение
- Название
- Цену
- Ссылку на детальную страницу

#### ToyDetail.tsx

**Назначение:** Детальная информация об игрушке.

**Отображает:**

- Изображение
- Название
- Описание
- Цену
- Кнопку "Купить" (ведет в Telegram)

---

## 🔄 Компоненты и их взаимодействие

### Поток аутентификации

```
1. Пользователь открывает /admin/login
   ↓
2. Вводит логин и пароль
   ↓
3. Отправка POST /api/Auth/login
   ↓
4. Backend проверяет учетные данные
   ↓
5. Генерация JWT токена
   ↓
6. Сохранение токена в localStorage (через auth-store)
   ↓
7. Редирект на /admin
   ↓
8. AdminGuard проверяет токен
   ↓
9. Разрешает доступ к админ-панели
```

### Поток работы с игрушками (публичный)

```
1. Пользователь открывает главную страницу (/)
   ↓
2. Компонент загружает GET /api/Toys
   ↓
3. Отображение сетки карточек игрушек
   ↓
4. Клик на карточку → переход на /toys/:id
   ↓
5. Загрузка GET /api/Toys/:id
   ↓
6. Отображение детальной информации
   ↓
7. Клик "Купить" → переход в Telegram
```

### Поток CRUD операций (админ)

```
1. Админ открывает /admin
   ↓
2. Загрузка списка игрушек (GET /api/Toys)
   ↓
3. Создание:
   - Клик "Добавить"
   - Заполнение формы
   - POST /api/Toys (с токеном)
   - Обновление списка

4. Редактирование:
   - Клик "Редактировать"
   - Заполнение формы с данными
   - PUT /api/Toys/:id (с токеном)
   - Обновление списка

5. Удаление:
   - Клик "Удалить"
   - Подтверждение
   - DELETE /api/Toys/:id (с токеном)
   - Обновление списка
```

---

## 📊 Потоки данных

### Запрос данных (Read)

```
Frontend Component
    ↓
lib/api.ts (getToys/getToyById)
    ↓
Axios Request Interceptor (добавление токена)
    ↓
HTTP Request → Backend API
    ↓
ToysController
    ↓
ToyService
    ↓
ToyRepository
    ↓
AppDbContext → PostgreSQL
    ↓
Response ← PostgreSQL
    ↓
ToyRepository → ToyService → ToysController
    ↓
JSON Response → Frontend
    ↓
Component обновляет UI
```

### Создание/Обновление данных (Write)

```
Frontend Component (форма)
    ↓
lib/api.ts (createToy/updateToy)
    ↓
Axios Request Interceptor (добавление токена)
    ↓
HTTP Request → Backend API
    ↓
JWT Authentication Middleware (проверка токена)
    ↓
Authorization Middleware (проверка роли Admin)
    ↓
ToysController
    ↓
ToyService (валидация)
    ↓
ToyRepository
    ↓
AppDbContext → PostgreSQL
    ↓
Response ← PostgreSQL
    ↓
ToyRepository → ToyService → ToysController
    ↓
JSON Response → Frontend
    ↓
Component обновляет UI
```

---

## 🔒 Безопасность

### Backend

1. **JWT Authentication:**
   - Токены подписываются секретным ключом
   - Валидация issuer, audience, lifetime
   - Токены содержат claims (имя, ID, роли)

2. **Role-based Authorization:**
   - Эндпоинты CRUD защищены атрибутом `[Authorize(Roles = "Admin")]`
   - Только пользователи с ролью "Admin" могут изменять данные

3. **Password Security:**
   - ASP.NET Core Identity валидирует пароли
   - Требования: минимум 6 символов, цифра, заглавная и строчная буквы

4. **CORS:**
   - В разработке: `AllowAnyOrigin` (для удобства)
   - В продакшене: настроить конкретные домены

### Frontend

1. **Token Storage:**
   - Токен хранится в `localStorage`
   - ⚠️ В продакшене рассмотреть httpOnly cookies

2. **Automatic Logout:**
   - При получении 401 ошибки автоматический logout
   - Редирект на страницу входа

3. **Route Protection:**
   - `AdminGuard` проверяет токен перед рендерингом
   - Редиректы для неавторизованных пользователей

---

## 🗄 База данных

### Схема

**Таблица: Toys**

```
Id          INTEGER (PK, Auto-increment)
Name        TEXT (NOT NULL)
Description TEXT (NOT NULL)
Price       NUMERIC (NOT NULL)
ImageUrl    TEXT (NOT NULL)
```

**Таблицы Identity (ASP.NET Core Identity):**

- `AspNetUsers` — пользователи
- `AspNetRoles` — роли
- `AspNetUserRoles` — связь пользователей и ролей
- `AspNetUserClaims` — дополнительные claims
- `AspNetRoleClaims` — claims ролей
- `AspNetUserLogins` — внешние логины
- `AspNetUserTokens` — токены пользователей

### Миграции

Миграции создаются через Entity Framework Core:

```bash
dotnet ef migrations add <MigrationName> --project Infrastructure --startup-project Presentation
```

Применение миграций:

- Автоматически при запуске приложения (в `Program.cs`)
- Вручную: `dotnet ef database update --project Infrastructure --startup-project Presentation`

### Seed Data

Начальные данные создаются в `AppDbContext.OnModelCreating`:

- Две тестовые игрушки (медведь и заяц)

Пользователь и роль создаются в `Program.cs` при первом запуске:

- Роль "Admin"
- Пользователь "admin" с паролем "Admin123!"

---

## 🔧 Конфигурация

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=KnittedToysDb;Username=postgres;Password=Giuhy56P"
  },
  "Jwt": {
    "Key": "your_secret_key_at_least_32_characters_long",
    "Issuer": "KnittedToysShop",
    "Audience": "KnittedToysShop"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5136
```

---

## 📝 Примечания по разработке

### Добавление новой сущности

1. Создать класс в `Domain/Entities`
2. Добавить `DbSet` в `AppDbContext`
3. Создать интерфейс репозитория в `Application/Interfaces`
4. Реализовать репозиторий в `Infrastructure/Repositories`
5. Создать интерфейс сервиса в `Application/Services`
6. Реализовать сервис в `Application/Services`
7. Зарегистрировать в `Program.cs`
8. Создать контроллер в `Presentation/Controllers`
9. Создать миграцию
10. Добавить API методы во фронтенде
11. Создать компоненты для UI

### Тестирование

Рекомендуется добавить:

- Unit тесты для сервисов
- Integration тесты для API
- E2E тесты для критических потоков

---

**Версия документации:** 1.0  
**Последнее обновление:** 28 января 2026
