// Данные команд для рекламного виджета
const teams = {
    'florida-panthers': {
        id: 'florida-panthers',
        name: 'Флорида',
        fullName: 'Флорида Пантерз',
        subtitle: 'Пантерз',
        logo: 'https://img.uefa.com/imgml/TP/teams/logos/50x50/63.png',
        colors: {
            primary: '#041E42',
            secondary: '#C8102E',
            accent: '#B9975B'
        },
        league: 'НХЛ',
        conference: 'Восточная',
        division: 'Атлантическая',
        founded: 1993,
        city: 'Санрайз',
        arena: 'FLA Live Arena',
        stats: {
            wins: 42,
            losses: 32,
            overtimeLosses: 8,
            points: 92,
            goalsFor: 267,
            goalsAgainst: 258
        }
    },
    'carolina-hurricanes': {
        id: 'carolina-hurricanes',
        name: 'Каролина',
        fullName: 'Каролина Харрикейнз',
        subtitle: 'Харрикейнз',
        logo: 'https://img.uefa.com/imgml/TP/teams/logos/50x50/52.png',
        colors: {
            primary: '#CC0000',
            secondary: '#000000',
            accent: '#A2AAAD'
        },
        league: 'НХЛ',
        conference: 'Восточная',
        division: 'Метрополитан',
        founded: 1972,
        city: 'Роли',
        arena: 'PNC Arena',
        stats: {
            wins: 52,
            losses: 23,
            overtimeLosses: 7,
            points: 111,
            goalsFor: 297,
            goalsAgainst: 236
        }
    }
};

// Статистика матча
const matchStats = {
    'florida-panthers': {
        shots: 28,
        shotsOnGoal: 15,
        saves: 26,
        faceoffWin: 58,
        powerPlayGoals: 2,
        powerPlayOpportunities: 4,
        penaltyMinutes: 8,
        hits: 22,
        blockedShots: 12,
        giveaways: 7,
        takeaways: 5,
        timeOnAttack: 52.3
    },
    'carolina-hurricanes': {
        shots: 32,
        shotsOnGoal: 18,
        saves: 25,
        faceoffWin: 42,
        powerPlayGoals: 1,
        powerPlayOpportunities: 3,
        penaltyMinutes: 6,
        hits: 18,
        blockedShots: 8,
        giveaways: 5,
        takeaways: 8,
        timeOnAttack: 47.7
    }
};

// Фактоиды матча
const matchFactoids = [
    {
        icon: '🏒',
        title: 'Первый гол на 3-й минуте',
        description: 'Самый быстрый гол в плей-офф НХЛ 2024',
        type: 'record',
        team: 'florida-panthers'
    },
    {
        icon: '⚡',
        title: '87% владения шайбой',
        description: 'Доминирование Флориды в третьем периоде',
        type: 'stat',
        team: 'florida-panthers'
    },
    {
        icon: '🥅',
        title: '15 бросков в створ',
        description: 'Каролина атаковала с удвоенной силой',
        type: 'stat',
        team: 'carolina-hurricanes'
    },
    {
        icon: '🔥',
        title: 'Серия из 8 побед',
        description: 'Флорида продлила победную серию дома',
        type: 'streak',
        team: 'florida-panthers'
    },
    {
        icon: '🎯',
        title: '92% реализации большинства',
        description: 'Каролина забивала в каждом большинстве',
        type: 'efficiency',
        team: 'carolina-hurricanes'
    },
    {
        icon: '⭐',
        title: 'Хет-трик Барковва',
        description: 'Капитан Флориды забил 3 гола подряд',
        type: 'achievement',
        team: 'florida-panthers'
    }
];

// Ключевые игроки
const keyPlayers = {
    'florida-panthers': [
        {
            name: 'Александр Барков',
            position: 'Центральный нападающий',
            number: 16,
            goals: 23,
            assists: 57,
            points: 80
        },
        {
            name: 'Сэм Райнхарт',
            position: 'Правый крайний',
            number: 13,
            goals: 57,
            assists: 37,
            points: 94
        },
        {
            name: 'Сергей Бобровский',
            position: 'Вратарь',
            number: 72,
            wins: 36,
            saves: 1183,
            savePercentage: 91.5
        }
    ],
    'carolina-hurricanes': [
        {
            name: 'Себастьян Ахо',
            position: 'Центральный нападающий',
            number: 20,
            goals: 36,
            assists: 53,
            points: 89
        },
        {
            name: 'Андрей Свечников',
            position: 'Правый крайний',
            number: 37,
            goals: 23,
            assists: 30,
            points: 53
        },
        {
            name: 'Фредерик Андерсен',
            position: 'Вратарь',
            number: 31,
            wins: 35,
            saves: 1089,
            savePercentage: 89.8
        }
    ]
};

// История встреч команд
const headToHead = {
    totalGames: 28,
    'florida-panthers': {
        wins: 14,
        winPercentage: 50.0
    },
    'carolina-hurricanes': {
        wins: 14,
        winPercentage: 50.0
    },
    lastMeetings: [
        {
            date: '2024-04-20',
            score: { home: 3, away: 2 },
            homeTeam: 'florida-panthers',
            awayTeam: 'carolina-hurricanes',
            overtime: false
        },
        {
            date: '2024-03-15',
            score: { home: 1, away: 4 },
            homeTeam: 'carolina-hurricanes',
            awayTeam: 'florida-panthers',
            overtime: false
        },
        {
            date: '2024-02-08',
            score: { home: 2, away: 3 },
            homeTeam: 'florida-panthers',
            awayTeam: 'carolina-hurricanes',
            overtime: true
        }
    ]
};

// Данные хоккейных команд НХЛ - Флорида Пантерз vs Каролина Харрикейнз
const teamsData = {
    match: {
        id: "nhl-playoffs-2024-fla-vs-car",
        tournament: "НХЛ Плей-офф 2024",
        round: "Полуфинал Восточной конференции",
        date: "2024-05-15",
        time: "23:30",
        status: "ЗАВЕРШЕН",
        venue: "BB&T Center, Восток-Риверсайд, Флорида",
        period: "ОТ"
    },

    homeTeam: {
        id: "florida-panthers",
        name: "Флорида",
        fullName: "Флорида Пантерз", 
        city: "Майами",
        logo: "https://a.espncdn.com/i/teamlogos/nhl/500/fla.png",
        logoAlt: "https://assets.nhle.com/logos/nhl/svg/FLA_light.svg",
        conference: "Восточная",
        division: "Атлантическая",
        colors: {
            primary: "#C8102E",
            secondary: "#B9975B",
            accent: "#041E42"
        },
        score: 3,
        currentForm: ["П", "В", "В", "В", "П"],
        stats: {
            regularSeasonRecord: "42-32-8",
            playoffRecord: "8-4",
            goalsFor: 267,
            goalsAgainst: 248,
            powerPlayPercentage: 22.6,
            penaltyKillPercentage: 79.2
        }
    },

    awayTeam: {
        id: "carolina-hurricanes", 
        name: "Каролина",
        fullName: "Каролина Харрикейнз",
        city: "Роли",
        logo: "https://a.espncdn.com/i/teamlogos/nhl/500/car.png",
        logoAlt: "https://assets.nhle.com/logos/nhl/svg/CAR_light.svg",
        conference: "Восточная",
        division: "Метрополитэн",
        colors: {
            primary: "#CC0000", 
            secondary: "#000000",
            accent: "#A2AAAD"
        },
        score: 2,
        currentForm: ["В", "В", "П", "В", "В"],
        stats: {
            regularSeasonRecord: "52-23-7",
            playoffRecord: "7-5", 
            goalsFor: 298,
            goalsAgainst: 217,
            powerPlayPercentage: 24.8,
            penaltyKillPercentage: 84.1
        }
    },

    gameStats: {
        periods: [
            { period: "1П", home: 1, away: 0 },
            { period: "2П", home: 1, away: 2 },
            { period: "3П", home: 1, away: 0 },
            { period: "ОТ", home: 0, away: 0 }
        ],
        shots: {
            home: 28,
            away: 25,
            total: 53
        },
        shotsOnGoal: {
            home: 15,
            away: 13,
            total: 28
        },
        saves: {
            homeGoalie: 26,
            awayGoalie: 25
        },
        faceoffs: {
            home: 48,
            away: 52,
            homeWins: 26,
            awayWins: 28
        },
        powerPlay: {
            home: "1/3",
            away: "2/4"
        },
        hits: {
            home: 31,
            away: 24
        },
        blockedShots: {
            home: 21,
            away: 9
        },
        takeaways: {
            home: 8,
            away: 12
        },
        giveaways: {
            home: 7,
            away: 11
        },
        penaltyMinutes: {
            home: 6,
            away: 8
        }
    },

    keyPlayers: {
        home: [
            {
                name: "Сергей Бобровский",
                position: "В", 
                number: 72,
                stats: "26 сэйвов, 92.9% отбитых"
            },
            {
                name: "Алексей Барков",
                position: "Ц",
                number: 16, 
                stats: "1 гол, 1 передача"
            },
            {
                name: "Мэттью Ткачук",
                position: "ЛК",
                number: 19,
                stats: "1 гол, 4 броска"
            }
        ],
        away: [
            {
                name: "Фредерик Андерсен",
                position: "В",
                number: 31,
                stats: "25 сэйвов, 89.3% отбитых"
            },
            {
                name: "Себастьян Ахо",
                position: "Ц", 
                number: 20,
                stats: "1 гол, 1 передача"
            },
            {
                name: "Андрей Свечников",
                position: "ПК",
                number: 37,
                stats: "1 гол, 3 броска"
            }
        ]
    },

    factoids: [
        {
            id: "quick-goal",
            icon: "⚡",
            title: "Быстрый старт",
            description: "Первый гол уже на 2:47 минуте",
            accent: "Рекорд сезона!",
            category: "timing",
            animation: "slide-left"
        },
        {
            id: "shot-accuracy", 
            icon: "🥅",
            title: "Точность бросков",
            description: "Флорида: 15 из 28 в створ",
            accent: "53.6% точности",
            category: "shooting",
            animation: "slide-up"
        },
        {
            id: "goalie-performance",
            icon: "🛡️", 
            title: "Мастер-класс вратаря",
            description: "Бобровский: 26 сэйвов",
            accent: "92.9% отбитых",
            category: "goaltending",
            animation: "slide-right"
        },
        {
            id: "possession",
            icon: "⏱️",
            title: "Владение шайбой", 
            description: "Каролина: 52% vs 48%",
            accent: "Контроль игры",
            category: "possession",
            animation: "slide-left"
        },
        {
            id: "power-play",
            icon: "⚡",
            title: "Игра в большинстве",
            description: "Каролина: 2/4, Флорида: 1/3",
            accent: "50% vs 33%",
            category: "special-teams",
            animation: "slide-up"
        },
        {
            id: "blocks",
            icon: "🛡️",
            title: "Заблокированные броски",
            description: "Флорида блокировала 21 бросок",
            accent: "Vs 9 у Каролины",
            category: "defense",
            animation: "slide-right"
        }
    ],

    head2head: {
        allTime: {
            games: 47,
            homeWins: 23,
            awayWins: 18,
            ties: 6
        },
        recentGames: [
            {
                date: "2024-04-28",
                homeTeam: "Флорида",
                awayTeam: "Каролина", 
                score: "4-3",
                result: "В"
            },
            {
                date: "2024-04-26",
                homeTeam: "Каролина",
                awayTeam: "Флорида",
                score: "2-1", 
                result: "П"
            },
            {
                date: "2024-04-24",
                homeTeam: "Каролина",
                awayTeam: "Флорида", 
                score: "6-1",
                result: "П"
            }
        ],
        playoffHistory: {
            meetings: 3,
            seriesRecord: "Каролина 2-1",
            lastMeeting: "2024",
            notes: "Первая встреча команд в плей-офф НХЛ 2024"
        }
    },

    venue: {
        name: "BB&T Center",
        city: "Восток-Риверсайд, Флорида", 
        capacity: 19250,
        surface: "лёд",
        opened: 1998,
        timezone: "EST"
    },

    broadcastInfo: {
        tv: ["ESPN", "Матч ТВ"],
        radio: ["790 The Ticket", "99.9 The Fan"],
        streaming: ["ESPN+", "НТВ+"]
    },

    betting: {
        preGameOdds: {
            homeWin: 1.85,
            draw: 4.20,
            awayWin: 3.95
        },
        popularBets: [
            "Тотал больше 5.5 голов",
            "Обе команды забьют",
            "Флорида победа в основное время",
            "Матч пойдёт в овертайм"
        ]
    },

    weather: {
        condition: "Ясно",
        temperature: "24°C",
        humidity: "65%",
        wind: "10 км/ч С-В"
    }
};

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = teamsData;
} else if (typeof window !== 'undefined') {
    window.teamsData = teamsData;
} 