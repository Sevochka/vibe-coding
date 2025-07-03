const teams = [
  {
    id: 'sales',
    name: 'Продажи',
    color: '#ff6b6b',
    players: [
      {
        name: 'Криштиану Роналду',
        image: './images/players/ronaldo.png',
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
    players: [
      {
        name: 'Лионель Месси',
        image: './images/players/messi.png',
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
    players: [
      {
        name: 'Килиан Мбаппе',
        image: './images/players/mbappe.png',
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
    players: [
      {
        name: 'Эрлинг Холанд',
        image: './images/players/haaland.png',
        stats: {
          speed: 8,
          jump: 8,
          power: 9
        }
      }
    ]
  },
  {
    id: 'product',
    name: 'Продукт',
    color: '#c56cf0',
    players: [
      {
        name: 'Неймар',
        image: './images/players/neymar.png',
        stats: {
          speed: 9,
          jump: 8,
          power: 7
        }
      }
    ]
  },
  {
    id: 'development',
    name: 'Разработка',
    color: '#ff9f43',
    players: [
      {
        name: 'Роберт Левандовски',
        image: './images/players/lewandowski.png',
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
  'ronaldo': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png',
  'messi': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png',
  'mbappe': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png',
  'haaland': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png',
  'neymar': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png',
  'lewandowski': 'https://dumpster.cdn.sports.ru/e/01/b6a5c8d6223d46030fe91d0aa70cc.png'
}; 