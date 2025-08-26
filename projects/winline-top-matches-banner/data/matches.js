// Демо-данные. В реальном проекте можно подтягивать из API Sports/Winline.
// Все тексты на русском.
const matches = [
  {
    home: 'Крылья',
    away: 'Балтика',
    tournament: 'Премьер‑лига',
    startAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 13, 30).toISOString(),
    odds: { p1: 2.60, x: 3.10, p2: 2.95 },
  },
  {
    home: 'ЦСКА',
    away: 'Рубин',
    tournament: 'Премьер‑лига',
    startAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 45).toISOString(),
    odds: { p1: 1.75, x: 3.75, p2: 4.70 },
  },
  {
    home: 'Локомотив',
    away: 'Спартак',
    tournament: 'Премьер‑лига',
    startAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 18, 0).toISOString(),
    odds: { p1: 2.65, x: 3.55, p2: 2.65 },
  },
];


