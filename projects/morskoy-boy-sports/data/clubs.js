// Европейские футбольные клубы для игры
const FOOTBALL_CLUBS = [
    {
        id: 'real-madrid',
        name: 'Реал Мадрид',
        country: 'Испания',
        logo: '⚪',
        colors: ['#FFFFFF', '#FFD700'],
        description: 'Королевский клуб'
    },
    {
        id: 'barcelona',
        name: 'Барселона',
        country: 'Испания', 
        logo: '🔵',
        colors: ['#004D98', '#A50044'],
        description: 'Каталонские львы'
    },
    {
        id: 'manchester-city',
        name: 'Манчестер Сити',
        country: 'Англия',
        logo: '🩵',
        colors: ['#6CABDD', '#FFE066'],
        description: 'Небесно-голубые'
    },
    {
        id: 'liverpool',
        name: 'Ливерпуль',
        country: 'Англия',
        logo: '🔴',
        colors: ['#C8102E', '#FFD700'],
        description: 'Красные дьяволы'
    },
    {
        id: 'psg',
        name: 'ПСЖ',
        country: 'Франция',
        logo: '🔵',
        colors: ['#004170', '#FF0000'],
        description: 'Парижане'
    },
    {
        id: 'bayern',
        name: 'Бавария',
        country: 'Германия',
        logo: '🔴',
        colors: ['#DC052D', '#FFFFFF'],
        description: 'Баварцы'
    },
    {
        id: 'chelsea',
        name: 'Челси',
        country: 'Англия',
        logo: '🔵',
        colors: ['#034694', '#FFFFFF'],
        description: 'Аристократы'
    },
    {
        id: 'juventus',
        name: 'Ювентус',
        country: 'Италия',
        logo: '⚫',
        colors: ['#000000', '#FFFFFF'],
        description: 'Старая синьора'
    },
    {
        id: 'milan',
        name: 'Милан',
        country: 'Италия',
        logo: '🔴',
        colors: ['#FB090B', '#000000'],
        description: 'Россонери'
    },
    {
        id: 'arsenal',
        name: 'Арсенал',
        country: 'Англия',
        logo: '🔴',
        colors: ['#EF0107', '#FFD700'],
        description: 'Канониры'
    },
    {
        id: 'atletico',
        name: 'Атлетико Мадрид',
        country: 'Испания',
        logo: '🔴',
        colors: ['#CE3524', '#FFFFFF'],
        description: 'Матрасники'
    },
    {
        id: 'dortmund',
        name: 'Боруссия Дортмунд',
        country: 'Германия',
        logo: '🟡',
        colors: ['#FDE100', '#000000'],
        description: 'Жёлто-чёрные'
    }
];

// Функция для получения случайного соперника
function getRandomOpponent(excludeId = null) {
    const availableClubs = FOOTBALL_CLUBS.filter(club => club.id !== excludeId);
    const randomIndex = Math.floor(Math.random() * availableClubs.length);
    return availableClubs[randomIndex];
}

// Функция для получения клуба по ID
function getClubById(id) {
    return FOOTBALL_CLUBS.find(club => club.id === id);
} 