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
                        stat {
                            ballPossession
                            shotsOnTarget
                            shotsOffTarget
                            cornerKicks
                            yellowCards
                            redCards
                            offsides
                            fouls
                        }
                    }
                    away {
                        team {
                            name
                            picture(productType: SPORTSRU, format: SVG) {
                                main
                            }
                        }
                        score
                        stat {
                            ballPossession
                            shotsOnTarget
                            shotsOffTarget
                            cornerKicks
                            yellowCards
                            redCards
                            offsides
                            fouls
                        }
                    }
                    referees {
                        name
                        type
                        country {
                            name
                        }
                    }
                    season {
                        tournament {
                            name
                            picture(productType: SPORTSRU, format: SVG) {
                                main
                            }
                        }
                    }
                    hasDetailStat
                    periodScore {
                        type
                        homeScore
                        awayScore
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
            
            // Добавляем статистику матча
            matchData.hasDetailStat = match.hasDetailStat;
            
            if (match.home.stat && match.away.stat) {
                matchData.stats = {
                    home: {
                        ballPossession: match.home.stat.ballPossession || 0,
                        shotsOnTarget: match.home.stat.shotsOnTarget || 0,
                        shotsOffTarget: match.home.stat.shotsOffTarget || 0,
                        cornerKicks: match.home.stat.cornerKicks || 0,
                        yellowCards: match.home.stat.yellowCards || 0,
                        redCards: match.home.stat.redCards || 0,
                        offsides: match.home.stat.offsides || 0,
                        fouls: match.home.stat.fouls || 0
                    },
                    away: {
                        ballPossession: match.away.stat.ballPossession || 0,
                        shotsOnTarget: match.away.stat.shotsOnTarget || 0,
                        shotsOffTarget: match.away.stat.shotsOffTarget || 0,
                        cornerKicks: match.away.stat.cornerKicks || 0,
                        yellowCards: match.away.stat.yellowCards || 0,
                        redCards: match.away.stat.redCards || 0,
                        offsides: match.away.stat.offsides || 0,
                        fouls: match.away.stat.fouls || 0
                    }
                };
            }
            
            // Добавляем счет по таймам
            if (match.periodScore && match.periodScore.length > 0) {
                matchData.periodScore = match.periodScore;
            }
            
            // Добавляем информацию о судьях
            if (match.referees && match.referees.length > 0) {
                matchData.referees = match.referees.map(referee => ({
                    name: referee.name,
                    type: referee.type,
                    country: referee.country?.name || '-'
                }));
            }
            
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
    
    // Функция для отображения типа судьи на русском
    function getRefereeTypeText(type) {
        const typeMap = {
            'main': 'Главный судья',
            'linesman_1': 'Боковой судья',
            'linesman_2': 'Боковой судья',
            'fourth_official': 'Четвертый судья',
            'var': 'VAR',
            'var_assistant': 'Ассистент VAR'
        };
        return typeMap[type.toLowerCase()] || type;
    }
    
    // Функция для отображения статистики матча
    function renderMatchStats() {
        if (!matchData.hasDetailStat || !matchData.stats) {
            return '';
        }
        
        const stats = matchData.stats;
        
        return `
            <div class="match-stats">
                <h3 class="match-stats__title">Статистика матча</h3>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.ballPossession || 0}%</div>
                    <div class="stat-item__name">Владение мячом</div>
                    <div class="stat-item__value">${stats.away.ballPossession || 0}%</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.shotsOnTarget || 0}</div>
                    <div class="stat-item__name">Удары в створ</div>
                    <div class="stat-item__value">${stats.away.shotsOnTarget || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.shotsOffTarget || 0}</div>
                    <div class="stat-item__name">Удары мимо</div>
                    <div class="stat-item__value">${stats.away.shotsOffTarget || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.cornerKicks || 0}</div>
                    <div class="stat-item__name">Угловые</div>
                    <div class="stat-item__value">${stats.away.cornerKicks || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.yellowCards || 0}</div>
                    <div class="stat-item__name">Желтые карточки</div>
                    <div class="stat-item__value">${stats.away.yellowCards || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.redCards || 0}</div>
                    <div class="stat-item__name">Красные карточки</div>
                    <div class="stat-item__value">${stats.away.redCards || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.offsides || 0}</div>
                    <div class="stat-item__name">Офсайды</div>
                    <div class="stat-item__value">${stats.away.offsides || 0}</div>
                </div>
                
                <div class="stat-item">
                    <div class="stat-item__value">${stats.home.fouls || 0}</div>
                    <div class="stat-item__name">Фолы</div>
                    <div class="stat-item__value">${stats.away.fouls || 0}</div>
                </div>
            </div>
        `;
    }
    
    // Функция для отображения счета по таймам
    function renderPeriodScore() {
        if (!matchData.periodScore || matchData.periodScore.length === 0) {
            return '';
        }
        
        const periodLabels = {
            REGULAR_PERIOD: 'Тайм',
            OVERTIME: 'Доп. время',
            PENALTIES: 'Пенальти'
        };
        
        let html = '<div class="period-score"><h3 class="period-score__title">Счет по таймам</h3><table class="period-table">';
        
        // Создаем строки для каждого типа периода
        const periodsByType = {};
        
        matchData.periodScore.forEach(period => {
            if (!periodsByType[period.type]) {
                periodsByType[period.type] = [];
            }
            periodsByType[period.type].push(period);
        });
        
        // Выводим результаты по периодам
        Object.keys(periodsByType).forEach(type => {
            const periods = periodsByType[type];
            const label = periodLabels[type] || type;
            
            periods.forEach((period, index) => {
                html += `
                <tr>
                    <td>${label} ${index + 1}</td>
                    <td>${period.homeScore}</td>
                    <td>${period.awayScore}</td>
                </tr>
                `;
            });
        });
        
        html += '</table></div>';
        return html;
    }
    
    // Функция для отображения информации о судьях
    function renderReferees() {
        if (!matchData.referees || matchData.referees.length === 0) {
            return '';
        }
        
        let html = '<div class="match-referees"><h3 class="match-referees__title">Судейство</h3><ul class="referees-list">';
        
        // Фильтруем и сортируем судей - выводим только главного и боковых
        const mainReferees = matchData.referees
            .filter(referee => ['main', 'linesman_1', 'linesman_2'].includes(referee.type.toLowerCase()))
            .sort((a, b) => {
                // Главный судья всегда первый
                if (a.type.toLowerCase() === 'main') return -1;
                if (b.type.toLowerCase() === 'main') return 1;
                return 0;
            });
        
        mainReferees.forEach(referee => {
            html += `
            <li class="referee-item">
                <div class="referee-item__type">${getRefereeTypeText(referee.type)}</div>
                <div class="referee-item__name">${referee.name}</div>
                <div class="referee-item__country">${referee.country}</div>
            </li>
            `;
        });
        
        html += '</ul></div>';
        return html;
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
            
            ${renderPeriodScore()}
            ${renderMatchStats()}
            ${renderReferees()}
            
            <div class="match-footer">
                <a href="https://www.sports.ru/football/match/${matchData.id}/?utm_source=special-football-match-widget" class="match-link">Подробнее о матче</a>
            </div>
        `;
    }
    
    // Получаем данные о матче
    fetchMatchData();
}); 