const matchData = {
    match: {
        id: 'como-inter-serie-a-2024',
        homeTeam: {
            id: 'como',
            name: 'Комо',
            shortName: 'КОМ',
            logo: './data/como-logo.png'
        },
        awayTeam: {
            id: 'inter',
            name: 'Интер',
            shortName: 'ИНТ',
            logo: './data/inter-logo.png'
        },
        competition: {
            name: 'Серия А',
            country: 'Италия',
            season: '2024/25'
        },
        venue: {
            name: 'Синигалья',
            city: 'Комо',
            capacity: 13602
        },
        datetime: {
            date: '2024-12-23',
            time: '22:45',
            timezone: 'Europe/Moscow',
            displayDate: 'Понедельник, 23 декабря',
            displayTime: '22:45'
        },
        odds: {
            homeWin: 5.20,
            draw: 4.10,
            awayWin: 1.58,
            bookmaker: 'Fonbet'
        },
        prediction: {
            result: 'Победа Интера',
            confidence: 75,
            scorePrediction: '1-2'
        },
        status: 'scheduled',
        broadcast: {
            available: true,
            platforms: ['Okko Спорт', 'Матч ТВ'],
            link: 'https://www.sports.ru/match/como-inter'
        }
    },
    recentForm: {
        como: {
            lastGames: ['L', 'D', 'L', 'W', 'L'],
            goalsScored: 8,
            goalsConceded: 12,
            position: 16
        },
        inter: {
            lastGames: ['W', 'W', 'D', 'W', 'W'],
            goalsScored: 23,
            goalsConceded: 8,
            position: 2
        }
    },
    headToHead: {
        totalMatches: 4,
        comoWins: 0,
        draws: 1,
        interWins: 3,
        lastMeeting: {
            date: '2024-05-28',
            result: '1-2',
            winner: 'inter'
        }
    }
};

// Analytics data
const analyticsData = {
    popularBets: [
        { type: 'Тотал больше 2.5', odds: 1.85, popularity: 68 },
        { type: 'Обе забьют', odds: 1.72, popularity: 45 },
        { type: 'Интер победит', odds: 1.58, popularity: 82 }
    ],
    keyStats: {
        como: {
            avgGoalsPerGame: 1.2,
            avgGoalsConceded: 1.8,
            homeForm: 'Weak'
        },
        inter: {
            avgGoalsPerGame: 2.1,
            avgGoalsConceded: 0.7,
            awayForm: 'Strong'
        }
    }
}; 