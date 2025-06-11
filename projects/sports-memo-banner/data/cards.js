// Данные карточек для игры мемо
const CARD_SYMBOLS = [
    '⚽', // Футбол
    '🏀', // Баскетбол
    '🏈', // Американский футбол
    '⚾', // Бейсбол
    '🎾', // Теннис
    '🏐', // Волейбол
    '🏒', // Хоккей
    '🥊'  // Бокс
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