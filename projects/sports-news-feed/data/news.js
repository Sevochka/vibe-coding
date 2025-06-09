// Данные спортивных новостей Sports.ru
const sportsNews = [
    {
        id: 1,
        time: "16:45",
        datetime: "2024-12-19T16:45:00",
        content: `Криштиану Роналду <a href="https://www.sports.ru/football/1147862346-ronaldu-zabivayut-i-v-39-let-portugalec-oformil-khyet-trik-v-matche-protiv-al-dukhayla.html" target="_blank">оформил хет-трик</a> в матче против «Аль-Духайля». Португалец показал, что возраст – не помеха для забивания голов в Саудовской Аравии.`,
        category: "Футбол",
        reactions: ["⚽", "👑", "🔥"],
        priority: "high"
    },
    {
        id: 2,
        time: "16:30",
        datetime: "2024-12-19T16:30:00",
        content: `Сборная России по хоккею <a href="https://www.sports.ru/hockey/1147862340-sbornaya-rossii-pobedila-kanadu-v-finalni-olimpiadi-2024.html" target="_blank">одержала победу</a> над Канадой в финале чемпионата мира. Российские хоккеисты показали великолепную игру в обороне.`,
        category: "Хоккей", 
        reactions: ["🏒", "🥇", "🎉"],
        priority: "high"
    },
    {
        id: 3,
        time: "16:12",
        datetime: "2024-12-19T16:12:00",
        content: `Александр Усик <a href="https://www.sports.ru/boxing/1147862335-usik-zashchitil-tituli-chempiona-mira-v-tyazhelom-vese.html" target="_blank">защитил титулы</a> чемпiona мира в тяжёлом весе, нокаутировав соперника в 8-м раунде. Украинский боксёр остаётся непобеждённым.`,
        category: "Бокс",
        reactions: ["🥊", "💪", "👏"],
        priority: "high"
    },
    {
        id: 4,
        time: "15:58",
        datetime: "2024-12-19T15:58:00",
        content: `«Зенит» <a href="https://www.sports.ru/football/1147862330-zenit-oformil-dosrochnoe-chempionstvo-rpl.html" target="_blank">досрочно стал чемпионом</a> РПЛ сезона 2024/25. Петербуржцы обеспечили себе золотые медали за три тура до окончания первенства.`,
        category: "Футбол",
        reactions: ["⚽", "🏆", "💙"],
        priority: "high"
    },
    {
        id: 5,
        time: "15:41",
        datetime: "2024-12-19T15:41:00",
        content: `Никита Кучеров <a href="https://www.sports.ru/hockey/1147862325-kucherov-nabral-100-ochkov-v-sezone-nhl.html" target="_blank">набрал 100 очков</a> в сезоне НХЛ. Российский форвард «Тампы» стал третьим игроком в истории клуба, достигшим этой отметки.`,
        category: "Хоккей",
        reactions: ["🏒", "💯", "⚡"],
        priority: "medium"
    },
    {
        id: 6,
        time: "15:23",
        datetime: "2024-12-19T15:23:00",
        content: `Сборная России по футболу <a href="https://www.sports.ru/football/1147862320-sbornaya-rossii-pobedila-brazil-v-tovarishcheskom-matche.html" target="_blank">обыграла Бразилию</a> в товарищеском матче со счётом 2:1. Голы забили Захарян и Миранчук на «Лужниках».`,
        category: "Футбол",
        reactions: ["⚽", "🇷🇺", "🎯"],
        priority: "high"
    },
    {
        id: 7,
        time: "15:07",
        datetime: "2024-12-19T15:07:00",
        content: `Даниил Медведев <a href="https://www.sports.ru/tennis/1147862315-medvedev-proshel-v-final-masters-v-indials-uells.html" target="_blank">прошёл в финал</a> турнира Masters в Индиан-Уэллсе, обыграв в полуфинале Новака Джоковича в трёх сетах.`,
        category: "Теннис",
        reactions: ["🎾", "🔥", "👑"],
        priority: "medium"
    },
    {
        id: 8,
        time: "14:52",
        datetime: "2024-12-19T14:52:00",
        content: `ЦСКА <a href="https://www.sports.ru/basketball/1147862310-cska-pobedil-real-v-final-evroligui.html" target="_blank">обыграл «Реал»</a> в финале Евролиги по баскетболу. Армейцы завоевали свой 9-й титул в главном европейском турнире.`,
        category: "Баскетбол",
        reactions: ["🏀", "🏆", "🔴"],
        priority: "high"
    },
    {
        id: 9,
        time: "14:35",
        datetime: "2024-12-19T14:35:00",
        content: `Сергей Карякин <a href="https://www.sports.ru/chess/1147862305-karyakin-stal-chempionom-mira-po-blitsshakmatam.html" target="_blank">стал чемпионом мира</a> по блиц-шахматам, обыграв в финале Магнуса Карлсена. Россиянин показал феноменальную скорость игры.`,
        category: "Шахматы",
        reactions: ["♟️", "⚡", "🧠"],
        priority: "medium"
    },
    {
        id: 10,
        time: "14:18",
        datetime: "2024-12-19T14:18:00",
        content: `Сборная России по биатлону <a href="https://www.sports.ru/biathlon/1147862300-sbornaya-rossii-vyigrala-smeshannuyu-estafetu.html" target="_blank">выиграла смешанную эстафету</a> на этапе Кубка мира в Хохфильцене. Команда показала отличную стрельбу.`,
        category: "Биатлон",
        reactions: ["🎿", "🎯", "🥇"],
        priority: "medium"
    },
    {
        id: 11,
        time: "14:02",
        datetime: "2024-12-19T14:02:00",
        content: `«Спартак» <a href="https://www.sports.ru/football/1147862295-spartak-priobrel-braziiskogo-napadayushchego.html" target="_blank">приобрёл бразильского нападающего</a> Габриэла Барбозу за 25 миллионов евро. Красно-белые усилили атакующую линию.`,
        category: "Футбол",
        reactions: ["⚽", "💰", "❤️"],
        priority: "medium"
    },
    {
        id: 12,
        time: "13:47",
        datetime: "2024-12-19T13:47:00",
        content: `Хабиб Нурмагомедов <a href="https://www.sports.ru/mma/1147862290-khabib-vernetsya-v-oktagon-protiv-mcgregora.html" target="_blank">объявил о возвращении</a> в октагон для боя с Конором Макгрегором. Реванш состоится в мае 2025 года в Лас-Вегасе.`,
        category: "MMA",
        reactions: ["🥊", "🦅", "🔥"],
        priority: "high"
    }
];

// Категории спорта для фильтрации
const sportsCategories = [
    { id: 'football', name: 'Футбол', emoji: '⚽', color: '#00c78b' },
    { id: 'hockey', name: 'Хоккей', emoji: '🏒', color: '#235bff' },
    { id: 'basketball', name: 'Баскетбол', emoji: '🏀', color: '#ff003c' },
    { id: 'tennis', name: 'Теннис', emoji: '🎾', color: '#ffc300' },
    { id: 'boxing', name: 'Бокс', emoji: '🥊', color: '#d26e00' },
    { id: 'mma', name: 'MMA', emoji: '🥊', color: '#171717' },
    { id: 'biathlon', name: 'Биатлон', emoji: '🎿', color: '#00a0f0' },
    { id: 'chess', name: 'Шахматы', emoji: '♟️', color: '#4a4a4a' }
];

// Функция для получения новостей по категории
function getNewsByCategory(category) {
    if (!category || category === 'all') {
        return sportsNews;
    }
    
    const categoryName = sportsCategories.find(cat => cat.id === category)?.name;
    if (!categoryName) {
        return sportsNews;
    }
    
    return sportsNews.filter(news => news.category === categoryName);
}

// Функция для получения последних новостей
function getLatestNews(count = 10) {
    return sportsNews
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, count);
}

// Функция для получения популярных новостей
function getPopularNews() {
    return sportsNews.filter(news => news.priority === 'high');
}

// Функция для форматирования времени
function formatNewsTime(datetime) {
    const date = new Date(datetime);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
        return diffMinutes === 0 ? 'только что' : `${diffMinutes} мин. назад`;
    } else if (diffMinutes < 24 * 60) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours} ч. назад`;
    } else {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
} 