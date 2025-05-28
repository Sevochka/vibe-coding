document.addEventListener('DOMContentLoaded', () => {
    const widgetsContainer = document.querySelector('.widgets-container');
    
    // 1. Виджет счета матча
    const scoreWidget = createScoreWidget();
    
    // 2. Виджет статистики матча
    const statsWidget = createStatsWidget();
    
    // 3. Виджет событий матча
    const eventsWidget = createEventsWidget();
    
    // 4. Виджет истории личных встреч
    const h2hWidget = createH2HWidget();
    
    // 5. Виджет коэффициентов букмекеров
    const oddsWidget = createOddsWidget();
    
    // Добавляем все виджеты на страницу
    widgetsContainer.appendChild(scoreWidget);
    widgetsContainer.appendChild(statsWidget);
    widgetsContainer.appendChild(eventsWidget);
    widgetsContainer.appendChild(h2hWidget);
    widgetsContainer.appendChild(oddsWidget);
});

// 1. Функция создания виджета счета матча
function createScoreWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget score-widget';
    
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = 'Счет матча';
    header.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'widget-content';
    
    const matchTeams = document.createElement('div');
    matchTeams.className = 'match-teams';
    
    // Домашняя команда
    const homeTeam = document.createElement('div');
    homeTeam.className = 'team home';
    
    const homeTeamLogo = document.createElement('div');
    homeTeamLogo.className = 'team-logo';
    
    const homeTeamLogoImg = document.createElement('img');
    homeTeamLogoImg.src = matchData.home.team.logo;
    homeTeamLogoImg.alt = matchData.home.team.name;
    
    homeTeamLogo.appendChild(homeTeamLogoImg);
    
    const homeTeamName = document.createElement('div');
    homeTeamName.className = 'team-name';
    homeTeamName.textContent = matchData.home.team.name;
    
    homeTeam.appendChild(homeTeamLogo);
    homeTeam.appendChild(homeTeamName);
    
    // Счет
    const matchScore = document.createElement('div');
    matchScore.className = 'match-score';
    
    const score = document.createElement('div');
    score.className = 'score';
    score.textContent = `${matchData.home.score}:${matchData.away.score}`;
    
    const matchStatus = document.createElement('div');
    matchStatus.className = 'match-status';
    matchStatus.textContent = matchData.currentTime === 'FT' ? 'Завершен' : matchData.currentTime;
    
    matchScore.appendChild(score);
    matchScore.appendChild(matchStatus);
    
    // Гостевая команда
    const awayTeam = document.createElement('div');
    awayTeam.className = 'team away';
    
    const awayTeamLogo = document.createElement('div');
    awayTeamLogo.className = 'team-logo';
    
    const awayTeamLogoImg = document.createElement('img');
    awayTeamLogoImg.src = matchData.away.team.logo;
    awayTeamLogoImg.alt = matchData.away.team.name;
    
    awayTeamLogo.appendChild(awayTeamLogoImg);
    
    const awayTeamName = document.createElement('div');
    awayTeamName.className = 'team-name';
    awayTeamName.textContent = matchData.away.team.name;
    
    awayTeam.appendChild(awayTeamLogo);
    awayTeam.appendChild(awayTeamName);
    
    // Добавляем все элементы в виджет
    matchTeams.appendChild(homeTeam);
    matchTeams.appendChild(matchScore);
    matchTeams.appendChild(awayTeam);
    
    content.appendChild(matchTeams);
    
    widget.appendChild(header);
    widget.appendChild(content);
    
    return widget;
}

// 2. Функция создания виджета статистики матча
function createStatsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget stats-widget';
    
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = 'Статистика матча';
    header.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'widget-content';
    
    // Статистика владения мячом
    content.appendChild(createStatRow(
        'Владение мячом',
        `${matchData.home.stat.ballPossession}%`,
        `${matchData.away.stat.ballPossession}%`,
        matchData.home.stat.ballPossession,
        matchData.away.stat.ballPossession
    ));
    
    // Удары
    content.appendChild(createStatRow(
        'Удары',
        matchData.home.stat.shotsTotal,
        matchData.away.stat.shotsTotal,
        matchData.home.stat.shotsTotal,
        matchData.away.stat.shotsTotal
    ));
    
    // Удары в створ
    content.appendChild(createStatRow(
        'Удары в створ',
        matchData.home.stat.shotsOnTarget,
        matchData.away.stat.shotsOnTarget,
        matchData.home.stat.shotsOnTarget,
        matchData.away.stat.shotsOnTarget
    ));
    
    // Угловые
    content.appendChild(createStatRow(
        'Угловые',
        matchData.home.stat.cornerKicks,
        matchData.away.stat.cornerKicks,
        matchData.home.stat.cornerKicks,
        matchData.away.stat.cornerKicks
    ));
    
    // Фолы
    content.appendChild(createStatRow(
        'Фолы',
        matchData.home.stat.fouls,
        matchData.away.stat.fouls,
        matchData.home.stat.fouls,
        matchData.away.stat.fouls
    ));
    
    // Желтые карточки
    content.appendChild(createStatRow(
        'Желтые карточки',
        matchData.home.stat.yellowCards,
        matchData.away.stat.yellowCards,
        matchData.home.stat.yellowCards,
        matchData.away.stat.yellowCards
    ));
    
    // Красные карточки
    content.appendChild(createStatRow(
        'Красные карточки',
        matchData.home.stat.redCards,
        matchData.away.stat.redCards,
        matchData.home.stat.redCards,
        matchData.away.stat.redCards
    ));
    
    widget.appendChild(header);
    widget.appendChild(content);
    
    return widget;
}

// Вспомогательная функция для создания строки статистики
function createStatRow(statName, homeValue, awayValue, homeWidth, awayWidth) {
    const total = homeWidth + awayWidth;
    const homePercent = total > 0 ? (homeWidth / total) * 100 : 50;
    const awayPercent = total > 0 ? (awayWidth / total) * 100 : 50;
    
    const row = document.createElement('div');
    row.className = 'stat-row';
    
    const homeValueElement = document.createElement('div');
    homeValueElement.className = 'stat-value home-value';
    homeValueElement.textContent = homeValue;
    
    const statNameElement = document.createElement('div');
    statNameElement.className = 'stat-name';
    statNameElement.textContent = statName;
    
    const awayValueElement = document.createElement('div');
    awayValueElement.className = 'stat-value away-value';
    awayValueElement.textContent = awayValue;
    
    row.appendChild(homeValueElement);
    row.appendChild(statNameElement);
    row.appendChild(awayValueElement);
    
    // Добавляем визуальный индикатор для сравнения
    const barContainer = document.createElement('div');
    barContainer.className = 'stat-bar-container';
    
    const homeBar = document.createElement('div');
    homeBar.className = 'stat-bar-home';
    homeBar.style.width = `${homePercent}%`;
    
    const awayBar = document.createElement('div');
    awayBar.className = 'stat-bar-away';
    awayBar.style.width = `${awayPercent}%`;
    
    barContainer.appendChild(homeBar);
    barContainer.appendChild(awayBar);
    
    const statContainer = document.createElement('div');
    statContainer.appendChild(row);
    statContainer.appendChild(barContainer);
    
    return statContainer;
}

// 3. Функция создания виджета событий матча
function createEventsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget events-widget';
    
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = 'События матча';
    header.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'widget-content';
    
    // Добавляем события
    matchData.events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        
        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = `${event.time}'`;
        
        const eventIcon = document.createElement('div');
        eventIcon.className = 'event-icon';
        
        // Иконка в зависимости от типа события
        let iconSvg = '';
        let iconClass = '';
        
        switch(event.type) {
            case 'GOAL':
                iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z"/></svg>';
                iconClass = 'goal-icon';
                break;
            case 'YELLOW_CARD':
                iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>';
                iconClass = 'yellow-card-icon';
                break;
            case 'RED_CARD':
                iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>';
                iconClass = 'red-card-icon';
                break;
            case 'SUBSTITUTION':
                iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16,12l-4,4V9l4,3L16,12z M8,12l4-3v7l-4-4L8,12z"/></svg>';
                iconClass = 'substitution-icon';
                break;
        }
        
        eventIcon.innerHTML = iconSvg;
        eventIcon.classList.add(iconClass);
        
        const eventDetails = document.createElement('div');
        eventDetails.className = 'event-details';
        
        // Формируем текст события
        let eventText = '';
        const teamName = event.team === 'home' ? matchData.home.team.name : matchData.away.team.name;
        
        switch(event.type) {
            case 'GOAL':
                eventText = `<span class="event-team">${teamName}:</span> ${event.player} (${event.assistPlayer})`;
                break;
            case 'YELLOW_CARD':
            case 'RED_CARD':
                eventText = `<span class="event-team">${teamName}:</span> ${event.player}`;
                break;
            case 'SUBSTITUTION':
                eventText = `<span class="event-team">${teamName}:</span> ${event.playerIn} вместо ${event.playerOut}`;
                break;
        }
        
        eventDetails.innerHTML = eventText;
        
        eventElement.appendChild(eventTime);
        eventElement.appendChild(eventIcon);
        eventElement.appendChild(eventDetails);
        
        content.appendChild(eventElement);
    });
    
    widget.appendChild(header);
    widget.appendChild(content);
    
    return widget;
}

// 4. Функция создания виджета истории личных встреч
function createH2HWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget h2h-widget';
    
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = 'История встреч';
    header.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'widget-content';
    
    // Добавляем матчи из истории
    matchData.headToHead.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'h2h-match';
        
        // Дата
        const dateElement = document.createElement('div');
        dateElement.className = 'h2h-date';
        const date = new Date(match.date);
        dateElement.textContent = date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit' 
        });
        
        // Турнир
        const tournamentElement = document.createElement('div');
        tournamentElement.className = 'h2h-tournament';
        tournamentElement.textContent = match.tournament;
        
        // Команды и счет
        const teamsElement = document.createElement('div');
        teamsElement.className = 'h2h-teams';
        
        const homeTeamElement = document.createElement('div');
        homeTeamElement.className = 'h2h-team home';
        homeTeamElement.textContent = match.homeTeam;
        
        const scoreElement = document.createElement('div');
        scoreElement.className = 'h2h-score';
        scoreElement.textContent = `${match.homeScore}:${match.awayScore}`;
        
        const awayTeamElement = document.createElement('div');
        awayTeamElement.className = 'h2h-team away';
        awayTeamElement.textContent = match.awayTeam;
        
        teamsElement.appendChild(homeTeamElement);
        teamsElement.appendChild(scoreElement);
        teamsElement.appendChild(awayTeamElement);
        
        matchElement.appendChild(dateElement);
        matchElement.appendChild(tournamentElement);
        matchElement.appendChild(teamsElement);
        
        content.appendChild(matchElement);
    });
    
    widget.appendChild(header);
    widget.appendChild(content);
    
    return widget;
}

// 5. Функция создания виджета коэффициентов букмекеров
function createOddsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget odds-widget';
    
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = 'Коэффициенты';
    header.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'widget-content';
    
    // Контейнер для коэффициентов
    const oddsContainer = document.createElement('div');
    oddsContainer.className = 'odds-container';
    
    // Создаем три блока: П1, Х, П2
    const homeWinOdd = document.createElement('div');
    homeWinOdd.className = 'odd-item home-win';
    
    const homeWinOddType = document.createElement('div');
    homeWinOddType.className = 'odd-type';
    homeWinOddType.textContent = 'П1';
    
    const homeWinOddValue = document.createElement('div');
    homeWinOddValue.className = 'odd-value';
    homeWinOddValue.textContent = matchData.odds.fonbet.homeWin;
    
    homeWinOdd.appendChild(homeWinOddType);
    homeWinOdd.appendChild(homeWinOddValue);
    
    const drawOdd = document.createElement('div');
    drawOdd.className = 'odd-item draw';
    
    const drawOddType = document.createElement('div');
    drawOddType.className = 'odd-type';
    drawOddType.textContent = 'X';
    
    const drawOddValue = document.createElement('div');
    drawOddValue.className = 'odd-value';
    drawOddValue.textContent = matchData.odds.fonbet.draw;
    
    drawOdd.appendChild(drawOddType);
    drawOdd.appendChild(drawOddValue);
    
    const awayWinOdd = document.createElement('div');
    awayWinOdd.className = 'odd-item away-win';
    
    const awayWinOddType = document.createElement('div');
    awayWinOddType.className = 'odd-type';
    awayWinOddType.textContent = 'П2';
    
    const awayWinOddValue = document.createElement('div');
    awayWinOddValue.className = 'odd-value';
    awayWinOddValue.textContent = matchData.odds.fonbet.awayWin;
    
    awayWinOdd.appendChild(awayWinOddType);
    awayWinOdd.appendChild(awayWinOddValue);
    
    // Добавляем логотип букмекера
    const bookmakerLogo = document.createElement('img');
    bookmakerLogo.className = 'bookmaker-logo';
    bookmakerLogo.src = matchData.odds.fonbet.logo;
    bookmakerLogo.alt = 'Fonbet';
    
    // Добавляем элементы в виджет
    oddsContainer.appendChild(homeWinOdd);
    oddsContainer.appendChild(drawOdd);
    oddsContainer.appendChild(awayWinOdd);
    
    content.appendChild(oddsContainer);
    content.appendChild(bookmakerLogo);
    
    widget.appendChild(header);
    widget.appendChild(content);
    
    // Добавляем блок с фактоидами
    const factoids = document.createElement('div');
    factoids.className = 'factoids';
    
    matchData.factoids.forEach(factoid => {
        const factoidElement = document.createElement('div');
        factoidElement.className = 'factoid';
        factoidElement.textContent = factoid;
        factoids.appendChild(factoidElement);
    });
    
    widget.appendChild(factoids);
    
    return widget;
} 