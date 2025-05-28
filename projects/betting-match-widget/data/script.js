document.addEventListener('DOMContentLoaded', function() {
    // Данные по коэффициентам для разных букмекеров
    const bookmakerOdds = {
        fonbet: {
            homeWin: 2.10,
            draw: 3.65,
            awayWin: 3.25
        },
        pari: {
            homeWin: 2.20,
            draw: 3.50,
            awayWin: 3.30
        },
        winline: {
            homeWin: 2.15,
            draw: 3.55,
            awayWin: 3.20
        },
        betcity: {
            homeWin: 2.18,
            draw: 3.60,
            awayWin: 3.28
        }
    };

    // Получаем все вкладки букмекеров
    const bookmakerTabs = document.querySelectorAll('.bookmaker-tab');
    const bookmakerContents = document.querySelectorAll('.bookmaker-content');
    
    // Элементы с коэффициентами
    const homeWinOdds = document.getElementById('home-win-odds');
    const drawOdds = document.getElementById('draw-odds');
    const awayWinOdds = document.getElementById('away-win-odds');

    // Устанавливаем начальные коэффициенты (Фонбет)
    updateOdds('fonbet');

    // Обработка кликов по вкладкам букмекеров
    bookmakerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс со всех вкладок и контента
            bookmakerTabs.forEach(t => t.classList.remove('active'));
            bookmakerContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс к выбранной вкладке
            this.classList.add('active');
            
            // Получаем ID букмекера
            const bookmaker = this.getAttribute('data-bookmaker');
            
            // Активируем соответствующий контент
            const content = document.getElementById(`${bookmaker}-content`);
            content.classList.add('active');
            
            // Обновляем коэффициенты
            updateOdds(bookmaker);
        });
    });

    // Функция обновления коэффициентов
    function updateOdds(bookmaker) {
        homeWinOdds.textContent = bookmakerOdds[bookmaker].homeWin.toFixed(2);
        drawOdds.textContent = bookmakerOdds[bookmaker].draw.toFixed(2);
        awayWinOdds.textContent = bookmakerOdds[bookmaker].awayWin.toFixed(2);
    }

    // Обработка кликов по коэффициентам
    homeWinOdds.addEventListener('click', function() {
        const activeBookmaker = document.querySelector('.bookmaker-tab.active').getAttribute('data-bookmaker');
        window.open(document.querySelector(`#${activeBookmaker}-content a`).href, '_blank');
    });

    drawOdds.addEventListener('click', function() {
        const activeBookmaker = document.querySelector('.bookmaker-tab.active').getAttribute('data-bookmaker');
        window.open(document.querySelector(`#${activeBookmaker}-content a`).href, '_blank');
    });

    awayWinOdds.addEventListener('click', function() {
        const activeBookmaker = document.querySelector('.bookmaker-tab.active').getAttribute('data-bookmaker');
        window.open(document.querySelector(`#${activeBookmaker}-content a`).href, '_blank');
    });
}); 