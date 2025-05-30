// Данные по сезонам для Овечкина и Грецки
const seasonsData = {
  // Данные взяты из CSV-файла
  ovechkin: [
    { season: "2005-06", games: 81, goals: 52, assists: 54, points: 106 },
    { season: "2006-07", games: 82, goals: 46, assists: 46, points: 92 },
    { season: "2007-08", games: 82, goals: 65, assists: 47, points: 112 },
    { season: "2008-09", games: 79, goals: 56, assists: 54, points: 110 },
    { season: "2009-10", games: 72, goals: 50, assists: 59, points: 109 },
    { season: "2010-11", games: 79, goals: 32, assists: 53, points: 85 },
    { season: "2011-12", games: 78, goals: 38, assists: 27, points: 65 },
    { season: "2012-13", games: 48, goals: 32, assists: 24, points: 56 },
    { season: "2013-14", games: 78, goals: 51, assists: 28, points: 79 },
    { season: "2014-15", games: 81, goals: 53, assists: 28, points: 81 },
    { season: "2015-16", games: 79, goals: 50, assists: 21, points: 71 },
    { season: "2016-17", games: 82, goals: 33, assists: 36, points: 69 },
    { season: "2017-18", games: 82, goals: 49, assists: 38, points: 87 },
    { season: "2018-19", games: 81, goals: 51, assists: 38, points: 89 },
    { season: "2019-20", games: 68, goals: 48, assists: 19, points: 67 },
    { season: "2020-21", games: 45, goals: 24, assists: 18, points: 42 },
    { season: "2021-22", games: 77, goals: 50, assists: 40, points: 90 },
    { season: "2022-23", games: 73, goals: 42, assists: 33, points: 75 },
    { season: "2023-24", games: 79, goals: 31, assists: 34, points: 65 }
  ],
  
  // Данные Грецки по сезонам
  gretzky: [
    { season: "1979-80", games: 79, goals: 51, assists: 86, points: 137 },
    { season: "1980-81", games: 80, goals: 55, assists: 109, points: 164 },
    { season: "1981-82", games: 80, goals: 92, assists: 120, points: 212 },
    { season: "1982-83", games: 80, goals: 71, assists: 125, points: 196 },
    { season: "1983-84", games: 74, goals: 87, assists: 118, points: 205 },
    { season: "1984-85", games: 80, goals: 73, assists: 135, points: 208 },
    { season: "1985-86", games: 80, goals: 52, assists: 163, points: 215 },
    { season: "1986-87", games: 79, goals: 62, assists: 121, points: 183 },
    { season: "1987-88", games: 64, goals: 40, assists: 109, points: 149 },
    { season: "1988-89", games: 78, goals: 54, assists: 114, points: 168 },
    { season: "1989-90", games: 73, goals: 40, assists: 102, points: 142 },
    { season: "1990-91", games: 78, goals: 41, assists: 122, points: 163 },
    { season: "1991-92", games: 74, goals: 31, assists: 90, points: 121 },
    { season: "1992-93", games: 45, goals: 16, assists: 49, points: 65 },
    { season: "1993-94", games: 81, goals: 38, assists: 92, points: 130 },
    { season: "1994-95", games: 48, goals: 11, assists: 37, points: 48 },
    { season: "1995-96", games: 80, goals: 23, assists: 79, points: 102 },
    { season: "1996-97", games: 82, goals: 25, assists: 72, points: 97 },
    { season: "1997-98", games: 70, goals: 9, assists: 53, points: 62 }
  ]
};

// Кумулятивные данные по сезонам (накопительные)
const cumulativeData = {
  ovechkin: [],
  gretzky: []
};

// Рассчитываем кумулятивные данные для обоих игроков
for (const player of ['ovechkin', 'gretzky']) {
  let cumulativeGoals = 0;
  let cumulativeGames = 0;
  
  for (const season of seasonsData[player]) {
    cumulativeGoals += season.goals;
    cumulativeGames += season.games;
    
    cumulativeData[player].push({
      season: season.season,
      games: cumulativeGames,
      goals: cumulativeGoals,
      goalsPerGame: (cumulativeGoals / cumulativeGames).toFixed(3)
    });
  }
}

// Данные для сравнительных профилей игроков
const comparisonData = {
  categories: [
    "Голы",
    "Победные голы",
    "Голы в большинстве",
    "Голы в меньшинстве",
    "Голы в пустые ворота",
    "Сезоны с 30+ голами",
    "Сезоны с 40+ голами",
    "Сезоны с 50+ голами"
  ],
  ovechkin: {
    totalGoals: 894,
    totalAssists: 724,
    totalPoints: 1618,
    totalGames: 1486,
    winningGoals: 136,
    powerPlayGoals: 323,
    shortHandedGoals: 5,
    emptyNetGoals: 65,
    seasons30PlusGoals: 19,
    seasons40PlusGoals: 14,
    seasons50PlusGoals: 9,
    goalsPerGame: 0.602
  },
  gretzky: {
    totalGoals: 894,
    totalAssists: 1963,
    totalPoints: 2857,
    totalGames: 1487,
    winningGoals: 91,
    powerPlayGoals: 204,
    shortHandedGoals: 73,
    emptyNetGoals: 56,
    seasons30PlusGoals: 14,
    seasons40PlusGoals: 12,
    seasons50PlusGoals: 9,
    goalsPerGame: 0.601
  }
}; 