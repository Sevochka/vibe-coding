// Данные по сезонам для Овечкина и Грецки
const seasonsData = {
  ovechkin: [
    { season: 1, goals: 52 },
    { season: 2, goals: 46 },
    { season: 3, goals: 65 },
    { season: 4, goals: 56 },
    { season: 5, goals: 50 },
    { season: 6, goals: 32 },
    { season: 7, goals: 38 },
    { season: 8, goals: 51 },
    { season: 9, goals: 53 },
    { season: 10, goals: 53 },
    { season: 11, goals: 50 },
    { season: 12, goals: 33 },
    { season: 13, goals: 49 },
    { season: 14, goals: 51 },
    { season: 15, goals: 48 },
    { season: 16, goals: 24 },
    { season: 17, goals: 24 },
    { season: 18, goals: 42 },
    { season: 19, goals: 40 }
  ],
  gretzky: [
    { season: 1, goals: 51 },
    { season: 2, goals: 55 },
    { season: 3, goals: 92 },
    { season: 4, goals: 71 },
    { season: 5, goals: 87 },
    { season: 6, goals: 73 },
    { season: 7, goals: 52 },
    { season: 8, goals: 62 },
    { season: 9, goals: 40 },
    { season: 10, goals: 54 },
    { season: 11, goals: 41 },
    { season: 12, goals: 31 },
    { season: 13, goals: 16 },
    { season: 14, goals: 25 },
    { season: 15, goals: 23 },
    { season: 16, goals: 38 },
    { season: 17, goals: 25 },
    { season: 18, goals: 23 },
    { season: 19, goals: 9 }
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
    cumulativeGames += 1;
    
    cumulativeData[player].push({
      season: cumulativeGames,
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