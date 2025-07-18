# Свадебная страница Яны и Эдуарда

Интерактивная адаптивная свадебная лендинг-страница с очень яркими фонами панелек, ограниченным кликером сердечек с кнопкой сброса и плавным скроллом.

## Описание

Элегантная и полностью адаптивная свадебная страница для Яны и Эдуарда с датой торжества 30 августа 2025 года в стиле "пока родителей нет дома" с ностальгическими элементами 90-х.

## 🎉 ПОСЛЕДНИЕ ОБНОВЛЕНИЯ

### 🔧 ПОЛНОСТЬЮ ПЕРЕПИСАНЫ СЛАЙДЕРЫ - ВСЕ ПРОБЛЕМЫ ИСПРАВЛЕНЫ ✅

**Проблемы, которые были решены:**
- ❌ Слайдеры съезжали в сторону на мобильных → ✅ **Идеальная центровка**
- ❌ Рандомная прокрутка фотографий → ✅ **Четкая навигация по порядку**
- ❌ Не все фотографии были видны → ✅ **Все 8 фото девочек + 4 фото мальчиков**
- ❌ Кнопки плохо кликались → ✅ **Большие, стилизованные кнопки**
- ❌ Дублирование логики в коде → ✅ **Чистый современный код**

**Технические улучшения:**
- **Новый класс `ModernCarousel`**: Полностью переписанная логика без конфликтов
- **Поддержка свайпов**: Работает на всех мобильных устройствах
- **Адаптивные размеры**: 280px (планшеты), 250px (мобильные)
- **Улучшенные кнопки**: Розовые рамки, hover-эффекты, лучшее позиционирование
- **Правильный CSS**: object-fit: cover для корректного отображения фото

**Файлы для деплоя:**
- 📁 `../netlify-deploy2/` - **НОВАЯ ВЕРСИЯ** с исправленными слайдерами
- 📁 `../netlify-deploy/` - старая версия

### 🔧 Исправлена центровка слайдеров на мобильных устройствах
- **Проблема решена**: Слайдеры с референсами одежды больше не съезжают в сторону на мобильных
- **Фиксированные размеры**: 280px для экранов 768px, 250px для экранов 480px
- **Принудительная центровка**: Добавлено `left: 50%` и `transform: translateX(-50%)`
- **Улучшенный flex-контейнер**: Слайдер-группы теперь имеют правильную центровку

### 📱 Улучшенная мобильная адаптация
- **Убраны переносы слов**: Отключен автоматический перенос слов через дефис (hyphens: none)
- **Добавлено эмоджи**: 🙈 после фразы "а реальность формируете вы"
- **Изображения boy и girl**: Добавлены после абзаца о творческом самовыражении
- **Белый слой на money**: Полупрозрачный белый слой поверх money.jpg для читаемости текста
- **Новое фото игр**: Заменили game2.jpg на all_play.jpg
- **Увеличен отступ внизу**: 120px padding-bottom для postscript чтобы кликер не наезжал на текст

## Код отображения в посте
```html
<iframe class="auto-height" height="668" id="special-project-yana-ed-wedding" src="https://vibe-coding-blush.vercel.app/projects/yana-ed-wedding/index.html" style="border: 0px;" width="100%"></iframe>
<iframe class="iframe-video" height="0" src="/picker/resize/" style="height: 0px; display:none;" width="730"></iframe>
```

## 📝 Типографика без переносов

### Отключение автоматических переносов
```css
body {
    hyphens: none;
}

/* Все текстовые элементы */
.intro-text p,
.concept-text p,
.dresscode-text p,
.gifts-text p,
.gifts-alt-text p,
.timeline-desc,
.contact-info p,
.postscript p {
    hyphens: none;
    text-align: justify; /* без text-justify: inter-word */
}
```

### Результат
- Слова не разбиваются по слогам через дефис
- Если слово не помещается в строку, переносится целиком
- Сохранена выравнивание по ширине без принудительного растягивания

## 🙈 Новые визуальные элементы

### Эмоджи обезьянки
Добавлено 🙈 после фразы "А реальность формируете вы" в секции ожиданий для большей эмоциональности.

### Изображения boy и girl
```html
<div class="creative-images">
    <img src="./images/boy.jpg" alt="Мальчик" class="creative-photo">
    <img src="./images/girl.jpg" alt="Девочка" class="creative-photo">
</div>
```

Добавлены после абзаца о творческом самовыражении с адаптивными размерами:
- **Десктоп**: 200x180px (горизонтально слева-справа)
- **Планшеты**: 160x140px  
- **Мобильные**: 140x120px

Фотографии расположены горизонтально с увеличенным размером для лучшего восприятия.

## 💰 Улучшенная денежная секция

### Полупрозрачный белый слой
```css
.money-section-part::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    z-index: 1;
}

.money-text {
    position: relative;
    z-index: 3; /* поверх белого слоя */
}
```

### Результат
- Черный текст отлично читается поверх money.jpg
- Сохранена анимация падающих денег (z-index: 2)
- Белый слой не мешает восприятию фонового изображения

## 🎮 Обновленное фото настольных игр

Заменили `game2.jpg` на `all_play.jpg` с увеличенным размером:
- **Десктоп**: до 450px ширина
- **Планшеты**: до 350px ширина
- **Мобильные**: до 280px ширина

Большее изображение лучше демонстрирует настольные игры в секции альтернативных подарков.

## 📱 Улучшенная адаптивность внизу

### Увеличенный отступ
```css
.postscript {
    border-top: 1px solid #ddd;
    padding-top: 1rem;
    padding-bottom: 120px; /* было без отступа */
}
```

### Результат
- Кликер сердечек и стрелка "наверх" не наезжают на текст P.S.
- Комфортное расстояние между контентом и фиксированными элементами
- Сохранена читаемость на всех устройствах

## Очень яркие фоны панелек

### Максимально яркое затемнение
```css
section::before {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: brightness(0.95) contrast(1.0) saturate(1.1);
}
```

### Ротация фонов по секциям (3 изображения)

**panelki.jpg** - Используется на:
- Intro (знакомство с парой)

**panelki2.jpg** - Используется на:
- Date (дата встречи с love.jpg)
- Timeline (тайминг мероприятия)
- Dresscode (дресс-код с цветовой палитрой)
- Gifts Creative (подарки + денежная секция)
- Final (финальное обращение)

**panelki3.jpg** - Используется на:
- Location (локация с фотографиями зала)
- Concept (концепция "POV: пока родителей нет дома")
- Expectations (ожидания с каруселями)
- Gifts Alternative (альтернативные подарки + контакты)

## 💖 Кликер сердечек с кнопкой сброса

### Функциональность
- **Кнопка "Сбросить"**: Позволяет обнулить счетчик и начать тапать заново
- **Визуальный эффект**: Кнопка масштабируется при нажатии
- **Сохранение состояния**: Счетчик сохраняется в localStorage

### Активные фотографии
Кликер работает **ТОЛЬКО** на следующих изображениях:
- **main-couple** - Главная фотография пары (первый экран)
- **love** - Фотография love.jpg (второй экран)
- **me** - Фотография Яны (финальный экран)
- **you** - Фотография Эда (финальный экран)

### Адаптивные размеры кликера
- **Десктоп**: 200px ширина, кнопка 0.9rem
- **Планшеты**: 180px ширина, кнопка 0.8rem  
- **Мобильные**: 160px ширина, кнопка 0.8rem
- **Маленькие экраны**: 140px ширина, кнопка 0.7rem

## Технические особенности

### Улучшенная типографика
- Отключены автоматические переносы слов (hyphens: none)
- Убрано принудительное растягивание текста (text-justify: inter-word)
- Сохранено выравнивание по ширине для аккуратного вида

### Новые интерактивные элементы
- Эмоджи 🙈 для эмоциональности
- Изображения boy.jpg и girl.jpg с hover-эффектами
- Полупрозрачный белый слой на денежной секции
- Обновленное фото настольных игр all_play.jpg

### Оптимизированная производительность
- Только 3 фоновых изображения вместо 10
- Правильные z-index для наложения слоев
- Увеличенный отступ внизу для комфорта

### Кроссбраузерная совместимость
- Fallback для backdrop-filter
- Адаптивные единицы измерения
- Плавные переходы на всех устройствах

## Цветовая схема

### Очень яркие панельки
- **Полупрозрачность**: rgba(255, 255, 255, 0.75)
- **Фильтры**: brightness(0.95) contrast(1.0) saturate(1.1)
- **Результат**: Максимально яркие, насыщенные панельки с отличной читаемостью

### Активные элементы
- **Кликер**: #FF6B9D (розовый)
- **Сердечки**: #e91e63 (темно-розовый)
- **Кнопка сброса**: rgba(255, 255, 255, 0.2) с hover-эффектом
- **Кнопка наверх**: #FF6B9D (розовый) - слева внизу

Сайт теперь имеет улучшенную типографику без переносов, новые визуальные элементы (эмоджи 🙈, boy/girl фото), улучшенную читаемость денежной секции с белым слоем, обновленное фото настольных игр и увеличенный отступ внизу для комфорта! 