// Данные карточек для игры мемо
const CARD_SYMBOLS = [
    {
        id: 'haaland',
        name: 'Эрлинг Холанд',
        image: './images_memo/Эрлинг Холанд.jpg',
        color: '#00a8ff'
    },
    {
        id: 'grealish',
        name: 'Джек Грилиш', 
        image: './images_memo/Джек Грилиш.jpg',
        color: '#6c5ce7'
    },
    {
        id: 'akanji',
        name: 'Мануэль Аканджи',
        image: './images_memo/Мануэль Аканджи.jpg',
        color: '#fd79a8'
    },
    {
        id: 'alaba',
        name: 'Давид Алаба',
        image: './images_memo/Давид Алаба.jpg',
        color: '#00b894'
    },
    {
        id: 'muller',
        name: 'Томас Мюллер',
        image: './images_memo/Томас Мюллер.jpg',
        color: '#e17055'
    }
];

// Функция для перемешивания массива
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Функция создания игрового поля
function createGameCards() {
    // Создаем пары карточек
    const cardPairs = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
    
    // Перемешиваем карточки
    const shuffledCards = shuffleArray(cardPairs);
    
    // Создаем объекты карточек с уникальными ID
    return shuffledCards.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
    }));
} 