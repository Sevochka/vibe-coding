// GraphQL запрос для получения информации о матче
const MATCH_QUERY = `{statQueries{football{match(id:"cska-vs-zenit",source:SPORTS_HUB){id matchStatus scheduledAt currentTime dateOnly attendance home{team{id name country{name code}picture(productType:SPORTSRU,format:LOGO){webp(width:"128",height:"128")}}score penaltyScore formation{code}lineup{player{id name firstName lastName}jerseyNumber position lineupOrder lineupStarting}stat{ballPossession shotsOnTarget shotsOffTarget yellowCards redCards cornerKicks freeKicks offsides fouls}}away{team{id name country{name code}picture(productType:SPORTSRU,format:LOGO){webp(width:"128",height:"128")}}score penaltyScore formation{code}lineup{player{id name firstName lastName}jerseyNumber position lineupOrder lineupStarting}stat{ballPossession shotsOnTarget shotsOffTarget yellowCards redCards cornerKicks freeKicks offsides fouls}}events(eventType:[SCORE_CHANGE,YELLOW_CARD,RED_CARD,YELLOW_RED_CARD,PENALTY_MISSED,PENALTY_SAVED,SUBSTITUTION]){id time type team outcome periodId value{...on statScoreChange{homeScore awayScore goalScorer{name}assist{name}team}...on statYellowCard{player{name}team}...on statRedCard{player{name}team}...on statYellowRedCard{player{name}team}...on statPenaltyMissed{player{name}team}...on statPenaltySaved{player{name}team}...on statSubstitution{playerIn{name}playerOut{name}team}}}season{tournament{id name picture(productType:SPORTSRU,format:LOGO){webp(width:"64",height:"64")}}}}}}}`;

// Если API недоступен или произошла ошибка, используем моковые данные
const MOCK_MATCH_DATA = {
  statQueries: {
    football: {
      match: {
        id: "CSKA-ZENIT",
        matchStatus: "ENDED",
        scheduledAt: "2024-05-14 19:30:00",
        currentTime: "",
        dateOnly: false,
        attendance: 35218,
        home: {
          team: {
            id: "CSKA",
            name: "ЦСКА",
            country: {
              name: "Россия",
              code: "RUS"
            },
            picture: {
              webp: "https://img.sports.ru/images/team_logos/1/cska_russia.png"
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
            },
            {
              player: {
                id: "3",
                name: "Бактиёр Зайнутдинов",
                firstName: "Бактиёр",
                lastName: "Зайнутдинов"
              },
              jerseyNumber: "19",
              position: "MIDFIELDER",
              lineupOrder: 3,
              lineupStarting: true
            },
            {
              player: {
                id: "4",
                name: "Игорь Дивеев",
                firstName: "Игорь",
                lastName: "Дивеев"
              },
              jerseyNumber: "78",
              position: "CENTRAL_DEFENDER",
              lineupOrder: 4,
              lineupStarting: true
            },
            {
              player: {
                id: "5",
                name: "Кирилл Набабкин",
                firstName: "Кирилл",
                lastName: "Набабкин"
              },
              jerseyNumber: "14",
              position: "CENTRAL_DEFENDER",
              lineupOrder: 5,
              lineupStarting: true
            },
            {
              player: {
                id: "6",
                name: "Иван Обляков",
                firstName: "Иван",
                lastName: "Обляков"
              },
              jerseyNumber: "10",
              position: "CENTRAL_MIDFIELDER",
              lineupOrder: 6,
              lineupStarting: true
            },
            {
              player: {
                id: "7",
                name: "Федор Чалов",
                firstName: "Федор",
                lastName: "Чалов"
              },
              jerseyNumber: "9",
              position: "STRIKER",
              lineupOrder: 7,
              lineupStarting: true
            },
            {
              player: {
                id: "8",
                name: "Максим Мухин",
                firstName: "Максим",
                lastName: "Мухин"
              },
              jerseyNumber: "20",
              position: "CENTRAL_MIDFIELDER",
              lineupOrder: 8,
              lineupStarting: true
            },
            {
              player: {
                id: "9",
                name: "Хесус Медина",
                firstName: "Хесус",
                lastName: "Медина"
              },
              jerseyNumber: "82",
              position: "LEFT_WINGER",
              lineupOrder: 9,
              lineupStarting: true
            }
          ],
          stat: {
            ballPossession: 48,
            shotsOnTarget: 2,
            shotsOffTarget: 3,
            yellowCards: 2,
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
              webp: "https://img.sports.ru/images/team_logos/1/zenit_russia.png"
            }
          },
          score: 2,
          penaltyScore: 0,
          formation: {
            code: "4-4-2"
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
            },
            {
              player: {
                id: "103",
                name: "Вильмар Барриос",
                firstName: "Вильмар",
                lastName: "Барриос"
              },
              jerseyNumber: "5",
              position: "CENTRAL_MIDFIELDER",
              lineupOrder: 3,
              lineupStarting: true
            },
            {
              player: {
                id: "104",
                name: "Деян Ловрен",
                firstName: "Деян",
                lastName: "Ловрен"
              },
              jerseyNumber: "6",
              position: "CENTRAL_DEFENDER",
              lineupOrder: 4,
              lineupStarting: true
            },
            {
              player: {
                id: "105",
                name: "Малком",
                firstName: "Малком",
                lastName: ""
              },
              jerseyNumber: "7",
              position: "RIGHT_WINGER",
              lineupOrder: 5,
              lineupStarting: true
            },
            {
              player: {
                id: "106",
                name: "Матео Кассьерра",
                firstName: "Матео",
                lastName: "Кассьерра"
              },
              jerseyNumber: "30",
              position: "STRIKER",
              lineupOrder: 6,
              lineupStarting: true
            },
            {
              player: {
                id: "107",
                name: "Андрей Мостовой",
                firstName: "Андрей",
                lastName: "Мостовой"
              },
              jerseyNumber: "17",
              position: "LEFT_WINGER",
              lineupOrder: 7,
              lineupStarting: true
            },
            {
              player: {
                id: "108",
                name: "Сердар Азмун",
                firstName: "Сердар",
                lastName: "Азмун"
              },
              jerseyNumber: "9",
              position: "STRIKER",
              lineupOrder: 8,
              lineupStarting: true
            }
          ],
          stat: {
            ballPossession: 52,
            shotsOnTarget: 4,
            shotsOffTarget: 2,
            yellowCards: 1,
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
          },
          {
            id: "e3",
            time: "53:27",
            type: "SCORE_CHANGE",
            team: "AWAY",
            outcome: null,
            periodId: "SECOND_HALF",
            value: {
              homeScore: 0,
              awayScore: 1,
              goalScorer: {
                name: "Малком"
              },
              assist: {
                name: "Сердар Азмун"
              },
              team: "AWAY"
            }
          },
          {
            id: "e4",
            time: "67:10",
            type: "YELLOW_CARD",
            team: "HOME",
            outcome: null,
            periodId: "SECOND_HALF",
            value: {
              player: {
                name: "Игорь Дивеев"
              },
              team: "HOME"
            }
          },
          {
            id: "e5",
            time: "72:40",
            type: "SUBSTITUTION",
            team: "HOME",
            outcome: null,
            periodId: "SECOND_HALF",
            value: {
              playerIn: {
                name: "Виктор Гонсалес"
              },
              playerOut: {
                name: "Иван Обляков"
              },
              team: "HOME"
            }
          },
          {
            id: "e6",
            time: "78:12",
            type: "SCORE_CHANGE",
            team: "AWAY",
            outcome: null,
            periodId: "SECOND_HALF",
            value: {
              homeScore: 0,
              awayScore: 2,
              goalScorer: {
                name: "Сердар Азмун"
              },
              assist: {
                name: "Андрей Мостовой"
              },
              team: "AWAY"
            }
          },
          {
            id: "e7",
            time: "82:30",
            type: "SUBSTITUTION",
            team: "AWAY",
            outcome: null,
            periodId: "SECOND_HALF",
            value: {
              playerIn: {
                name: "Артем Дзюба"
              },
              playerOut: {
                name: "Сердар Азмун"
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
              webp: "https://img.sports.ru/images/tournament_logos/1/rus-cup.png"
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
    // На этом этапе мы просто возвращаем моковые данные,
    // так как API имеет сложности с CORS и ограничениями доступа
    console.log('Использование моковых данных для отображения матча');
    setTimeout(() => {
      resolve(MOCK_MATCH_DATA);
    }, 500);
  });
} 