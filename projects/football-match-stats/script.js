// Функция для форматирования времени матча
const formatMatchTime = (minutes) => {
    if (minutes > 90) {
        return `${minutes}'`;
    }
    return `${minutes}'`;
};

// Функция для получения названия позиции на русском
const getPositionName = (position) => {
    const positions = {
        'GOALKEEPER': 'Вратарь',
        'DEFENDER': 'Защитник',
        'MIDFIELDER': 'Полузащитник',
        'FORWARD': 'Нападающий'
    };
    return positions[position] || position;
};

// Функция для создания карточки игрока
const createPlayerCard = (playerData) => {
    const { player, stat } = playerData;
    const card = document.createElement('div');
    card.className = 'player-card';
    
    card.innerHTML = `
        <img src="${player.logotype.url}" alt="${player.lastName}" class="player-photo">
        <div class="player-info">
            <div class="player-name">${player.firstName} ${player.lastName}</div>
            <div class="player-position">${getPositionName(player.fieldPosition)}</div>
            <div class="player-stats">
                ${stat.goalsScored > 0 ? `<span class="goals-count">⚽ ${stat.goalsScored}</span>` : ''}
                ${stat.assists > 0 ? `<span class="assists-count">👟 ${stat.assists}</span>` : ''}
                ${stat.yellowCards > 0 ? `<span class="yellow-card">🟨 ${stat.yellowCards}</span>` : ''}
                ${stat.redCards > 0 ? `<span class="red-card">🟥 ${stat.redCards}</span>` : ''}
            </div>
        </div>
    `;
    
    return card;
};

// Функция для создания события в таймлайне
const createTimelineEvent = (event) => {
    const timelineEvent = document.createElement('div');
    timelineEvent.className = 'timeline-event';
    
    const eventTime = formatMatchTime(event.value.matchTime);
    const team = event.value.team === 'HOME' ? 'Интер' : 'Барселона';
    let description = '';
    
    switch (event.type) {
        case 'SCORE_CHANGE':
            description = `<div class="event-team">${team}</div>
                         <div class="event-detail">Гол! Счёт становится ${event.value.homeScore}:${event.value.awayScore}</div>`;
            break;
        case 'SUBSTITUTION':
            description = `<div class="event-team">${team}</div>
                         <div class="event-detail">Замена</div>`;
            break;
        default:
            description = `<div class="event-detail">Событие матча</div>`;
    }
    
    timelineEvent.innerHTML = `
        <div class="event-time">${eventTime}</div>
        <div class="event-content">
            <div class="event-description">${description}</div>
        </div>
    `;
    
    return timelineEvent;
};

// Функция для отображения составов
const renderSquads = () => {
    const homeSquad = document.getElementById('home-squad');
    const awaySquad = document.getElementById('away-squad');
    
    // Очищаем предыдущее содержимое
    homeSquad.innerHTML = '';
    awaySquad.innerHTML = '';
    
    // Добавляем игроков домашней команды
    matchData.home.lineup.forEach(player => {
        homeSquad.appendChild(createPlayerCard(player));
    });
    
    // Добавляем игроков гостевой команды
    matchData.away.lineup.forEach(player => {
        awaySquad.appendChild(createPlayerCard(player));
    });
};

// Функция для отображения хронологии
const renderTimeline = () => {
    const timelineContainer = document.querySelector('.timeline-container');
    timelineContainer.innerHTML = '';
    
    // Сортируем события по времени (от последнего к первому)
    const sortedEvents = [...matchData.events].sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
    });
    
    sortedEvents.forEach(event => {
        timelineContainer.appendChild(createTimelineEvent(event));
    });
};

// Обработчик переключения вкладок
const initTabs = () => {
    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            tab.classList.add('active');
            const pane = document.getElementById(tab.dataset.tab);
            pane.classList.add('active');
        });
    });
};

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    renderSquads();
    renderTimeline();
    initTabs();
}); 