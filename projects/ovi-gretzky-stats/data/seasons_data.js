// Данные по сезонам для Овечкина и Грецки
const seasonsData = {
  // Данные Овечкина по сезонам
  ovechkin: [
    { season: "2005-06", games: 81, goals: 52, assists: 54, points: 106, plusMinus: 2 },
    { season: "2006-07", games: 82, goals: 46, assists: 46, points: 92, plusMinus: -19 },
    { season: "2007-08", games: 82, goals: 65, assists: 47, points: 112, plusMinus: 28 },
    { season: "2008-09", games: 79, goals: 56, assists: 54, points: 110, plusMinus: 8 },
    { season: "2009-10", games: 72, goals: 50, assists: 59, points: 109, plusMinus: 45 },
    { season: "2010-11", games: 79, goals: 32, assists: 53, points: 85, plusMinus: 24 },
    { season: "2011-12", games: 78, goals: 38, assists: 27, points: 65, plusMinus: -8 },
    { season: "2012-13", games: 48, goals: 32, assists: 24, points: 56, plusMinus: 2 },
    { season: "2013-14", games: 78, goals: 51, assists: 28, points: 79, plusMinus: -35 },
    { season: "2014-15", games: 81, goals: 53, assists: 28, points: 81, plusMinus: 10 },
    { season: "2015-16", games: 79, goals: 50, assists: 21, points: 71, plusMinus: 21 },
    { season: "2016-17", games: 82, goals: 33, assists: 36, points: 69, plusMinus: 6 },
    { season: "2017-18", games: 82, goals: 49, assists: 38, points: 87, plusMinus: 3 },
    { season: "2018-19", games: 81, goals: 51, assists: 38, points: 89, plusMinus: 7 },
    { season: "2019-20", games: 68, goals: 48, assists: 19, points: 67, plusMinus: -12 },
    { season: "2020-21", games: 45, goals: 24, assists: 18, points: 42, plusMinus: 5 },
    { season: "2021-22", games: 77, goals: 50, assists: 40, points: 90, plusMinus: 8 },
    { season: "2022-23", games: 73, goals: 42, assists: 33, points: 75, plusMinus: 7 },
    { season: "2023-24", games: 79, goals: 31, assists: 34, points: 65, plusMinus: -9 }
  ],
  
  // Данные Грецки по сезонам (первые 19 сезонов для соответствия с Овечкиным)
  gretzky: [
    { season: "1979-80", games: 79, goals: 51, assists: 86, points: 137, plusMinus: 1 },
    { season: "1980-81", games: 80, goals: 55, assists: 109, points: 164, plusMinus: 41 },
    { season: "1981-82", games: 80, goals: 92, assists: 120, points: 212, plusMinus: 81 },
    { season: "1982-83", games: 80, goals: 71, assists: 125, points: 196, plusMinus: 61 },
    { season: "1983-84", games: 74, goals: 87, assists: 118, points: 205, plusMinus: 76 },
    { season: "1984-85", games: 80, goals: 73, assists: 135, points: 208, plusMinus: 98 },
    { season: "1985-86", games: 80, goals: 52, assists: 163, points: 215, plusMinus: 71 },
    { season: "1986-87", games: 79, goals: 62, assists: 121, points: 183, plusMinus: 70 },
    { season: "1987-88", games: 64, goals: 40, assists: 109, points: 149, plusMinus: 39 },
    { season: "1988-89", games: 78, goals: 54, assists: 114, points: 168, plusMinus: 15 },
    { season: "1989-90", games: 73, goals: 40, assists: 102, points: 142, plusMinus: 8 },
    { season: "1990-91", games: 78, goals: 41, assists: 122, points: 163, plusMinus: 25 },
    { season: "1991-92", games: 74, goals: 31, assists: 90, points: 121, plusMinus: 7 },
    { season: "1992-93", games: 45, goals: 16, assists: 49, points: 65, plusMinus: -25 },
    { season: "1993-94", games: 81, goals: 38, assists: 92, points: 130, plusMinus: 4 },
    { season: "1994-95", games: 48, goals: 11, assists: 37, points: 48, plusMinus: 10 },
    { season: "1995-96", games: 80, goals: 23, assists: 79, points: 102, plusMinus: -11 },
    { season: "1996-97", games: 82, goals: 25, assists: 72, points: 97, plusMinus: 21 },
    { season: "1997-98", games: 70, goals: 9, assists: 53, points: 62, plusMinus: -11 }
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
  let cumulativePoints = 0;
  
  for (const season of seasonsData[player]) {
    cumulativeGoals += season.goals;
    cumulativeGames += season.games;
    cumulativePoints += season.points;
    
    cumulativeData[player].push({
      season: season.season,
      games: cumulativeGames,
      goals: cumulativeGoals,
      points: cumulativePoints,
      goalsPerGame: (cumulativeGoals / cumulativeGames).toFixed(3),
      pointsPerGame: (cumulativePoints / cumulativeGames).toFixed(3)
    });
  }
}

// Данные для сравнительных профилей игроков
const comparisonData = {
  categories: [
    "Голы",
    "Передачи",
    "Очки",
    "Игры",
    "Победные голы",
    "Голы в большинстве",
    "Голы в меньшинстве",
    "Голы в пустые ворота"
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
    goalsPerGame: 0.602,
    pointsPerGame: 1.089
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
    goalsPerGame: 0.601,
    pointsPerGame: 1.921
  }
}; 