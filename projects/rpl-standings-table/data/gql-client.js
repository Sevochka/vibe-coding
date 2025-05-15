/**
 * Класс для выполнения GraphQL запросов к API Sports.ru
 */
class GqlClient {
  constructor() {
    this.endpoint = 'https://www.sports.ru/gql/graphql/';
  }

  /**
   * Выполняет GraphQL запрос
   * @param {string} query - GraphQL запрос
   * @returns {Promise<Object>} - Результат запроса
   */
  async query(query) {
    try {
      // Удаляем все пробелы и переносы строк для корректной работы запроса
      const formattedQuery = query.replace(/\s+/g, '');
      const url = `${this.endpoint}?query=${encodeURIComponent(formattedQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при выполнении GraphQL запроса:', error);
      throw error;
    }
  }

  /**
   * Получает данные турнирной таблицы РПЛ
   * @returns {Promise<Object>} - Данные турнирной таблицы
   */
  async getStandings() {
    const query = `{
      statQueries {
        football {
          tournament(id: "rfpl", source: SPORTRADAR) {
            id
            currentSeason {
              id
              rankingTeamStat(input: {attribute: [TOTAL_GOALS]}) {
                items {
                  team {
                    id
                    name
                    teaser(last: 0, next: 1) {
                      current {
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
                  rank
                  value
                  stat {
                    MatchesPlayed
                    MatchesWon
                    MatchesDrawn
                    MatchesLost
                    GoalsScored
                    GoalsConceded
                    CupRank
                    GroupPosition
                    GroupName
                    YellowCards
                    RedCards
                  }
                }
              }
            }
          }
        }
      }
    }`;

    return this.query(query);
  }
}

// Создаем глобальный экземпляр клиента
const gqlClient = new GqlClient(); 