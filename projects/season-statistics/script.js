document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const tournamentSelect = document.getElementById('tournamentSelect');
    const seasonSelect = document.getElementById('seasonSelect');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const statsTabs = document.getElementById('statsTabs');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Элементы для отображения командной статистики
    const teamsGoals = document.getElementById('teamsGoals');
    const teamsPossession = document.getElementById('teamsPossession');
    const teamsPassing = document.getElementById('teamsPassing');
    const teamsShots = document.getElementById('teamsShots');

    // Элементы для отображения игровой статистики
    const playersGoals = document.getElementById('playersGoals');
    const playersAssists = document.getElementById('playersAssists');
    const playersGoalAssists = document.getElementById('playersGoalAssists');
    const playersYellowCards = document.getElementById('playersYellowCards');

    // Текущие выбранные данные
    let currentSeason = null;
    let currentTournament = null;
    let processedData = null;

    // Инициализация данных
    async function initializeData() {
        try {
            // Мы будем копировать JSON файл при загрузке страницы в локальную папку
            const response = await fetch('../ucl-matches-stat/stat.json');
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные');
            }
            const data = await response.json();
            
            // Обработка данных
            processData(data);
            
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            loadingIndicator.innerHTML = `
                <p style="color: var(--sports-red-a700);">Произошла ошибка при загрузке данных: ${error.message}</p>
                <button id="retryButton" class="retry-button">Повторить</button>
            `;
            document.getElementById('retryButton').addEventListener('click', initializeData);
        }
    }

    // Обработка и структурирование данных
    function processData(data) {
        if (!data || !data.data || !data.data.statQueries || !data.data.statQueries.football) {
            throw new Error('Некорректный формат данных');
        }

        const football = data.data.statQueries.football;
        
        // Получение списка уникальных турниров
        const tournaments = {};
        
        if (football.season && Array.isArray(football.season)) {
            football.season.forEach(season => {
                if (season.tournament && season.tournament.name) {
                    const tournamentName = season.tournament.name;
                    if (!tournaments[tournamentName]) {
                        tournaments[tournamentName] = [];
                    }
                    
                    tournaments[tournamentName].push({
                        id: season.id,
                        name: season.name,
                        startDate: season.startDate,
                        endDate: season.endDate,
                        year: season.year
                    });
                }
            });
        }
        
        // Заполнение выпадающего списка турниров
        populateTournamentSelect(tournaments);
        
        // Сохранение обработанных данных
        processedData = {
            tournaments,
            allSeasons: football.season
        };
        
        // Скрытие индикатора загрузки
        loadingIndicator.style.display = 'none';
    }

    // Заполнение выпадающего списка турниров
    function populateTournamentSelect(tournaments) {
        tournamentSelect.innerHTML = '<option value="" selected disabled>Выберите турнир</option>';
        
        Object.keys(tournaments).sort().forEach(tournamentName => {
            const option = document.createElement('option');
            option.value = tournamentName;
            option.textContent = tournamentName;
            tournamentSelect.appendChild(option);
        });
        
        // Активация выпадающего списка
        tournamentSelect.disabled = false;
    }

    // Заполнение выпадающего списка сезонов для выбранного турнира
    function populateSeasonSelect(tournamentName) {
        seasonSelect.innerHTML = '<option value="" selected disabled>Выберите сезон</option>';
        
        if (!processedData || !processedData.tournaments[tournamentName]) {
            return;
        }
        
        const seasons = processedData.tournaments[tournamentName];
        
        // Сортировка сезонов по времени (новые сверху)
        seasons.sort((a, b) => {
            return new Date(b.startDate) - new Date(a.startDate);
        });
        
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.id;
            option.textContent = season.name;
            seasonSelect.appendChild(option);
        });
        
        // Активация выпадающего списка
        seasonSelect.disabled = false;
    }

    // Загрузка статистики для выбранного сезона
    function loadSeasonStats(seasonId) {
        // Показать индикатор загрузки
        loadingIndicator.style.display = 'flex';
        
        try {
            if (!processedData || !processedData.allSeasons) {
                throw new Error('Данные не загружены');
            }
            
            // Поиск выбранного сезона
            const selectedSeason = processedData.allSeasons.find(season => season.id === seasonId);
            
            if (!selectedSeason) {
                throw new Error('Сезон не найден');
            }
            
            // Обработка матчей сезона для получения статистики
            const stats = analyzeSeasonStats(selectedSeason);
            
            // Отображение статистики
            displayStats(stats);
            
            // Скрытие индикатора загрузки
            loadingIndicator.style.display = 'none';
            
        } catch (error) {
            console.error('Ошибка при загрузке статистики сезона:', error);
            loadingIndicator.innerHTML = `
                <p style="color: var(--sports-red-a700);">Произошла ошибка при обработке статистики: ${error.message}</p>
                <button id="retryButton" class="retry-button">Повторить</button>
            `;
            document.getElementById('retryButton').addEventListener('click', () => loadSeasonStats(seasonId));
        }
    }

    // Анализ статистики сезона
    function analyzeSeasonStats(season) {
        const teams = {};
        const players = {};
        
        // Проверка наличия матчей
        if (!season.matches || !Array.isArray(season.matches)) {
            return { teams: {}, players: {} };
        }
        
        // Обработка каждого матча
        season.matches.forEach(match => {
            // Пропуск матчей без статуса 'CLOSED'
            if (match.matchStatus !== 'CLOSED') {
                return;
            }
            
            // Обработка команд
            ['home', 'away'].forEach(side => {
                if (match[side] && match[side].team) {
                    const team = match[side].team;
                    const teamId = team.id || team.name;
                    
                    if (!teams[teamId]) {
                        teams[teamId] = {
                            id: teamId,
                            name: team.name,
                            logo: team.logotype ? team.logotype.url : null,
                            matches: 0,
                            wins: 0,
                            draws: 0,
                            losses: 0,
                            goalsScored: 0,
                            goalsConceded: 0,
                            possession: 0,
                            possessionTotal: 0,
                            passes: 0,
                            passesTotal: 0,
                            shots: 0
                        };
                    }
                    
                    const currentTeam = teams[teamId];
                    currentTeam.matches++;
                    
                    // Голы
                    if (match[side].score !== undefined) {
                        const oppositeSide = side === 'home' ? 'away' : 'home';
                        const goalsScored = match[side].score || 0;
                        const goalsConceded = match[oppositeSide] && match[oppositeSide].score !== undefined ? match[oppositeSide].score : 0;
                        
                        currentTeam.goalsScored += goalsScored;
                        currentTeam.goalsConceded += goalsConceded;
                        
                        // Победы/ничьи/поражения
                        if (goalsScored > goalsConceded) {
                            currentTeam.wins++;
                        } else if (goalsScored === goalsConceded) {
                            currentTeam.draws++;
                        } else {
                            currentTeam.losses++;
                        }
                    }
                    
                    // Статистика владения мячом, если есть
                    if (match[side].stat && match[side].stat.possessionPercentage !== undefined) {
                        currentTeam.possession += match[side].stat.possessionPercentage;
                        currentTeam.possessionTotal++;
                    }
                    
                    // Статистика передач, если есть
                    if (match[side].stat && match[side].stat.passAccuracy !== undefined) {
                        currentTeam.passes += match[side].stat.passAccuracy;
                        currentTeam.passesTotal++;
                    }
                    
                    // Статистика ударов, если есть
                    if (match[side].stat && match[side].stat.shotsTotal !== undefined) {
                        currentTeam.shots += match[side].stat.shotsTotal;
                    }
                }
                
                // Обработка игроков
                if (match[side] && match[side].lineup && Array.isArray(match[side].lineup)) {
                    match[side].lineup.forEach(playerData => {
                        if (playerData.player) {
                            const player = playerData.player;
                            const playerId = player.id || player.name;
                            
                            if (!players[playerId]) {
                                players[playerId] = {
                                    id: playerId,
                                    name: player.name,
                                    photo: player.logotype ? player.logotype.url : null,
                                    team: match[side].team ? match[side].team.name : 'Неизвестно',
                                    teamLogo: match[side].team && match[side].team.logotype ? match[side].team.logotype.url : null,
                                    matches: 0,
                                    goalsScored: 0,
                                    assists: 0,
                                    yellowCards: 0,
                                    redCards: 0
                                };
                            }
                            
                            const currentPlayer = players[playerId];
                            currentPlayer.matches++;
                            
                            // Статистика игрока, если есть
                            if (playerData.stat) {
                                currentPlayer.goalsScored += playerData.stat.goalsScored || 0;
                                currentPlayer.assists += playerData.stat.assists || 0;
                                currentPlayer.yellowCards += playerData.stat.yellowCards || 0;
                                currentPlayer.redCards += (playerData.stat.redCards || 0) + (playerData.stat.yellowRedCards || 0);
                            }
                        }
                    });
                }
            });
        });
        
        // Вычисление средних значений
        Object.values(teams).forEach(team => {
            if (team.possessionTotal > 0) {
                team.possessionAvg = (team.possession / team.possessionTotal).toFixed(1);
            } else {
                team.possessionAvg = 0;
            }
            
            if (team.passesTotal > 0) {
                team.passesAvg = (team.passes / team.passesTotal).toFixed(1);
            } else {
                team.passesAvg = 0;
            }
            
            if (team.matches > 0) {
                team.shotsAvg = (team.shots / team.matches).toFixed(1);
            } else {
                team.shotsAvg = 0;
            }
        });
        
        return {
            teams: Object.values(teams),
            players: Object.values(players)
        };
    }

    // Отображение статистики
    function displayStats(stats) {
        // Сортировка команд по различным критериям
        const teamsByGoals = [...stats.teams].sort((a, b) => b.goalsScored - a.goalsScored);
        const teamsByPossession = [...stats.teams].sort((a, b) => parseFloat(b.possessionAvg) - parseFloat(a.possessionAvg));
        const teamsByPassing = [...stats.teams].sort((a, b) => parseFloat(b.passesAvg) - parseFloat(a.passesAvg));
        const teamsByShots = [...stats.teams].sort((a, b) => parseFloat(b.shotsAvg) - parseFloat(a.shotsAvg));
        
        // Сортировка игроков по различным критериям
        const playersByGoals = [...stats.players].sort((a, b) => b.goalsScored - a.goalsScored);
        const playersByAssists = [...stats.players].sort((a, b) => b.assists - a.assists);
        const playersByGoalAssists = [...stats.players].sort((a, b) => (b.goalsScored + b.assists) - (a.goalsScored + a.assists));
        const playersByYellowCards = [...stats.players].sort((a, b) => b.yellowCards - a.yellowCards);
        
        // Отображение команд
        teamsGoals.innerHTML = renderTeamStats(teamsByGoals.slice(0, 5), 'goalsScored', 'голов');
        teamsPossession.innerHTML = renderTeamStats(teamsByPossession.slice(0, 5), 'possessionAvg', '%');
        teamsPassing.innerHTML = renderTeamStats(teamsByPassing.slice(0, 5), 'passesAvg', '%');
        teamsShots.innerHTML = renderTeamStats(teamsByShots.slice(0, 5), 'shotsAvg', 'за матч');
        
        // Отображение игроков
        playersGoals.innerHTML = renderPlayerStats(playersByGoals.slice(0, 5), 'goalsScored', 'голов');
        playersAssists.innerHTML = renderPlayerStats(playersByAssists.slice(0, 5), 'assists', 'передач');
        playersGoalAssists.innerHTML = renderPlayerStats(playersByGoalAssists.slice(0, 5), '', '', (player) => `${player.goalsScored + player.assists} (${player.goalsScored}+${player.assists})`);
        playersYellowCards.innerHTML = renderPlayerStats(playersByYellowCards.slice(0, 5), 'yellowCards', 'карточек');
    }

    // Рендеринг статистики команд
    function renderTeamStats(teams, statKey, unit) {
        if (teams.length === 0) {
            return '<p class="no-data">Нет данных для отображения</p>';
        }
        
        return teams.map((team, index) => {
            return `
                <div class="stat-item">
                    <div class="stat-rank ${index < 3 ? 'top-3' : ''}">${index + 1}</div>
                    ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="stat-logo">` : '<div class="stat-logo"></div>'}
                    <div class="stat-name">${team.name}</div>
                    <div class="stat-value">${team[statKey]} ${unit}</div>
                </div>
            `;
        }).join('');
    }

    // Рендеринг статистики игроков
    function renderPlayerStats(players, statKey, unit, customValueFn = null) {
        if (players.length === 0) {
            return '<p class="no-data">Нет данных для отображения</p>';
        }
        
        return players.map((player, index) => {
            let statValue;
            if (customValueFn) {
                statValue = customValueFn(player);
            } else {
                statValue = `${player[statKey]} ${unit}`;
            }
            
            return `
                <div class="stat-item">
                    <div class="stat-rank ${index < 3 ? 'top-3' : ''}">${index + 1}</div>
                    ${player.photo ? `<img src="${player.photo}" alt="${player.name}" class="stat-logo">` : '<div class="stat-logo"></div>'}
                    <div class="stat-name">${player.name} <small>(${player.team})</small></div>
                    <div class="stat-value">${statValue}</div>
                </div>
            `;
        }).join('');
    }

    // Обработка переключения вкладок
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Удаление активного класса со всех кнопок и вкладок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавление активного класса на выбранную кнопку и вкладку
            button.classList.add('active');
            document.getElementById(`${tabId}Content`).classList.add('active');
        });
    });

    // Обработка выбора турнира
    tournamentSelect.addEventListener('change', () => {
        const selectedTournament = tournamentSelect.value;
        currentTournament = selectedTournament;
        
        // Сброс выпадающего списка сезонов
        seasonSelect.innerHTML = '<option value="" selected disabled>Выберите сезон</option>';
        seasonSelect.disabled = true;
        
        // Заполнение выпадающего списка сезонов
        populateSeasonSelect(selectedTournament);
    });

    // Обработка выбора сезона
    seasonSelect.addEventListener('change', () => {
        const selectedSeason = seasonSelect.value;
        currentSeason = selectedSeason;
        
        // Загрузка статистики для выбранного сезона
        loadSeasonStats(selectedSeason);
    });

    // Инициализация данных при загрузке страницы
    initializeData();
}); 