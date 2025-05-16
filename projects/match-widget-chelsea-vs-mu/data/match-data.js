const matchData = {
    league: "АПЛ",
    date: "16 мая 2025",
    teams: {
        home: {
            name: "Челси",
            shortName: "Челси",
            logo: "https://img.sports.ru/storage/teams/0/101/chelsea.png",
            url: "https://www.sports.ru/chelsea/",
            winProbability: 47
        },
        away: {
            name: "Манчестер Юнайтед",
            shortName: "МЮ",
            logo: "https://img.sports.ru/storage/teams/0/52/manchester-united.png",
            url: "https://www.sports.ru/manchester-united/",
            winProbability: 33
        }
    },
    matchUrl: "https://www.sports.ru/football/match/chelsea-vs-mu/"
};

// Для возможного динамического обновления вероятностей
document.addEventListener('DOMContentLoaded', function() {
    // Можно добавить здесь логику для динамического обновления данных
    console.log('Виджет матча загружен:', matchData);
}); 