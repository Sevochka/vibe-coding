// Виртуальные матчи для симуляции
const virtualMatches = [
    {
        id: 1,
        homeTeam: 'Зенит',
        awayTeam: 'Краснодар',
        homeScore: 0,
        awayScore: 0,
        status: 'live',
        minute: 0
    },
    {
        id: 2,
        homeTeam: 'ЦСКА',
        awayTeam: 'Динамо',
        homeScore: 0,
        awayScore: 0,
        status: 'live',
        minute: 0
    },
    {
        id: 3,
        homeTeam: 'Спартак',
        awayTeam: 'Зенит',
        homeScore: 0,
        awayScore: 0,
        status: 'scheduled',
        minute: 0
    }
];

// Сценарии голов для автоматической симуляции
const goalScenarios = [
    { matchId: 1, minute: 15, scorer: 'away', description: 'Гол Краснодара!' },
    { matchId: 2, minute: 25, scorer: 'home', description: 'Гол ЦСКА!' },
    { matchId: 1, minute: 35, scorer: 'home', description: 'Ответный гол Зенита!' },
    { matchId: 2, minute: 42, scorer: 'away', description: 'Динамо сравнивает счёт!' },
    { matchId: 1, minute: 55, scorer: 'away', description: 'Второй гол Краснодара!' },
    { matchId: 2, minute: 67, scorer: 'home', description: 'ЦСКА вырывается вперёд!' },
    { matchId: 1, minute: 78, scorer: 'home', description: 'Зенит снова сравнивает!' },
    { matchId: 2, minute: 84, scorer: 'away', description: 'Динамо забивает на последних минутах!' }
]; 