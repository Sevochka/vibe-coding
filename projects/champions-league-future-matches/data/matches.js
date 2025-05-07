// Данные о предстоящих матчах будут загружены через GraphQL
const seasonId = 'champions_league_24-25';

// Запрос GraphQL для получения данных о сезоне и матчах
const getMatchesQuery = `
query getUpcomingMatches {
  footballType {
    season(id: ["${seasonId}"]) {
      id
      name
      logo
      tournament {
        id
        name
        logo
      }
      upcomingMatches: matches(status: UPCOMING, limit: 10) {
        id
        startTime
        homeTeam {
          id
          name
          logo
          country {
            name
            flag
          }
        }
        awayTeam {
          id
          name
          logo
          country {
            name
            flag
          }
        }
        venue {
          id
          name
          city
        }
      }
    }
  }
}
`;

// Временные данные для отображения до загрузки с сервера
const tempMatches = [
  {
    id: "123456",
    startTime: new Date(Date.now() + 86400000 * 2).toISOString(), // через 2 дня
    homeTeam: {
      id: "1",
      name: "Реал Мадрид",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_1.png",
      country: {
        name: "Испания",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_spain.png"
      }
    },
    awayTeam: {
      id: "2",
      name: "Бавария",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_2.png",
      country: {
        name: "Германия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_germany.png"
      }
    },
    venue: {
      id: "1001",
      name: "Сантьяго Бернабеу",
      city: "Мадрид"
    }
  },
  {
    id: "123457",
    startTime: new Date(Date.now() + 86400000 * 3).toISOString(), // через 3 дня
    homeTeam: {
      id: "3",
      name: "Манчестер Сити",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_3.png",
      country: {
        name: "Англия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_england.png"
      }
    },
    awayTeam: {
      id: "4",
      name: "ПСЖ",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_4.png",
      country: {
        name: "Франция",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_france.png"
      }
    },
    venue: {
      id: "1002",
      name: "Этихад",
      city: "Манчестер"
    }
  },
  {
    id: "123458",
    startTime: new Date(Date.now() + 86400000 * 4).toISOString(), // через 4 дня
    homeTeam: {
      id: "5",
      name: "Барселона",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_5.png",
      country: {
        name: "Испания",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_spain.png"
      }
    },
    awayTeam: {
      id: "6",
      name: "Интер",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_6.png",
      country: {
        name: "Италия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_italy.png"
      }
    },
    venue: {
      id: "1003",
      name: "Камп Ноу",
      city: "Барселона"
    }
  },
  {
    id: "123459",
    startTime: new Date(Date.now() + 86400000 * 5).toISOString(), // через 5 дней
    homeTeam: {
      id: "7",
      name: "Ливерпуль",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_7.png",
      country: {
        name: "Англия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_england.png"
      }
    },
    awayTeam: {
      id: "8",
      name: "Порту",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_8.png",
      country: {
        name: "Португалия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_portugal.png"
      }
    },
    venue: {
      id: "1004",
      name: "Энфилд",
      city: "Ливерпуль"
    }
  },
  {
    id: "123460",
    startTime: new Date(Date.now() + 86400000 * 6).toISOString(), // через 6 дней
    homeTeam: {
      id: "9",
      name: "Боруссия Д",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_9.png",
      country: {
        name: "Германия",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_germany.png"
      }
    },
    awayTeam: {
      id: "10",
      name: "Атлетико Мадрид",
      logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_10.png",
      country: {
        name: "Испания",
        flag: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_spain.png"
      }
    },
    venue: {
      id: "1005",
      name: "Сигнал Идуна Парк",
      city: "Дортмунд"
    }
  }
];

// Данные о сезоне и турнире
const tempSeasonData = {
  id: seasonId,
  name: "Лига чемпионов 2024-25",
  logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_cl.png",
  tournament: {
    id: "champions_league",
    name: "Лига чемпионов",
    logo: "https://dumpster.cdn.sports.ru/uploading/dumpster/icon/icon_cl.png"
  }
}; 