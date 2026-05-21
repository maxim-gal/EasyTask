markdown
# EasyTask — менеджер событий с приоритетами и таймерами

Простое веб-приложение для планирования событий.  
**Backend:** Node.js + Express + JWT + bcrypt  
**База данных:** PostgreSQL  
**Frontend:** HTML/CSS/JS  

---

## 🚀 Быстрый запуск

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/maxim-gal/EasyTask.git
cd EasyTask
2. Установите зависимости бэкенда
bash
cd backend
npm install
3. Создайте базу данных PostgreSQL
bash
sudo -u postgres psql -c "CREATE DATABASE \"EasyTask\";"
4. Импортируйте схему и данные
В папке backend уже лежит файл EasyTask_clean.sql – это готовый дамп таблиц и тестовых записей.
Выполните импорт:

bash
sudo -u postgres psql -d EasyTask -f backend/EasyTask_clean.sql
(Если вы находитесь в корне проекта, путь будет backend/EasyTask_clean.sql.)

5. Настройте окружение
Создайте в папке backend файл .env:

env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=         # если пароль не задан – оставьте пустым
DB_NAME=EasyTask
JWT_SECRET=supersecretkey
6. Запустите сервер
bash
node backend/server.js
Вы увидите:

text
✅ Сервер запущен на http://localhost:5000
7. Откройте приложение в браузере
Перейдите на http://localhost:5000
(сервер автоматически раздаёт статические файлы из папки frontend)

📝 Возможности
Регистрация / вход (JWT)

Создание, редактирование, удаление событий

Установка даты, времени, приоритета (высокий / средний / низкий)

Приватные / общие события

Отметка о выполнении

Фильтрация: все / активные / выполненные

Поиск по названию

Комментарии к событиям

Обратный таймер до события (обновляется в реальном времени)

Статистика по событиям

🗄️ Структура БД
users – пользователи

events – события (связь с users)

comments – комментарии (связь с users и events)

🛠️ Технологии
Express – сервер

jsonwebtoken – аутентификация

bcrypt – хэширование паролей

pg – клиент PostgreSQL

dotenv – управление переменными окружения

cors – кросс-доменные запросы

❓ Частые проблемы
Проблема	Решение
database "EasyTask" does not exist	Создайте БД: CREATE DATABASE "EasyTask";
relation "users" does not exist	Не импортирован дамп. Выполните шаг 4.
Ошибка при импорте transaction_timeout	Игнорируйте – это предупреждение старой версии PostgreSQL.
Порт 5000 занят	Измените PORT в .env или завершите процесс, занимающий порт.
📄 Лицензия
ISC
