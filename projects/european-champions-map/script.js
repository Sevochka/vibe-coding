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
            const countryData = countries[countryId];
            
            // Создаем группу для страны
            const countryGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            countryGroup.setAttribute('class', 'country-group');
            countryGroup.setAttribute('data-country', countryId);

            // Создаем путь страны
            const countryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            countryPath.setAttribute('d', country.path);
            
            // Определяем классы для стилизации
            let classes = 'country';
            if (championData?.big5) {
                classes += ' big5';
            }
            if (!championData) {
                classes += ' no-data';
            }
            
            countryPath.setAttribute('class', classes);
            countryPath.setAttribute('data-country', countryId);

            // Добавляем лейбл страны (только если есть данные о стране)
            if (countryData) {
                const countryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                countryLabel.setAttribute('x', country.cx);
                countryLabel.setAttribute('y', country.cy);
                countryLabel.setAttribute('class', 'country-label');
                countryLabel.textContent = countryData.code;
                countryGroup.appendChild(countryLabel);
            }

            countryGroup.appendChild(countryPath);
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

        // Обработка движения мыши для обновления позиции tooltip
        this.mapContainer.addEventListener('mousemove', (e) => {
            const tooltip = document.getElementById('map-tooltip');
            if (tooltip && tooltip.style.opacity === '1') {
                tooltip.style.left = e.pageX + 15 + 'px';
                tooltip.style.top = e.pageY - 10 + 'px';
            }
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
                    <h3 class="champion-title">📊 ${countryData?.name || countryId}</h3>
                    <p class="champion-description">
                        ${countryData ? 
                            `Информация о чемпионе ${countryData.name} пока недоступна. Население: ${countryData.population}, столица: ${countryData.capital}.` :
                            `К сожалению, данные по этой стране пока недоступны.`
                        }
                    </p>
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
                max-width: 200px;
                text-align: center;
            `;
            document.body.appendChild(tooltip);
        }

        if (championData) {
            tooltip.innerHTML = `
                <strong>${championData.champion}</strong><br>
                <small>${championData.country} • ${championData.league}</small>
            `;
        } else if (countryData) {
            tooltip.innerHTML = `
                <strong>${countryData.name}</strong><br>
                <small>Данные недоступны</small>
            `;
        } else {
            tooltip.innerHTML = `
                <strong>${countryId.toUpperCase()}</strong><br>
                <small>Нет информации</small>
            `;
        }

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

    // Получить статистику по карте
    getMapStats() {
        const totalCountries = Object.keys(mapPaths).length;
        const countriesWithData = Object.keys(champions).length;
        const big5Countries = Object.values(champions).filter(c => c.big5).length;
        
        return {
            totalCountries,
            countriesWithData,
            countriesWithoutData: totalCountries - countriesWithData,
            big5Countries,
            coverage: Math.round((countriesWithData / totalCountries) * 100)
        };
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
        const availableCountries = Object.keys(champions);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // Переключение на следующую страну
            const currentIndex = availableCountries.indexOf(map.selectedCountry);
            const nextIndex = (currentIndex + 1) % availableCountries.length;
            map.selectCountry(availableCountries[nextIndex]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Переключение на предыдущую страну
            const currentIndex = availableCountries.indexOf(map.selectedCountry);
            const prevIndex = currentIndex === 0 ? availableCountries.length - 1 : currentIndex - 1;
            map.selectCountry(availableCountries[prevIndex]);
        }
    });

    const stats = map.getMapStats();
    console.log('🗺️ Карта чемпионов Европы загружена!');
    console.log(`📊 Статистика: ${stats.countriesWithData}/${stats.totalCountries} стран (${stats.coverage}% покрытие)`);
    console.log(`⭐ Топ-5 лиг UEFA: ${stats.big5Countries} стран`);
    console.log('💡 Используйте стрелки для навигации или кликайте по странам');
    console.log('🔍 Доступны команды: europeMap.searchChampion("запрос"), europeMap.getMapStats()');
}); 