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
        
        // Проверяем наличие данных
        if (!data || !data.data || !data.data.statQueries || !data.data.statQueries.football || 
            !data.data.statQueries.football.tournament || !data.data.statQueries.football.tournament.currentSeason ||
            !data.data.statQueries.football.tournament.currentSeason.stages) {
            throw new Error('Данные турнирной таблицы отсутствуют или имеют неверный формат');
        }

        // Проверяем наличие данных матчей
        const currentMatches = data.data.statQueries.football.tournament.currentSeason.pageListMatches?.list || [];
        
        // Извлекаем информацию о текущих матчах
        const liveMatches = {};
        
        if (currentMatches.length > 0) {
            currentMatches.forEach(match => {
                // Сохраняем информацию о текущих матчах по ID команд
                // для домашней команды
                if (match.home && match.home.team) {
                    liveMatches[match.home.team.name] = match;
                }
                // для гостевой команды
                if (match.away && match.away.team) {
                    liveMatches[match.away.team.name] = match;
                }
            });
        }
        
        // Получаем элементы таблицы
        // проверяем сначала stages
        const stages = data.data.statQueries.football.tournament.currentSeason.stages;
        
        if (!stages || !stages.length) {
            throw new Error('Данные этапов турнира отсутствуют');
        }
        
        // Ищем этап с турнирной таблицей
        let teamStandingTotal = [];
        
        for (const stage of stages) {
            if (stage.teamStanding && stage.teamStanding.total && stage.teamStanding.total.length > 0) {
                teamStandingTotal = stage.teamStanding.total;
                break;
            }
        }
        
        if (teamStandingTotal.length === 0) {
            throw new Error('Турнирная таблица отсутствует');
        }
        
        // Сортируем элементы по позиции (rank)
        const sortedTableItems = teamStandingTotal.sort((a, b) => a.rank - b.rank);
        
        // Отображаем таблицу
        renderTournamentTable(sortedTableItems, liveMatches);
        
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
 * @param {Object} liveMatches - Информация о текущих матчах
 */
function renderTournamentTable(tableItems, liveMatches = {}) {
    const tableBodyElement = document.getElementById('table-body');
    
    // Очищаем содержимое таблицы
    tableBodyElement.innerHTML = '';
    
    // Перебираем элементы таблицы и добавляем их в DOM
    tableItems.forEach(item => {
        const team = item.team;
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
        
        // Добавляем текущий матч, если команда играет сейчас
        if (liveMatches[team.name]) {
            const liveMatch = createLiveMatchElement(liveMatches[team.name]);
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
        tableRow.appendChild(createStatCell(item.played)); // Игры
        tableRow.appendChild(createStatCell(item.win)); // Победы
        tableRow.appendChild(createStatCell(item.draw)); // Ничьи
        tableRow.appendChild(createStatCell(item.loss)); // Поражения
        tableRow.appendChild(createStatCell(item.goalsFor)); // Забитые голы
        tableRow.appendChild(createStatCell(item.goalsAgainst)); // Пропущенные голы
        
        // Разница голов
        const goalDiffCell = document.createElement('td');
        goalDiffCell.textContent = item.goalDiff > 0 ? `+${item.goalDiff}` : item.goalDiff;
        tableRow.appendChild(goalDiffCell);
        
        // Очки
        const pointsCell = document.createElement('td');
        pointsCell.className = 'matches-played';
        pointsCell.textContent = item.points;
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