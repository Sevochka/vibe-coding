const champions = [
  {
    country: "Англия",
    champion: "Манчестер Сити",
    logo: "https://dumpster.cdn.sports.ru/n/7e/c4bac6d1a4be0f2c31f4d0aa0fc8c.png",
    coordinates: [51.5, -0.1],
    color: "#6CABDD",
    league: "Премьер-лига",
    titles: 10
  },
  {
    country: "Испания",
    champion: "Реал Мадрид",
    logo: "https://dumpster.cdn.sports.ru/4/25/a05abeada1b9f8b54dd8f8c9e6a16.png",
    coordinates: [40.4, -3.7],
    color: "#FFFFFF",
    league: "Ла Лига",
    titles: 36
  },
  {
    country: "Италия",
    champion: "Интер",
    logo: "https://dumpster.cdn.sports.ru/8/c0/50abc4dfaa4d582d716de2cad6b95.png",
    coordinates: [45.4, 9.2],
    color: "#0066B3",
    league: "Серия А",
    titles: 20
  },
  {
    country: "Германия",
    champion: "Байер Леверкузен",
    logo: "https://dumpster.cdn.sports.ru/2/d0/f6f8c7f8cb56d97cabb8b9c8bef05.png",
    coordinates: [51.0, 10.0],
    color: "#E32221",
    league: "Бундеслига",
    titles: 1
  },
  {
    country: "Франция",
    champion: "ПСЖ",
    logo: "https://dumpster.cdn.sports.ru/c/d8/ce69c3dda9be51f3cfad09cd5bf21.png",
    coordinates: [48.9, 2.3],
    color: "#004170",
    league: "Лига 1",
    titles: 12
  },
  {
    country: "Португалия",
    champion: "Спортинг",
    logo: "https://dumpster.cdn.sports.ru/6/9e/ddd1c2d7c9cf5a0d7ad4fcc9bb09d.png",
    coordinates: [38.7, -9.1],
    color: "#006633",
    league: "Примейра Лига",
    titles: 20
  },
  {
    country: "Нидерланды",
    champion: "ПСВ",
    logo: "https://dumpster.cdn.sports.ru/e/7d/befd9e81c8d7081caa4f29cd5ddbc.png",
    coordinates: [52.1, 5.3],
    color: "#FF0000",
    league: "Эредивизи",
    titles: 25
  },
  {
    country: "Бельгия",
    champion: "Брюгге",
    logo: "https://dumpster.cdn.sports.ru/2/b5/d6b1c2d9e9ae5fcba8dedecd90fa5.png",
    coordinates: [50.8, 4.4],
    color: "#000000",
    league: "Про Лига",
    titles: 19
  },
  {
    country: "Шотландия",
    champion: "Селтик",
    logo: "https://dumpster.cdn.sports.ru/3/4f/4df7b8d2c91d5fa67ed2d3c4bb69c.png",
    coordinates: [55.9, -3.2],
    color: "#006633",
    league: "Премьершип",
    titles: 54
  },
  {
    country: "Турция",
    champion: "Галатасарай",
    logo: "https://dumpster.cdn.sports.ru/6/95/1adeb1e3da3c092af7e7cfc497fbf.png",
    coordinates: [41.0, 29.0],
    color: "#FFB400",
    league: "Суперлига",
    titles: 24
  },
  {
    country: "Греция",
    champion: "ПАОК",
    logo: "https://dumpster.cdn.sports.ru/e/c9/c49eb6ddaa8f5b8c9a1ec2cfb1bc1.png",
    coordinates: [39.0, 22.0],
    color: "#000000",
    league: "Суперлига",
    titles: 4
  },
  {
    country: "Украина",
    champion: "Шахтер",
    logo: "https://dumpster.cdn.sports.ru/b/e9/52de89e0c9b65f7eb0d389c82cbc5.png",
    coordinates: [49.0, 32.0],
    color: "#FF6600",
    league: "Премьер-лига",
    titles: 14
  },
  {
    country: "Россия",
    champion: "Зенит",
    logo: "https://dumpster.cdn.sports.ru/b/3e/5f57b8d8ca8b5fc5cbd5d3c2bcfaf.png",
    coordinates: [55.8, 37.6],
    color: "#0000FF",
    league: "РПЛ",
    titles: 10
  },
  {
    country: "Швейцария",
    champion: "Янг Бойз",
    logo: "https://dumpster.cdn.sports.ru/8/e4/5ec1a2d7c92a5b64a1d7eacabf083.png",
    coordinates: [46.8, 8.2],
    color: "#FFFF00",
    league: "Суперлига",
    titles: 17
  },
  {
    country: "Австрия",
    champion: "Штурм",
    logo: "https://dumpster.cdn.sports.ru/4/94/1a4be3e3da1a0d2fe9f2ceca9fb07.png",
    coordinates: [47.5, 14.5],
    color: "#000000",
    league: "Бундеслига",
    titles: 4
  },
  {
    country: "Дания",
    champion: "Мидтьюлланд",
    logo: "https://dumpster.cdn.sports.ru/f/b2/daa4c5daa9bf5dd59f9fcccd9baad.png",
    coordinates: [56.0, 10.0],
    color: "#000000",
    league: "Суперлига",
    titles: 4
  },
  {
    country: "Швеция",
    champion: "Мальме",
    logo: "https://dumpster.cdn.sports.ru/3/d0/37a7a6ddaa4c5d0abed4c6c19bf75.png",
    coordinates: [62.0, 15.0],
    color: "#0099FF",
    league: "Аллсвенскан",
    titles: 23
  },
  {
    country: "Норвегия",
    champion: "Буде-Глимт",
    logo: "https://dumpster.cdn.sports.ru/6/32/3aaaa3dda98d5b6c86d2e9ce9a693.png",
    coordinates: [62.0, 10.0],
    color: "#FFFF00",
    league: "Элитсериен",
    titles: 3
  },
  {
    country: "Хорватия",
    champion: "Динамо Загреб",
    logo: "https://dumpster.cdn.sports.ru/e/75/7da4c3dfa98f592d76c4f9c292b67.png",
    coordinates: [45.8, 16.0],
    color: "#0000FF",
    league: "Первая лига",
    titles: 24
  },
  {
    country: "Сербия",
    champion: "Црвена Звезда",
    logo: "https://dumpster.cdn.sports.ru/4/e5/b793aedda9bd5f7d77d4fbca9ab91.png",
    coordinates: [44.8, 20.5],
    color: "#FF0000",
    league: "Суперлига",
    titles: 35
  }
]; 