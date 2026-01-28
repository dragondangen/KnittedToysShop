# Инструкция по фронтенду магазина вязаных игрушек

Next.js 15, TypeScript, pnpm. Бэкенд — ASP.NET Core API (JWT, роли Admin). Обычные пользователи просматривают каталог без авторизации. Админ входит через JWT для управления товарами. Покупка ведёт в Telegram-директ [@miracles211](https://t.me/miracles211).

---

## 1. Инициализация проекта

```bash
pnpm create next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd frontend
```

Важно: выберите App Router, TypeScript, Tailwind CSS, ESLint, `src/` directory, alias `@/*`.

---

## 2. Зависимости

```bash
pnpm add axios zustand
pnpm add -D @types/node
```

- `axios` — запросы к API.
- `zustand` — хранение токена и роли (админ/гость).

---

## 3. Структура приложения

```
src/
  app/
    layout.tsx           # общий layout, шапка, футер
    page.tsx             # главная, каталог
    toys/
      [id]/page.tsx      # карточка игрушки
    admin/
      layout.tsx         # защита: редирект на /admin/login
      login/page.tsx     # страница входа админа
      page.tsx           # список игрушек, CRUD
    api/                 # при необходимости — proxy к бэку (опционально)
  components/
    ToyCard.tsx          # карточка в каталоге
    ToyDetail.tsx        # полное описание + «Купить»
    AdminToyForm.tsx     # форма создания/редактирования
    Header.tsx
    Footer.tsx
  lib/
    api.ts               # axios instance, базовый URL
    auth-store.ts        # zustand: token, isAdmin, login, logout
  types/
    toy.ts               # Toy, AdminToy
```

---

## 4. Типы (types/toy.ts)

```typescript
export interface Toy {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
```

Для создания/обновления: те же поля, `id` опционален при POST.

---

## 5. API-клиент (lib/api.ts)

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (например `http://localhost:5000` или URL вашего API).
- GET-запросы к `/api/Toys` и `/api/Toys/{id}` — без заголовка Authorization.
- POST/PUT/DELETE к `/api/Toys` — с заголовком `Authorization: Bearer <token>`.

Пример:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getToys = () => api.get<Toy[]>('/api/Toys');
export const getToyById = (id: number) => api.get<Toy>(`/api/Toys/${id}`);
export const createToy = (data: Omit<Toy, 'id'>) => api.post<Toy>('/api/Toys', data);
export const updateToy = (id: number, data: Toy) => api.put(`/api/Toys/${id}`, data);
export const deleteToy = (id: number) => api.delete(`/api/Toys/${id}`);
```

---

## 6. Авторизация админа (lib/auth-store.ts)

- Хранить JWT в `localStorage` (или в httpOnly cookie, если будет настроено на бэке).
- При логине вызывать `POST /api/Auth/login` с телом `{ "userName": "...", "password": "..." }`.
- Ответ: `{ "token": "..." }`. Декодировать JWT не обязательно: бэкенд отдаёт токен только при успешной проверке учётных данных, а роль Admin задана на бэке. Для фронта достаточно: «есть валидный токен — считаем админом».
- В store сохранять `token` и флаг `isAdmin` (true после успешного логина). При `logout` удалять токен и сбрасывать `isAdmin`.
- Страницы админки должны проверять `isAdmin`; при отсутствии — редирект на `/admin/login`.

---

## 7. Страницы

### 7.1. Главная (app/page.tsx)

- Заголовок сайта (название магазина). Без смайликов.
- Сетка карточек игрушек из `GET /api/Toys`. Использовать `ToyCard`: изображение, название, цена, ссылка на `/toys/[id]`.
- В шапке: ссылка «Каталог» (или главная), «Админ» — ведёт на `/admin` (или `/admin/login`, если не авторизован).

### 7.2. Карточка игрушки (app/toys/[id]/page.tsx)

- `GET /api/Toys/[id]`: фото, название, описание, цена.
- Кнопка «Купить»: по клику перенаправлять на `https://t.me/miracles211` (открывать в текущей вкладке или в новой — на ваше усмотрение, в инструкции можно зафиксировать «в той же вкладке»).
- Текст кнопки — нейтральный, без смайликов, например «Написать в Telegram» или «Оформить заказ».

### 7.3. Админ: вход (app/admin/login/page.tsx)

- Форма: логин (username), пароль, кнопка «Войти».
- При успехе: сохранить токен, выставить `isAdmin`, редирект на `/admin`.
- При ошибке: показать сообщение «Неверный логин или пароль» (или общее «Ошибка входа»).

### 7.4. Админ: список и CRUD (app/admin/page.tsx)

- Доступ только при `isAdmin`. Иначе — редирект на `/admin/login`.
- Таблица или сетка игрушек: данные из `GET /api/Toys`. Действия: «Добавить», «Редактировать», «Удалить».
- Создание/редактирование через форму (модальное окно или отдельная страница): название, описание, цена, URL изображения. POST при создании, PUT при редактировании.
- Удаление: `DELETE /api/Toys/{id}` с подтверждением.
- Кнопка «Выйти» — очистка токена, сброс `isAdmin`, редирект на главную или `/admin/login`.

---

## 8. Защита админ-разделов

- В `app/admin/layout.tsx` проверять `isAdmin` (из store). Если не админ — `redirect('/admin/login')`. Страница логина в админке может быть исключением (не редиректить с неё).
- При 401 на любом запросе к API (например, через axios interceptor) — очистить токен, сбросить `isAdmin`, редирект на `/admin/login`.

---

## 9. Стили и эстетика

- Tailwind CSS. Шрифты: например `font-sans` с кастомным шрифтом (Inter, Literata, Lora — на выбор, главное читаемость).
- Цвета: спокойная палитра. Например, фон `#faf9f7`, акцент `#2c1810` или приглушённый терракотовый/бежевый; карточки с лёгкой тенью и скруглением.
- Изображения: `object-cover`, фиксированные пропорции у карточек, единообразие сетки.
- Кнопки: чёткие, без градиентов и «игрового» вида. «Купить» / «Написать в Telegram» — контрастнее, остальные — нейтральные.
- Никаких смайликов в интерфейсе.

---

## 10. Переменные окружения

В корне фронтенда создать `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Для продовой сборки подставить реальный URL API.

---

## 11. CORS и API

Бэкенд уже настроен с `AllowAnyOrigin`. Убедитесь, что `NEXT_PUBLIC_API_URL` указывает на тот хост/порт, где запущен API (например, `https://api.example.com` в проде).

---

## 12. Покупка и редирект в Telegram

- Единственный «чекаут» в приложении — кнопка «Купить» / «Написать в Telegram» на странице игрушки.
- По клику: `window.location.href = 'https://t.me/miracles211'` или `<a href="https://t.me/miracles211" target="_blank" rel="noopener">`.
- Дополнительно можно передать текст сообщения через `https://t.me/miracles211?text=...` (предзаполнение, например: «Хочу купить [название игрушки]»). Кодировать `text` через `encodeURIComponent`.

---

## 13. Чек-лист

- [ ] Next.js + TypeScript + pnpm, App Router.
- [ ] Каталог и карточка игрушки работают без авторизации.
- [ ] Кнопка «Купить» ведёт в https://t.me/miracles211.
- [ ] Админ-логин через `/api/Auth/login`, JWT в localStorage и в заголовке запросов.
- [ ] CRUD игрушек только для авторизованного админа; админ-страницы защищены.
- [ ] Выход из админки, при 401 — разлогин и редирект на `/admin/login`.
- [ ] Нейтральный, «тёплый» визуальный стиль, без смайликов.

---

## 14. Учётные данные админа (для разработки)

По умолчанию в бэкенде создаётся пользователь:

- Логин: `admin`
- Пароль: `Admin123!`

Использовать только в dev; в проде сменить пароль и настроить надёжный JWT (ключ, issuer, audience).

---

Документ можно положить в репозиторий и использовать как спецификацию при реализации фронтенда.

---

## 15. Устранение неполадок

### Ошибка `ERR_INVALID_ARG_VALUE` / null bytes при `pnpm dev`

Если проект лежит в папке с символом `#` в пути (например `D:\C#-project\...`), Tailwind и Turbopack могут искажать путь, из‑за чего возникает «path must be a string without null bytes».

**Что делать:** перенести весь проект в каталог без `#`. Например:
- `D:\CSharp-project\KnittedToysShop`
- `D:\Projects\KnittedToysShop`
- `D:\KnittedToysShop`

После переноса заново выполнить `pnpm install` в `frontend` и запустить `pnpm dev`.
