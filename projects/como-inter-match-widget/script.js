class ComoInterWidget {
    constructor() {
        this.selectedOdd = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateWidgetData();
        this.startTimeUpdater();
    }

    bindEvents() {
        // Обработчик кликов по коэффициентам
        const oddsItems = document.querySelectorAll('.odds-item');
        oddsItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectOdd(e.currentTarget);
            });
        });

        // Обработчик кнопки трансляции
        const watchBtn = document.getElementById('watchBtn');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                this.openBroadcast();
            });
        }

        // Добавляем эффекты наведения
        this.addHoverEffects();
    }

    selectOdd(oddElement) {
        // Убираем выделение с предыдущего элемента
        document.querySelectorAll('.odds-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Выделяем выбранный элемент
        oddElement.classList.add('selected');
        
        const outcome = oddElement.dataset.outcome;
        const value = oddElement.querySelector('.odds-value').textContent;
        
        this.selectedOdd = {
            outcome,
            value
        };

        // Показываем уведомление
        this.showNotification(`Выбран исход: ${this.getOutcomeText(outcome)} (${value})`);
        
        // Отправляем аналитику
        this.trackOddSelection(outcome, value);
    }

    getOutcomeText(outcome) {
        const outcomes = {
            'home': 'Победа Комо',
            'draw': 'Ничья',
            'away': 'Победа Интера'
        };
        return outcomes[outcome] || outcome;
    }

    openBroadcast() {
        // Имитируем открытие трансляции
        this.showNotification('Переход к трансляции матча...', 'success');
        
        // В реальном приложении здесь был бы переход на страницу трансляции
        setTimeout(() => {
            window.open(matchData.match.broadcast.link, '_blank');
        }, 1000);
        
        this.trackBroadcastClick();
    }

    updateWidgetData() {
        // Обновляем данные из matchData, если нужно
        const timeElement = document.querySelector('.time-text');
        const dateElement = document.querySelector('.date-text');
        
        if (timeElement && matchData.match.datetime.displayTime) {
            timeElement.textContent = matchData.match.datetime.displayTime;
        }
        
        if (dateElement && matchData.match.datetime.displayDate) {
            dateElement.textContent = matchData.match.datetime.displayDate;
        }

        // Обновляем информацию о стадионе
        const venueInfo = document.querySelector('.venue-info');
        if (venueInfo && matchData.match.venue.name) {
            venueInfo.textContent = `Стадион: ${matchData.match.venue.name}`;
        }

        // Обновляем прогноз
        const predictionInfo = document.querySelector('.prediction-info');
        if (predictionInfo && matchData.match.prediction.result) {
            predictionInfo.textContent = `Прогноз: ${matchData.match.prediction.result}`;
        }
    }

    startTimeUpdater() {
        // Обновляем время до начала матча каждую минуту
        setInterval(() => {
            this.updateTimeToMatch();
        }, 60000);
        
        // Первое обновление
        this.updateTimeToMatch();
    }

    updateTimeToMatch() {
        const matchTime = new Date(`${matchData.match.datetime.date}T${matchData.match.datetime.time}:00`);
        const now = new Date();
        const timeDiff = matchTime - now;

        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            let timeText = '';
            if (days > 0) {
                timeText = `${days}д ${hours}ч`;
            } else if (hours > 0) {
                timeText = `${hours}ч ${minutes}м`;
            } else {
                timeText = `${minutes}м`;
            }

            // Обновляем отображение времени до матча
            const timeElement = document.querySelector('.time-text');
            if (timeElement && timeDiff < 24 * 60 * 60 * 1000) { // Если до матча меньше суток
                timeElement.textContent = `через ${timeText}`;
                timeElement.style.color = 'var(--sports-red-a700)';
            }
        }
    }

    addHoverEffects() {
        const widget = document.querySelector('.match-widget');
        
        // Добавляем тонкие анимации при наведении
        widget.addEventListener('mouseenter', () => {
            widget.style.transform = 'translateY(-2px)';
            widget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
        });

        widget.addEventListener('mouseleave', () => {
            widget.style.transform = 'translateY(0)';
            widget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    }

    showNotification(message, type = 'info') {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--sports-primary-color)' : 'var(--sports-grey-800)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: var(--ui-font-family-body);
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    trackOddSelection(outcome, value) {
        // Отправляем аналитику выбора коэффициента
        console.log('Analytics: Odd selected', {
            match: matchData.match.id,
            outcome,
            value,
            timestamp: new Date().toISOString()
        });
    }

    trackBroadcastClick() {
        // Отправляем аналитику клика по трансляции
        console.log('Analytics: Broadcast clicked', {
            match: matchData.match.id,
            timestamp: new Date().toISOString()
        });
    }

    // Метод для обновления коэффициентов в реальном времени
    updateOdds(newOdds) {
        const oddsElements = {
            home: document.querySelector('[data-outcome="home"] .odds-value'),
            draw: document.querySelector('[data-outcome="draw"] .odds-value'),
            away: document.querySelector('[data-outcome="away"] .odds-value')
        };

        if (newOdds.homeWin && oddsElements.home) {
            oddsElements.home.textContent = newOdds.homeWin.toFixed(2);
            this.animateOddsChange(oddsElements.home);
        }

        if (newOdds.draw && oddsElements.draw) {
            oddsElements.draw.textContent = newOdds.draw.toFixed(2);
            this.animateOddsChange(oddsElements.draw);
        }

        if (newOdds.awayWin && oddsElements.away) {
            oddsElements.away.textContent = newOdds.awayWin.toFixed(2);
            this.animateOddsChange(oddsElements.away);
        }
    }

    animateOddsChange(element) {
        element.style.color = 'var(--sports-yellow-A700)';
        element.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            element.style.color = '';
            element.style.transform = 'scale(1)';
        }, 500);
    }

    // Метод для получения статистики виджета
    getWidgetStats() {
        return {
            selectedOdd: this.selectedOdd,
            matchData: matchData.match,
            viewTime: Date.now() - this.startTime
        };
    }
}

// Инициализируем виджет при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.comoInterWidget = new ComoInterWidget();
});

// Функция для обновления виджета извне
window.updateMatchWidget = function(newData) {
    if (window.comoInterWidget && newData) {
        if (newData.odds) {
            window.comoInterWidget.updateOdds(newData.odds);
        }
        
        console.log('Widget updated with new data:', newData);
    }
}; 