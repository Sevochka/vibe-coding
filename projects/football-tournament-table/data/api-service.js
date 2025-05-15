/**
 * Сервис для работы с GraphQL API Sports.ru
 */
const ApiService = {
    /**
     * URL для GraphQL запросов
     */
    endpoint: 'https://www.sports.ru/gql/graphql/',

    /**
     * Запрос на получение данных турнирной таблицы РПЛ
     */
    getTournamentTableQuery: `
    {
      statQueries {
        football {
          tournament(id: "rfpl", source: SPORTRADAR) {
            id,
            currentSeason {
              id,
              rankingTeamStat(input: {attribute: [TOTAL_GOALS]}) {
                team {
                  id,
                  name,
                  teaser(last: 0, next: 1) {
                    current {
                      id,
                      links {
                        sportsRu
                      },
                      currentMinute,
                      home {
                        score,
                        team {
                          name,
                          logotype(input: {resize: ORIGINAL, ext: WEBP}) {
                            url
                          }
                        }
                      },
                      away {
                        score,
                        team {
                          name,
                          logotype(input: {resize: ORIGINAL, ext: WEBP}) {
                            url
                          }
                        }
                      }
                    }
                  },
                  lastFive {
                    result,
                    match {
                      links {
                        sportsRu
                      }
                    }
                  },
                  logotype(input: {resize: ORIGINAL, ext: WEBP}) {
                    url
                  }
                },
                rank,
                value,
                stat {
                  MatchesPlayed,
                  MatchesWon,
                  MatchesDrawn,
                  MatchesLost,
                  GoalsScored,
                  GoalsConceded,
                  CupRank,
                  GroupPosition,
                  GroupName,
                  YellowCards,
                  RedCards
                }
              }
            }
          }
        }
      }
    }
    `,

    /**
     * Выполняет запрос к GraphQL API
     * @param {string} query - GraphQL запрос
     * @returns {Promise<Object>} - Ответ API
     */
    fetchFromSportsGql: async function(query) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-appname': 'vibe-coding',
                },
                body: JSON.stringify({
                    query: query
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при запросе к API:', error);
            throw error;
        }
    },

    /**
     * Получает данные турнирной таблицы
     * @returns {Promise<Object>} - Данные турнирной таблицы
     */
    getTournamentTable: async function() {
        try {
            return await this.fetchFromSportsGql(this.getTournamentTableQuery);
        } catch (error) {
            console.error('Ошибка при получении данных турнирной таблицы:', error);
            throw error;
        }
    }
}; 