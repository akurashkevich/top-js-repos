# Most Starred JavaScript Repositories

Одностраничное приложение для просмотра самых популярных JavaScript репозиториев на GitHub с возможностью бесконечной прокрутки, локального редактирования и удаления.

## Функционал

- Получение списка самых популярных JavaScript репозиториев через GitHub API
- Бесконечная прокрутка с постепенной подгрузкой данных
- Локальное редактирование информации о репозитории и удаление

## Технологии

- React
- TypeScript
- Vite
- Mantine UI Kit
- Jest + React Testing Library
- CSS Modules

### Почему Mantine UI Kit?

- Высокая популярность в сообществе React разработчиков
- Отличная документация и поддержка TypeScript из коробки
- Современный дизайн компонентов и гибкая система стилизации
  
## Тестирование

Проект покрыт unit-тестами с использованием Jest и React Testing Library. Тесты охватывают:
- Компоненты (List, ListItem)
- Хуки (useRepositories)
- API запросы (githubApi)

## Системные требования

- Node.js
- npm

## Инструкция по использованию
1. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/akurashkevich/top-js-repos.git
   ```
2. Перейдите в папку проекта:
   ```bash
   cd top-js-repos
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Для запуска проекта в режиме разработки:
   ```bash
   npm run dev
   ```
5. Для сборки проекта:
   ```bash
   npm run build
   ```

## Демо

Netlify: [ссылка](https://tangerine-pegasus-35614a.netlify.app/)
