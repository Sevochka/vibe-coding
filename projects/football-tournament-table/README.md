# Турнирная таблица Российской Премьер-Лиги

## Описание
Виджет, отображающий актуальную турнирную таблицу Российской Премьер-Лиги (РПЛ) с информацией о командах, результатах последних матчей и текущей статистике. Данные получаются автоматически через GraphQL API Sports.ru.

## Особенности
- Отображение позиции команды в турнирной таблице
- Отображение логотипов команд
- Показ текущих матчей команд (если они проходят в момент просмотра)
- Результаты последних 5 матчей каждой команды с возможностью перехода на страницу матча
- Полная статистика: количество игр, победы, ничьи, поражения, забитые и пропущенные мячи
- Расчет разницы мячей и очков
- Адаптивный дизайн для комфортного просмотра на любых устройствах
- Автоматическое обновление данных при каждой загрузке страницы

## Технологии
- HTML5
- CSS3
- JavaScript (ES6+)
- GraphQL API для получения актуальных данных
- Дизайн-система Sports.ru

## Использование
Виджет может быть встроен на любую страницу с помощью iframe:

```html
<iframe class="auto-height" height="668" id="special-project-football-tournament-table" src="https://vibe-coding-blush.vercel.app/projects/football-tournament-table/index.html" style="border: 0px;" width="100%"></iframe>
<iframe class="iframe-video" height="0" src="/picker/resize/" style="height: 0px; display:none;" width="730"></iframe>
```

## Структура проекта
- `index.html` - основная структура страницы
- `styles.css` - стили для отображения таблицы и элементов
- `script.js` - JavaScript код для обработки данных и отображения таблицы
- `data/api-service.js` - сервис для работы с GraphQL API
- `resize.js` - скрипт для автоматического изменения размера iframe 