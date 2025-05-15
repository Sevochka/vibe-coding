document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('standings-body');
  
  // Загружаем данные с GQL API
  const data = await fetchGQLData();
  
  if (!data) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="loading">Не удалось загрузить данные. Пожалуйста, попробуйте позже.</td>
      </tr>
    `;
    return;
  }
  
  // Получаем массив команд из данных
  const items = data.statQueries.football.tournament.currentSeason.rankingTeamStat[0].items;
  
  // Сортируем команды по рангу (позиции в таблице)
  const sortedItems = [...items].sort((a, b) => a.rank - b.rank);
  
  // Очищаем таблицу
  tableBody.innerHTML = '';
  
  // Заполняем таблицу командами
  sortedItems.forEach((item) => {
    const team = item.team;
    const stats = item.stat;
    const position = item.rank;
    
    // Разница мячей
    const goalDiff = stats.GoalsScored - stats.GoalsConceded;
    const goalDiffStr = goalDiff > 0 ? `+${goalDiff}` : goalDiff;
    
    // Определяем класс для строки таблицы (UCL, Europa League, Relegation)
    let rowClass = '';
    if (position <= 4) {
      rowClass = 'ucl';
    } else if (position > 4 && position <= 6) {
      rowClass = 'europa';
    } else if (position > 12) {
      rowClass = 'relegation';
    }
    
    // Формируем HTML для предыдущих результатов
    const prevResults = team.lastFive.map(result => {
      let resultClass = '';
      let resultChar = '';
      
      switch(result.result) {
        case 'WIN':
          resultClass = 'win';
          resultChar = 'В';
          break;
        case 'DRAW':
          resultClass = 'draw';
          resultChar = 'Н';
          break;
        case 'LOSE':
          resultClass = 'lose';
          resultChar = 'П';
          break;
        default:
          resultClass = '';
          resultChar = '';
      }
      
      return `
        <a href="${result.match.links.sportsRu}" target="_blank" title="${resultChar}">
          <div class="result-icon ${resultClass}">${resultChar}</div>
        </a>
      `;
    }).join('');

    // Формируем HTML для текущего матча, если он есть
    let liveMatch = '';
    if (team.teaser && team.teaser.current) {
      const match = team.teaser.current;
      const homeTeam = match.home.team;
      const awayTeam = match.away.team;
      const homeScore = match.home.score;
      const awayScore = match.away.score;
      const isLive = match.currentMinute && match.currentMinute !== '0';
      
      liveMatch = `
        <a href="${match.links.sportsRu}" class="live-match" target="_blank">
          <img src="${homeTeam.logotype.url}" alt="${homeTeam.name}">
          <span>${homeTeam.name}</span>
          <span class="live-score">${homeScore}:${awayScore}</span>
          <span>${awayTeam.name}</span>
          <img src="${awayTeam.logotype.url}" alt="${awayTeam.name}">
          ${isLive ? `<span class="live-indicator">${match.currentMinute}'</span>` : ''}
        </a>
      `;
    }
    
    // Создаем строку таблицы
    const row = document.createElement('tr');
    row.className = rowClass;
    row.innerHTML = `
      <td>${position}</td>
      <td>
        <div class="item-container">
          <div class="team-cell">
            <img src="${team.logotype.url}" alt="${team.name}" class="team-logo">
            <span>${team.name}</span>
          </div>
          ${liveMatch}
          <div class="previous-results">
            ${prevResults}
          </div>
        </div>
      </td>
      <td>${stats.MatchesPlayed}</td>
      <td>${stats.MatchesWon}</td>
      <td>${stats.MatchesDrawn}</td>
      <td>${stats.MatchesLost}</td>
      <td>${stats.GoalsScored}</td>
      <td>${stats.GoalsConceded}</td>
      <td>${goalDiffStr}</td>
      <td><strong>${stats.MatchesWon * 3 + stats.MatchesDrawn}</strong></td>
    `;
    
    tableBody.appendChild(row);
  });
}); 