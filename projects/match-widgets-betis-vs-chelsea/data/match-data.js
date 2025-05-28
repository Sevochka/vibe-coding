const matchData = {
  id: "betis-vs-chelsea",
  scheduledAt: "2025-05-29T22:00:00+03:00",
  currentTime: "FT",
  season: {
    tournament: {
      name: "Лига Конференций",
      logo: "https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png"
    }
  },
  matchStatus: "ENDED",
  roundName: "Финал",
  home: {
    team: {
      name: "Бетис",
      logo: "https://pictures.cdn.sports.ru/6f_HwvZ-xjnVK7C1fQXR7JLJ-lfW1YGYcO7JtZk7Ooo/fill/150/150/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL1RFQU0vbWFpbi9iZXRpc19zZXZpbGxhXzE3MjQzMjEwNDIucG5n.webp"
    },
    score: 1,
    penaltyScore: 0,
    stat: {
      ballPossession: 43,
      shotsTotal: 12,
      shotsOnTarget: 4,
      cornerKicks: 4,
      fouls: 16,
      yellowCards: 3,
      redCards: 0
    }
  },
  away: {
    team: {
      name: "Челси",
      logo: "https://pictures.cdn.sports.ru/u5FXb3P5vLkqJ6FUXfOsLTlkHF1-UGYOoNhLm-c4HwY/fill/150/150/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL1RFQU0vbWFpbi9jaGVsc2VhLnBuZw.webp"
    },
    score: 2,
    penaltyScore: 0,
    stat: {
      ballPossession: 57,
      shotsTotal: 18,
      shotsOnTarget: 8,
      cornerKicks: 7,
      fouls: 10,
      yellowCards: 2,
      redCards: 0
    }
  },
  events: [
    {
      time: "23",
      type: "GOAL",
      team: "home",
      player: "Родри",
      assistPlayer: "Айосе Перес"
    },
    {
      time: "41",
      type: "YELLOW_CARD",
      team: "home",
      player: "Абнер"
    },
    {
      time: "45+2",
      type: "GOAL",
      team: "away",
      player: "Джексон",
      assistPlayer: "Кукурелья"
    },
    {
      time: "56",
      type: "YELLOW_CARD",
      team: "away",
      player: "Галлахер"
    },
    {
      time: "63",
      type: "SUBSTITUTION",
      team: "home",
      playerOut: "Абнер",
      playerIn: "Сабали"
    },
    {
      time: "68",
      type: "SUBSTITUTION",
      team: "away",
      playerOut: "Кукурелья",
      playerIn: "Чилвелл"
    },
    {
      time: "75",
      type: "YELLOW_CARD",
      team: "home",
      player: "Пецелья"
    },
    {
      time: "78",
      type: "GOAL",
      team: "away",
      player: "Нкунку",
      assistPlayer: "Джексон"
    },
    {
      time: "82",
      type: "YELLOW_CARD",
      team: "away",
      player: "Чаловба"
    },
    {
      time: "86",
      type: "YELLOW_CARD",
      team: "home",
      player: "Родри"
    }
  ],
  lineup: {
    home: [
      { name: "Руи Силва", number: "13", position: "GK" },
      { name: "Абнер", number: "24", position: "DF" },
      { name: "Пецелья", number: "16", position: "DF" },
      { name: "Бартра", number: "5", position: "DF" },
      { name: "Белерин", number: "22", position: "DF" },
      { name: "Карвальо", number: "14", position: "MF" },
      { name: "Родри", number: "28", position: "MF" },
      { name: "Исско", number: "22", position: "MF" },
      { name: "Форналс", number: "8", position: "MF" },
      { name: "Айосе Перес", number: "10", position: "FW" },
      { name: "Виллиан Жозе", number: "9", position: "FW" }
    ],
    away: [
      { name: "Санчес", number: "31", position: "GK" },
      { name: "Кукурелья", number: "3", position: "DF" },
      { name: "Колвилл", number: "26", position: "DF" },
      { name: "Фофана", number: "15", position: "DF" },
      { name: "Чаловба", number: "30", position: "DF" },
      { name: "Кайседо", number: "25", position: "MF" },
      { name: "Энзо", number: "8", position: "MF" },
      { name: "Галлахер", number: "23", position: "MF" },
      { name: "Мадуэке", number: "11", position: "FW" },
      { name: "Джексон", number: "15", position: "FW" },
      { name: "Палмер", number: "20", position: "FW" }
    ]
  },
  headToHead: [
    {
      date: "2024-02-13",
      tournament: "Товарищеский матч",
      homeTeam: "Челси",
      awayTeam: "Бетис",
      homeScore: 2,
      awayScore: 0
    },
    {
      date: "2023-07-12",
      tournament: "Товарищеский матч",
      homeTeam: "Бетис",
      awayTeam: "Челси",
      homeScore: 1,
      awayScore: 1
    },
    {
      date: "2019-07-23",
      tournament: "Товарищеский матч",
      homeTeam: "Бетис",
      awayTeam: "Челси",
      homeScore: 0,
      awayScore: 1
    }
  ],
  factoids: [
    "Челси не проигрывает в 7 из 9 последних матчей",
    "Бетис не проигрывает в 9 из 11 последних матчей",
    "В последних 5 играх Челси пропускает в среднем 0.60 гола за игру"
  ],
  odds: {
    fonbet: {
      homeWin: 3.65,
      draw: 3.80,
      awayWin: 1.95,
      logo: "https://legalbet.ru/images/bukmekery/fonbet_logo.svg"
    }
  }
}; 