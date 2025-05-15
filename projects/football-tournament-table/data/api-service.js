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
          tournament(id: "rfpl") {
            id
            currentSeason {
              pageListMatches(status: LIVE, sort: ASC_SCHEDULED_AT, limit: 10) {
                list {
                  id
                  links {
                    sportsRu
                  }
                  currentMinute
                  home {
                    score
                    team {
                      name
                      logotype(input: {resize: ORIGINAL, ext: WEBP}) {
                        url
                      }
                    }
                  }
                  away {
                    score
                    team {
                      name
                      logotype(input: {resize: ORIGINAL, ext: WEBP}) {
                        url
                      }
                    }
                  }
                }
              }
              stages {
                teamStanding {
                  total {
                    ...line
                  }
                  live {
                    ...line
                  }
                }
              }
            }
          }
        }
      }
    }
    
    fragment line on statTeamStandingLine {
      team {
        id
        name
        lastFive {
          result
          match {
            links {
              sportsRu
            }
          }
        }
        logotype(input: {resize: ORIGINAL, ext: WEBP}) {
          url
        }
      }
      played
      points
      rank
      rankChange
      goalDiff
      win
      draw
      loss
      goalsFor
      goalDiff
      goalsAgainst
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