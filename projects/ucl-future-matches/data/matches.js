// Функции для работы с данными о матчах
const MatchesAPI = {
    // Получение предстоящих матчей через GraphQL API
    async getFutureMatches() {
        try {
            const query = `
                {
                    statQueries {
                        football {
                            stat_season(id: ["${CONFIG.seasonId}"]) {
                                id
                                name
                                tournament {
                                    name
                                    logotype {
                                        url
                                    }
                                }
                                pageListMatches(
                                    status: NOT_STARTED
                                    sort: ASC_SCHEDULED_AT
                                    limit: ${CONFIG.matchesLimit}
                                ) {
                                    list {
                                        id
                                        scheduledAt
                                        home {
                                            team {
                                                name
                                                logotype {
                                                    url
                                                }
                                            }
                                        }
                                        away {
                                            team {
                                                name
                                                logotype {
                                                    url
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const response = await fetch(`${CONFIG.apiUrl}?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.errors) {
                console.error('GraphQL ошибки:', data.errors);
                return [];
            }

            const season = data.data?.statQueries?.football?.stat_season?.[0];
            if (!season || !season.pageListMatches || !season.pageListMatches.list) {
                console.error('Данные не найдены');
                return [];
            }

            return season.pageListMatches.list.map(match => {
                return {
                    id: match.id,
                    scheduledAt: match.scheduledAt,
                    homeTeam: {
                        name: match.home.team.name,
                        logoUrl: match.home.team.logotype?.url || './assets/team-placeholder.png'
                    },
                    awayTeam: {
                        name: match.away.team.name,
                        logoUrl: match.away.team.logotype?.url || './assets/team-placeholder.png'
                    },
                    tournament: {
                        name: season.tournament.name || CONFIG.tournament.name,
                        logoUrl: season.tournament.logotype?.url || CONFIG.tournament.logo
                    }
                };
            });
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    },

    // Форматирование даты матча
    formatMatchDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', CONFIG.dateFormat.options);
    },

    // Форматирование времени матча
    formatMatchTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('ru-RU', CONFIG.timeFormat.options);
    }
}; 