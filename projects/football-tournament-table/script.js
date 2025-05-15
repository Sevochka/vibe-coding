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
        
        // Запускаем имитацию обновления данных Зенита через 3 секунды
        setTimeout(() => {
            simulateZenitUpdate(sortedTableItems);
        }, 3000);
    } catch (error) {
        console.error('Ошибка при загрузке турнирной таблицы:', error);
        
        // Показываем сообщение об ошибке и скрываем индикатор загрузки
        loadingElement.style.display = 'none';
        errorContainerElement.style.display = 'block';
    }
}

/**
 * Имитация обновления данных Зенита в реальном времени
 * @param {Array} tableItems - Элементы турнирной таблицы
 */
function simulateZenitUpdate(tableItems) {
    // Находим Зенит и Краснодар в данных
    const zenitIndex = tableItems.findIndex(item => item.team.name === 'Зенит');
    const krasnodarIndex = tableItems.findIndex(item => item.team.name === 'Краснодар');
    
    if (zenitIndex !== -1 && krasnodarIndex !== -1) {
        // Обновляем данные Зенита
        const zenitItem = tableItems[zenitIndex];
        
        // Увеличиваем очки Зенита с 60 до 63
        if (zenitItem.points === 60) {
            zenitItem.points = 63;
            zenitItem.win += 1; // Учитываем новую победу
            zenitItem.played += 1; // Увеличиваем количество сыгранных матчей
            
            // Пересортируем таблицу
            tableItems.sort((a, b) => {
                // Сначала сортируем по очкам (по убыванию)
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                // При одинаковых очках сортируем по разнице голов (по убыванию)
                if (b.goalDiff !== a.goalDiff) {
                    return b.goalDiff - a.goalDiff;
                }
                // При одинаковой разнице голов сортируем по забитым голам (по убыванию)
                return b.goalsFor - a.goalsFor;
            });
            
            // Обновляем ранги
            tableItems.forEach((item, index) => {
                item.rank = index + 1;
            });
            
            // Обновляем отображение
            renderTournamentTable(tableItems, {}, true);
            
            // Выделяем обновленные строки
            highlightTeamRow('Зенит');
        }
    }
}

/**
 * Выделяет строку команды в таблице
 * @param {string} teamName - Название команды
 */
function highlightTeamRow(teamName) {
    const tableRows = document.querySelectorAll('#table-body tr');
    
    tableRows.forEach(row => {
        const teamNameElement = row.querySelector('.team-name');
        
        if (teamNameElement && teamNameElement.textContent === teamName) {
            // Добавляем класс для анимации
            row.classList.add('highlight-row');
            row.classList.add('moving-up');
            
            // Удаляем класс через 3 секунды
            setTimeout(() => {
                row.classList.remove('highlight-row');
                setTimeout(() => {
                    row.classList.remove('moving-up');
                }, 1000);
            }, 1500);
        }
    });
}

/**
 * Отображает турнирную таблицу
 * @param {Array} tableItems - Элементы турнирной таблицы
 * @param {Object} liveMatches - Информация о текущих матчах
 * @param {boolean} isUpdate - Флаг обновления таблицы
 */
function renderTournamentTable(tableItems, liveMatches = {}, isUpdate = false) {
    const tableBodyElement = document.getElementById('table-body');
    
    // Очищаем содержимое таблицы при обновлении
    if (isUpdate) {
        const oldTableRows = Array.from(tableBodyElement.querySelectorAll('tr'));
        const oldPositions = {};
        
        // Сохраняем старые позиции команд
        oldTableRows.forEach(row => {
            const teamName = row.querySelector('.team-name').textContent;
            const position = parseInt(row.querySelector('.position').textContent);
            oldPositions[teamName] = { 
                position, 
                points: parseInt(row.querySelector('td:last-child').textContent)
            };
        });
        
        // Очищаем содержимое таблицы
        tableBodyElement.innerHTML = '';
        
        // Перебираем элементы таблицы и добавляем их в DOM с анимацией
        tableItems.forEach(item => {
            const team = item.team;
            const row = createTableRow(item, team, liveMatches);
            
            // Добавляем строку в таблицу
            tableBodyElement.appendChild(row);
            
            // Если позиция команды изменилась
            if (oldPositions[team.name] && oldPositions[team.name].position !== item.rank) {
                if (oldPositions[team.name].position > item.rank) {
                    // Команда поднялась в таблице
                    row.classList.add('moving-up');
                }
            }
            
            // Если очки команды изменились
            if (oldPositions[team.name] && oldPositions[team.name].points !== item.points) {
                const pointsCell = row.querySelector('td:last-child');
                pointsCell.innerHTML = `<strong>${item.points}</strong>`;
                pointsCell.style.color = 'var(--sports-primary-color)';
                pointsCell.style.fontWeight = '700';
            }
        });
    } else {
        // Очищаем содержимое таблицы
        tableBodyElement.innerHTML = '';
        
        // Перебираем элементы таблицы и добавляем их в DOM
        tableItems.forEach(item => {
            const team = item.team;
            const row = createTableRow(item, team, liveMatches);
            
            // Добавляем строку в таблицу
            tableBodyElement.appendChild(row);
        });
    }
}

/**
 * Создает строку таблицы для команды
 * @param {Object} item - Данные о позиции команды
 * @param {Object} team - Данные о команде
 * @param {Object} liveMatches - Информация о текущих матчах
 * @returns {HTMLElement} - Строка таблицы
 */
function createTableRow(item, team, liveMatches) {
    const logoUrl = team.logotype ? team.logotype.url : '';
    
    // Создаем строку таблицы
    const tableRow = document.createElement('tr');
    tableRow.dataset.team = team.name;
    
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
    
    return tableRow;
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