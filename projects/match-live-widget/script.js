// Элементы DOM для обновления
const tournamentLogo = document.querySelector('.tournament-logo');
const tournamentName = document.querySelector('.tournament-name');
const matchStatus = document.querySelector('.match-status');
const matchDate = document.querySelector('.match-date');
const homeTeamLogo = document.getElementById('home-team-logo');
const homeTeamName = document.getElementById('home-team-name');
const homeScore = document.getElementById('home-score');
const awayTeamLogo = document.getElementById('away-team-logo');
const awayTeamName = document.getElementById('away-team-name');
const awayScore = document.getElementById('away-score');
const statsContainer = document.querySelector('.stats-container');
const timelineContainer = document.querySelector('.timeline-container');
const homeLineup = document.querySelector('.home-lineup');
const awayLineup = document.querySelector('.away-lineup');
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');
const loadingIndicators = document.querySelectorAll('.loading-indicator');

// Инициализация виджета
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация табов
    initTabs();
    
    // Загрузка данных о матче
    loadMatchData();
});

// Инициализация табов
function initTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Получаем идентификатор таба
            const tabId = tab.getAttribute('data-tab');
            
            // Удаляем класс active у всех табов и панелей
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Добавляем класс active выбранному табу и соответствующей панели
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Загрузка данных о матче
function loadMatchData() {
    // Получаем данные с использованием функции из match.js
    fetchMatchData()
        .then(data => {
            // Обрабатываем полученные данные
            renderMatchData(data);
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных матча:', error);
            // Показываем сообщение об ошибке
            showError('Не удалось загрузить данные матча. Пожалуйста, попробуйте позже.');
        });
}

// Отображение данных матча
function renderMatchData(data) {
    try {
        const match = data.statQueries.football.match;
        if (!match) {
            throw new Error('Данные матча не найдены');
        }
        
        // Информация о турнире
        if (match.season && match.season.tournament) {
            const tournament = match.season.tournament;
            tournamentName.textContent = tournament.name;
            if (tournament.picture && tournament.picture.webp) {
                tournamentLogo.style.backgroundImage = `url(${tournament.picture.webp})`;
            }
        }
        
        // Информация о матче
        updateMatchInfo(match);
        
        // Информация о командах
        updateTeamsInfo(match);
        
        // Убираем индикаторы загрузки
        hideLoadingIndicators();
        
        // Рендерим статистику
        renderStatistics(match);
        
        // Рендерим события
        renderTimeline(match);
        
        // Рендерим составы
        renderLineups(match);
    } catch (error) {
        console.error('Ошибка при отображении данных матча:', error);
        showError('Ошибка при отображении данных матча');
    }
}

// Обновление информации о матче
function updateMatchInfo(match) {
    // Статус матча
    const statusMap = {
        'NOT_STARTED': 'Не начался',
        'LIVE': 'В прямом эфире',
        'ENDED': 'Завершен',
        'POSTPONED': 'Перенесен',
        'CANCELLED': 'Отменен'
    };
    
    matchStatus.textContent = statusMap[match.matchStatus] || match.matchStatus;
    
    // Если матч в прямом эфире, отображаем текущее время
    if (match.matchStatus === 'LIVE' && match.currentTime) {
        matchStatus.textContent = match.currentTime;
        matchStatus.classList.add('live');
    }
    
    // Дата матча
    const date = new Date(match.scheduledAt);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    matchDate.textContent = date.toLocaleDateString('ru-RU', options);
}

// Обновление информации о командах
function updateTeamsInfo(match) {
    // Домашняя команда
    if (match.home && match.home.team) {
        homeTeamName.textContent = match.home.team.name;
        if (match.home.team.picture && match.home.team.picture.webp) {
            homeTeamLogo.src = match.home.team.picture.webp;
        }
        homeScore.textContent = match.home.score;
    }
    
    // Гостевая команда
    if (match.away && match.away.team) {
        awayTeamName.textContent = match.away.team.name;
        if (match.away.team.picture && match.away.team.picture.webp) {
            awayTeamLogo.src = match.away.team.picture.webp;
        }
        awayScore.textContent = match.away.score;
    }
}

// Отображение статистики
function renderStatistics(match) {
    if (!match.home || !match.away || !match.home.stat || !match.away.stat) {
        statsContainer.innerHTML = '<div class="no-data">Нет данных о статистике</div>';
        return;
    }
    
    const stats = [
        { title: 'Владение мячом', home: match.home.stat.ballPossession, away: match.away.stat.ballPossession, unit: '%' },
        { title: 'Удары в створ', home: match.home.stat.shotsOnTarget, away: match.away.stat.shotsOnTarget },
        { title: 'Удары мимо', home: match.home.stat.shotsOffTarget, away: match.away.stat.shotsOffTarget },
        { title: 'Угловые', home: match.home.stat.cornerKicks, away: match.away.stat.cornerKicks },
        { title: 'Офсайды', home: match.home.stat.offsides, away: match.away.stat.offsides },
        { title: 'Фолы', home: match.home.stat.fouls, away: match.away.stat.fouls },
        { title: 'Желтые карточки', home: match.home.stat.yellowCards, away: match.away.stat.yellowCards },
        { title: 'Красные карточки', home: match.home.stat.redCards, away: match.away.stat.redCards }
    ];
    
    statsContainer.innerHTML = '';
    
    stats.forEach(stat => {
        // Пропускаем статистику, если оба значения равны 0
        if (stat.home === 0 && stat.away === 0) return;
        
        const total = stat.home + stat.away;
        const homeWidth = total > 0 ? (stat.home / total) * 100 : 50;
        const awayWidth = total > 0 ? (stat.away / total) * 100 : 50;
        
        const row = document.createElement('div');
        row.className = 'stat-row';
        
        row.innerHTML = `
            <div class="stat-value">${stat.home}${stat.unit || ''}</div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${homeWidth}%"></div>
                <div class="stat-bar right" style="width: ${awayWidth}%"></div>
            </div>
            <div class="stat-title">${stat.title}</div>
            <div class="stat-value">${stat.away}${stat.unit || ''}</div>
        `;
        
        statsContainer.appendChild(row);
    });
    
    if (statsContainer.children.length === 0) {
        statsContainer.innerHTML = '<div class="no-data">Нет данных о статистике</div>';
    }
}

// Отображение таймлайна событий
function renderTimeline(match) {
    if (!match.events || match.events.length === 0) {
        timelineContainer.innerHTML = '<div class="no-data">Нет данных о событиях матча</div>';
        return;
    }
    
    timelineContainer.innerHTML = '';
    
    // Сортируем события по времени
    const sortedEvents = [...match.events].sort((a, b) => {
        // Получаем минуты из времени
        const getMinutes = (time) => {
            const parts = time.split(':');
            return parseInt(parts[0]);
        };
        
        return getMinutes(a.time) - getMinutes(b.time);
    });
    
    sortedEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        
        // Определяем команду и тип события
        const isHome = event.team === 'HOME';
        let eventDescription = '';
        let eventTypeClass = '';
        
        // В зависимости от типа события, формируем разное описание
        switch (event.type) {
            case 'SCORE_CHANGE':
                const scorer = event.value?.goalScorer?.name || 'Неизвестный игрок';
                const assist = event.value?.assist?.name ? ` (ассист: ${event.value.assist.name})` : '';
                eventDescription = `Гол! ${scorer}${assist}`;
                eventTypeClass = 'goal';
                break;
                
            case 'YELLOW_CARD':
                const yellowPlayer = event.value?.player?.name || 'Неизвестный игрок';
                eventDescription = `Желтая карточка: ${yellowPlayer}`;
                eventTypeClass = 'yellow-card';
                break;
                
            case 'RED_CARD':
                const redPlayer = event.value?.player?.name || 'Неизвестный игрок';
                eventDescription = `Красная карточка: ${redPlayer}`;
                eventTypeClass = 'red-card';
                break;
                
            case 'YELLOW_RED_CARD':
                const yrPlayer = event.value?.player?.name || 'Неизвестный игрок';
                eventDescription = `Вторая желтая карточка: ${yrPlayer}`;
                eventTypeClass = 'yellow-red-card';
                break;
                
            case 'PENALTY_MISSED':
                const penaltyMissed = event.value?.player?.name || 'Неизвестный игрок';
                eventDescription = `Пенальти не реализован: ${penaltyMissed}`;
                eventTypeClass = 'penalty-missed';
                break;
                
            case 'PENALTY_SAVED':
                const penaltySaved = event.value?.player?.name || 'Неизвестный игрок';
                eventDescription = `Пенальти отражен: ${penaltySaved}`;
                eventTypeClass = 'penalty-saved';
                break;
                
            case 'SUBSTITUTION':
                const playerIn = event.value?.playerIn?.name || 'Неизвестный игрок';
                const playerOut = event.value?.playerOut?.name || 'Неизвестный игрок';
                eventDescription = `Замена: ${playerIn} вместо ${playerOut}`;
                eventTypeClass = 'substitution';
                break;
                
            default:
                eventDescription = 'Событие матча';
                break;
        }
        
        eventElement.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-team ${isHome ? 'home-team-event' : 'away-team-event'}"></div>
            <div class="event-type ${eventTypeClass}"></div>
            <div class="event-description">${eventDescription}</div>
        `;
        
        timelineContainer.appendChild(eventElement);
    });
}

// Отображение составов
function renderLineups(match) {
    if (!match.home || !match.away || !match.home.lineup || !match.away.lineup) {
        homeLineup.innerHTML = '<div class="no-data">Нет данных о составе</div>';
        awayLineup.innerHTML = '<div class="no-data">Нет данных о составе</div>';
        return;
    }
    
    // Заголовки составов
    const homeTitleElement = document.createElement('div');
    homeTitleElement.className = 'lineup-title';
    homeTitleElement.textContent = match.home.team.name;
    homeLineup.appendChild(homeTitleElement);
    
    const awayTitleElement = document.createElement('div');
    awayTitleElement.className = 'lineup-title';
    awayTitleElement.textContent = match.away.team.name;
    awayLineup.appendChild(awayTitleElement);
    
    // Списки игроков
    const homePlayerList = document.createElement('div');
    homePlayerList.className = 'player-list';
    
    const awayPlayerList = document.createElement('div');
    awayPlayerList.className = 'player-list';
    
    // Сортируем составы по порядку выхода
    const sortedHomeLineup = [...match.home.lineup]
        .filter(player => player.lineupStarting)
        .sort((a, b) => a.lineupOrder - b.lineupOrder);
    
    const sortedAwayLineup = [...match.away.lineup]
        .filter(player => player.lineupStarting)
        .sort((a, b) => a.lineupOrder - b.lineupOrder);
    
    // Рендерим домашний состав
    sortedHomeLineup.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player-item';
        
        playerElement.innerHTML = `
            <div class="player-number">${player.jerseyNumber}</div>
            <div class="player-name">${player.player.name}</div>
        `;
        
        homePlayerList.appendChild(playerElement);
    });
    
    // Рендерим гостевой состав
    sortedAwayLineup.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = 'player-item';
        
        playerElement.innerHTML = `
            <div class="player-number">${player.jerseyNumber}</div>
            <div class="player-name">${player.player.name}</div>
        `;
        
        awayPlayerList.appendChild(playerElement);
    });
    
    homeLineup.appendChild(homePlayerList);
    awayLineup.appendChild(awayPlayerList);
}

// Скрываем индикаторы загрузки
function hideLoadingIndicators() {
    loadingIndicators.forEach(indicator => {
        indicator.style.display = 'none';
    });
}

// Показываем сообщение об ошибке
function showError(message) {
    loadingIndicators.forEach(indicator => {
        indicator.textContent = message;
        indicator.classList.add('error');
    });
} 