// Данные карточек для игры мемо
const CARD_SYMBOLS = [
    {
        id: 'football',
        name: 'Футбол',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/football.svg',
        color: '#00c78b'
    },
    {
        id: 'basketball',
        name: 'Баскетбол', 
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/basketball.svg',
        color: '#ff6b35'
    },
    {
        id: 'hockey',
        name: 'Хоккей',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/hockey.svg',
        color: '#0066cc'
    },
    {
        id: 'tennis',
        name: 'Теннис',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/tennis.svg',
        color: '#22c55e'
    },
    {
        id: 'boxing',
        name: 'Бокс',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/boxing.svg',
        color: '#dc2626'
    },
    {
        id: 'volleyball',
        name: 'Волейбол',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/volleyball.svg',
        color: '#7c3aed'
    },
    {
        id: 'formula1',
        name: 'Формула-1',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/formula1.svg',
        color: '#fbbf24'
    },
    {
        id: 'mma',
        name: 'ММА',
        image: 'https://cdn.sports.ru/ui_kit/pics/sports-icons/mma.svg',
        color: '#6b7280'
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