/**
 * Обработчик загрузки документа
 */
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем данные турнирной таблицы
    loadTournamentTable();
});

/**
 * Загружает данные турнирной таблицы и отображает их
 */
async function loadTournamentTable() {
    const loadingElement = document.getElementById('loading');
    const tableContainerElement = document.getElementById('table-container');
    const errorContainerElement = document.getElementById('error-container');

    try {
        // Получаем данные турнирной таблицы
        const data = await ApiService.getTournamentTable();
        
        // Логируем данные для отладки
        console.log('Полученные данные:', data);
        
        // Проверяем наличие данных (с учетом того, что rankingTeamStat - массив)
        if (!data || !data.data || !data.data.statQueries || !data.data.statQueries.football || 
            !data.data.statQueries.football.tournament || !data.data.statQueries.football.tournament.currentSeason ||
            !data.data.statQueries.football.tournament.currentSeason.rankingTeamStat) {
            throw new Error('Данные турнирной таблицы отсутствуют или имеют неверный формат');
        }

        // Получаем элементы таблицы, работаем с массивом rankingTeamStat
        const rankingTeamStat = data.data.statQueries.football.tournament.currentSeason.rankingTeamStat;
        
        // Проверяем, есть ли элементы в массиве
        if (!rankingTeamStat || !rankingTeamStat.length) {
            throw new Error('Массив данных турнирной таблицы пуст');
        }
        
        // Берем первый элемент массива, который должен содержать items
        const tableItems = rankingTeamStat[0].items;
        
        if (!tableItems || !tableItems.length) {
            throw new Error('Данные команд в турнирной таблице отсутствуют');
        }
        
        // Сортируем элементы по позиции (rank)
        const sortedTableItems = tableItems.sort((a, b) => a.rank - b.rank);
        
        // Отображаем таблицу
        renderTournamentTable(sortedTableItems);
        
        // Показываем таблицу и скрываем индикатор загрузки
        loadingElement.style.display = 'none';
        tableContainerElement.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при загрузке турнирной таблицы:', error);
        
        // Показываем сообщение об ошибке и скрываем индикатор загрузки
        loadingElement.style.display = 'none';
        errorContainerElement.style.display = 'block';
    }
}

/**
 * Отображает турнирную таблицу
 * @param {Array} tableItems - Элементы турнирной таблицы
 */
function renderTournamentTable(tableItems) {
    const tableBodyElement = document.getElementById('table-body');
    
    // Очищаем содержимое таблицы
    tableBodyElement.innerHTML = '';
    
    // Перебираем элементы таблицы и добавляем их в DOM
    tableItems.forEach(item => {
        const team = item.team;
        const stat = item.stat;
        const logoUrl = team.logotype ? team.logotype.url : '';
        
        // Создаем строку таблицы
        const tableRow = document.createElement('tr');
        
        // Добавляем позицию команды
        const positionCell = document.createElement('td');
        positionCell.className = 'position';
        positionCell.textContent = item.rank;
        tableRow.appendChild(positionCell);
        
        // Добавляем информацию о команде
        const teamCell = document.createElement('td');
        teamCell.className = 'team';
        
        // Создаем логотип команды
        const teamLogo = document.createElement('img');
        teamLogo.className = 'team-logo';
        teamLogo.src = logoUrl;
        teamLogo.alt = team.name;
        teamCell.appendChild(teamLogo);
        
        // Создаем название команды
        const teamName = document.createElement('span');
        teamName.className = 'team-name';
        teamName.textContent = team.name;
        teamCell.appendChild(teamName);
        
        // Добавляем текущий матч, если есть
        if (team.teaser && team.teaser.current) {
            const liveMatch = createLiveMatchElement(team.teaser.current);
            teamCell.appendChild(document.createElement('br'));
            teamCell.appendChild(liveMatch);
        }
        
        tableRow.appendChild(teamCell);
        
        // Добавляем результаты последних 5 матчей
        const lastFiveCell = document.createElement('td');
        lastFiveCell.className = 'last-five';
        
        // Создаем контейнер для результатов
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'last-five';
        
        // Добавляем результаты (не более 5)
        if (team.lastFive && team.lastFive.length > 0) {
            team.lastFive.slice(0, 5).forEach(match => {
                const resultElement = document.createElement('a');
                resultElement.className = `match-result ${getResultClass(match.result)}`;
                resultElement.textContent = getResultShortText(match.result);
                
                // Добавляем ссылку на матч, если есть
                if (match.match && match.match.links && match.match.links.sportsRu) {
                    resultElement.href = match.match.links.sportsRu;
                    resultElement.target = '_blank';
                }
                
                resultsContainer.appendChild(resultElement);
            });
        }
        
        lastFiveCell.appendChild(resultsContainer);
        tableRow.appendChild(lastFiveCell);
        
        // Добавляем статистику
        tableRow.appendChild(createStatCell(stat.MatchesPlayed));
        tableRow.appendChild(createStatCell(stat.MatchesWon));
        tableRow.appendChild(createStatCell(stat.MatchesDrawn));
        tableRow.appendChild(createStatCell(stat.MatchesLost));
        tableRow.appendChild(createStatCell(stat.GoalsScored));
        tableRow.appendChild(createStatCell(stat.GoalsConceded));
        
        // Разница голов
        const goalDiff = stat.GoalsScored - stat.GoalsConceded;
        const goalDiffCell = document.createElement('td');
        goalDiffCell.textContent = goalDiff > 0 ? `+${goalDiff}` : goalDiff;
        tableRow.appendChild(goalDiffCell);
        
        // Очки (победа = 3 очка, ничья = 1 очко)
        const points = (stat.MatchesWon * 3) + stat.MatchesDrawn;
        const pointsCell = document.createElement('td');
        pointsCell.className = 'matches-played';
        pointsCell.textContent = points;
        tableRow.appendChild(pointsCell);
        
        // Добавляем строку в таблицу
        tableBodyElement.appendChild(tableRow);
    });
}

/**
 * Создаёт ячейку со статистическими данными
 * @param {number} value - Значение статистики
 * @returns {HTMLElement} - Ячейка таблицы
 */
function createStatCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    return cell;
}

/**
 * Возвращает класс CSS для результата матча
 * @param {string} result - Результат матча (WIN, DRAW, LOSE)
 * @returns {string} - Класс CSS
 */
function getResultClass(result) {
    switch(result) {
        case 'WIN': return 'win';
        case 'DRAW': return 'draw';
        case 'LOSE': return 'lose';
        default: return '';
    }
}

/**
 * Возвращает короткий текст для результата матча
 * @param {string} result - Результат матча (WIN, DRAW, LOSE)
 * @returns {string} - Короткий текст (В, Н, П)
 */
function getResultShortText(result) {
    switch(result) {
        case 'WIN': return 'В';
        case 'DRAW': return 'Н';
        case 'LOSE': return 'П';
        default: return '';
    }
}

/**
 * Создаёт элемент с информацией о текущем матче
 * @param {Object} match - Информация о матче
 * @returns {HTMLElement} - Элемент с информацией о матче
 */
function createLiveMatchElement(match) {
    const liveMatchContainer = document.createElement('div');
    liveMatchContainer.className = 'live-match';
    
    // Статус матча
    const matchStatus = document.createElement('div');
    matchStatus.className = 'live-match-status';
    matchStatus.textContent = match.currentMinute ? match.currentMinute : 'LIVE';
    liveMatchContainer.appendChild(matchStatus);
    
    // Информация о командах и счёте
    const teamsContainer = document.createElement('a');
    teamsContainer.className = 'live-match-teams';
    teamsContainer.href = match.links.sportsRu;
    teamsContainer.target = '_blank';
    
    // Домашняя команда
    const homeTeam = document.createElement('div');
    homeTeam.className = 'live-team';
    
    const homeTeamLogo = document.createElement('img');
    homeTeamLogo.src = match.home.team.logotype.url;
    homeTeamLogo.alt = match.home.team.name;
    homeTeam.appendChild(homeTeamLogo);
    
    const homeTeamName = document.createElement('span');
    homeTeamName.textContent = match.home.team.name;
    homeTeam.appendChild(homeTeamName);
    
    teamsContainer.appendChild(homeTeam);
    
    // Счёт
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'live-score';
    
    const homeScore = document.createElement('span');
    homeScore.textContent = match.home.score;
    scoreContainer.appendChild(homeScore);
    
    const separator = document.createElement('span');
    separator.className = 'live-separator';
    separator.textContent = ':';
    scoreContainer.appendChild(separator);
    
    const awayScore = document.createElement('span');
    awayScore.textContent = match.away.score;
    scoreContainer.appendChild(awayScore);
    
    teamsContainer.appendChild(scoreContainer);
    
    // Гостевая команда
    const awayTeam = document.createElement('div');
    awayTeam.className = 'live-team';
    
    const awayTeamLogo = document.createElement('img');
    awayTeamLogo.src = match.away.team.logotype.url;
    awayTeamLogo.alt = match.away.team.name;
    awayTeam.appendChild(awayTeamLogo);
    
    const awayTeamName = document.createElement('span');
    awayTeamName.textContent = match.away.team.name;
    awayTeam.appendChild(awayTeamName);
    
    teamsContainer.appendChild(awayTeam);
    
    liveMatchContainer.appendChild(teamsContainer);
    
    return liveMatchContainer;
} 