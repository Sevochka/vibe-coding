async function fetchMatchData() {
    const matchId = "cska-vs-zenit";
    const source = "SPORTS_HUB";
    const GQL_ENDPOINT = 'https://www.sports.ru/gql/graphql/';

    // Создаем запрос GraphQL без пробелов, табов и новых строк
    const queryString = `{statQueries{football{match(id:"${matchId}",source:${source}){id scheduledAt dateOnly currentTime matchStatus roundName home{team{name logo:picture(productType:SPORTSRU,format:LOGO){url}}score stat{ballPossession shotsTotal shotsOnTarget cornerKicks fouls yellowCards redCards}}away{team{name logo:picture(productType:SPORTSRU,format:LOGO){url}}score stat{ballPossession shotsTotal shotsOnTarget cornerKicks fouls yellowCards redCards}}season{tournament{name}}}}}}`;

    try {
        const response = await fetch(`${GQL_ENDPOINT}?query=${encodeURIComponent(queryString)}`);

        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL Ошибки:', data.errors);
            return null;
        }

        return data.data.statQueries.football.match;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return null;
    }
}

function renderWidget(data) {
    // Проверяем, загружены ли данные или используем резервные
    if (!data) {
        console.warn('Используются резервные данные о матче');
        data = matchData;
    }

    // Установка информации о турнире и статусе
    document.getElementById('tournament-name').textContent = `${data.season.tournament.name}: ${data.roundName || ''}`;
    
    let statusText = data.matchStatus === 'LIVE' 
        ? `⚽ Идет матч (${data.currentTime || 'Live'})` 
        : data.matchStatus === 'ENDED' 
            ? 'Матч завершен' 
            : new Date(data.scheduledAt).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              });
    
    document.getElementById('match-status').textContent = statusText;

    // Установка информации о домашней команде
    document.getElementById('home-team-name').textContent = data.home.team.name;
    document.getElementById('home-team-logo').src = data.home.team.logo?.url || data.home.team.logo;
    document.getElementById('home-team-score').textContent = data.home.score;

    // Установка информации о гостевой команде
    document.getElementById('away-team-name').textContent = data.away.team.name;
    document.getElementById('away-team-logo').src = data.away.team.logo?.url || data.away.team.logo;
    document.getElementById('away-team-score').textContent = data.away.score;

    // Отрисовка статистики
    renderStats(data);
}

function renderStats(data) {
    const statsGrid = document.getElementById('stats-grid-content');
    statsGrid.innerHTML = '';

    const homeStats = data.home.stat;
    const awayStats = data.away.stat;

    // Данные по владению мячом
    const homePossession = homeStats.ballPossession || 0;
    const awayPossession = awayStats.ballPossession || 0;
    const totalPossession = homePossession + awayPossession;
    const homePossessionPercent = totalPossession > 0 ? Math.round((homePossession / totalPossession) * 100) : 50;
    const awayPossessionPercent = totalPossession > 0 ? Math.round((awayPossession / totalPossession) * 100) : 50;

    const statsToShow = [
        { 
            label: 'Владение мячом', 
            homeVal: `${homePossessionPercent}%`, 
            awayVal: `${awayPossessionPercent}%`, 
            type: 'possession',
            homeBarWidth: homePossessionPercent,
            awayBarWidth: awayPossessionPercent
        },
        { 
            label: 'Удары', 
            homeVal: homeStats.shotsTotal || 0, 
            awayVal: awayStats.shotsTotal || 0, 
            type: 'values'
        },
        { 
            label: 'Удары в створ', 
            homeVal: homeStats.shotsOnTarget || 0, 
            awayVal: awayStats.shotsOnTarget || 0, 
            type: 'values'
        },
        { 
            label: 'Угловые', 
            homeVal: homeStats.cornerKicks || 0, 
            awayVal: awayStats.cornerKicks || 0, 
            type: 'values'
        },
        { 
            label: 'Фолы', 
            homeVal: homeStats.fouls || 0, 
            awayVal: awayStats.fouls || 0, 
            type: 'values'
        },
        {
            label: 'Карточки',
            homeHTML: `${generateCardIcons(homeStats.yellowCards || 0, 'yellow')} ${generateCardIcons(homeStats.redCards || 0, 'red')}`.trim(),
            awayHTML: `${generateCardIcons(awayStats.yellowCards || 0, 'yellow')} ${generateCardIcons(awayStats.redCards || 0, 'red')}`.trim(),
            type: 'html'
        }
    ];

    statsToShow.forEach(stat => {
        const statRow = document.createElement('div');
        statRow.classList.add('stat-row');

        if (stat.type === 'possession') {
            statRow.innerHTML = `
                <div class="stat-row-content" style="display: grid; grid-template-columns: 1fr auto 1fr; width: 100%;">
                    <span class="stat-value home-value">${stat.homeVal}</span>
                    <span class="stat-label">${stat.label}</span>
                    <span class="stat-value away-value">${stat.awayVal}</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar home-bar" style="width: ${stat.homeBarWidth}%;"></div>
                    <div class="stat-bar away-bar" style="width: ${stat.awayBarWidth}%;"></div>
                </div>
            `;
        } else if (stat.type === 'html') {
            statRow.innerHTML = `
                <span class="stat-value home-value">${stat.homeHTML}</span>
                <span class="stat-label">${stat.label}</span>
                <span class="stat-value away-value">${stat.awayHTML}</span>
            `;
        } else {
            statRow.innerHTML = `
                <span class="stat-value home-value">${stat.homeVal}</span>
                <span class="stat-label">${stat.label}</span>
                <span class="stat-value away-value">${stat.awayVal}</span>
            `;
        }

        statsGrid.appendChild(statRow);
    });
}

function generateCardIcons(count, type) {
    if (typeof count !== 'number' || count <= 0) return '';
    
    let icons = '';
    for (let i = 0; i < count; i++) {
        icons += `<span class="card-icon ${type}-card"></span>`;
    }
    return icons;
}

// Инициализация виджета при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const projectName = 'football-match-cska-vs-zenit';
    
    // Установка ссылки на Sports.ru в логотипе
    const sportsLogoLink = document.getElementById('sports-logo-link');
    if (sportsLogoLink) {
        sportsLogoLink.href = `https://www.sports.ru/?utm_source=special-${projectName}`;
    }

    // Получаем данные матча через GQL запрос
    const matchData = await fetchMatchData();
    
    // Отображаем виджет
    renderWidget(matchData);
}); 