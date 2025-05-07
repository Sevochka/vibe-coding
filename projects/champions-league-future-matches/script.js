// Константы для работы с API
const GQL_ENDPOINT = 'https://www.sports.ru/gql/graphql/';

// DOM элементы
const tournamentLogoEl = document.getElementById('tournament-logo');
const tournamentNameEl = document.getElementById('tournament-name');
const matchesListEl = document.getElementById('matches-list');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const refreshButtonEl = document.getElementById('refresh-button');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Добавление слушателя событий для кнопки обновления
  refreshButtonEl.addEventListener('click', init);
});

// Основная функция инициализации
async function init() {
  try {
    showLoading();
    hideError();
    
    // Пытаемся получить данные с сервера
    let seasonData, matchesData;
    
    try {
      const result = await fetchMatchesData();
      if (result && result.data && result.data.footballType) {
        const footballData = result.data.footballType;
        if (footballData.season && footballData.season.length > 0) {
          const season = footballData.season[0];
          seasonData = {
            id: season.id,
            name: season.name,
            logo: season.logo,
            tournament: season.tournament
          };
          
          if (season.upcomingMatches && season.upcomingMatches.length > 0) {
            matchesData = season.upcomingMatches;
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при получении данных с сервера:', error);
      // Используем временные данные если API запрос не удался
    }
    
    // Если не удалось получить данные с сервера, используем временные данные
    if (!seasonData) {
      seasonData = tempSeasonData;
    }
    
    if (!matchesData || matchesData.length === 0) {
      matchesData = tempMatches;
    }
    
    // Отображаем информацию о турнире
    renderTournamentInfo(seasonData);
    
    // Отображаем матчи
    renderMatches(matchesData);
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    hideLoading();
    showError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
  }
}

// Функция для получения данных через GraphQL API
async function fetchMatchesData() {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getMatchesQuery
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка запроса к API:', error);
    throw error;
  }
}

// Функция для отображения информации о турнире
function renderTournamentInfo(seasonData) {
  if (!seasonData) return;
  
  if (tournamentLogoEl && seasonData.tournament && seasonData.tournament.logo) {
    tournamentLogoEl.innerHTML = `<img src="${seasonData.tournament.logo}" alt="${seasonData.tournament.name}">`;
  }
  
  if (tournamentNameEl) {
    tournamentNameEl.textContent = seasonData.name || 'Лига чемпионов 2024-25';
  }
}

// Функция для отображения списка матчей
function renderMatches(matches) {
  if (!matches || matches.length === 0) {
    matchesListEl.innerHTML = '<div class="no-matches">Нет предстоящих матчей</div>';
    return;
  }
  
  matchesListEl.innerHTML = '';
  
  matches.forEach(match => {
    const matchCard = createMatchCard(match);
    matchesListEl.appendChild(matchCard);
  });
}

// Функция для создания карточки матча
function createMatchCard(match) {
  const matchCard = document.createElement('div');
  matchCard.className = 'match-card';
  
  // Форматируем дату
  const matchDate = new Date(match.startTime);
  const formattedDate = formatDate(matchDate);
  
  // Создаем HTML для карточки матча
  matchCard.innerHTML = `
    <div class="match-date">${formattedDate}</div>
    <div class="match-teams">
      <div class="team">
        <div class="team-logo">
          <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}">
        </div>
        <div class="team-name">${match.homeTeam.name}</div>
        <div class="team-country">
          ${match.homeTeam.country ? `<img src="${match.homeTeam.country.flag}" alt="${match.homeTeam.country.name}">` : ''}
          ${match.homeTeam.country ? match.homeTeam.country.name : ''}
        </div>
      </div>
      <div class="vs">VS</div>
      <div class="team">
        <div class="team-logo">
          <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}">
        </div>
        <div class="team-name">${match.awayTeam.name}</div>
        <div class="team-country">
          ${match.awayTeam.country ? `<img src="${match.awayTeam.country.flag}" alt="${match.awayTeam.country.name}">` : ''}
          ${match.awayTeam.country ? match.awayTeam.country.name : ''}
        </div>
      </div>
    </div>
    ${match.venue ? `
      <div class="match-venue">
        <svg class="match-venue-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"></path>
          <path d="M5 21V7l8-4v18"></path>
          <path d="M19 21V11l-6-4"></path>
          <path d="M9 9h1"></path>
          <path d="M9 13h1"></path>
          <path d="M9 17h1"></path>
        </svg>
        ${match.venue.name}${match.venue.city ? `, ${match.venue.city}` : ''}
      </div>
    ` : ''}
  `;
  
  return matchCard;
}

// Функция для форматирования даты
function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return 'Дата неизвестна';
  }
  
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('ru-RU', options).replace(',', '');
}

// Функции для управления состоянием приложения
function showLoading() {
  if (loadingEl) loadingEl.style.display = 'flex';
  if (matchesListEl) matchesListEl.style.display = 'none';
}

function hideLoading() {
  if (loadingEl) loadingEl.style.display = 'none';
  if (matchesListEl) matchesListEl.style.display = 'flex';
}

function showError(message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function hideError() {
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
} 