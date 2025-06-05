document.addEventListener('DOMContentLoaded', function() {
    renderTeams();
});

function renderTeams() {
    const container = document.getElementById('teamsContainer');
    
    // Рендерим домашнюю команду
    renderTeam(matchData.home, container);
    
    // Добавляем разделитель VS
    const vsIndicator = document.createElement('div');
    vsIndicator.className = 'vs-indicator';
    vsIndicator.textContent = 'VS';
    container.appendChild(vsIndicator);
    
    // Рендерим гостевую команду
    renderTeam(matchData.away, container);
}

function renderTeam(teamData, container) {
    const teamCard = document.createElement('div');
    teamCard.className = 'team-card';
    
    const teamInfo = document.createElement('div');
    teamInfo.className = 'team-info';
    
    // Логотип команды
    const teamLogo = document.createElement('img');
    teamLogo.className = 'team-logo';
    teamLogo.src = teamData.team.logotype.url;
    teamLogo.alt = `Логотип ${teamData.team.name}`;
    teamLogo.onerror = function() {
        this.style.display = 'none';
    };
    
    // Название команды
    const teamName = document.createElement('h2');
    teamName.className = 'team-name';
    teamName.textContent = teamData.team.name;
    
    teamInfo.appendChild(teamLogo);
    teamInfo.appendChild(teamName);
    
    // Результаты последних матчей
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'team-results';
    
    teamData.team.lastFive.forEach((gameData, index) => {
        const resultCircle = document.createElement('div');
        resultCircle.className = 'result-circle';
        
        const result = getTeamResult(gameData.match, teamData.team.name);
        resultCircle.classList.add(result.toLowerCase());
        
        // Добавляем tooltip с информацией о матче
        const opponent = getOpponent(gameData.match, teamData.team.name);
        resultCircle.title = `${result === 'WIN' ? 'Победа' : result === 'DRAW' ? 'Ничья' : 'Поражение'} против ${opponent}`;
        
        resultsContainer.appendChild(resultCircle);
    });
    
    teamCard.appendChild(teamInfo);
    teamCard.appendChild(resultsContainer);
    container.appendChild(teamCard);
}

function getTeamResult(match, teamName) {
    // Определяем, является ли команда домашней или гостевой
    const isHome = match.home.team.name === teamName;
    
    if (match.winner === 'DRAW') {
        return 'DRAW';
    } else if ((isHome && match.winner === 'HOME') || (!isHome && match.winner === 'AWAY')) {
        return 'WIN';
    } else {
        return 'LOSS';
    }
}

function getOpponent(match, teamName) {
    // Возвращаем название команды соперника
    if (match.home.team.name === teamName) {
        return match.away.team.name;
    } else {
        return match.home.team.name;
    }
} 