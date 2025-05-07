document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const loader = document.getElementById('loader');
    const matchesList = document.getElementById('matchesList');
    const errorMessage = document.getElementById('errorMessage');
    
    // Загружаем данные о будущих матчах
    fetchUpcomingMatches();
    
    // Функция для загрузки данных о будущих матчах
    async function fetchUpcomingMatches() {
        try {
            // Формируем GraphQL запрос для получения будущих матчей определенного сезона
            const query = `
            {
                statQueries {
                    football {
                        season(id: ["${CONFIG.seasonId}"]) {
                            id
                            tournament {
                                id
                                name
                                shortName
                                logo
                            }
                            matches {
                                id
                                status
                                stageType
                                startTimeTimestamp
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
                                venueShortName
                            }
                        }
                    }
                }
            }`;
            
            // Отправляем запрос к API
            const response = await fetch(`${CONFIG.gqlEndpoint}?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            // Скрываем лоадер
            loader.style.display = 'none';
            
            // Обрабатываем ответ
            if (data.data && data.data.statQueries && data.data.statQueries.football) {
                const seasons = data.data.statQueries.football.season;
                
                if (seasons && seasons.length > 0) {
                    // Получаем данные сезона
                    const season = seasons[0];
                    const matches = season.matches || [];
                    
                    // Фильтруем и сортируем будущие матчи
                    const upcomingMatches = matches
                        .filter(match => match.status === 'scheduled' || match.status === 'time_scheduled')
                        .sort((a, b) => a.startTimeTimestamp - b.startTimeTimestamp);
                    
                    // Группируем матчи по типу стадии
                    const groupedMatches = groupMatchesByStage(upcomingMatches);
                    
                    // Отображаем матчи
                    displayMatches(groupedMatches, season.tournament);
                } else {
                    showNoMatchesMessage();
                }
            } else {
                showNoMatchesMessage();
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            loader.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
        }
    }
    
    // Функция для группировки матчей по типу стадии
    function groupMatchesByStage(matches) {
        return matches.reduce((acc, match) => {
            const stageType = match.stageType || 'other';
            if (!acc[stageType]) {
                acc[stageType] = [];
            }
            acc[stageType].push(match);
            return acc;
        }, {});
    }
    
    // Функция для отображения матчей
    function displayMatches(groupedMatches, tournament) {
        // Очищаем контейнер для матчей
        matchesList.innerHTML = '';
        
        // Если нет будущих матчей, показываем сообщение
        if (Object.keys(groupedMatches).length === 0) {
            showNoMatchesMessage();
            return;
        }
        
        // Обрабатываем каждую группу матчей
        for (const stageType in groupedMatches) {
            const matches = groupedMatches[stageType];
            
            // Если есть матчи в этой стадии
            if (matches.length > 0) {
                // Добавляем заголовок для стадии
                const stageName = CONFIG.stageNames[stageType] || stageType;
                const stageHeader = document.createElement('h2');
                stageHeader.textContent = stageName;
                stageHeader.className = 'group-title';
                matchesList.appendChild(stageHeader);
                
                // Добавляем матчи
                matches.forEach(match => {
                    const matchCard = createMatchCard(match, tournament);
                    matchesList.appendChild(matchCard);
                });
            }
        }
    }
    
    // Функция создания карточки матча
    function createMatchCard(match, tournament) {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Форматируем дату и время матча
        const matchDate = new Date(match.startTimeTimestamp * 1000);
        const formattedDate = matchDate.toLocaleDateString('ru-RU', CONFIG.dateOptions);
        const formattedTime = matchDate.toLocaleTimeString('ru-RU', CONFIG.timeOptions);
        
        // Получаем домашнюю и гостевую команды
        const homeTeam = match.homeTeam || { name: 'TBD' };
        const awayTeam = match.awayTeam || { name: 'TBD' };
        
        // Создаем HTML для карточки матча
        matchCard.innerHTML = `
            <div class="match-header">
                <div class="match-tournament">${tournament.shortName || tournament.name}</div>
                <div class="match-date">${formattedDate}, ${formattedTime}</div>
            </div>
            <div class="match-teams">
                <div class="team home-team">
                    <div class="team-name">${homeTeam.name}</div>
                    <div class="team-logo">
                        <img src="${getTeamLogo(homeTeam)}" alt="${homeTeam.name}" loading="lazy">
                    </div>
                </div>
                <div class="match-time">
                    <div class="match-vs">vs</div>
                </div>
                <div class="team away-team">
                    <div class="team-logo">
                        <img src="${getTeamLogo(awayTeam)}" alt="${awayTeam.name}" loading="lazy">
                    </div>
                    <div class="team-name">${awayTeam.name}</div>
                </div>
            </div>
            ${match.venueShortName ? `<div class="match-venue">${match.venueShortName}</div>` : ''}
        `;
        
        return matchCard;
    }
    
    // Функция для получения логотипа команды (с учетом кэша)
    function getTeamLogo(team) {
        // Пытаемся найти логотип в нашем локальном кэше
        const teamName = team.name.toLowerCase().replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')
            .replace(/__+/g, '_');
        
        // Проверяем, есть ли логотип в нашем кэше
        if (TEAMS_DATA.logos[teamName]) {
            return TEAMS_DATA.logos[teamName];
        }
        
        // Если нет в кэше, используем полученный из API или значение по умолчанию
        return team.logo || 'https://img.sports.ru/images/26000166/77/d5/26000166775d63a77b073aa7f0d6066d.png';
    }
    
    // Функция для отображения сообщения об отсутствии матчей
    function showNoMatchesMessage() {
        matchesList.innerHTML = '<div class="no-matches">В ближайшее время нет запланированных матчей</div>';
    }
}); 