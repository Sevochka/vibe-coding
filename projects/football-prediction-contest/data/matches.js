const matchesData = [
    {
        id: 1,
        homeTeam: "ЦСКА",
        awayTeam: "Зенит",
        homeScore: null,
        awayScore: null,
        time: "03.07 19:00",
        status: "upcoming",
        odds: {
            win: 2.45,
            draw: 3.20,
            lose: 2.90,
            over: 1.85,
            under: 1.95
        },
        finished: false,
        homeForm: "WWLDW",
        awayForm: "DLWWL",
        homeStats: { goals: 42, conceded: 18, position: 3 },
        awayStats: { goals: 56, conceded: 22, position: 1 },
        temperature: "hot",
        rivalry: true
    },
    {
        id: 2,
        homeTeam: "Спартак",
        awayTeam: "Локомотив",
        homeScore: null,
        awayScore: null,
        time: "03.07 21:30",
        status: "upcoming",
        odds: {
            win: 1.75,
            draw: 3.65,
            lose: 4.80,
            over: 2.10,
            under: 1.70
        },
        finished: false,
        homeForm: "WWWDL",
        awayForm: "LLDWW",
        homeStats: { goals: 38, conceded: 15, position: 2 },
        awayStats: { goals: 29, conceded: 31, position: 8 },
        temperature: "normal",
        rivalry: true
    },
    {
        id: 3,
        homeTeam: "Динамо",
        awayTeam: "Краснодар",
        homeScore: null,
        awayScore: null,
        time: "04.07 16:00",
        status: "upcoming",
        odds: {
            win: 3.10,
            draw: 3.00,
            lose: 2.35,
            over: 1.95,
            under: 1.85
        },
        finished: false,
        homeForm: "WLDLD",
        awayForm: "WWDWL",
        homeStats: { goals: 28, conceded: 25, position: 7 },
        awayStats: { goals: 45, conceded: 28, position: 4 },
        temperature: "cold",
        rivalry: false
    },
    {
        id: 4,
        homeTeam: "Реал Мадрид",
        awayTeam: "Барселона",
        homeScore: 2,
        awayScore: 1,
        time: "02.07 22:00",
        status: "finished",
        odds: {
            win: 2.20,
            draw: 3.40,
            lose: 3.10,
            over: 1.75,
            under: 2.05
        },
        finished: true,
        homeForm: "WWWWW",
        awayForm: "WDLWW",
        homeStats: { goals: 58, conceded: 19, position: 1 },
        awayStats: { goals: 51, conceded: 24, position: 2 },
        temperature: "hot",
        rivalry: true
    },
    {
        id: 5,
        homeTeam: "Манчестер Сити",
        awayTeam: "Ливерпуль",
        homeScore: null,
        awayScore: null,
        time: "05.07 18:00",
        status: "upcoming",
        odds: {
            win: 2.80,
            draw: 3.50,
            lose: 2.40,
            over: 2.20,
            under: 1.65
        },
        finished: false,
        homeForm: "WDWWL",
        awayForm: "LWWDW",
        homeStats: { goals: 48, conceded: 21, position: 3 },
        awayStats: { goals: 52, conceded: 18, position: 2 },
        temperature: "hot",
        rivalry: true
    },
    {
        id: 6,
        homeTeam: "Бавария",
        awayTeam: "Боруссия Д",
        homeScore: null,
        awayScore: null,
        time: "06.07 20:00",
        status: "upcoming",
        odds: {
            win: 1.95,
            draw: 3.80,
            lose: 3.60,
            over: 1.90,
            under: 1.90
        },
        finished: false,
        homeForm: "WWWWL",
        awayForm: "DWLWW",
        homeStats: { goals: 67, conceded: 25, position: 1 },
        awayStats: { goals: 43, conceded: 29, position: 5 },
        temperature: "normal",
        rivalry: true
    },
    {
        id: 7,
        homeTeam: "ПСЖ",
        awayTeam: "Марсель",
        homeScore: 1,
        awayScore: 0,
        time: "01.07 21:00",
        status: "finished",
        odds: {
            win: 1.60,
            draw: 4.20,
            lose: 5.50,
            over: 2.30,
            under: 1.60
        },
        finished: true,
        homeForm: "WWWDW",
        awayForm: "LDLWL",
        homeStats: { goals: 71, conceded: 16, position: 1 },
        awayStats: { goals: 34, conceded: 38, position: 9 },
        temperature: "cold",
        rivalry: true
    },
    {
        id: 8,
        homeTeam: "Челси",
        awayTeam: "Арсенал",
        homeScore: null,
        awayScore: null,
        time: "07.07 17:30",
        status: "upcoming",
        odds: {
            win: 2.65,
            draw: 3.15,
            lose: 2.70,
            over: 2.05,
            under: 1.75
        },
        finished: false,
        homeForm: "WLWDW",
        awayForm: "WWWLL",
        homeStats: { goals: 39, conceded: 26, position: 6 },
        awayStats: { goals: 44, conceded: 31, position: 5 },
        temperature: "hot",
        rivalry: true
    },
    {
        id: 9,
        homeTeam: "Интер",
        awayTeam: "Милан",
        homeScore: null,
        awayScore: null,
        time: "07.07 19:45",
        status: "upcoming",
        odds: {
            win: 2.15,
            draw: 3.25,
            lose: 3.40,
            over: 2.45,
            under: 1.55
        },
        finished: false,
        homeForm: "WWDWW",
        awayForm: "WLDWL",
        homeStats: { goals: 55, conceded: 20, position: 2 },
        awayStats: { goals: 41, conceded: 28, position: 4 },
        temperature: "hot",
        rivalry: true
    },
    {
        id: 10,
        homeTeam: "Ювентус",
        awayTeam: "Наполи",
        homeScore: null,
        awayScore: null,
        time: "08.07 21:00",
        status: "upcoming",
        odds: {
            win: 2.90,
            draw: 3.10,
            lose: 2.55,
            over: 2.15,
            under: 1.70
        },
        finished: false,
        homeForm: "WDLWW",
        awayForm: "LWWWL",
        homeStats: { goals: 36, conceded: 24, position: 7 },
        awayStats: { goals: 49, conceded: 22, position: 3 },
        temperature: "normal",
        rivalry: false
    }
];

const toursData = {
    1: {
        name: "Тур 1 - Российская Премьер-лига",
        deadline: "03 июля, 16:00",
        matches: [1, 2, 3]
    },
    2: {
        name: "Тур 2 - Топ-чемпионаты", 
        deadline: "06 июля, 16:00",
        matches: [4, 5, 6, 7, 8]
    },
    3: {
        name: "Тур 3 - Серия А",
        deadline: "08 июля, 16:00", 
        matches: [9, 10]
    }
};

const teamLogos = {
    "ЦСКА": "🔴",
    "Зенит": "🔵", 
    "Спартак": "🔴",
    "Локомотив": "🚂",
    "Динамо": "💙",
    "Краснодар": "🟢",
    "Реал Мадрид": "👑",
    "Барселона": "🔴",
    "Манчестер Сити": "💙",
    "Ливерпуль": "🔴",
    "Бавария": "🔴",
    "Боруссия Д": "🟡",
    "ПСЖ": "🔵",
    "Марсель": "💙",
    "Челси": "🔵",
    "Арсенал": "🔴",
    "Интер": "🖤",
    "Милан": "❤️",
    "Ювентус": "⚪",
    "Наполи": "💙"
}; 