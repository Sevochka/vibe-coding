class EuropeanChampionsMap {
    constructor() {
        this.selectedCountry = null;
        this.mapContainer = document.getElementById('europeMap');
        this.championPanel = document.getElementById('championInfo');
        this.init();
    }

    init() {
        this.createMap();
        this.setupEventListeners();
    }

    createMap() {
        // Создаем SVG карту Европы
        Object.keys(mapPaths).forEach(countryId => {
            const country = mapPaths[countryId];
            const championData = champions[countryId];
            
            // Создаем группу для страны
            const countryGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            countryGroup.setAttribute('class', 'country-group');
            countryGroup.setAttribute('data-country', countryId);

            // Создаем путь страны
            const countryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            countryPath.setAttribute('d', country.path);
            countryPath.setAttribute('class', `country ${championData?.big5 ? 'big5' : ''}`);
            countryPath.setAttribute('data-country', countryId);

            // Добавляем лейбл страны
            const countryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            countryLabel.setAttribute('x', country.cx);
            countryLabel.setAttribute('y', country.cy);
            countryLabel.setAttribute('class', 'country-label');
            countryLabel.textContent = countries[countryId]?.code || countryId.toUpperCase();

            countryGroup.appendChild(countryPath);
            countryGroup.appendChild(countryLabel);
            this.mapContainer.appendChild(countryGroup);
        });
    }

    setupEventListeners() {
        // Обработка кликов по странам
        this.mapContainer.addEventListener('click', (e) => {
            const countryElement = e.target.closest('[data-country]');
            if (countryElement) {
                const countryId = countryElement.dataset.country;
                this.selectCountry(countryId);
            }
        });

        // Обработка hover эффектов
        this.mapContainer.addEventListener('mouseover', (e) => {
            const countryElement = e.target.closest('.country');
            if (countryElement) {
                this.showTooltip(e, countryElement.dataset.country);
            }
        });

        this.mapContainer.addEventListener('mouseout', (e) => {
            this.hideTooltip();
        });
    }

    selectCountry(countryId) {
        // Убираем предыдущее выделение
        if (this.selectedCountry) {
            document.querySelector(`[data-country="${this.selectedCountry}"] .country`)
                ?.classList.remove('selected');
        }

        // Выделяем новую страну
        this.selectedCountry = countryId;
        document.querySelector(`[data-country="${countryId}"] .country`)
            ?.classList.add('selected');

        // Обновляем информационную панель
        this.updateChampionPanel(countryId);

        // Добавляем плавную анимацию
        this.animateSelection(countryId);
    }

    updateChampionPanel(countryId) {
        const championData = champions[countryId];
        const countryData = countries[countryId];

        if (!championData) {
            this.championPanel.innerHTML = `
                <div class="champion-content">
                    <h3 class="champion-title">Информация недоступна</h3>
                    <p class="champion-description">К сожалению, данные по чемпиону ${countryData?.name || countryId} пока недоступны</p>
                </div>
            `;
            return;
        }

        this.championPanel.innerHTML = `
            <div class="champion-content">
                <img src="${championData.flag}" alt="${championData.country}" class="champion-flag">
                <h3 class="champion-title">${championData.champion}</h3>
                <p class="champion-country">${championData.country} • ${championData.league}</p>
                <img src="${championData.logo}" alt="${championData.champion}" class="champion-logo" 
                     onerror="this.style.display='none'">
                <p class="champion-description">
                    Чемпион сезона ${championData.season}${championData.big5 ? ' (Топ-5 лига UEFA)' : ''}
                </p>
                <div class="champion-stats">
                    <div class="stat-item">
                        <span class="stat-value">${championData.points}</span>
                        <span class="stat-label">Очки</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${championData.goals}</span>
                        <span class="stat-label">Голы</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${championData.big5 ? '⭐' : '🏆'}</span>
                        <span class="stat-label">${championData.big5 ? 'Топ-5' : 'Лига'}</span>
                    </div>
                </div>
            </div>
        `;

        // Анимация появления панели
        this.championPanel.style.transform = 'scale(0.95)';
        this.championPanel.style.opacity = '0.8';
        
        setTimeout(() => {
            this.championPanel.style.transform = 'scale(1)';
            this.championPanel.style.opacity = '1';
        }, 100);
    }

    animateSelection(countryId) {
        const countryElement = document.querySelector(`[data-country="${countryId}"] .country`);
        if (countryElement) {
            // Анимация пульсации
            countryElement.style.animation = 'none';
            setTimeout(() => {
                countryElement.style.animation = 'pulse 2s infinite';
            }, 50);
        }
    }

    showTooltip(event, countryId) {
        const championData = champions[countryId];
        const countryData = countries[countryId];
        
        if (!championData) return;

        // Создаем всплывающую подсказку
        let tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'map-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--sports-primary-color);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 199, 139, 0.3);
                pointer-events: none;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(10px);
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <strong>${championData.champion}</strong><br>
            <small>${championData.country} • ${championData.league}</small>
        `;

        tooltip.style.left = event.pageX + 15 + 'px';
        tooltip.style.top = event.pageY - 10 + 'px';
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }

    hideTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        }
    }

    // Функция для автопоказа чемпионов
    startAutoShow() {
        const countryIds = Object.keys(champions);
        let currentIndex = 0;

        const showNext = () => {
            this.selectCountry(countryIds[currentIndex]);
            currentIndex = (currentIndex + 1) % countryIds.length;
        };

        // Показываем первого чемпиона
        showNext();

        // Автоматически переключаем каждые 5 секунд
        setInterval(showNext, 5000);
    }

    // Поиск по чемпионам
    searchChampion(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        Object.keys(champions).forEach(countryId => {
            const championData = champions[countryId];
            if (championData.champion.toLowerCase().includes(searchTerm) ||
                championData.country.toLowerCase().includes(searchTerm) ||
                championData.league.toLowerCase().includes(searchTerm)) {
                results.push({ countryId, ...championData });
            }
        });

        return results;
    }
}

// Инициализация карты
document.addEventListener('DOMContentLoaded', () => {
    const map = new EuropeanChampionsMap();
    
    // Показываем Реал Мадрид как первого чемпиона
    setTimeout(() => {
        map.selectCountry('spain');
    }, 1000);

    // Глобальная переменная для доступа из консоли
    window.europeMap = map;

    // Добавляем обработчик для ссылок турниров
    document.querySelectorAll('.tournament-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Добавляем UTM метки для аналитики
            const url = new URL(link.href);
            url.searchParams.set('utm_source', 'special-european-champions-map');
            url.searchParams.set('utm_medium', 'interactive-map');
            url.searchParams.set('utm_campaign', 'european-champions');
            link.href = url.toString();
        });
    });

    // Обработчик клавиатуры для навигации
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // Переключение на следующую страну
            const countries = Object.keys(champions);
            const currentIndex = countries.indexOf(map.selectedCountry);
            const nextIndex = (currentIndex + 1) % countries.length;
            map.selectCountry(countries[nextIndex]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Переключение на предыдущую страну
            const countries = Object.keys(champions);
            const currentIndex = countries.indexOf(map.selectedCountry);
            const prevIndex = currentIndex === 0 ? countries.length - 1 : currentIndex - 1;
            map.selectCountry(countries[prevIndex]);
        }
    });

    console.log('🏆 Карта чемпионов Европы загружена!');
    console.log('💡 Используйте стрелки для навигации или кликайте по странам');
    console.log('🔍 Доступен объект window.europeMap для дополнительных возможностей');
}); 