// Данные карточек для игры мемо - спортивные символы
const CARD_SYMBOLS = [
    {
        id: 'football',
        name: 'Футбол',
        symbol: '⚽',
        color: '#00a8ff'
    },
    {
        id: 'basketball',
        name: 'Баскетбол', 
        symbol: '🏀',
        color: '#6c5ce7'
    },
    {
        id: 'tennis',
        name: 'Теннис',
        symbol: '🎾',
        color: '#fd79a8'
    },
    {
        id: 'hockey',
        name: 'Хоккей',
        symbol: '🏒',
        color: '#00b894'
    },
    {
        id: 'volleyball',
        name: 'Волейбол',
        symbol: '🏐',
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