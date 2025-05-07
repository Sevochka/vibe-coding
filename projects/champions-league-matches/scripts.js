// Основной JavaScript файл для получения и отображения будущих матчей

document.addEventListener('DOMContentLoaded', () => {
    // Получаем контейнеры для отображения
    const matchesList = document.getElementById('matches-list');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');

    // Функция для загрузки данных с API
    const fetchUpcomingMatches = async () => {
        try {
            // Получаем дату limit для будущих матчей
            const dateLimit = CONFIG.getDateLimit();
            
            // Создаем GraphQL запрос
            const query = `
                {
                    statFootball {
                        season(id: ["${CONFIG.seasonId}"]) {
                            id
                            name
                            tournament {
                                id
                                name
                            }
                            upcomingMatches: matches(status: SCHEDULED, sort: DATE_ASC, limit: ${CONFIG.maxMatches}) {
                                id
                                startDate
                                homeTeam {
                                    id
                                    name
                                    logo
                                }
                                awayTeam {
                                    id
                                    name
                                    logo
                                }
                                venue {
                                    id
                                    name
                                    city {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            `;
            
            // Кодируем запрос для URL
            const encodedQuery = encodeURIComponent(query);
            const url = `${CONFIG.apiUrl}?query=${encodedQuery}`;
            
            // Выполняем запрос к API
            const response = await fetch(url);
            const data = await response.json();
            
            // Проверяем наличие ошибок в ответе
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            // Проверяем, что получили данные сезона
            if (!data.data || !data.data.statFootball || !data.data.statFootball.season || !data.data.statFootball.season[0]) {
                throw new Error('Не удалось получить данные о матчах');
            }
            
            // Получаем массив предстоящих матчей
            const season = data.data.statFootball.season[0];
            const matches = season.upcomingMatches || [];
            
            // Отображаем матчи
            renderMatches(matches);
            
        } catch (error) {
            console.error('Ошибка при загрузке матчей:', error);
            showError(error.message || 'Произошла ошибка при загрузке матчей');
        }
    };
    
    // Функция для отображения списка матчей
    const renderMatches = (matches) => {
        // Скрываем лоадер
        loader.style.display = 'none';
        
        // Если матчей нет, показываем сообщение
        if (!matches || matches.length === 0) {
            showError('Нет предстоящих матчей для отображения');
            return;
        }
        
        // Очищаем контейнер и показываем его
        matchesList.innerHTML = '';
        matchesList.style.display = 'block';
        
        // Группируем матчи по датам
        const matchesByDate = groupMatchesByDate(matches);
        
        // Отображаем матчи, сгруппированные по датам
        for (const [date, dateMatches] of Object.entries(matchesByDate)) {
            // Создаем заголовок для даты
            const dateHeader = document.createElement('div');
            dateHeader.className = 'match-date';
            dateHeader.textContent = CONFIG.formatDate(date);
            matchesList.appendChild(dateHeader);
            
            // Отображаем все матчи на эту дату
            dateMatches.forEach(match => {
                const matchCard = createMatchCard(match);
                matchesList.appendChild(matchCard);
            });
        }
    };
    
    // Функция для группировки матчей по датам
    const groupMatchesByDate = (matches) => {
        const grouped = {};
        
        matches.forEach(match => {
            // Получаем только дату (без времени)
            const date = match.startDate ? match.startDate.split('T')[0] : 'Неизвестно';
            
            // Создаем массив для этой даты, если его еще нет
            if (!grouped[date]) {
                grouped[date] = [];
            }
            
            // Добавляем матч в соответствующую группу
            grouped[date].push(match);
        });
        
        return grouped;
    };
    
    // Функция для создания карточки матча
    const createMatchCard = (match) => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Получаем данные о командах
        const homeTeam = match.homeTeam || { name: 'Неизвестно', logo: '' };
        const awayTeam = match.awayTeam || { name: 'Неизвестно', logo: '' };
        const venue = match.venue || { name: '', city: { name: '' } };
        
        // Форматируем время матча
        const matchTime = CONFIG.formatTime(match.startDate);
        
        // Формируем название стадиона и города
        let venueText = '';
        if (venue.name) {
            venueText = venue.name;
            if (venue.city && venue.city.name) {
                venueText += `, ${venue.city.name}`;
            }
        }
        
        // Создаем HTML для карточки матча
        matchCard.innerHTML = `
            <div class="match-teams">
                <div class="team team-home">
                    <span class="team-name">${homeTeam.name}</span>
                    <img class="team-logo" src="${homeTeam.logo || 'https://dumpster.cdn.sports.ru/0/08/cc55d04e9b8982897827dccb94e8f.png'}" alt="${homeTeam.name}">
                </div>
                <div class="match-time">${matchTime}</div>
                <div class="team team-away">
                    <img class="team-logo" src="${awayTeam.logo || 'https://dumpster.cdn.sports.ru/0/08/cc55d04e9b8982897827dccb94e8f.png'}" alt="${awayTeam.name}">
                    <span class="team-name">${awayTeam.name}</span>
                </div>
            </div>
            ${venueText ? `<div class="match-venue">${venueText}</div>` : ''}
        `;
        
        return matchCard;
    };
    
    // Функция для отображения ошибки
    const showError = (message) => {
        loader.style.display = 'none';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    };
    
    // Запускаем загрузку данных
    fetchUpcomingMatches();
}); 