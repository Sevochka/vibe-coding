const CONFIG = {
    // Идентификатор сезона Лиги Чемпионов 2024/25
    seasonId: 'champions_league_24-25',
    
    // Параметры запроса
    gqlEndpoint: 'https://www.sports.ru/gql/graphql/',
    
    // Форматирование даты
    dateOptions: {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        timeZone: 'Europe/Moscow'
    },
    
    // Форматирование времени
    timeOptions: {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow' 
    },
    
    // Названия этапов/стадий турнира
    stageNames: {
        'regular_season': 'Лига',
        'playoff': 'Плей-офф',
        'round_of_16': '1/8 финала',
        'quarter_finals': '1/4 финала',
        'semi_finals': '1/2 финала',
        'final': 'Финал'
    },
    
    // ID проекта для ресайзера
    projectSlug: 'champions-league-matches',
}; 