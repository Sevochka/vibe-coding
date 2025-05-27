// Функция для генерации случайных результатов оставшихся матчей
function generateResults() {
    // Использую первые 10 туров из реальных данных
    const existingResults = results.slice(0, 10);
    
    // Генерирую результаты для оставшихся 28 туров
    const allTeams = teams.map(team => team.id);
    
    // Функция для создания пар матчей (каждый с каждым)
    function generateFixtures(teamList) {
        const fixtures = [];
        for (let i = 0; i < teamList.length; i++) {
            for (let j = i + 1; j < teamList.length; j++) {
                fixtures.push({
                    home: teamList[i],
                    away: teamList[j]
                });
            }
        }
        return fixtures;
    }
    
    // Создаём полный список всех возможных матчей (для домашних и выездных игр)
    const allFixtures = generateFixtures(allTeams);
    const reverseFixtures = allFixtures.map(match => ({
        home: match.away,
        away: match.home
    }));
    
    // Объединяем все возможные матчи
    const allPossibleMatches = [...allFixtures, ...reverseFixtures];
    
    // Отфильтровываем уже сыгранные матчи
    const playedMatches = new Set();
    existingResults.forEach(week => {
        week.matches.forEach(match => {
            const key = `${match.home}-${match.away}`;
            playedMatches.add(key);
        });
    });
    
    const remainingMatches = allPossibleMatches.filter(match => {
        const key = `${match.home}-${match.away}`;
        return !playedMatches.has(key);
    });
    
    // Перемешиваем оставшиеся матчи
    for (let i = remainingMatches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingMatches[i], remainingMatches[j]] = [remainingMatches[j], remainingMatches[i]];
    }
    
    // Распределяем матчи по оставшимся турам (10-38)
    const matchesPerWeek = 10; // Количество матчей в каждом туре
    const remainingWeeks = [];
    
    for (let week = 11; week <= 38; week++) {
        const weekMatches = remainingMatches.splice(0, matchesPerWeek);
        
        // Генерируем случайные счета для каждого матча
        const matchesWithScores = weekMatches.map(match => {
            // Домашние команды обычно забивают немного больше, учитываем фактор домашнего поля
            const homeGoals = Math.floor(Math.random() * 4);
            const awayGoals = Math.floor(Math.random() * 3);
            return {
                ...match,
                score: [homeGoals, awayGoals]
            };
        });
        
        remainingWeeks.push({
            week,
            matches: matchesWithScores
        });
    }
    
    // Объединяем существующие и сгенерированные результаты
    return [...existingResults, ...remainingWeeks];
}

// Генерируем полный набор результатов
const fullResults = generateResults();

// Выводим в консоль для копирования
console.log(JSON.stringify(fullResults, null, 2)); 