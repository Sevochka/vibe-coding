# Инструкция по деплою проекта Yana-Ed Wedding

## Варианты бесплатного деплоя

### 1. GitHub Pages (Автоматический)
- Проект уже настроен для автоматического деплоя через GitHub Actions
- После пуша в main ветку, сайт автоматически обновится
- Доступен по адресу: `https://sevochka.github.io/vibe-coding/projects/yana-ed-wedding/`

### 2. Netlify
1. Зайдите на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Netlify автоматически найдет конфигурацию из `netlify.toml`
4. Укажите папку публикации: `projects/yana-ed-wedding`

### 3. Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий 
3. Vercel использует конфигурацию из `vercel.json`

### 4. Surge.sh (Ручной деплой)
```bash
# Установите Surge.sh
npm install -g surge

# Перейдите в папку проекта
cd projects/yana-ed-wedding

# Деплой
surge . yana-ed-wedding.surge.sh
```

### 5. Firebase Hosting
```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Войдите в аккаунт
firebase login

# Инициализируйте проект
firebase init hosting

# Укажите папку: projects/yana-ed-wedding

# Деплой
firebase deploy
```

## Локальный запуск
```bash
cd projects/yana-ed-wedding
python3 -m http.server 8000
```

Откройте в браузере: http://localhost:8000

## Статус
✅ Проект готов к деплою
✅ Все конфигурации созданы
✅ Локальный сервер запущен 