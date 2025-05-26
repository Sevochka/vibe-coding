const factoidsData = [
    {
        id: 1,
        type: 'head2head',
        teams: [
            {
                name: 'Флорида Пантерз',
                logo: 'https://pictures.cdn.sports.ru/1UIu10OYmR0unnrl1ZF4qAjNwdb5v02hxjcUUIewCDs/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Zsb3JpZGFfcGFudGhlcnMucG5n.png'
            },
            {
                name: 'Каролина Харрикейнз',
                logo: 'https://pictures.cdn.sports.ru/TFRGNM2iXuiJVhXNPi67z7qMkcidOaVMvP7ahq58LfY/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Nhcm9saW5hX2h1cnJpY2FuZXMucG5n.png'
            }
        ],
        text: 'Флорида – Каролина: Флорида побеждает в 3 последних очных матчах',
        betting: {
            bookmaker: 'Fonbet',
            logo: 'https://dumpster.cdn.sports.ru/5/21/a03c5a5beeaa5acd29418d04bb72d.svg',
            text: 'Флорида победит',
            coefficient: '1.95',
            link: 'https://sprts.cc/fonbet_factoid?erid=Pb3XmBtzswmhSZVgRhqcXojSZcuyLhBKLuPgY6U'
        }
    },
    {
        id: 2,
        type: 'team_form',
        teams: [
            {
                name: 'Каролина Харрикейнз',
                logo: 'https://pictures.cdn.sports.ru/TFRGNM2iXuiJVhXNPi67z7qMkcidOaVMvP7ahq58LfY/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Nhcm9saW5hX2h1cnJpY2FuZXMucG5n.png'
            }
        ],
        text: 'Каролина проигрывает в 3 последних матчах подряд',
        betting: {
            bookmaker: 'Fonbet',
            logo: 'https://dumpster.cdn.sports.ru/5/21/a03c5a5beeaa5acd29418d04bb72d.svg',
            text: 'Каролина не победит',
            coefficient: '1.65',
            link: 'https://sprts.cc/fonbet_factoid?erid=Pb3XmBtzswmhSZVgRhqcXojSZcuyLhBKLuPgY6U'
        }
    },
    {
        id: 3,
        type: 'team_form',
        teams: [
            {
                name: 'Флорида Пантерз',
                logo: 'https://pictures.cdn.sports.ru/1UIu10OYmR0unnrl1ZF4qAjNwdb5v02hxjcUUIewCDs/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Zsb3JpZGFfcGFudGhlcnMucG5n.png'
            }
        ],
        text: 'Флорида выигрывает в 4 последних матчах домашних матчах',
        betting: {
            bookmaker: 'Fonbet',
            logo: 'https://dumpster.cdn.sports.ru/5/21/a03c5a5beeaa5acd29418d04bb72d.svg',
            text: 'Флорида победит',
            coefficient: '1.95',
            link: 'https://sprts.cc/fonbet_factoid?erid=Pb3XmBtzswmhSZVgRhqcXojSZcuyLhBKLuPgY6U'
        }
    },
    {
        id: 4,
        type: 'goals',
        teams: [
            {
                name: 'Флорида Пантерз',
                logo: 'https://pictures.cdn.sports.ru/1UIu10OYmR0unnrl1ZF4qAjNwdb5v02hxjcUUIewCDs/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Zsb3JpZGFfcGFudGhlcnMucG5n.png'
            },
            {
                name: 'Каролина Харрикейнз',
                logo: 'https://pictures.cdn.sports.ru/TFRGNM2iXuiJVhXNPi67z7qMkcidOaVMvP7ahq58LfY/fill/600/600/no/1/czM6Ly9zcG9ydHMtYmFja2VuZC1zdGF0LXBpY3R1cmVzLXh3enltd3NyL0hPQ0tFWS9URUFNL2Nhcm9saW5hX2h1cnJpY2FuZXMucG5n.png'
            }
        ],
        text: 'В 4 из 5 последних матчей между командами забито больше 5.5 голов',
        betting: {
            bookmaker: 'Fonbet',
            logo: 'https://dumpster.cdn.sports.ru/5/21/a03c5a5beeaa5acd29418d04bb72d.svg',
            text: 'Тотал больше 5.5',
            coefficient: '2.10',
            link: 'https://sprts.cc/fonbet_factoid?erid=Pb3XmBtzswmhSZVgRhqcXojSZcuyLhBKLuPgY6U'
        }
    }
];

const motivationalPhrases = [
    "🔥 Горячие факты!",
    "⚡ Молниеносная статистика!",
    "🎯 Точная аналитика!",
    "💯 Проверенные данные!",
    "⭐ Звездная статистика!"
];

const additionalFacts = [
    {
        text: "Средняя результативность матчей Флориды дома - 6.2 гола",
        icon: "📊"
    },
    {
        text: "Каролина пропустила первыми в 67% выездных матчей",
        icon: "⚠️"
    },
    {
        text: "В последних 10 матчах между командами было 8 овертаймов",
        icon: "⏰"
    },
    {
        text: "Флорида выиграла 4 из 6 последних домашних матчей",
        icon: "🏠"
    }
]; 