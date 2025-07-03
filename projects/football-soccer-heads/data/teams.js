const teams = [
  {
    id: 'sales',
    name: 'Продажи',
    color: '#ff6b6b',
    players: [
      {
        name: 'Команда продаж',
        image: './images/default-player.png',
        stats: {
          speed: 8,
          jump: 9,
          power: 9
        }
      }
    ]
  },
  {
    id: 'markoffice',
    name: 'Маркофис',
    color: '#48dbfb',
    employee: 'stepan',
    players: [
      {
        name: 'Степан',
        image: './images/stepan.jpg',
        stats: {
          speed: 9,
          jump: 7,
          power: 8
        }
      }
    ]
  },
  {
    id: 'sirena',
    name: 'Сирена',
    color: '#feca57',
    employee: 'ark',
    players: [
      {
        name: 'Арк',
        image: './images/ark.jpg',
        stats: {
          speed: 9,
          jump: 8,
          power: 7
        }
      }
    ]
  },
  {
    id: 'editorial',
    name: 'Редакция',
    color: '#1dd1a1',
    employee: 'vlad',
    players: [
      {
        name: 'Влад',
        image: './images/vlad.jpg',
        stats: {
          speed: 8,
          jump: 8,
          power: 9
        }
      }
    ]
  },
  {
    id: 'product-dev',
    name: 'Продукт и разработка',
    color: '#c56cf0',
    employee: 'makarenko',
    players: [
      {
        name: 'Макаренко',
        image: './images/makarenko.jpg',
        stats: {
          speed: 7,
          jump: 8,
          power: 9
        }
      }
    ]
  }
];

// Временные URL для изображений, пока не будут загружены настоящие
const defaultPlayerImages = {
  'stepan': './images/stepan.jpg',
  'ark': './images/ark.jpg', 
  'vlad': './images/vlad.jpg',
  'makarenko': './images/makarenko.jpg',
  'default': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png'
}; 