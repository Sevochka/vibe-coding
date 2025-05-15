document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const teamCards = document.querySelectorAll('.team-card');
    const spartakPercentage = document.getElementById('spartak-percentage');
    const rostovPercentage = document.getElementById('rostov-percentage');
    const votingMessage = document.getElementById('voting-message');
    
    // Переменные для подсчета голосов
    let hasVoted = false;
    let spartakVotes = teamsData.spartak.votes;
    let rostovVotes = teamsData.rostov.votes;
    
    // Обновление процентов
    function updatePercentages() {
        const totalVotes = spartakVotes + rostovVotes;
        
        if (totalVotes > 0) {
            const spartakPercent = Math.round((spartakVotes / totalVotes) * 100);
            const rostovPercent = Math.round((rostovVotes / totalVotes) * 100);
            
            spartakPercentage.textContent = spartakPercent + '%';
            rostovPercentage.textContent = rostovPercent + '%';
            
            spartakPercentage.classList.add('visible');
            rostovPercentage.classList.add('visible');
        }
    }
    
    // Инициализация процентов при загрузке страницы
    function initPercentages() {
        // Проверяем, голосовал ли пользователь ранее
        const storedVote = localStorage.getItem('matchWinnerVote');
        
        if (storedVote) {
            hasVoted = true;
            
            // Отмечаем выбранную команду
            const selectedTeam = document.querySelector(`.team-card[data-team="${storedVote}"]`);
            if (selectedTeam) {
                selectedTeam.classList.add('selected');
            }
            
            // Показываем проценты
            updatePercentages();
            
            // Обновляем сообщение
            votingMessage.textContent = 'Спасибо за ваш голос!';
            votingMessage.classList.add('voted');
        }
    }
    
    // Обработчик клика по команде
    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            if (hasVoted) return;
            
            const teamName = card.getAttribute('data-team');
            
            // Увеличиваем счетчик голосов
            if (teamName === 'spartak') {
                spartakVotes++;
            } else if (teamName === 'rostov') {
                rostovVotes++;
            }
            
            // Сохраняем выбор пользователя
            localStorage.setItem('matchWinnerVote', teamName);
            
            // Отмечаем выбранную команду
            card.classList.add('selected');
            
            // Показываем проценты
            updatePercentages();
            
            // Обновляем статус
            hasVoted = true;
            
            // Обновляем сообщение
            votingMessage.textContent = 'Спасибо за ваш голос!';
            votingMessage.classList.add('voted');
        });
    });
    
    // Инициализация при загрузке страницы
    initPercentages();
}); 