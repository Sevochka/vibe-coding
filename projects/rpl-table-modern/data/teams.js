const rplTeams = [
    {
        id: 1,
        name: "Динамо",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/1.webp",
        position: 1,
        games: 30,
        wins: 20,
        draws: 7,
        losses: 3,
        goalsFor: 52,
        goalsAgainst: 18,
        points: 67,
        form: ['W', 'W', 'D', 'W', 'W'],
        zone: "champions"
    },
    {
        id: 2,
        name: "Зенит",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/3.webp",
        position: 2,
        games: 30,
        wins: 19,
        draws: 6,
        losses: 5,
        goalsFor: 48,
        goalsAgainst: 22,
        points: 63,
        form: ['W', 'D', 'W', 'W', 'L'],
        zone: "champions"
    },
    {
        id: 3,
        name: "ЦСКА",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/4.webp",
        position: 3,
        games: 30,
        wins: 17,
        draws: 9,
        losses: 4,
        goalsFor: 45,
        goalsAgainst: 25,
        points: 60,
        form: ['D', 'W', 'W', 'D', 'W'],
        zone: "champions"
    },
    {
        id: 4,
        name: "Спартак",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/5.webp",
        position: 4,
        games: 30,
        wins: 16,
        draws: 8,
        losses: 6,
        goalsFor: 42,
        goalsAgainst: 28,
        points: 56,
        form: ['L', 'W', 'D', 'W', 'W'],
        zone: "champions"
    },
    {
        id: 5,
        name: "Краснодар",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/1058.webp",
        position: 5,
        games: 30,
        wins: 15,
        draws: 9,
        losses: 6,
        goalsFor: 38,
        goalsAgainst: 26,
        points: 54,
        form: ['W', 'D', 'L', 'W', 'D'],
        zone: "europa"
    },
    {
        id: 6,
        name: "Локомотив",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/2.webp",
        position: 6,
        games: 30,
        wins: 14,
        draws: 10,
        losses: 6,
        goalsFor: 36,
        goalsAgainst: 27,
        points: 52,
        form: ['D', 'D', 'W', 'L', 'W'],
        zone: "europa"
    },
    {
        id: 7,
        name: "Ростов",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/14.webp",
        position: 7,
        games: 30,
        wins: 13,
        draws: 11,
        losses: 6,
        goalsFor: 34,
        goalsAgainst: 28,
        points: 50,
        form: ['D', 'W', 'D', 'D', 'L'],
        zone: "conference"
    },
    {
        id: 8,
        name: "Рубин",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/6.webp",
        position: 8,
        games: 30,
        wins: 12,
        draws: 9,
        losses: 9,
        goalsFor: 32,
        goalsAgainst: 32,
        points: 45,
        form: ['L', 'D', 'W', 'D', 'L'],
        zone: "safe"
    },
    {
        id: 9,
        name: "Торпедо",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/9.webp",
        position: 9,
        games: 30,
        wins: 11,
        draws: 11,
        losses: 8,
        goalsFor: 30,
        goalsAgainst: 30,
        points: 44,
        form: ['D', 'L', 'D', 'W', 'D'],
        zone: "safe"
    },
    {
        id: 10,
        name: "Крылья Советов",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/15.webp",
        position: 10,
        games: 30,
        wins: 11,
        draws: 10,
        losses: 9,
        goalsFor: 29,
        goalsAgainst: 31,
        points: 43,
        form: ['W', 'L', 'D', 'L', 'D'],
        zone: "safe"
    },
    {
        id: 11,
        name: "Ахмат",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/102.webp",
        position: 11,
        games: 30,
        wins: 10,
        draws: 12,
        losses: 8,
        goalsFor: 28,
        goalsAgainst: 30,
        points: 42,
        form: ['D', 'D', 'L', 'W', 'D'],
        zone: "safe"
    },
    {
        id: 12,
        name: "Балтика",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/97.webp",
        position: 12,
        games: 30,
        wins: 9,
        draws: 12,
        losses: 9,
        goalsFor: 26,
        goalsAgainst: 32,
        points: 39,
        form: ['L', 'D', 'D', 'L', 'W'],
        zone: "safe"
    },
    {
        id: 13,
        name: "Сочи",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/2127.webp",
        position: 13,
        games: 30,
        wins: 8,
        draws: 13,
        losses: 9,
        goalsFor: 25,
        goalsAgainst: 33,
        points: 37,
        form: ['D', 'L', 'D', 'D', 'L'],
        zone: "safe"
    },
    {
        id: 14,
        name: "Пари НН",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/3086.webp",
        position: 14,
        games: 30,
        wins: 7,
        draws: 11,
        losses: 12,
        goalsFor: 24,
        goalsAgainst: 36,
        points: 32,
        form: ['L', 'L', 'D', 'L', 'D'],
        zone: "relegation"
    },
    {
        id: 15,
        name: "Динамо Мх",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/3384.webp",
        position: 15,
        games: 30,
        wins: 6,
        draws: 12,
        losses: 12,
        goalsFor: 22,
        goalsAgainst: 38,
        points: 30,
        form: ['L', 'D', 'L', 'L', 'D'],
        zone: "relegation"
    },
    {
        id: 16,
        name: "Акрон",
        logo: "https://cdn.bombardir.ru/images/ut_teams/logo/3386.webp",
        position: 16,
        games: 30,
        wins: 4,
        draws: 10,
        losses: 16,
        goalsFor: 18,
        goalsAgainst: 42,
        points: 22,
        form: ['L', 'L', 'D', 'L', 'L'],
        zone: "relegation"
    }
];

// Функция для получения цвета зоны
function getZoneColor(zone) {
    switch(zone) {
        case 'champions':
            return 'var(--sports-primary-color)';
        case 'europa':
            return 'var(--sports-cyan-A700)';
        case 'conference':
            return 'var(--sports-yellow-A700)';
        case 'relegation':
            return 'var(--sports-red-a700)';
        default:
            return 'transparent';
    }
}

// Функция для получения названия зоны
function getZoneName(zone) {
    switch(zone) {
        case 'champions':
            return 'Лига чемпионов';
        case 'europa':
            return 'Лига Европы';
        case 'conference':
            return 'Лига конференций';
        case 'relegation':
            return 'Зона вылета';
        default:
            return '';
    }
} 