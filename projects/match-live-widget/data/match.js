// GraphQL запрос для получения информации о матче
const MATCH_QUERY = `
{
  statQueries {
    football {
      match(id: "cska-vs-zenit", source: SPORTS_HUB) {
        id
        matchStatus
        scheduledAt
        currentTime
        dateOnly
        attendance
        home {
          team {
            id
            name
            country {
              name
              code
            }
            picture(productType: SPORTSRU, format: LOGO) {
              webp(width: "128", height: "128")
            }
          }
          score
          penaltyScore
          formation {
            code
          }
          lineup {
            player {
              id
              name
              firstName
              lastName
            }
            jerseyNumber
            position
            lineupOrder
            lineupStarting
          }
          stat {
            ballPossession
            shotsOnTarget
            shotsOffTarget
            yellowCards
            redCards
            cornerKicks
            freeKicks
            offsides
            fouls
          }
        }
        away {
          team {
            id
            name
            country {
              name
              code
            }
            picture(productType: SPORTSRU, format: LOGO) {
              webp(width: "128", height: "128")
            }
          }
          score
          penaltyScore
          formation {
            code
          }
          lineup {
            player {
              id
              name
              firstName
              lastName
            }
            jerseyNumber
            position
            lineupOrder
            lineupStarting
          }
          stat {
            ballPossession
            shotsOnTarget
            shotsOffTarget
            yellowCards
            redCards
            cornerKicks
            freeKicks
            offsides
            fouls
          }
        }
        events(eventType: [SCORE_CHANGE, YELLOW_CARD, RED_CARD, YELLOW_RED_CARD, PENALTY_MISSED, PENALTY_SAVED, SUBSTITUTION]) {
          id
          time
          type
          team
          outcome
          periodId
          value {
            ... on statScoreChange {
              homeScore
              awayScore
              goalScorer {
                name
              }
              assist {
                name
              }
              team
            }
            ... on statYellowCard {
              player {
                name
              }
              team
            }
            ... on statRedCard {
              player {
                name
              }
              team
            }
            ... on statYellowRedCard {
              player {
                name
              }
              team
            }
            ... on statPenaltyMissed {
              player {
                name
              }
              team
            }
            ... on statPenaltySaved {
              player {
                name
              }
              team
            }
            ... on statSubstitution {
              playerIn {
                name
              }
              playerOut {
                name
              }
              team
            }
          }
        }
        season {
          tournament {
            id
            name
            picture(productType: SPORTSRU, format: LOGO) {
              webp(width: "64", height: "64")
            }
          }
        }
      }
    }
  }
}
`;

// Если API недоступен или произошла ошибка, используем моковые данные
const MOCK_MATCH_DATA = {
  statQueries: {
    football: {
      match: {
        id: "CSKA-ZENIT",
        matchStatus: "NOT_STARTED",
        scheduledAt: "2025-05-14 19:30:00",
        currentTime: "",
        dateOnly: false,
        attendance: 0,
        home: {
          team: {
            id: "CSKA",
            name: "ЦСКА",
            country: {
              name: "Россия",
              code: "RUS"
            },
            picture: {
              webp: "https://cdn.sports.ru/new-images/teams/1/CSKA.webp"
            }
          },
          score: 0,
          penaltyScore: 0,
          formation: {
            code: "4-2-3-1"
          },
          lineup: [
            {
              player: {
                id: "1",
                name: "Игорь Акинфеев",
                firstName: "Игорь",
                lastName: "Акинфеев"
              },
              jerseyNumber: "35",
              position: "GOALKEEPER",
              lineupOrder: 1,
              lineupStarting: true
            },
            {
              player: {
                id: "2",
                name: "Марио Фернандес",
                firstName: "Марио",
                lastName: "Фернандес"
              },
              jerseyNumber: "2",
              position: "RIGHT_BACK",
              lineupOrder: 2,
              lineupStarting: true
            }
          ],
          stat: {
            ballPossession: 48,
            shotsOnTarget: 2,
            shotsOffTarget: 3,
            yellowCards: 1,
            redCards: 0,
            cornerKicks: 4,
            freeKicks: 7,
            offsides: 2,
            fouls: 9
          }
        },
        away: {
          team: {
            id: "ZENIT",
            name: "Зенит",
            country: {
              name: "Россия",
              code: "RUS"
            },
            picture: {
              webp: "https://cdn.sports.ru/new-images/teams/1/ZENIT.webp"
            }
          },
          score: 0,
          penaltyScore: 0,
          formation: {
            code: "4-3-3"
          },
          lineup: [
            {
              player: {
                id: "101",
                name: "Михаил Кержаков",
                firstName: "Михаил",
                lastName: "Кержаков"
              },
              jerseyNumber: "41",
              position: "GOALKEEPER",
              lineupOrder: 1,
              lineupStarting: true
            },
            {
              player: {
                id: "102",
                name: "Дуглас Сантос",
                firstName: "Дуглас",
                lastName: "Сантос"
              },
              jerseyNumber: "3",
              position: "LEFT_BACK",
              lineupOrder: 2,
              lineupStarting: true
            }
          ],
          stat: {
            ballPossession: 52,
            shotsOnTarget: 3,
            shotsOffTarget: 4,
            yellowCards: 2,
            redCards: 0,
            cornerKicks: 3,
            freeKicks: 6,
            offsides: 3,
            fouls: 8
          }
        },
        events: [
          {
            id: "e1",
            time: "32:15",
            type: "YELLOW_CARD",
            team: "HOME",
            outcome: null,
            periodId: "FIRST_HALF",
            value: {
              player: {
                name: "Федор Чалов"
              },
              team: "HOME"
            }
          },
          {
            id: "e2",
            time: "45:00",
            type: "YELLOW_CARD",
            team: "AWAY",
            outcome: null,
            periodId: "FIRST_HALF",
            value: {
              player: {
                name: "Вилмар Барриос"
              },
              team: "AWAY"
            }
          }
        ],
        season: {
          tournament: {
            id: "FONBET-KUBOK",
            name: "ФОНБЕТ Кубок России",
            picture: {
              webp: "https://cdn.sports.ru/new-images/tournaments/1/RUS_CUP.webp"
            }
          }
        }
      }
    }
  }
};

// Функция получения данных о матче
function fetchMatchData() {
  return new Promise((resolve, reject) => {
    // Формируем URL для запроса
    const apiUrl = `https://www.sports.ru/gql/graphql/?query=${encodeURIComponent(MATCH_QUERY)}`;

    // Отправляем запрос
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.warn('Failed to fetch match data:', error);
        // При ошибке возвращаем моковые данные
        resolve(MOCK_MATCH_DATA);
      });
  });
} 