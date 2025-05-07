// Основной скрипт для работы с виджетом
document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    const matchesList = document.getElementById('matches-list');
    
    // Загрузка и отображение данных о матчах
    async function loadMatches() {
        try {
            // Получение данных о матчах
            const matches = await MatchesAPI.getFutureMatches();
            
            // Скрытие загрузчика
            loader.style.display = 'none';
            
            // Проверка наличия матчей
            if (!matches || matches.length === 0) {
                showNoMatchesMessage();
                return;
            }
            
            // Группировка матчей по дате
            const matchesByDate = groupMatchesByDate(matches);
            
            // Отображение матчей
            renderMatches(matchesByDate);
        } catch (error) {
            console.error('Ошибка при загрузке матчей:', error);
            showErrorMessage();
        }
    }
    
    // Группировка матчей по дате
    function groupMatchesByDate(matches) {
        const result = {};
        
        matches.forEach(match => {
            const date = new Date(match.scheduledAt);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            if (!result[dateStr]) {
                result[dateStr] = [];
            }
            
            result[dateStr].push(match);
        });
        
        return result;
    }
    
    // Отображение сгруппированных матчей
    function renderMatches(matchesByDate) {
        // Очистка списка матчей
        matchesList.innerHTML = '';
        
        // Добавление матчей по датам
        Object.keys(matchesByDate).sort().forEach(dateStr => {
            const matches = matchesByDate[dateStr];
            const dateMatches = document.createElement('div');
            dateMatches.className = 'date-matches';
            
            // Добавление каждого матча
            matches.forEach(match => {
                const matchElement = createMatchElement(match);
                dateMatches.appendChild(matchElement);
            });
            
            matchesList.appendChild(dateMatches);
        });
    }
    
    // Создание элемента для отображения матча
    function createMatchElement(match) {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Создание заголовка с датой и турниром
        const matchHeader = document.createElement('div');
        matchHeader.className = 'match-header';
        
        const matchDate = document.createElement('div');
        matchDate.className = 'match-date';
        matchDate.textContent = MatchesAPI.formatMatchDate(match.scheduledAt);
        
        const matchTournament = document.createElement('div');
        matchTournament.className = 'match-tournament';
        
        const tournamentLogo = document.createElement('img');
        tournamentLogo.className = 'match-tournament-logo';
        tournamentLogo.src = match.tournament.logoUrl;
        tournamentLogo.alt = match.tournament.name;
        
        const tournamentName = document.createElement('div');
        tournamentName.className = 'match-tournament-name';
        tournamentName.textContent = match.tournament.name;
        
        matchTournament.appendChild(tournamentLogo);
        matchTournament.appendChild(tournamentName);
        
        matchHeader.appendChild(matchDate);
        matchHeader.appendChild(matchTournament);
        
        // Создание контента матча с командами и временем
        const matchContent = document.createElement('div');
        matchContent.className = 'match-content';
        
        // Домашняя команда
        const teamHome = document.createElement('div');
        teamHome.className = 'team team-home';
        
        const teamHomeName = document.createElement('div');
        teamHomeName.className = 'team-name';
        teamHomeName.textContent = match.homeTeam.name;
        
        const teamHomeLogo = document.createElement('img');
        teamHomeLogo.className = 'team-logo';
        teamHomeLogo.src = match.homeTeam.logoUrl;
        teamHomeLogo.alt = match.homeTeam.name;
        
        teamHome.appendChild(teamHomeName);
        teamHome.appendChild(teamHomeLogo);
        
        // Время матча
        const matchTime = document.createElement('div');
        matchTime.className = 'match-time';
        matchTime.textContent = MatchesAPI.formatMatchTime(match.scheduledAt);
        
        // Гостевая команда
        const teamAway = document.createElement('div');
        teamAway.className = 'team team-away';
        
        const teamAwayName = document.createElement('div');
        teamAwayName.className = 'team-name';
        teamAwayName.textContent = match.awayTeam.name;
        
        const teamAwayLogo = document.createElement('img');
        teamAwayLogo.className = 'team-logo';
        teamAwayLogo.src = match.awayTeam.logoUrl;
        teamAwayLogo.alt = match.awayTeam.name;
        
        teamAway.appendChild(teamAwayName);
        teamAway.appendChild(teamAwayLogo);
        
        // Добавление элементов в контент
        matchContent.appendChild(teamHome);
        matchContent.appendChild(matchTime);
        matchContent.appendChild(teamAway);
        
        // Добавление заголовка и контента в карточку матча
        matchCard.appendChild(matchHeader);
        matchCard.appendChild(matchContent);
        
        return matchCard;
    }
    
    // Отображение сообщения об отсутствии матчей
    function showNoMatchesMessage() {
        matchesList.innerHTML = '<div class="no-matches">Не найдено предстоящих матчей</div>';
    }
    
    // Отображение сообщения об ошибке
    function showErrorMessage() {
        loader.style.display = 'none';
        matchesList.innerHTML = '<div class="no-matches">Произошла ошибка при загрузке данных</div>';
    }
    
    // Запуск загрузки матчей
    loadMatches();
}); 