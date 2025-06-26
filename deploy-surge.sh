#!/bin/bash

# Установка Surge если не установлен
if ! command -v surge &> /dev/null; then
    echo "Устанавливаем Surge.sh..."
    npm install -g surge
fi

# Переходим в папку проекта
cd projects/yana-ed-wedding

# Деплоим на Surge.sh с уникальным доменом
echo "Деплоим проект yana-ed-wedding на Surge.sh..."
surge . yana-ed-wedding.surge.sh

echo "Готово! Проект доступен по адресу: https://yana-ed-wedding.surge.sh" 