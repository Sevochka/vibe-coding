document.addEventListener('DOMContentLoaded', function() {
    initTable();
});

/**
 * Инициализация таблицы и загрузка данных
 */
async function initTable() {
    try {
        const data = await fetchStandingsData();
        renderStandingsTable(data);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('standings-table').style.display = 'table';
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        document.getElementById('loader').textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
    }
}

/**
 * Получить данные о турнирной таблице через GraphQL запрос
 */
async function fetchStandingsData() {
    // Подготовка запроса - удаляем все пробелы, табуляции и переносы строк
    const query = CONFIG.removeWhitespace(CONFIG.GQL_QUERY);
    
    // Отправляем POST запрос с query в теле
    const response = await fetch(CONFIG.GQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
    });
    
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
        throw new Error(`Ошибка GraphQL: ${data.errors[0].message}`);
    }
    
    return data.data;
}

/**
 * Отрисовка турнирной таблицы на основе полученных данных
 */
function renderStandingsTable(data) {
    const tableBody = document.getElementById('standings-body');
    const teams = data.statQueries.football.tournament.currentSeason.rankingTeamStat.items;
    
    // Сортировка команд по рангу
    teams.sort((a, b) => a.team.id === b.team.id ? 0 : a.rank - b.rank);
    
    teams.forEach((team, index) => {
        const position = team.rank;
        const teamData = team.team;
        const stats = team.stat;
        
        // Определение зоны (ЛЧ, ЛЕ, вылет)
        let rowClass = '';
        if (position <= CONFIG.TABLE_ZONES.CHAMPIONS_LEAGUE) {
            rowClass = 'champions-league-zone';
        } else if (position <= CONFIG.TABLE_ZONES.EUROPA_LEAGUE) {
            rowClass = 'europa-league-zone';
        } else if (position > CONFIG.TABLE_ZONES.RELEGATION) {
            rowClass = 'relegation-zone';
        }
        
        // Создание строки таблицы
        const row = document.createElement('tr');
        row.className = rowClass;
        
        // Вычисление разницы забитых и пропущенных мячей
        const goalDiff = stats.GoalsScored - stats.GoalsConceded;
        const goalDiffText = goalDiff > 0 ? `+${goalDiff}` : goalDiff;
        
        // HTML для отображения последних 5 результатов
        let resultsHTML = '<div class="match-results">';
        
        if (teamData.lastFive && teamData.lastFive.length) {
            teamData.lastFive.slice(0, 5).forEach(match => {
                const resultChar = CONFIG.resultToChar(match.result);
                const resultClass = CONFIG.resultToClass(match.result);
                
                resultsHTML += `
                    <a href="${match.match.links.sportsRu}" class="match-result ${resultClass}" title="${resultChar}">
                        ${resultChar}
                    </a>
                `;
            });
        }
        
        resultsHTML += '</div>';
        
        // HTML для отображения текущего матча (если есть)
        let liveMatchHTML = '';
        
        if (teamData.teaser && teamData.teaser.current) {
            const currentMatch = teamData.teaser.current;
            const homeTeam = currentMatch.home.team;
            const awayTeam = currentMatch.away.team;
            const isLive = currentMatch.currentMinute && currentMatch.currentMinute !== '0';
            
            liveMatchHTML = `
                <a href="${currentMatch.links.sportsRu}" class="live-match ${isLive ? 'live' : ''}" title="Текущий матч">
                    <img src="${homeTeam.logotype.url}" alt="${homeTeam.name}" class="live-match-team-logo">
                    <span class="live-match-score">${currentMatch.home.score} : ${currentMatch.away.score}</span>
                    <img src="${awayTeam.logotype.url}" alt="${awayTeam.name}" class="live-match-team-logo">
                    ${isLive ? `<span class="live-match-time">${currentMatch.currentMinute}'</span>` : ''}
                </a>
            `;
        }
        
        // Сборка содержимого строки
        row.innerHTML = `
            <td class="pos-column">${position}</td>
            <td class="team-column">
                <div class="team-info">
                    <a href="https://www.sports.ru/tags/${teamData.id}/" class="team-link">
                        <img src="${teamData.logotype.url}" alt="${teamData.name}" class="team-logo">
                        <span class="team-name">${teamData.name}</span>
                    </a>
                    ${liveMatchHTML}
                    ${resultsHTML}
                </div>
            </td>
            <td>${stats.MatchesPlayed}</td>
            <td>${stats.MatchesWon}</td>
            <td>${stats.MatchesDrawn}</td>
            <td>${stats.MatchesLost}</td>
            <td>${stats.GoalsScored}</td>
            <td>${stats.GoalsConceded}</td>
            <td>${goalDiffText}</td>
            <td><strong>${stats.MatchesWon * 3 + stats.MatchesDrawn}</strong></td>
        `;
        
        tableBody.appendChild(row);
    });
} 