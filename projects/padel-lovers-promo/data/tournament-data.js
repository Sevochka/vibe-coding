// Данные о турнире Winline Padel Tour
const tournamentData = {
    name: "Winline Padel Tour",
    category: "Любители",
    date: "25 мая 2024",
    time: "10:00",
    location: "Москва",
    format: "Парные игры",
    
    features: [
        {
            icon: "🏆",
            title: "Призовой фонд",
            description: "Ценные призы для победителей и призеров"
        },
        {
            icon: "📅", 
            title: "25 мая 2024",
            description: "Дата проведения турнира"
        },
        {
            icon: "🎾",
            title: "Профессиональные корты",
            description: "Игра на качественных покрытиях"
        }
    ],
    
    infoCards: [
        {
            title: "Для всех уровней",
            description: "Турнир открыт для игроков любого уровня подготовки. Главное - это любовь к игре!",
            icon: "players-icon.jpg"
        },
        {
            title: "Лучшие корты", 
            description: "Игры проходят на профессиональных кортах с качественным покрытием",
            icon: "court-icon.jpg"
        },
        {
            title: "Ценные призы",
            description: "Победители и призеры получат кубки, медали и специальные подарки от спонсоров",
            icon: "trophy-icon.jpg"
        }
    ],
    
    schedule: [
        {
            time: "09:00",
            event: "Регистрация участников"
        },
        {
            time: "10:00", 
            event: "Торжественное открытие"
        },
        {
            time: "10:30",
            event: "Начало групповых игр"
        },
        {
            time: "14:00",
            event: "Обеденный перерыв"
        },
        {
            time: "15:00",
            event: "Плей-офф игры"
        },
        {
            time: "18:00",
            event: "Финал и награждение"
        }
    ],
    
    registration: {
        fee: "Уточняется",
        requirements: [
            "Наличие партнера для парной игры",
            "Спортивная форма и кроссовки",
            "Собственная ракетка (аренда доступна)"
        ],
        levels: [
            { value: "beginner", label: "Начинающий" },
            { value: "amateur", label: "Любитель" },
            { value: "advanced", label: "Продвинутый" }
        ]
    },
    
    rules: [
        "Игры проводятся по официальным правилам падел-тенниса",
        "Матчи играются до 2 выигранных сетов",
        "Сет играется до 6 геймов с разницей в 2 гейма",
        "При счете 6:6 играется тай-брейк до 7 очков"
    ],
    
    prizes: [
        {
            place: "1 место",
            prize: "Кубок + подарки от спонсоров",
            amount: "50,000 ₽"
        },
        {
            place: "2 место", 
            prize: "Медаль + подарки от спонсоров",
            amount: "30,000 ₽"
        },
        {
            place: "3 место",
            prize: "Медаль + подарки от спонсоров", 
            amount: "20,000 ₽"
        }
    ],
    
    partners: [
        {
            name: "Winline",
            logo: "winline-logo.jpg",
            role: "Главный партнер"
        },
        {
            name: "Партнер 2",
            logo: "partner-2.jpg", 
            role: "Официальный партнер"
        },
        {
            name: "Партнер 3",
            logo: "partner-3.jpg",
            role: "Спонсор призов"
        },
        {
            name: "Партнер 4",
            logo: "partner-4.jpg",
            role: "Медиа-партнер"
        }
    ],
    
    contacts: {
        email: "info@padeltour.ru",
        phone: "+7 (999) 123-45-67",
        address: "Москва, ул. Спортивная, 15",
        social: {
            telegram: "@padeltour",
            instagram: "@winline_padel_tour"
        }
    },
    
    gallery: [
        {
            src: "gallery-1.jpg",
            alt: "Момент игры",
            description: "Захватывающие моменты игры"
        },
        {
            src: "gallery-2.jpg", 
            alt: "Команды",
            description: "Дружеские команды"
        },
        {
            src: "gallery-3.jpg",
            alt: "Награждение", 
            description: "Торжественное награждение"
        },
        {
            src: "gallery-4.jpg",
            alt: "Празднование",
            description: "Празднование побед"
        }
    ]
};

// Статистика турнира
const tournamentStats = {
    expectedParticipants: 250,
    courts: 8,
    prizePool: 100000,
    categories: 3
};

// Экспорт данных для использования в других частях приложения
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tournamentData, tournamentStats };
} 