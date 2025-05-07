// Конфигурация для API запросов
const CONFIG = {
    // ID сезона Лиги Чемпионов 2024-25
    seasonId: 'champions_league_24-25',
    
    // Базовый URL для GraphQL запросов
    apiUrl: 'https://www.sports.ru/gql/graphql/',
    
    // Количество матчей для отображения
    matchesLimit: 10,
    
    // ID и логотип турнира
    tournament: {
        id: 'champions_league',
        name: 'Лига Чемпионов',
        logo: 'https://s.scr365.net/s1/logo/22_432.png'
    },
    
    // Форматы даты и времени
    dateFormat: {
        options: { 
            day: 'numeric', 
            month: 'long', 
            weekday: 'long'
        }
    },
    timeFormat: {
        options: {
            hour: '2-digit',
            minute: '2-digit'
        }
    }
}; 