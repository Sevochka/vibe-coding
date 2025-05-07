/**
 * Функция для получения будущих матчей Лиги чемпионов 2024-2025
 */
async function fetchChampionsLeagueMatches() {
    try {
        // Формируем GraphQL запрос для получения матчей сезона
        const query = `{
            statQueries {
                football {
                    upcomingMatches(
                        dateLimit: "2025-06-30",
                        tournamentIds: ["champions_league"]
                    ) {
                        id
                        date
                        status
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
                            name
                            city
                        }
                        round {
                            name
                        }
                    }
                }
            }
        }`;

        // Кодируем запрос для URL
        const encodedQuery = encodeURIComponent(query);
        const endpoint = `https://www.sports.ru/gql/graphql/?query=${encodedQuery}`;

        // Выполняем запрос к GraphQL API
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Проверяем, есть ли ошибки в ответе
        if (data.errors) {
            throw new Error(data.errors[0]?.message || 'Ошибка GraphQL запроса');
        }

        // Получаем данные о матчах
        const matches = data.data?.statQueries?.football?.upcomingMatches || [];
        
        if (matches.length === 0) {
            throw new Error('Матчи не найдены');
        }

        // Сортируем матчи по дате
        const sortedMatches = matches.sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        return sortedMatches;
    } catch (error) {
        console.error('Ошибка при получении матчей:', error);
        throw error;
    }
}

/**
 * Преобразует строку с датой в формат для отображения
 * @param {string} dateString - ISO строка даты
 * @returns {object} - Объект с датой и временем в отформатированном виде
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Названия месяцев на русском
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    // Названия дней недели на русском
    const weekdays = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 
        'Четверг', 'Пятница', 'Суббота'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const weekday = weekdays[date.getDay()];
    
    // Форматируем время (часы:минуты)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    // Добавляем ведущий ноль при необходимости
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    
    const time = `${hours}:${minutes}`;
    
    return {
        date: `${day} ${month}`,
        weekday,
        time
    };
}

/**
 * Создает HTML для карточки матча
 * @param {Object} match - Данные о матче
 * @returns {string} - HTML-разметка карточки матча
 */
function createMatchCard(match) {
    const { date, weekday, time } = formatDate(match.date);
    
    return `
        <div class="match-card">
            <div class="match-header">
                <div class="match-tournament">${match.round?.name || 'Лига чемпионов'}</div>
                <div class="match-date">${weekday}, ${date}</div>
            </div>
            <div class="match-content">
                <div class="team">
                    <img src="${match.homeTeam.logo || 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png'}" alt="${match.homeTeam.name}" class="team-logo">
                    <div class="team-name">${match.homeTeam.name}</div>
                </div>
                <div class="vs">
                    <div class="vs-text">vs</div>
                    <div class="match-time">${time}</div>
                </div>
                <div class="team">
                    <img src="${match.awayTeam.logo || 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png'}" alt="${match.awayTeam.name}" class="team-logo">
                    <div class="team-name">${match.awayTeam.name}</div>
                </div>
            </div>
            ${match.venue?.name ? `<div class="match-venue">${match.venue.name}${match.venue.city ? `, ${match.venue.city}` : ''}</div>` : ''}
        </div>
    `;
} 