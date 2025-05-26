// Данные букмекеров и рекламных предложений для НХЛ
const bookmakersData = {
    bookmakers: [
        {
            id: "parimatch",
            name: "Parimatch",
            shortName: "PM", 
            logo: "https://static.pm-cdn.pro/pm-front/assets/images/logo-pm.svg",
            logoShort: "PM",
            website: "https://parimatch.ru",
            rating: 4.8,
            isTopChoice: true,
            colors: {
                primary: "#ff6b35",
                secondary: "#f7931e",
                accent: "#fff"
            },
            bonus: {
                type: "deposit",
                amount: 30000,
                currency: "₽",
                percentage: 100,
                description: "Бонус до 30,000₽",
                shortDescription: "До 30к",
                conditions: "Для новых игроков",
                wagering: "x5",
                minDeposit: 1000
            },
            odds: {
                homeWin: 1.85,
                draw: 4.20,
                awayWin: 3.95
            },
            features: [
                "Лучшие коэффициенты НХЛ",
                "Быстрые выплаты",
                "Мобильное приложение",
                "Live-ставки"
            ],
            paymentMethods: ["Карты", "Qiwi", "YooMoney"],
            license: "Кюрасао",
            established: 1994
        },
        {
            id: "fonbet", 
            name: "Фонбет",
            shortName: "FB",
            logo: "https://fonbet.ru/favicon.ico",
            logoShort: "FB",
            website: "https://fonbet.ru",
            rating: 4.6,
            isTopChoice: false,
            colors: {
                primary: "#1e3a8a",
                secondary: "#3b82f6", 
                accent: "#fff"
            },
            bonus: {
                type: "freebet",
                amount: 5000,
                currency: "₽",
                percentage: 0,
                description: "Фрибет 5,000₽",
                shortDescription: "Фрибет 5к",
                conditions: "При регистрации",
                wagering: "x1",
                minDeposit: 500
            },
            odds: {
                homeWin: 1.88,
                draw: 4.15,
                awayWin: 3.90
            },
            features: [
                "Российская лицензия",
                "Быстрая регистрация", 
                "Поддержка 24/7",
                "Статистика матчей"
            ],
            paymentMethods: ["СБП", "Карты", "Наличные"],
            license: "Россия",
            established: 1994
        },
        {
            id: "betcity",
            name: "BetCity", 
            shortName: "BC",
            logo: "https://betcity.ru/favicon.ico",
            logoShort: "BC",
            website: "https://betcity.ru",
            rating: 4.4,
            isTopChoice: false,
            colors: {
                primary: "#dc2626",
                secondary: "#ef4444",
                accent: "#fff"
            },
            bonus: {
                type: "cashback",
                amount: 10,
                currency: "%",
                percentage: 10,
                description: "Кэшбэк 10%",
                shortDescription: "Кэшбэк 10%",
                conditions: "Еженедельный",
                wagering: "x1",
                minDeposit: 0
            },
            odds: {
                homeWin: 1.90,
                draw: 4.10,
                awayWin: 3.85
            },
            features: [
                "Кэшбэк на спорт",
                "Экспресс дня",
                "Пункты приёма ставок",
                "Промокоды"
            ],
            paymentMethods: ["Карты", "Баланс телефона", "Терминалы"],
            license: "Россия",
            established: 2003
        },
        {
            id: "1xbet",
            name: "1xBet",
            shortName: "1X",
            logo: "https://1xbet.ru/favicon.ico", 
            logoShort: "1X",
            website: "https://1xbet.ru",
            rating: 4.2,
            isTopChoice: false,
            colors: {
                primary: "#1f4788",
                secondary: "#4169b8",
                accent: "#fff"
            },
            bonus: {
                type: "deposit",
                amount: 50000,
                currency: "₽", 
                percentage: 200,
                description: "200% до 50,000₽",
                shortDescription: "200% до 50к",
                conditions: "Первый депозит",
                wagering: "x5",
                minDeposit: 1000
            },
            odds: {
                homeWin: 1.87,
                draw: 4.18,
                awayWin: 3.92
            },
            features: [
                "Максимальные лимиты",
                "1000+ событий в день",
                "Переводы на карту",
                "VIP-программа"
            ],
            paymentMethods: ["Карты", "Криптовалюты", "Электронные"],
            license: "Кюрасао",
            established: 2007
        },
        {
            id: "winline",
            name: "Winline",
            shortName: "WL",
            logo: "https://winline.ru/favicon.ico",
            logoShort: "WL", 
            website: "https://winline.ru",
            rating: 4.3,
            isTopChoice: false,
            colors: {
                primary: "#ff9500",
                secondary: "#ffb347",
                accent: "#fff"
            },
            bonus: {
                type: "deposit",
                amount: 20000,
                currency: "₽",
                percentage: 100,
                description: "100% до 20,000₽", 
                shortDescription: "100% до 20к",
                conditions: "Новичкам",
                wagering: "x3",
                minDeposit: 500
            },
            odds: {
                homeWin: 1.86,
                draw: 4.22,
                awayWin: 3.96
            },
            features: [
                "Низкие требования к отыгрышу",
                "Акции для постоянных",
                "Тото и лотереи",
                "Турниры игроков"
            ],
            paymentMethods: ["СБП", "Карты", "Электронные кошельки"],
            license: "Россия", 
            established: 2009
        }
    ],

    specialOffers: [
        {
            id: "nhl-playoff-promo",
            type: "tournament", 
            title: "Эксклюзивное предложение!",
            description: "Удвойте свой первый депозит + получите 50 фрибетов на НХЛ",
            shortTitle: "НХЛ Плей-офф Бонус",
            icon: "🎁",
            bonus: {
                amount: 50000,
                currency: "₽",
                type: "matched_deposit",
                percentage: 200,
                freebets: 50,
                freebetValue: 1000
            },
            features: [
                "Удвоенный депозит",
                "50 фрибетов по 1000₽",
                "Действует до конца плей-офф",
                "Только для НХЛ"
            ],
            conditions: {
                minDeposit: 2000,
                wagering: "x4",
                timeLimit: "7 дней",
                sportsOnly: true
            },
            cta: "Активировать",
            isExclusive: true,
            validUntil: "2024-06-30"
        },
        {
            id: "weekly-cashback",
            type: "cashback",
            title: "Еженедельный кэшбэк на НХЛ", 
            description: "Возвращаем 15% с проигранных ставок на хоккей",
            shortTitle: "15% кэшбэк",
            icon: "💰",
            bonus: {
                percentage: 15,
                type: "cashback",
                maxAmount: 10000,
                currency: "₽"
            },
            features: [
                "Каждый понедельник",
                "Только на НХЛ",
                "Без отыгрыша",
                "До 10,000₽"
            ],
            conditions: {
                minLoss: 1000,
                frequency: "weekly",
                noWagering: true
            },
            cta: "Подключить",
            isExclusive: false
        }
    ],

    popularBets: [
        {
            id: "match-winner",
            name: "Исход матча",
            category: "main",
            bets: [
                { name: "Флорида", odds: 1.85, type: "home" },
                { name: "Ничья", odds: 4.20, type: "draw" },
                { name: "Каролина", odds: 3.95, type: "away" }
            ]
        },
        {
            id: "total-goals", 
            name: "Тотал голов",
            category: "totals",
            bets: [
                { name: "Больше 5.5", odds: 1.92, type: "over" },
                { name: "Меньше 5.5", odds: 1.88, type: "under" }
            ]
        },
        {
            id: "both-teams-score",
            name: "Обе забьют",
            category: "specials", 
            bets: [
                { name: "Да", odds: 1.75, type: "yes" },
                { name: "Нет", odds: 2.05, type: "no" }
            ]
        },
        {
            id: "overtime",
            name: "Овертайм",
            category: "specials",
            bets: [
                { name: "Будет ОТ", odds: 3.40, type: "yes" },
                { name: "Не будет ОТ", odds: 1.30, type: "no" }
            ]
        }
    ],

    liveOffers: [
        {
            bookmaker: "parimatch",
            offer: "Повышенные коэффициенты в Live",
            boost: "+15%",
            conditions: "На голы в плей-офф НХЛ"
        },
        {
            bookmaker: "fonbet", 
            offer: "Live кэшаут",
            boost: "100%",
            conditions: "Полный возврат до 90-й минуты"
        },
        {
            bookmaker: "betcity",
            offer: "Быстрые ставки",
            boost: "1 клик",
            conditions: "На популярные исходы"
        }
    ],

    paymentInfo: {
        methods: [
            {
                name: "Банковские карты",
                types: ["Visa", "MasterCard", "МИР"],
                depositTime: "Мгновенно",
                withdrawTime: "15 минут - 3 дня",
                minDeposit: 100,
                minWithdraw: 100,
                fees: "Без комиссии"
            },
            {
                name: "СБП", 
                types: ["Все банки России"],
                depositTime: "Мгновенно",
                withdrawTime: "15 минут",
                minDeposit: 100,
                minWithdraw: 100,
                fees: "Без комиссии"
            },
            {
                name: "Электронные кошельки",
                types: ["Qiwi", "YooMoney", "WebMoney"],
                depositTime: "Мгновенно", 
                withdrawTime: "15 минут - 2 часа",
                minDeposit: 50,
                minWithdraw: 100,
                fees: "1-3%"
            }
        ]
    },

    responsible: {
        limits: [
            "Лимиты на депозиты",
            "Лимиты на ставки", 
            "Тайм-ауты",
            "Самоисключение"
        ],
        support: [
            "Телефон горячей линии",
            "Чат поддержки 24/7",
            "Email техподдержка"
        ],
        verification: [
            "Проверка возраста 18+",
            "Верификация документов",
            "Контроль местонахождения"
        ]
    }
};

// Экспорт данных 
if (typeof module !== 'undefined' && module.exports) {
    module.exports = bookmakersData;
} else if (typeof window !== 'undefined') {
    window.bookmakersData = bookmakersData;
} 