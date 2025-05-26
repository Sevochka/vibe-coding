// Скрипт для интерактивного хоккейного виджета Sports.ru
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏒 Хоккейный виджет Sports.ru загружен!');
    
    // Инициализация всех функций
    initAnimations();
    initInteractivity();
    initCounters();
    initTooltips();
    initLiveUpdates();
    
    // Логирование загрузки данных
    if (typeof teamsData !== 'undefined') {
        console.log('📊 Данные команд загружены:', teamsData.match.tournament);
    }
    
    if (typeof bookmakersData !== 'undefined') {
        console.log('💰 Данные букмекеров загружены:', bookmakersData.bookmakers.length, 'букмекеров');
    }
});

// Инициализация анимаций при скролле
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
                
                // Запуск счетчиков для статистики
                if (entry.target.classList.contains('stat-fill')) {
                    animateStatBar(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Наблюдение за элементами для анимации
    document.querySelectorAll('.factoid-card, .bookmaker-card, .stat-fill, .promo-banner').forEach(el => {
        observer.observe(el);
    });
}

// Анимация заполнения статистических полос
function animateStatBar(element) {
    const finalWidth = element.style.width;
    element.style.width = '0%';
    
    setTimeout(() => {
        element.style.transition = 'width 1.5s ease-out';
        element.style.width = finalWidth;
    }, 100);
}

// Инициализация интерактивности
function initInteractivity() {
    // Обработчики кликов по кнопкам ставок
    document.querySelectorAll('.bet-button').forEach(button => {
        button.addEventListener('click', handleBetClick);
        button.addEventListener('mouseenter', createRippleEffect);
    });

    // Обработчики кликов по карточкам букмекеров
    document.querySelectorAll('.bookmaker-card').forEach(card => {
        card.addEventListener('click', handleBookmakerClick);
        card.addEventListener('mouseenter', handleCardHover);
    });

    // Обработчик промо-баннера
    const promoCta = document.querySelector('.promo-cta');
    if (promoCta) {
        promoCta.addEventListener('click', handlePromoClick);
    }

    // Обработчики логотипов команд
    document.querySelectorAll('.team-logo').forEach(logo => {
        logo.addEventListener('click', handleTeamLogoClick);
    });

    // Обработчики фактоидов
    document.querySelectorAll('.factoid-card').forEach(card => {
        card.addEventListener('click', handleFactoidClick);
    });
}

// Обработчик клика по кнопке ставки
function handleBetClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const bookmakerCard = button.closest('.bookmaker-card');
    const bookmakerName = bookmakerCard.querySelector('.bookmaker-info h4').textContent;
    
    // Анимация клика
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);

    // Показать уведомление
    showNotification(`Переход к ${bookmakerName}`, 'success');
    
    // Аналитика
    trackEvent('bet_button_click', {
        bookmaker: bookmakerName,
        widget: 'hockey-match'
    });

    console.log(`🎯 Клик по кнопке ставки: ${bookmakerName}`);
}

// Создание эффекта ripple для кнопок
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Обработчик клика по карточке букмекера
function handleBookmakerClick(event) {
    if (event.target.closest('.bet-button')) return;
    
    const card = event.currentTarget;
    const bookmakerName = card.querySelector('.bookmaker-info h4').textContent;
    
    // Эффект выделения
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);

    console.log(`🏢 Клик по карточке букмекера: ${bookmakerName}`);
}

// Обработчик наведения на карточку
function handleCardHover(event) {
    const card = event.currentTarget;
    
    // Добавляем динамичную тень
    card.style.boxShadow = '0 20px 60px rgba(0, 199, 139, 0.15)';
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    }, { once: true });
}

// Обработчик клика по промо-баннеру
function handlePromoClick(event) {
    event.preventDefault();
    
    // Анимация пульса
    const cta = event.currentTarget;
    cta.style.animation = 'pulse 0.5s ease-out';
    
    setTimeout(() => {
        cta.style.animation = '';
    }, 500);

    showNotification('Промо-предложение активировано!', 'success');
    
    trackEvent('promo_click', {
        offer: 'nhl-playoff-bonus',
        widget: 'hockey-match'
    });

    console.log('🎁 Клик по промо-предложению');
}

// Обработчик клика по логотипу команды
function handleTeamLogoClick(event) {
    const logo = event.currentTarget;
    const teamName = logo.closest('.team').querySelector('.team-name').textContent;
    
    // Анимация логотипа
    logo.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        logo.style.transform = '';
    }, 600);

    showNotification(`Информация о команде: ${teamName}`, 'info');
    
    console.log(`⚽ Клик по логотипу команды: ${teamName}`);
}

// Обработчик клика по фактоиду
function handleFactoidClick(event) {
    const card = event.currentTarget;
    const title = card.querySelector('h4').textContent;
    
    // Анимация карточки
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = '';
    }, 300);

    showNotification(`Интересный факт: ${title}`, 'info');
    
    console.log(`📊 Клик по фактоиду: ${title}`);
}

// Инициализация счетчиков
function initCounters() {
    const counters = document.querySelectorAll('.team-score, .stat-values');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Анимация счетчика
function animateCounter(element) {
    const text = element.textContent;
    const numbers = text.match(/\d+/g);
    
    if (numbers) {
        const finalNumber = parseInt(numbers[0]);
        let currentNumber = 0;
        const increment = finalNumber / 30;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                element.textContent = text;
                clearInterval(timer);
            } else {
                element.textContent = text.replace(numbers[0], Math.floor(currentNumber));
            }
        }, 50);
    }
}

// Инициализация подсказок
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Показ подсказки
function showTooltip(event) {
    const element = event.currentTarget;
    const text = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
    });
    
    element._tooltip = tooltip;
}

// Скрытие подсказки
function hideTooltip(event) {
    const element = event.currentTarget;
    if (element._tooltip) {
        element._tooltip.style.opacity = '0';
        setTimeout(() => {
            if (element._tooltip) {
                element._tooltip.remove();
                delete element._tooltip;
            }
        }, 300);
    }
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Имитация live-обновлений
function initLiveUpdates() {
    // Обновление коэффициентов каждые 30 секунд
    setInterval(updateOdds, 30000);
    
    // Обновление статистики каждые 60 секунд
    setInterval(updateStats, 60000);
}

// Обновление коэффициентов
function updateOdds() {
    const oddsElements = document.querySelectorAll('.odds-value');
    
    oddsElements.forEach(element => {
        const currentOdds = parseFloat(element.textContent);
        const variation = (Math.random() - 0.5) * 0.1; // ±0.05 изменение
        const newOdds = Math.max(1.1, currentOdds + variation);
        
        // Анимация изменения
        element.style.background = variation > 0 ? '#4CAF50' : '#F44336';
        element.style.color = 'white';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newOdds.toFixed(2);
            setTimeout(() => {
                element.style.background = '';
                element.style.color = '';
            }, 1000);
        }, 150);
    });
    
    console.log('📈 Коэффициенты обновлены');
}

// Обновление статистики
function updateStats() {
    const statValues = document.querySelectorAll('.stat-values');
    
    statValues.forEach(element => {
        // Небольшие изменения в статистике
        const text = element.textContent;
        if (text.includes(' - ')) {
            const [home, away] = text.split(' - ');
            const homeNum = parseInt(home);
            const awayNum = parseInt(away);
            
            // Случайное небольшое изменение
            if (Math.random() > 0.7) {
                const newHome = homeNum + (Math.random() > 0.5 ? 1 : 0);
                const newAway = awayNum + (Math.random() > 0.5 ? 1 : 0);
                
                element.style.background = '#FF9800';
                element.style.transition = 'background 0.5s ease';
                
                setTimeout(() => {
                    element.textContent = `${newHome} - ${newAway}`;
                    setTimeout(() => {
                        element.style.background = '';
                    }, 1000);
                }, 250);
            }
        }
    });
    
    console.log('📊 Статистика обновлена');
}

// Отслеживание событий для аналитики
function trackEvent(eventName, properties = {}) {
    // Здесь можно интегрировать с реальной системой аналитики
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        properties: {
            ...properties,
            page: 'hockey-widget',
            userAgent: navigator.userAgent,
            referrer: document.referrer
        }
    };
    
    console.log('📈 Аналитика:', eventData);
    
    // Отправка в аналитическую систему (пример)
    // analytics.track(eventName, eventData);
}

// Добавление CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation-play-state: running !important;
    }
    
    .notification {
        font-family: var(--ui-font-family-body, 'Roboto', sans-serif);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Обработка ошибок
window.addEventListener('error', function(event) {
    console.error('❌ Ошибка в виджете:', event.error);
    trackEvent('widget_error', {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno
    });
});

// Отслеживание производительности
window.addEventListener('load', function() {
    const loadTime = performance.now();
    trackEvent('widget_loaded', {
        loadTime: Math.round(loadTime),
        readyState: document.readyState
    });
    
    console.log(`⚡ Виджет загружен за ${Math.round(loadTime)}ms`);
}); 