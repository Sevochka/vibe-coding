const CONFIG = {
    // URL для GraphQL запросов на Sports.ru
    GQL_ENDPOINT: 'https://www.sports.ru/gql/graphql/',
    
    // GQL запрос для получения данных о турнирной таблице
    GQL_QUERY: `{
  statQueries {
    football {
      tournament(id: "rfpl", source: SPORTRADAR) {
        id,
        currentSeason {
          id,
          rankingTeamStat(input: {attribute: [TOTAL_GOALS]}) {
            items {
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
}`,
    
    // Функция для удаления пробелов из запроса
    removeWhitespace: function(str) {
        // Полностью удаляем все пробелы, табуляции и переносы строк
        return str.replace(/\s/g, '');
    },
    
    // Зоны турнирной таблицы
    TABLE_ZONES: {
        CHAMPIONS_LEAGUE: 4,    // 4 команды в Лигу Чемпионов
        EUROPA_LEAGUE: 6,       // С 5 по 6 место - в Лигу Европы
        RELEGATION: 13,         // С 14 по 16 место - зона вылета
    },
    
    // Преобразовать результат матча в удобный для отображения формат
    resultToChar: function(result) {
        if (result === 'WIN') return 'В';
        if (result === 'DRAW') return 'Н';
        if (result === 'LOSE') return 'П';
        return '';
    },
    
    // Преобразовать результат матча в класс CSS
    resultToClass: function(result) {
        if (result === 'WIN') return 'match-result-W';
        if (result === 'DRAW') return 'match-result-D';
        if (result === 'LOSE') return 'match-result-L';
        return '';
    }
}; 