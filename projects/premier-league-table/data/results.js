const results = [
    // Тур 1
    {
        week: 1,
        matches: [
            { home: 'MUN', away: 'FUL', score: [1, 0] },
            { home: 'ARS', away: 'WOL', score: [2, 0] },
            { home: 'EVE', away: 'BHA', score: [0, 3] },
            { home: 'NEW', away: 'SOU', score: [1, 0] },
            { home: 'NFO', away: 'BOU', score: [1, 1] },
            { home: 'WHU', away: 'AVL', score: [1, 2] },
            { home: 'IPW', away: 'LIV', score: [0, 2] },
            { home: 'BRE', away: 'CRY', score: [2, 1] },
            { home: 'CHE', away: 'MCI', score: [0, 2] },
            { home: 'LEI', away: 'TOT', score: [1, 1] }
        ]
    },
    // Тур 2
    {
        week: 2,
        matches: [
            { home: 'BOU', away: 'NEW', score: [2, 1] },
            { home: 'BHA', away: 'MUN', score: [2, 1] },
            { home: 'CRY', away: 'WHU', score: [0, 2] },
            { home: 'FUL', away: 'LEI', score: [2, 1] },
            { home: 'LIV', away: 'BRE', score: [2, 0] },
            { home: 'MCI', away: 'IPW', score: [4, 1] },
            { home: 'SOU', away: 'NFO', score: [0, 1] },
            { home: 'TOT', away: 'EVE', score: [4, 0] },
            { home: 'WOL', away: 'CHE', score: [2, 1] },
            { home: 'AVL', away: 'ARS', score: [2, 0] }
        ]
    },
    // Тур 3
    {
        week: 3,
        matches: [
            { home: 'CHE', away: 'CRY', score: [1, 1] },
            { home: 'ARS', away: 'BHA', score: [2, 0] },
            { home: 'BRE', away: 'SOU', score: [3, 1] },
            { home: 'EVE', away: 'BOU', score: [1, 2] },
            { home: 'IPW', away: 'FUL', score: [1, 1] },
            { home: 'LEI', away: 'AVL', score: [1, 2] },
            { home: 'MUN', away: 'LIV', score: [0, 3] },
            { home: 'NEW', away: 'TOT', score: [1, 1] },
            { home: 'NFO', away: 'WOL', score: [0, 1] },
            { home: 'WHU', away: 'MCI', score: [1, 3] }
        ]
    },
    // Тур 4
    {
        week: 4,
        matches: [
            { home: 'AVL', away: 'WOL', score: [3, 1] },
            { home: 'BHA', away: 'IPW', score: [1, 1] },
            { home: 'BOU', away: 'CHE', score: [0, 1] },
            { home: 'CRY', away: 'LEI', score: [2, 1] },
            { home: 'FUL', away: 'NFO', score: [0, 0] },
            { home: 'LIV', away: 'NEW', score: [2, 1] },
            { home: 'MCI', away: 'BRE', score: [1, 1] },
            { home: 'SOU', away: 'MUN', score: [0, 3] },
            { home: 'TOT', away: 'ARS', score: [2, 3] },
            { home: 'WOL', away: 'WHU', score: [1, 1] }
        ]
    },
    // Тур 5
    {
        week: 5,
        matches: [
            { home: 'ARS', away: 'LEI', score: [4, 0] },
            { home: 'BRE', away: 'WHU', score: [1, 1] },
            { home: 'CHE', away: 'BHA', score: [2, 1] },
            { home: 'EVE', away: 'CRY', score: [0, 0] },
            { home: 'IPW', away: 'SOU', score: [1, 0] },
            { home: 'MUN', away: 'TOT', score: [1, 3] },
            { home: 'NEW', away: 'WOL', score: [2, 0] },
            { home: 'NFO', away: 'LIV', score: [0, 1] },
            { home: 'AVL', away: 'MCI', score: [1, 1] },
            { home: 'FUL', away: 'BOU', score: [1, 2] }
        ]
    },
    // Тур 6
    {
        week: 6,
        matches: [
            { home: 'BHA', away: 'NFO', score: [3, 3] },
            { home: 'BOU', away: 'ARS', score: [0, 0] },
            { home: 'CRY', away: 'MUN', score: [0, 0] },
            { home: 'LEI', away: 'BRE', score: [1, 2] },
            { home: 'LIV', away: 'CHE', score: [2, 1] },
            { home: 'MCI', away: 'FUL', score: [3, 1] },
            { home: 'SOU', away: 'EVE', score: [1, 0] },
            { home: 'TOT', away: 'IPW', score: [3, 0] },
            { home: 'WHU', away: 'NEW', score: [1, 1] },
            { home: 'WOL', away: 'AVL', score: [0, 0] }
        ]
    },
    // Тур 7
    {
        week: 7,
        matches: [
            { home: 'ARS', away: 'SOU', score: [3, 1] },
            { home: 'AVL', away: 'BOU', score: [3, 1] },
            { home: 'BRE', away: 'WOL', score: [2, 0] },
            { home: 'CHE', away: 'NFO', score: [1, 0] },
            { home: 'EVE', away: 'WHU', score: [1, 1] },
            { home: 'FUL', away: 'LIV', score: [0, 1] },
            { home: 'IPW', away: 'CRY', score: [4, 1] },
            { home: 'MUN', away: 'BHA', score: [2, 1] },
            { home: 'NEW', away: 'MCI', score: [1, 0] },
            { home: 'TOT', away: 'LEI', score: [2, 1] }
        ]
    },
    // Тур 8
    {
        week: 8,
        matches: [
            { home: 'BOU', away: 'IPW', score: [2, 0] },
            { home: 'BHA', away: 'FUL', score: [1, 1] },
            { home: 'CRY', away: 'TOT', score: [1, 2] },
            { home: 'LEI', away: 'MUN', score: [0, 3] },
            { home: 'LIV', away: 'CHE', score: [2, 1] },
            { home: 'MCI', away: 'ARS', score: [2, 2] },
            { home: 'NFO', away: 'BRE', score: [1, 1] },
            { home: 'SOU', away: 'WOL', score: [1, 0] },
            { home: 'WHU', away: 'EVE', score: [1, 0] },
            { home: 'AVL', away: 'NEW', score: [2, 0] }
        ]
    },
    // Тур 9
    {
        week: 9,
        matches: [
            { home: 'ARS', away: 'LIV', score: [2, 2] },
            { home: 'BRE', away: 'IPW', score: [1, 0] },
            { home: 'CHE', away: 'NEW', score: [2, 1] },
            { home: 'CRY', away: 'NFO', score: [0, 1] },
            { home: 'EVE', away: 'FUL', score: [1, 0] },
            { home: 'MUN', away: 'WHU', score: [2, 1] },
            { home: 'SOU', away: 'LEI', score: [2, 1] },
            { home: 'TOT', away: 'WOL', score: [3, 1] },
            { home: 'AVL', away: 'BHA', score: [2, 1] },
            { home: 'BOU', away: 'MCI', score: [1, 3] }
        ]
    },
    // Тур 10
    {
        week: 10,
        matches: [
            { home: 'BHA', away: 'ARS', score: [1, 2] },
            { home: 'FUL', away: 'TOT', score: [1, 3] },
            { home: 'IPW', away: 'NEW', score: [2, 1] },
            { home: 'LEI', away: 'CHE', score: [1, 2] },
            { home: 'LIV', away: 'BOU', score: [3, 0] },
            { home: 'MCI', away: 'SOU', score: [2, 0] },
            { home: 'NFO', away: 'EVE', score: [2, 0] },
            { home: 'WHU', away: 'BRE', score: [2, 0] },
            { home: 'WOL', away: 'CRY', score: [2, 2] },
            { home: 'AVL', away: 'MUN', score: [3, 1] }
        ]
    }
]; 