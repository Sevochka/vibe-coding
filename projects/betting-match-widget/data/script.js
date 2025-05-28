document.addEventListener('DOMContentLoaded', function() {
    // Коэффициенты
    const betOdds = document.querySelectorAll('.bet-odds');
    
    // Клик на коэффициент
    betOdds.forEach(odd => {
        odd.addEventListener('click', function() {
            const bookmaker = this.getAttribute('data-bookmaker');
            const betType = this.getAttribute('data-bet-type');
            const odds = this.textContent;
            
            // URL для перехода на линию Фонбета с выбранным типом ставки
            let betUrl = "https://fon.bet?deepLink=start_auth_process&promoAlias=fb15k&eventId=55260400";
            
            // Добавляем параметр выбранного типа ставки
            if (betType) {
                betUrl += `&outcome=${betType}`;
            }
            
            // Добавляем UTM-метки
            betUrl += "&utm_source=sports.ru&utm_medium=cpc&utm_campaign=all_base&utm_content=odds&utm_term=button";
            
            // Открываем ссылку на сайт букмекера
            window.open(betUrl, '_blank');
        });
    });
}); 