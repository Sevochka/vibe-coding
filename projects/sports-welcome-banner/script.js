document.addEventListener('DOMContentLoaded', function() {
    // Инициализация баннера
    initBanner();
    
    // Добавление интерактивности
    addInteractivity();
    
    // Запуск дополнительных анимаций
    startAnimations();
    
    // Отслеживание взаимодействий
    trackInteractions();
});

function initBanner() {
    console.log('Sports Welcome Banner инициализирован');
    
    // Создание дополнительных анимационных элементов
    createParticles();
    
    // Инициализация счетчиков
    initCounters();
}

function createParticles() {
    const container = document.querySelector('.background-animation');
    
    // Создание светящихся частиц
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 195, 0, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat ${Math.random() * 3 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            box-shadow: 0 0 10px rgba(255, 195, 0, 0.8);
        `;
        container.appendChild(particle);
    }
    
    // Добавление CSS для анимации частиц
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) scale(0.8);
                opacity: 0.6;
            }
            25% {
                transform: translateY(-30px) scale(1);
                opacity: 1;
            }
            50% {
                transform: translateY(-15px) scale(0.9);
                opacity: 0.8;
            }
            75% {
                transform: translateY(-25px) scale(1.1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

function initCounters() {
    // Имитация счетчиков пользователей онлайн
    const counters = {
        users: Math.floor(Math.random() * 50000) + 150000,
        matches: Math.floor(Math.random() * 100) + 50,
        news: Math.floor(Math.random() * 20) + 30
    };
    
    // Сохранение данных для возможного отображения
    window.sportsCounters = counters;
}

function addInteractivity() {
    const ctaButton = document.querySelector('.cta-button');
    const logo = document.querySelector('.sports-logo');
    const featureItems = document.querySelectorAll('.feature-item');
    
    // Интерактивность кнопки CTA
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        ctaButton.addEventListener('click', function(e) {
            // Эффект клика
            this.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }, 150);
            
            // Отслеживание клика
            console.log('CTA button clicked - redirecting to Sports.ru');
        });
    }
    
    // Интерактивность логотипа
    if (logo) {
        logo.addEventListener('click', function() {
            // Анимация вращения при клике
            this.style.transform = 'rotate(360deg) scale(1.1)';
            this.style.transition = 'transform 0.8s ease';
            
            setTimeout(() => {
                this.style.transform = 'rotate(0deg) scale(1)';
            }, 800);
        });
    }
    
    // Анимация features при наведении
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.background = 'rgba(255, 255, 255, 0.25)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

function startAnimations() {
    // Анимация появления элементов с задержкой
    const animatedElements = document.querySelectorAll('.feature-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
    
    // Пульсация для выделения важных элементов
    startPulseAnimation();
    
    // Динамическое изменение спортивных иконок
    animateSportIcons();
}

function startPulseAnimation() {
    const highlight = document.querySelector('.highlight');
    if (highlight) {
        setInterval(() => {
            highlight.style.transform = 'scale(1.05)';
            setTimeout(() => {
                highlight.style.transform = 'scale(1)';
            }, 300);
        }, 3000);
    }
}

function animateSportIcons() {
    const icons = document.querySelectorAll('.icon');
    
    icons.forEach(icon => {
        // Добавление случайного движения
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
        }, Math.random() * 3000 + 2000);
    });
}

function trackInteractions() {
    // Отслеживание времени на странице
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log(`Время просмотра баннера: ${timeSpent} секунд`);
    });
    
    // Отслеживание скролла (если применимо)
    let scrolled = false;
    window.addEventListener('scroll', function() {
        if (!scrolled) {
            scrolled = true;
            console.log('Пользователь начал скроллить');
        }
    });
    
    // Отслеживание кликов по элементам
    document.addEventListener('click', function(e) {
        if (e.target.closest('.feature-item')) {
            console.log('Клик по feature:', e.target.textContent);
        }
        
        if (e.target.closest('.sports-logo')) {
            console.log('Клик по логотипу Sports');
        }
    });
}

// Функция для добавления конфетти при успешных действиях
function createConfetti() {
    const colors = ['#00c78b', '#ffc300', '#ff003c', '#0040fc'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall 3s ease-in forwards;
            animation-delay: ${Math.random() * 2}s;
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Добавление анимации конфетти
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Удаление контейнера через 5 секунд
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Экспорт функций для возможного использования
window.sportsWelcomeBanner = {
    createConfetti,
    trackInteractions
}; 