document.addEventListener('DOMContentLoaded', function() {
    initBettingWidget();
});

function initBettingWidget() {
    renderMatches();
    renderBookmakers();
    addAnimations();
    addEventListeners();
}

function renderMatches() {
    const matchesContainer = document.getElementById('matchesContainer');
    
    matchesData.forEach(match => {
        const matchElement = createMatchElement(match);
        matchesContainer.appendChild(matchElement);
    });
}

function createMatchElement(match) {
    const matchDiv = document.createElement('div');
    matchDiv.className = 'betting-widget__match';
    
    matchDiv.innerHTML = `
        <div class="betting-widget__match-info">
            <div class="betting-widget__match-teams">
                <span class="betting-widget__sport-icon">${match.leagueIcon}</span>
                <span>${match.homeTeam} - ${match.awayTeam}</span>
            </div>
            <div class="betting-widget__match-league">
                <span>${match.league}</span>
                <span>•</span>
                <span>${match.date} ${match.time}</span>
            </div>
        </div>
        <div class="betting-widget__odds">
            <div class="betting-widget__odd" data-outcome="home" data-match-id="${match.id}">
                ${match.odds.home}
            </div>
            <div class="betting-widget__odd betting-widget__odd--draw" data-outcome="draw" data-match-id="${match.id}">
                ${match.odds.draw}
            </div>
            <div class="betting-widget__odd betting-widget__odd--away" data-outcome="away" data-match-id="${match.id}">
                ${match.odds.away}
            </div>
        </div>
    `;
    
    return matchDiv;
}

function renderBookmakers() {
    const bookmakersContainer = document.getElementById('bookmakersContainer');
    
    bookmakersData.forEach(bookmaker => {
        const bookmakerElement = createBookmakerElement(bookmaker);
        bookmakersContainer.appendChild(bookmakerElement);
    });
}

function createBookmakerElement(bookmaker) {
    const bookmakerLink = document.createElement('a');
    bookmakerLink.href = bookmaker.url;
    bookmakerLink.target = '_blank';
    bookmakerLink.rel = 'nofollow sponsored';
    bookmakerLink.className = 'betting-widget__bookmaker';
    
    bookmakerLink.innerHTML = `
        <img src="${bookmaker.logo}" alt="${bookmaker.name}" class="betting-widget__bookmaker-logo">
        <span class="betting-widget__bookmaker-name">${bookmaker.name}</span>
    `;
    
    return bookmakerLink;
}

function addEventListeners() {
    // Добавляем обработчики для коэффициентов
    document.querySelectorAll('.betting-widget__odd').forEach(odd => {
        odd.addEventListener('click', handleOddClick);
    });
    
    // Добавляем обработчики для букмекеров
    document.querySelectorAll('.betting-widget__bookmaker').forEach(bookmaker => {
        bookmaker.addEventListener('click', handleBookmakerClick);
    });
}

function handleOddClick(event) {
    const odd = event.target;
    const matchId = odd.dataset.matchId;
    const outcome = odd.dataset.outcome;
    const oddValue = odd.textContent;
    
    // Анимация клика
    odd.style.transform = 'scale(0.95)';
    setTimeout(() => {
        odd.style.transform = '';
    }, 150);
    
    // Здесь можно добавить логику для обработки клика по коэффициенту
    console.log(`Выбран коэффициент: ${oddValue} на исход "${outcome}" матча ${matchId}`);
    
    // Показываем уведомление
    showNotification(`Коэффициент ${oddValue} выбран! Перейдите к букмекеру для оформления ставки.`);
}

function handleBookmakerClick(event) {
    const bookmakerName = event.currentTarget.querySelector('.betting-widget__bookmaker-name').textContent;
    console.log(`Переход к букмекеру: ${bookmakerName}`);
}

function addAnimations() {
    // Анимация появления матчей
    const matches = document.querySelectorAll('.betting-widget__match');
    matches.forEach((match, index) => {
        match.style.opacity = '0';
        match.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            match.style.transition = 'all 0.5s ease';
            match.style.opacity = '1';
            match.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Анимация пульсации для коэффициентов
    setInterval(() => {
        const odds = document.querySelectorAll('.betting-widget__odd');
        const randomOdd = odds[Math.floor(Math.random() * odds.length)];
        
        if (randomOdd && Math.random() > 0.7) {
            randomOdd.classList.add('betting-widget__odd--pulse');
            setTimeout(() => {
                randomOdd.classList.remove('betting-widget__odd--pulse');
            }, 1000);
        }
    }, 3000);
}

function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'betting-widget__notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--sports-primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 199, 139, 0.3);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обновление коэффициентов каждые 30 секунд
setInterval(() => {
    updateOdds();
}, 30000);

function updateOdds() {
    const odds = document.querySelectorAll('.betting-widget__odd');
    
    odds.forEach(odd => {
        const currentValue = parseFloat(odd.textContent);
        const change = (Math.random() - 0.5) * 0.2; // Изменение до ±0.1
        const newValue = Math.max(1.01, Math.round((currentValue + change) * 100) / 100);
        
        if (Math.abs(newValue - currentValue) > 0.05) {
            odd.style.background = change > 0 ? '#ff6b6b' : '#51cf66';
            odd.textContent = newValue.toFixed(2);
            
            setTimeout(() => {
                odd.style.background = '';
            }, 1000);
        }
    });
} 