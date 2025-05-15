/**
 * Скрипт для отображения турнирной таблицы РПЛ
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Загружаем данные из API
    const data = await gqlClient.getStandings();
    
    // Если данные не получены, выводим сообщение об ошибке
    if (!data || !data.data || !data.data.statQueries || !data.data.statQueries.football || 
        !data.data.statQueries.football.tournament || !data.data.statQueries.football.tournament.currentSeason) {
      showError('Не удалось загрузить данные турнирной таблицы');
      return;
    }
    
    // Получаем необходимые данные из ответа API
    const teams = data.data.statQueries.football.tournament.currentSeason.rankingTeamStat.items;
    
    // Сортируем команды по очкам (в обратном порядке)
    const sortedTeams = [...teams].sort((a, b) => {
      // Сначала сортируем по очкам
      const pointsDiff = b.stat.MatchesWon * 3 + b.stat.MatchesDrawn - (a.stat.MatchesWon * 3 + a.stat.MatchesDrawn);
      if (pointsDiff !== 0) return pointsDiff;
      
      // При равенстве очков сортируем по разнице голов
      const goalDiff = (b.stat.GoalsScored - b.stat.GoalsConceded) - (a.stat.GoalsScored - a.stat.GoalsConceded);
      if (goalDiff !== 0) return goalDiff;
      
      // При равенстве разницы голов сортируем по забитым голам
      return b.stat.GoalsScored - a.stat.GoalsScored;
    });
    
    // Отображаем данные в таблице
    renderStandingsTable(sortedTeams);
    
    // Обновляем высоту iframe
    if (typeof resize === 'function') {
      resize();
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    showError('Произошла ошибка при загрузке данных');
  }
});

/**
 * Отображает данные в турнирной таблице
 * @param {Array} teams - Массив с данными команд
 */
function renderStandingsTable(teams) {
  const tableBody = document.getElementById('standings-body');
  tableBody.innerHTML = ''; // Очищаем содержимое таблицы
  
  teams.forEach((team, index) => {
    const teamData = team.team;
    const stats = team.stat;
    
    // Создаем строку таблицы
    const row = document.createElement('tr');
    
    // Добавляем место в таблице
    const positionCell = document.createElement('td');
    positionCell.className = 'pos';
    positionCell.textContent = index + 1;
    row.appendChild(positionCell);
    
    // Добавляем логотип команды
    const logoCell = document.createElement('td');
    logoCell.className = 'team-logo-col';
    const logoImg = document.createElement('img');
    logoImg.className = 'team-logo';
    logoImg.src = teamData.logotype ? teamData.logotype.url : '';
    logoImg.alt = teamData.name;
    logoCell.appendChild(logoImg);
    row.appendChild(logoCell);
    
    // Добавляем название команды и текущий матч (если есть)
    const nameCell = document.createElement('td');
    nameCell.className = 'team-name';
    
    // Создаем ссылку на команду
    const teamLink = document.createElement('a');
    teamLink.className = 'team-link';
    teamLink.href = `/football/club/${teamData.id}/`;
    teamLink.textContent = teamData.name;
    nameCell.appendChild(teamLink);
    
    // Если есть текущий матч, добавляем его
    if (teamData.teaser && teamData.teaser.current) {
      const currentMatch = teamData.teaser.current;
      
      // Создаем элемент для отображения текущего матча
      const matchDiv = document.createElement('div');
      matchDiv.className = 'current-match';
      
      // Создаем элемент для домашней команды
      const homeTeam = document.createElement('div');
      homeTeam.className = 'team-match';
      
      const homeLogo = document.createElement('img');
      homeLogo.className = 'team-logo';
      homeLogo.src = currentMatch.home.team.logotype.url;
      homeLogo.alt = currentMatch.home.team.name;
      
      const homeNameSpan = document.createElement('span');
      homeNameSpan.textContent = currentMatch.home.team.name;
      
      homeTeam.appendChild(homeLogo);
      homeTeam.appendChild(homeNameSpan);
      
      // Создаем элемент для счета
      const scoreDiv = document.createElement('div');
      scoreDiv.className = 'score';
      scoreDiv.textContent = `${currentMatch.home.score} : ${currentMatch.away.score}`;
      
      // Если матч онлайн, добавляем текущую минуту
      if (currentMatch.currentMinute && currentMatch.currentMinute !== '0') {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'current-time';
        timeSpan.textContent = currentMatch.currentMinute + '′';
        scoreDiv.appendChild(timeSpan);
      }
      
      // Создаем элемент для гостевой команды
      const awayTeam = document.createElement('div');
      awayTeam.className = 'team-match';
      
      const awayLogo = document.createElement('img');
      awayLogo.className = 'team-logo';
      awayLogo.src = currentMatch.away.team.logotype.url;
      awayLogo.alt = currentMatch.away.team.name;
      
      const awayNameSpan = document.createElement('span');
      awayNameSpan.textContent = currentMatch.away.team.name;
      
      awayTeam.appendChild(awayLogo);
      awayTeam.appendChild(awayNameSpan);
      
      // Объединяем все элементы в div текущего матча
      matchDiv.appendChild(homeTeam);
      matchDiv.appendChild(scoreDiv);
      matchDiv.appendChild(awayTeam);
      
      // Добавляем div текущего матча в ячейку с названием команды
      nameCell.appendChild(matchDiv);
    }
    
    row.appendChild(nameCell);
    
    // Добавляем результаты последних 5 матчей
    const lastMatchesCell = document.createElement('td');
    lastMatchesCell.className = 'last-matches';
    
    if (teamData.lastFive && teamData.lastFive.length > 0) {
      teamData.lastFive.forEach(match => {
        const matchResultSpan = document.createElement('a');
        matchResultSpan.className = `match-result ${match.result.toLowerCase()}`;
        
        // Добавляем текст результата (В/Н/П)
        let resultText = '';
        if (match.result === 'WIN') resultText = 'В';
        else if (match.result === 'DRAW') resultText = 'Н';
        else if (match.result === 'LOSE') resultText = 'П';
        
        matchResultSpan.textContent = resultText;
        
        // Добавляем ссылку на матч, если она есть
        if (match.match && match.match.links && match.match.links.sportsRu) {
          matchResultSpan.href = match.match.links.sportsRu;
        }
        
        lastMatchesCell.appendChild(matchResultSpan);
      });
    } else {
      lastMatchesCell.textContent = '—';
    }
    
    row.appendChild(lastMatchesCell);
    
    // Добавляем статистику
    const gamesCell = document.createElement('td');
    gamesCell.className = 'games';
    gamesCell.textContent = stats.MatchesPlayed;
    row.appendChild(gamesCell);
    
    const winsCell = document.createElement('td');
    winsCell.className = 'wins';
    winsCell.textContent = stats.MatchesWon;
    row.appendChild(winsCell);
    
    const drawsCell = document.createElement('td');
    drawsCell.className = 'draws';
    drawsCell.textContent = stats.MatchesDrawn;
    row.appendChild(drawsCell);
    
    const lossesCell = document.createElement('td');
    lossesCell.className = 'losses';
    lossesCell.textContent = stats.MatchesLost;
    row.appendChild(lossesCell);
    
    const goalsForCell = document.createElement('td');
    goalsForCell.className = 'goals-for';
    goalsForCell.textContent = stats.GoalsScored;
    row.appendChild(goalsForCell);
    
    const goalsAgainstCell = document.createElement('td');
    goalsAgainstCell.className = 'goals-against';
    goalsAgainstCell.textContent = stats.GoalsConceded;
    row.appendChild(goalsAgainstCell);
    
    // Разница голов
    const goalDiffCell = document.createElement('td');
    goalDiffCell.className = 'goals-diff';
    const goalDiff = stats.GoalsScored - stats.GoalsConceded;
    goalDiffCell.textContent = goalDiff > 0 ? `+${goalDiff}` : goalDiff;
    row.appendChild(goalDiffCell);
    
    // Очки
    const pointsCell = document.createElement('td');
    pointsCell.className = 'points';
    pointsCell.textContent = stats.MatchesWon * 3 + stats.MatchesDrawn;
    row.appendChild(pointsCell);
    
    // Добавляем строку в таблицу
    tableBody.appendChild(row);
  });
}

/**
 * Отображает сообщение об ошибке
 * @param {string} message - Сообщение об ошибке
 */
function showError(message) {
  const tableBody = document.getElementById('standings-body');
  tableBody.innerHTML = `<tr class="loading"><td colspan="12">${message}</td></tr>`;
} 