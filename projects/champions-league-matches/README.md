# Будущие матчи Лиги Чемпионов 2024-2025

## Описание

Виджет, отображающий предстоящие матчи текущего сезона Лиги Чемпионов УЕФА. Данный проект получает информацию через GraphQL API sports.ru и отображает матчи в удобном для просмотра формате. Пользователи могут легко узнать расписание ближайших игр, время их начала и места проведения.

## Возможности

- Получение актуальных данных о предстоящих матчах через GraphQL API
- Группировка матчей по датам проведения
- Отображение логотипов команд и времени начала матча
- Информация о стадионах и городах проведения
- Адаптивный дизайн, работающий на мобильных устройствах
- Красивый и современный интерфейс в стиле Sports.ru

## Технологии

- HTML5
- CSS3 (с использованием брендированных стилей Sports.ru)
- Vanilla JavaScript
- Fetch API для взаимодействия с GraphQL
- ResizeObserver для адаптации размера iframe

## Код для интеграции на страницу

```html
<iframe class="auto-height" height="668" id="special-project-champions-league-matches" src="https://vibe-coding-blush.vercel.app/projects/champions-league-matches/index.html" style="border: 0px;" width="100%"></iframe>
<iframe class="iframe-video" height="0" src="/picker/resize/" style="height: 0px; display:none;" width="730"></iframe>
``` 