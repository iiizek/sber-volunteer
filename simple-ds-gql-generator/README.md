# Simple DS GraphQL Generator

## Описание
Генератор кода для GraphQL, который автоматизирует создание TypeScript-типов, запросов и компонентов React на основе GraphQL-схемы.

## Установка и настройка

### Клонирование репозитория
```bash
git clone https://gitverse.ru/bvvmail/simple-ds-gql-generator
cd simple-ds-gql-generator
```

### Настройка окружения
1. Создайте файл `.env` и добавьте в него endpoint GraphQL:
```
DS_ENDPOINT=http://your-graphql-server/graphql
```

2. Если у вас возникают проблемы с OpenSSL при запуске на новых версиях Node.js, установите следующую переменную:

Для Linux/MacOS
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

Для Windows
```bash
set NODE_OPTIONS=--openssl-legacy-provider
```


### Сборка генератора кода
```bash
cd tsgen
npm install
npm run build
cd ..
```

## Запуск приложения

### Установка зависимостей и генерация кода
```bash
npm install
npm run get-schema
npm run allgen
```

Процесс генерации включает следующие этапы:
- `gqlgen` - генерация базовых CRUD GraphQL-запросов
- `codegen` - создание TypeScript-типов и React-хуков
- `formgen` - генерация React-компонентов

### Запуск сервера разработки
```bash
npm start
```

## Структура проекта
- GraphQL-схема находится в директории `src/graphql`
- Сгенерированные файлы размещаются в:
  - `src/__generate/` - TypeScript-типы
  - `src/graphql/__generate/` - GraphQL-запросы
  - `src/components/__generate/` - React-компоненты

## Дополнительная информация
- `graphql-frontend.ts` содержит типизированные хуки для React на основе запросов
- `formgen.ts` содержит настройки приложения и отвечает за генерацию функциональных компонентов React
- Проект использует плагин к GraphQL Code Generator, который использует артефакты от стандартного GraphQL
