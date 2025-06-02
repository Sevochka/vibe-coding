// Расширенные результаты для полного сезона
const extendedResults = [
    // Туры 11-20
    {
        week: 11,
        matches: [
            { home: 'ARS', away: 'BRE', score: [2, 0] },
            { home: 'BHA', away: 'SOU', score: [3, 1] },
            { home: 'BOU', away: 'MCI', score: [1, 3] },
            { home: 'CHE', away: 'WOL', score: [2, 0] },
            { home: 'EVE', away: 'IPW', score: [2, 1] },
            { home: 'LEI', away: 'FUL', score: [1, 2] },
            { home: 'LIV', away: 'AVL', score: [3, 1] },
            { home: 'MUN', away: 'NFO', score: [2, 0] },
            { home: 'NEW', away: 'CRY', score: [1, 0] },
            { home: 'TOT', away: 'WHU', score: [3, 2] }
        ]
    },
    {
        week: 12,
        matches: [
            { home: 'AVL', away: 'TOT', score: [2, 2] },
            { home: 'BRE', away: 'BOU', score: [1, 1] },
            { home: 'CRY', away: 'LIV', score: [0, 2] },
            { home: 'FUL', away: 'ARS', score: [1, 3] },
            { home: 'IPW', away: 'MUN', score: [0, 2] },
            { home: 'MCI', away: 'LEI', score: [4, 0] },
            { home: 'NFO', away: 'NEW', score: [1, 1] },
            { home: 'SOU', away: 'CHE', score: [1, 2] },
            { home: 'WHU', away: 'BHA', score: [2, 1] },
            { home: 'WOL', away: 'EVE', score: [1, 0] }
        ]
    },
    {
        week: 13,
        matches: [
            { home: 'ARS', away: 'MUN', score: [2, 1] },
            { home: 'BHA', away: 'WOL', score: [2, 0] },
            { home: 'BOU', away: 'NFO', score: [2, 1] },
            { home: 'CHE', away: 'AVL', score: [1, 1] },
            { home: 'EVE', away: 'MCI', score: [0, 3] },
            { home: 'LEI', away: 'SOU', score: [2, 0] },
            { home: 'LIV', away: 'IPW', score: [3, 0] },
            { home: 'NEW', away: 'BRE', score: [2, 1] },
            { home: 'TOT', away: 'FUL', score: [3, 1] },
            { home: 'WHU', away: 'CRY', score: [1, 1] }
        ]
    },
    {
        week: 14,
        matches: [
            { home: 'AVL', away: 'LIV', score: [1, 2] },
            { home: 'BRE', away: 'ARS', score: [1, 2] },
            { home: 'CRY', away: 'NEW', score: [2, 2] },
            { home: 'FUL', away: 'LEI', score: [2, 1] },
            { home: 'IPW', away: 'EVE', score: [1, 1] },
            { home: 'MCI', away: 'BOU', score: [3, 0] },
            { home: 'MUN', away: 'ARS', score: [1, 1] },
            { home: 'NFO', away: 'TOT', score: [0, 2] },
            { home: 'SOU', away: 'BHA', score: [1, 2] },
            { home: 'WOL', away: 'CHE', score: [1, 3] }
        ]
    },
    {
        week: 15,
        matches: [
            { home: 'ARS', away: 'CRY', score: [3, 0] },
            { home: 'BHA', away: 'MCI', score: [1, 2] },
            { home: 'BOU', away: 'SOU', score: [2, 1] },
            { home: 'CHE', away: 'IPW', score: [2, 0] },
            { home: 'EVE', away: 'BRE', score: [1, 1] },
            { home: 'LEI', away: 'NFO', score: [2, 1] },
            { home: 'LIV', away: 'MUN', score: [2, 0] },
            { home: 'NEW', away: 'WOL', score: [3, 1] },
            { home: 'TOT', away: 'AVL', score: [2, 2] },
            { home: 'WHU', away: 'FUL', score: [2, 1] }
        ]
    },
    {
        week: 16,
        matches: [
            { home: 'AVL', away: 'WHU', score: [3, 0] },
            { home: 'BRE', away: 'EVE', score: [1, 0] },
            { home: 'CRY', away: 'ARS', score: [0, 2] },
            { home: 'FUL', away: 'TOT', score: [1, 3] },
            { home: 'IPW', away: 'CHE', score: [0, 3] },
            { home: 'MCI', away: 'BHA', score: [3, 1] },
            { home: 'MUN', away: 'LIV', score: [1, 2] },
            { home: 'NFO', away: 'LEI', score: [1, 0] },
            { home: 'SOU', away: 'BOU', score: [0, 0] },
            { home: 'WOL', away: 'NEW', score: [1, 2] }
        ]
    },
    {
        week: 17,
        matches: [
            { home: 'ARS', away: 'IPW', score: [4, 0] },
            { home: 'BHA', away: 'BRE', score: [2, 1] },
            { home: 'BOU', away: 'FUL', score: [2, 2] },
            { home: 'CHE', away: 'TOT', score: [2, 2] },
            { home: 'EVE', away: 'ARS', score: [0, 2] },
            { home: 'LEI', away: 'MUN', score: [1, 2] },
            { home: 'LIV', away: 'WOL', score: [3, 0] },
            { home: 'NEW', away: 'NFO', score: [2, 0] },
            { home: 'SOU', away: 'CRY', score: [1, 1] },
            { home: 'WHU', away: 'MCI', score: [0, 3] }
        ]
    },
    {
        week: 18,
        matches: [
            { home: 'AVL', away: 'LEI', score: [2, 0] },
            { home: 'BRE', away: 'NEW', score: [1, 2] },
            { home: 'CRY', away: 'BHA', score: [1, 2] },
            { home: 'FUL', away: 'WHU', score: [2, 2] },
            { home: 'IPW', away: 'ARS', score: [0, 3] },
            { home: 'MCI', away: 'LIV', score: [1, 1] },
            { home: 'MUN', away: 'CHE', score: [2, 1] },
            { home: 'NFO', away: 'BOU', score: [2, 1] },
            { home: 'TOT', away: 'SOU', score: [3, 0] },
            { home: 'WOL', away: 'EVE', score: [2, 1] }
        ]
    },
    {
        week: 19,
        matches: [
            { home: 'ARS', away: 'AVL', score: [2, 1] },
            { home: 'BHA', away: 'TOT', score: [1, 3] },
            { home: 'BOU', away: 'LIV', score: [0, 2] },
            { home: 'CHE', away: 'CRY', score: [2, 0] },
            { home: 'EVE', away: 'NFO', score: [2, 0] },
            { home: 'LEI', away: 'WOL', score: [2, 1] },
            { home: 'NEW', away: 'MUN', score: [1, 1] },
            { home: 'SOU', away: 'FUL', score: [1, 2] },
            { home: 'WHU', away: 'IPW', score: [3, 0] },
            { home: 'MCI', away: 'BRE', score: [2, 0] }
        ]
    },
    {
        week: 20,
        matches: [
            { home: 'AVL', away: 'BHA', score: [2, 1] },
            { home: 'BRE', away: 'MCI', score: [0, 2] },
            { home: 'CRY', away: 'EVE', score: [1, 1] },
            { home: 'FUL', away: 'NEW', score: [1, 2] },
            { home: 'IPW', away: 'LEI', score: [1, 2] },
            { home: 'LIV', away: 'SOU', score: [3, 0] },
            { home: 'MUN', away: 'BOU', score: [2, 1] },
            { home: 'NFO', away: 'ARS', score: [0, 2] },
            { home: 'TOT', away: 'CHE', score: [2, 2] },
            { home: 'WOL', away: 'WHU', score: [1, 2] }
        ]
    }
];

// Объединяем существующие и расширенные результаты
const fullResults = [...results, ...extendedResults];

// Добавляем оставшиеся 18 туров (21-38)
for (let week = 21; week <= 38; week++) {
    // Создаем матчи для каждого тура
    const matches = [];
    for (let i = 0; i < 10; i++) {
        // Случайно выбираем команды, избегая повторений
        const usedTeams = new Set();
        let homeTeam, awayTeam;
        
        do {
            homeTeam = teams[Math.floor(Math.random() * teams.length)].id;
        } while (usedTeams.has(homeTeam));
        usedTeams.add(homeTeam);
        
        do {
            awayTeam = teams[Math.floor(Math.random() * teams.length)].id;
        } while (usedTeams.has(awayTeam));
        usedTeams.add(awayTeam);
        
        // Генерируем случайный счет
        const homeGoals = Math.floor(Math.random() * 4);
        const awayGoals = Math.floor(Math.random() * 3);
        
        matches.push({
            home: homeTeam,
            away: awayTeam,
            score: [homeGoals, awayGoals]
        });
    }
    
    fullResults.push({
        week,
        matches
    });
} 