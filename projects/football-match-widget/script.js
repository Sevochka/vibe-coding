document.addEventListener('DOMContentLoaded', () => {
    // ID матча и источник данных
    const matchId = '1766439';
    const source = 'SPORTS';
    
    // Формируем GraphQL запрос
    const query = `{
        statQueries {
            football {
                match(id: "${matchId}", source: ${source}) {
                    id
                    matchStatus
                    scheduledAt
                    venue {
                        name
                        city
                    }
                    currentTime
                    home {
                        team {
                            name
                            picture(productType: SPORTSRU, format: SVG) {
                                main
                            }
                        }
                        score
                    }
                    away {
                        team {
                            name
                            picture(productType: SPORTSRU, format: SVG) {
                                main
                            }
                        }
                        score
                    }
                    season {
                        tournament {
                            name
                            picture(productType: SPORTSRU, format: SVG) {
                                main
                            }
                        }
                    }
                }
            }
        }
    }`;
    
    // URL для GraphQL запроса
    const url = 'https://www.sports.ru/gql/graphql/';
    
    // Функция для получения данных о матче
    async function fetchMatchData() {
        try {
            const response = await fetch(`${url}?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            const match = data.data.statQueries.football.match;
            
            // Обновляем данные
            matchData.id = match.id;
            matchData.matchStatus = match.matchStatus;
            matchData.scheduledAt = match.scheduledAt;
            matchData.currentTime = match.currentTime;
            matchData.homeTeam = {
                name: match.home.team.name,
                logo: match.home.team.picture.main
            };
            matchData.awayTeam = {
                name: match.away.team.name,
                logo: match.away.team.picture.main
            };
            matchData.homeScore = match.home.score;
            matchData.awayScore = match.away.score;
            matchData.tournament = {
                name: match.season.tournament.name,
                logo: match.season.tournament.picture.main
            };
            matchData.venue = {
                name: match.venue?.name || '-',
                city: match.venue?.city || '-'
            };
            
            // Отображаем виджет
            renderMatchWidget();
        } catch (error) {
            console.error('Ошибка при получении данных о матче:', error);
            // Отображаем виджет с тестовыми данными в случае ошибки
            renderMatchWidget();
        }
    }
    
    // Функция для форматирования даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Функция для получения статуса матча на русском
    function getMatchStatusText(status) {
        const statusMap = {
            'LIVE': 'Идёт сейчас',
            'NOT_STARTED': 'Скоро начнётся',
            'ENDED': 'Завершён',
            'POSTPONED': 'Перенесён',
            'CANCELLED': 'Отменён',
            'CLOSED': 'Завершён',
            'DELAYED': 'Задержан',
            'START_DELAYED': 'Начало задержано',
            'ABANDONED': 'Прерван',
            'UNDEFINED': 'Неизвестен'
        };
        return statusMap[status] || 'Неизвестен';
    }
    
    // Функция для получения класса CSS на основе статуса
    function getStatusClass(status) {
        const classMap = {
            'LIVE': 'status-live',
            'NOT_STARTED': 'status-not-started',
            'ENDED': 'status-ended',
            'POSTPONED': 'status-postponed',
            'CANCELLED': 'status-postponed',
            'CLOSED': 'status-ended',
            'DELAYED': 'status-postponed',
            'START_DELAYED': 'status-postponed',
            'ABANDONED': 'status-postponed',
            'UNDEFINED': 'status-not-started'
        };
        return classMap[status] || 'status-not-started';
    }
    
    // Функция для отображения времени матча
    function getMatchTime(status, scheduledAt, currentTime) {
        if (status === 'LIVE') {
            return currentTime;
        } else if (status === 'NOT_STARTED') {
            return formatDate(scheduledAt);
        } else {
            return getMatchStatusText(status);
        }
    }
    
    // Функция для отображения виджета матча
    function renderMatchWidget() {
        const matchWidget = document.getElementById('match-widget');
        
        // Определяем статус матча и его оформление
        const statusText = getMatchStatusText(matchData.matchStatus);
        const statusClass = getStatusClass(matchData.matchStatus);
        const matchTime = getMatchTime(matchData.matchStatus, matchData.scheduledAt, matchData.currentTime);
        
        // Создаём HTML-разметку виджета
        matchWidget.innerHTML = `
            <div class="match-header">
                <a href="https://www.sports.ru/?utm_source=special-football-match-widget" class="match-header__tournament">
                    <img src="${matchData.tournament.logo}" alt="${matchData.tournament.name}" class="match-header__tournament-logo">
                    <span>${matchData.tournament.name}</span>
                </a>
                <div class="match-header__status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="match-main">
                <div class="team">
                    <img src="${matchData.homeTeam.logo}" alt="${matchData.homeTeam.name}" class="team__logo">
                    <div class="team__name">${matchData.homeTeam.name}</div>
                </div>
                
                <div class="match-score">
                    <div class="match-score__numbers">${matchData.homeScore} : ${matchData.awayScore}</div>
                    <div class="match-score__time">${matchTime}</div>
                </div>
                
                <div class="team">
                    <img src="${matchData.awayTeam.logo}" alt="${matchData.awayTeam.name}" class="team__logo">
                    <div class="team__name">${matchData.awayTeam.name}</div>
                </div>
            </div>
            
            <div class="match-meta">
                <div class="match-meta__item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                    </svg>
                    ${matchData.venue.name}, ${matchData.venue.city}
                </div>
            </div>
            
            <div class="match-footer">
                <a href="https://www.sports.ru/football/match/${matchData.id}/?utm_source=special-football-match-widget" class="match-link">Подробнее о матче</a>
            </div>
        `;
    }
    
    // Получаем данные о матче
    fetchMatchData();
}); 