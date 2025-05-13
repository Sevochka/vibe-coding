document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, загружены ли данные матча
    if (typeof matchData === 'undefined') {
        console.error('Данные матча не найдены');
        return;
    }

    try {
        // Получаем данные о матче
        const match = matchData.data.statQueries.football.match;
        
        // Форматируем дату и время
        const matchDate = formatMatchDate(match.scheduledAt);
        document.querySelector('.match-date').textContent = matchDate;
        
        // Получаем коэффициенты букмекеров
        updateOdds(match.bettingOdds);
        
        // Обновляем ссылку на трансляцию
        if (match.links && match.links.sportsRu) {
            document.querySelector('.watch-button').href = 'https://www.sports.ru' + match.links.sportsRu;
        }
    } catch (error) {
        console.error('Ошибка при обработке данных матча:', error);
    }
});

/**
 * Форматирует дату и время матча
 * @param {string} dateString - ISO строка даты
 * @return {string} Отформатированная дата и время
 */
function formatMatchDate(dateString) {
    const date = new Date(dateString);
    
    // Получаем день месяца
    const day = date.getDate();
    
    // Получаем месяц в виде текста
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = months[date.getMonth()];
    
    // Получаем год
    const year = date.getFullYear();
    
    // Получаем часы и минуты
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    // Добавляем ведущий ноль к минутам, если необходимо
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    
    return `${day} ${month} ${year} | ${hours}:${minutes} МСК`;
}

/**
 * Обновляет коэффициенты букмекеров на странице
 * @param {Array} odds - Массив с коэффициентами
 */
function updateOdds(odds) {
    // Собираем коэффициенты нужных букмекеров
    let fonbetOdds, betcityOdds, winlineOdds;
    
    odds.forEach(odd => {
        const bookmaker = odd.bookmaker.id;
        
        if (bookmaker === 'FONBET') {
            fonbetOdds = odd.line1x2;
        } else if (bookmaker === 'BETCITY') {
            betcityOdds = odd.line1x2;
        } else if (bookmaker === 'WINLINE') {
            winlineOdds = odd.line1x2;
        }
    });
    
    // Обновляем коэффициенты на странице
    const oddsElements = document.querySelectorAll('.odds-value');
    
    // П1 - Победа Севильи (хозяева) - Фонбет
    if (fonbetOdds && oddsElements[0]) {
        oddsElements[0].innerHTML = `<span class="bookie-logo fonbet"></span>${fonbetOdds.h.toFixed(2)}`;
    }
    
    // X - Ничья - Бетсити
    if (betcityOdds && oddsElements[1]) {
        oddsElements[1].innerHTML = `<span class="bookie-logo betcity"></span>${betcityOdds.x.toFixed(2)}`;
    }
    
    // П2 - Победа Лас-Пальмаса (гости) - Винлайн
    if (winlineOdds && oddsElements[2]) {
        oddsElements[2].innerHTML = `<span class="bookie-logo winline"></span>${winlineOdds.a.toFixed(2)}`;
    }
} 