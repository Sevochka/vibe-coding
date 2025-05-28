document.addEventListener('DOMContentLoaded', function() {
    // Переключение между букмекерами
    const bookmakerTabs = document.querySelectorAll('.bookmaker-tab');
    const bookmakerContents = document.querySelectorAll('.bookmaker-content');
    const betOdds = document.querySelectorAll('.bet-odds');
    
    bookmakerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const bookmaker = this.getAttribute('data-bookmaker');
            
            // Обновляем активную вкладку
            bookmakerTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем активный контент
            bookmakerContents.forEach(content => {
                if (content.getAttribute('data-bookmaker') === bookmaker) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Обновляем коэффициенты
            updateOdds(bookmaker);
        });
    });
    
    // Функция обновления коэффициентов в зависимости от выбранного букмекера
    function updateOdds(bookmaker) {
        const bookmakerData = matchData.bettingOdds.find(b => {
            if (bookmaker === 'fonbet' && b.line1x2.bonusURL.includes('fon.bet')) return true;
            if (bookmaker === 'pari' && b.line1x2.bonusURL.includes('pari.ru')) return true;
            if (bookmaker === 'winline' && b.line1x2.bonusURL.includes('winline')) return true;
            return false;
        }) || matchData.bettingOdds[0]; // По умолчанию первый букмекер
        
        // Обновляем коэффициенты
        const oddsElements = document.querySelectorAll('.bet-odds');
        oddsElements.forEach(element => {
            if (element.parentElement.querySelector('.bet-type').textContent === 'П1') {
                element.textContent = bookmakerData.line1x2.h.toFixed(2);
            } else if (element.parentElement.querySelector('.bet-type').textContent === 'X') {
                element.textContent = bookmakerData.line1x2.x.toFixed(2);
            } else if (element.parentElement.querySelector('.bet-type').textContent === 'П2') {
                element.textContent = bookmakerData.line1x2.a.toFixed(2);
            }
        });
    }
    
    // Клик на коэффициент
    betOdds.forEach(odd => {
        odd.addEventListener('click', function() {
            const activeBookmaker = document.querySelector('.bookmaker-tab.active').getAttribute('data-bookmaker');
            const betType = this.parentElement.querySelector('.bet-type').textContent;
            const odds = this.textContent;
            
            // Находим активную вкладку букмекера
            const bookmakerContent = document.querySelector(`.bookmaker-content[data-bookmaker="${activeBookmaker}"]`);
            const bonusLink = bookmakerContent.querySelector('.bet-now-button');
            
            // Открываем ссылку на сайт букмекера
            if (bonusLink && bonusLink.getAttribute('href') !== '#') {
                window.open(bonusLink.getAttribute('href'), '_blank');
            }
        });
    });
}); 