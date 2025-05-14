// Резервные данные о матче, на случай если запрос GQL не выполнится успешно
const matchData = {
    id: "cska-vs-zenit",
    scheduledAt: "2025-05-14T19:30:00+03:00",
    currentTime: "90+5",
    season: {
        tournament: {
            name: "Кубок России",
            logo: "https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png"
        }
    },
    matchStatus: "LIVE",
    roundName: "Финал Пути РПЛ",
    home: {
        team: {
            name: "ЦСКА",
            logo: "https://img.sports.ru/480/7c6/football/team/logo/24.png"
        },
        score: 1,
        stat: {
            ballPossession: 56,
            shotsTotal: 12,
            shotsOnTarget: 5,
            cornerKicks: 7,
            fouls: 14,
            yellowCards: 2,
            redCards: 0
        }
    },
    away: {
        team: {
            name: "Зенит",
            logo: "https://img.sports.ru/480/7c6/football/team/logo/4.png"
        },
        score: 0,
        stat: {
            ballPossession: 44,
            shotsTotal: 9,
            shotsOnTarget: 3,
            cornerKicks: 4,
            fouls: 16,
            yellowCards: 3,
            redCards: 1
        }
    }
}; 