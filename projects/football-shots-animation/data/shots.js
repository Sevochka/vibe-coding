// Данные об ударах команд
const matchStats = {
  homeTeam: {
    name: "Команда А",
    color: "#ff003c", // красный цвет Sports
    totalShots: 10,
    shotsOnTarget: 8,
    blockedShots: 2,
    saves: 4
  },
  awayTeam: {
    name: "Команда Б", 
    color: "#00a0f0", // синий цвет Sports
    totalShots: 8,
    shotsOnTarget: 16,
    blockedShots: 3,
    saves: 1
  }
};

// Координаты ударов (x, y в процентах от размера поля)
const shotsData = [
  // Удары домашней команды (красные)
  { team: 'home', x: 25, y: 30, type: 'on-target', time: 12 },
  { team: 'home', x: 35, y: 45, type: 'off-target', time: 18 },
  { team: 'home', x: 40, y: 55, type: 'on-target', time: 23 },
  { team: 'home', x: 30, y: 25, type: 'blocked', time: 31 },
  { team: 'home', x: 45, y: 60, type: 'on-target', time: 38 },
  { team: 'home', x: 20, y: 40, type: 'off-target', time: 47 },
  { team: 'home', x: 38, y: 35, type: 'on-target', time: 52 },
  { team: 'home', x: 42, y: 48, type: 'on-target', time: 61 },
  { team: 'home', x: 28, y: 55, type: 'blocked', time: 69 },
  { team: 'home', x: 33, y: 42, type: 'on-target', time: 78 },

  // Удары гостевой команды (синие)
  { team: 'away', x: 75, y: 35, type: 'on-target', time: 15 },
  { team: 'away', x: 65, y: 50, type: 'on-target', time: 22 },
  { team: 'away', x: 70, y: 28, type: 'off-target', time: 29 },
  { team: 'away', x: 80, y: 45, type: 'blocked', time: 34 },
  { team: 'away', x: 60, y: 40, type: 'on-target', time: 43 },
  { team: 'away', x: 68, y: 58, type: 'on-target', time: 58 },
  { team: 'away', x: 72, y: 33, type: 'blocked', time: 66 },
  { team: 'away', x: 78, y: 52, type: 'on-target', time: 73 }
];

// Направления ударов к воротам
const goalCoordinates = {
  home: { x: 5, y: 50 }, // левые ворота
  away: { x: 95, y: 50 } // правые ворота
}; 