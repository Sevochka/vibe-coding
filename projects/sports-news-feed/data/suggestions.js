// Подсказки для пользователей на основе интересов
const userSuggestions = [
    {
        id: 1,
        text: "Результаты матчей РПЛ последнего тура",
        category: "football",
        tags: ["рпл", "футбол", "результаты"],
        url: "https://www.sports.ru/football/championship/rus/1/",
        priority: "high"
    },
    {
        id: 2,
        text: "Трансферные новости зимнего окна",
        category: "football",
        tags: ["трансферы", "футбол", "зимнее окно"],
        url: "https://www.sports.ru/football/transfers/",
        priority: "high"
    },
    {
        id: 3,
        text: "Расписание матчей НХЛ с участием россиян",
        category: "hockey",
        tags: ["нхл", "хоккей", "россияне"],
        url: "https://www.sports.ru/hockey/championship/nhl/",
        priority: "medium"
    },
    {
        id: 4,
        text: "Итоги турнира ATP в Дубае",
        category: "tennis",
        tags: ["теннис", "atp", "дубай"],
        url: "https://www.sports.ru/tennis/",
        priority: "medium"
    },
    {
        id: 5,
        text: "Подготовка сборной России к Евро-2024",
        category: "football",
        tags: ["сборная", "евро", "подготовка"],
        url: "https://www.sports.ru/football/team/russi/",
        priority: "high"
    },
    {
        id: 6,
        text: "Новости UFC и предстоящие бои",
        category: "mma",
        tags: ["ufc", "mma", "бои"],
        url: "https://www.sports.ru/mma/",
        priority: "medium"
    },
    {
        id: 7,
        text: "Результаты этапа Кубка мира по биатлону",
        category: "biathlon",
        tags: ["биатлон", "кубок мира", "результаты"],
        url: "https://www.sports.ru/biathlon/",
        priority: "low"
    },
    {
        id: 8,
        text: "Итоги плей-офф НБА",
        category: "basketball",
        tags: ["нба", "плей-офф", "баскетбол"],
        url: "https://www.sports.ru/basketball/championship/nba/",
        priority: "medium"
    },
    {
        id: 9,
        text: "Чемпионат мира по шахматам: последние партии",
        category: "chess",
        tags: ["шахматы", "чемпионат мира", "партии"],
        url: "https://www.sports.ru/chess/",
        priority: "low"
    },
    {
        id: 10,
        text: "Рейтинг лучших боксёров по версии WBC",
        category: "boxing",
        tags: ["бокс", "рейтинг", "wbc"],
        url: "https://www.sports.ru/boxing/",
        priority: "medium"
    }
];

// Популярные темы для всех пользователей
const popularTopics = [
    {
        id: 11,
        text: "🔥 Самые громкие трансферы года",
        category: "all",
        tags: ["трансферы", "топ", "года"],
        url: "https://www.sports.ru/football/transfers/",
        priority: "high"
    },
    {
        id: 12,
        text: "⚽ Топ-10 голов недели в Европе",
        category: "football",
        tags: ["голы", "европа", "топ"],
        url: "https://www.sports.ru/football/",
        priority: "high"
    },
    {
        id: 13,
        text: "🏒 Лучшие сэйвы вратарей НХЛ",
        category: "hockey",
        tags: ["сэйвы", "вратари", "нхл"],
        url: "https://www.sports.ru/hockey/",
        priority: "medium"
    },
    {
        id: 14,
        text: "🎾 Рейтинг ATP: новые позиции",
        category: "tennis",
        tags: ["рейтинг", "atp", "позиции"],
        url: "https://www.sports.ru/tennis/",
        priority: "medium"
    }
];

// Функция для получения подсказок по интересам пользователя
function getSuggestionsByInterests(userInterests) {
    if (!userInterests || userInterests.length === 0) {
        return popularTopics.slice(0, 3);
    }
    
    const filteredSuggestions = userSuggestions.filter(suggestion => 
        userInterests.includes(suggestion.category) || suggestion.category === 'all'
    );
    
    // Сортируем по приоритету
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    filteredSuggestions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    // Если подсказок мало, добавляем популярные
    if (filteredSuggestions.length < 3) {
        const additionalSuggestions = popularTopics.filter(topic => 
            !filteredSuggestions.find(s => s.id === topic.id)
        );
        filteredSuggestions.push(...additionalSuggestions);
    }
    
    return filteredSuggestions.slice(0, 3);
}

// Функция для получения случайных подсказок
function getRandomSuggestions(count = 3) {
    const allSuggestions = [...userSuggestions, ...popularTopics];
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Функция для обновления подсказок на основе прочитанных новостей
function updateSuggestionsBasedOnReading(readNewsCategories) {
    const relatedSuggestions = userSuggestions.filter(suggestion =>
        readNewsCategories.includes(suggestion.category)
    );
    
    // Добавляем связанные подсказки
    const additionalSuggestions = [];
    
    if (readNewsCategories.includes('football')) {
        additionalSuggestions.push({
            id: 'dynamic-1',
            text: "Аналитика матча: тактические схемы",
            category: "football",
            tags: ["аналитика", "тактика", "схемы"],
            url: "https://www.sports.ru/football/analytics/",
            priority: "medium"
        });
    }
    
    if (readNewsCategories.includes('hockey')) {
        additionalSuggestions.push({
            id: 'dynamic-2',
            text: "Статистика игроков НХЛ этого сезона",
            category: "hockey",
            tags: ["статистика", "игроки", "нхл"],
            url: "https://www.sports.ru/hockey/stats/",
            priority: "medium"
        });
    }
    
    return [...relatedSuggestions, ...additionalSuggestions].slice(0, 3);
}

// Персонализированные подсказки для разных типов пользователей
const personalizedSuggestions = {
    // Для любителей футбола
    football_fan: [
        "Лучшие моменты Лиги чемпионов",
        "Интервью с игроками сборной России",
        "Обзор трансферной политики топ-клубов"
    ],
    
    // Для фанатов хоккея
    hockey_fan: [
        "Анализ игры российских вратарей в НХЛ",
        "История противостояний Россия - Канада",
        "Молодые таланты российского хоккея"
    ],
    
    // Для любителей единоборств
    combat_fan: [
        "Подготовка бойцов к важным поединкам",
        "Техника ударов чемпионов мира",
        "История развития MMA в России"
    ],
    
    // Для универсальных любителей спорта
    all_sports: [
        "Самые яркие спортивные моменты года",
        "Олимпийские чемпионы делятся секретами",
        "Как спорт влияет на здоровье и жизнь"
    ]
};

// Функция для определения типа пользователя и выдачи соответствующих подсказок
function getPersonalizedSuggestions(userInterests, readingHistory) {
    let userType = 'all_sports';
    
    if (userInterests.includes('football') && userInterests.length <= 2) {
        userType = 'football_fan';
    } else if (userInterests.includes('hockey') && userInterests.length <= 2) {
        userType = 'hockey_fan';
    } else if ((userInterests.includes('mma') || userInterests.includes('boxing')) && userInterests.length <= 2) {
        userType = 'combat_fan';
    }
    
    return personalizedSuggestions[userType] || personalizedSuggestions['all_sports'];
} 