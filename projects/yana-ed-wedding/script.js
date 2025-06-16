// Дата свадьбы - 30 августа 2025
const weddingDate = new Date('2025-08-30T16:00:00');

// Функция обновления обратного отсчета
function updateCountdown() {
    const now = new Date();
    const difference = weddingDate - now;
    
    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Обновляем отображение
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Мягкое мерцание для секунд
        const secondsElement = document.getElementById('seconds');
        if (seconds % 2 === 0) {
            secondsElement.style.opacity = '0.8';
        } else {
            secondsElement.style.opacity = '1';
        }
    } else {
        // Если дата наступила
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Показываем сообщение о том, что свадьба началась
        const countdownSection = document.querySelector('.countdown-section .section-title');
        countdownSection.textContent = 'Свадьба началась!';
        countdownSection.style.color = 'var(--vintage-orange)';
    }
}

// Обновляем обратный отсчет каждую секунду
setInterval(updateCountdown, 1000);
updateCountdown(); // Сразу обновляем при загрузке

// Обработка формы RSVP
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const attendance = formData.get('attendance');
    const name = formData.get('name');
    const drinks = formData.getAll('drinks');
    
    // Создаем объект с данными формы
    const rsvpData = {
        attendance: attendance,
        name: name,
        drinks: drinks,
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage (в реальном проекте отправляли бы на сервер)
    const existingData = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');
    existingData.push(rsvpData);
    localStorage.setItem('weddingRSVP', JSON.stringify(existingData));
    
    // Показываем сообщение об успешной отправке
    showSuccessMessage();
    
    // Очищаем форму
    this.reset();
});

// Функция показа сообщения об успешной отправке
function showSuccessMessage() {
    const button = document.querySelector('.submit-btn');
    const originalText = button.textContent;
    
    button.textContent = 'Спасибо! Получили ваш ответ ♥';
    button.style.background = 'linear-gradient(135deg, var(--vintage-blue), var(--vintage-orange))';
    button.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, var(--vintage-brown), var(--vintage-orange))';
        button.style.transform = 'scale(1)';
    }, 4000);
}

// Добавляем мягкие эффекты наведения для заголовков
function addHoverEffects() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.color = 'var(--vintage-orange)';
            title.style.transition = 'color 0.3s ease';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.color = 'var(--vintage-brown)';
        });
    });
}

// Добавляем эффект плавного появления для timeline
function fadeInTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Добавляем мягкие эффекты для цветовых образцов
function animateColorSwatches() {
    const colorItems = document.querySelectorAll('.color-item');
    
    colorItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px) scale(1.05)';
            item.style.boxShadow = '0 8px 25px rgba(139, 111, 71, 0.4)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '0 5px 15px rgba(139, 111, 71, 0.2)';
        });
    });
}

// Добавляем мягкий эффект для фотографий
function animatePhotos() {
    const photoFrames = document.querySelectorAll('.photo-frame');
    
    photoFrames.forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            frame.style.transform = 'rotate(0deg) scale(1.08)';
            frame.style.boxShadow = '0 12px 35px rgba(139, 111, 71, 0.4)';
        });
        
        frame.addEventListener('mouseleave', () => {
            if (frame.classList.contains('left')) {
                frame.style.transform = 'rotate(-2deg) scale(1)';
            } else {
                frame.style.transform = 'rotate(1.5deg) scale(1)';
            }
            frame.style.boxShadow = '0 8px 25px rgba(139, 111, 71, 0.3)';
        });
    });
}

// Добавляем эффект мягкого параллакса
function addParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация всех эффектов после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    addHoverEffects();
    animateColorSwatches();
    animatePhotos();
    addParallax();
    initSmoothScroll();
    
    // Запускаем эффект появления timeline с задержкой
    setTimeout(fadeInTimeline, 1000);
});

// Добавляем мягкое мерцание для VHS лейблов
setInterval(() => {
    const vhsLabels = document.querySelectorAll('.vhs-label');
    vhsLabels.forEach(label => {
        if (Math.random() > 0.8) {
            label.style.opacity = '0.7';
            setTimeout(() => {
                label.style.opacity = '1';
            }, 200);
        }
    });
}, 3000);

// Добавляем мягкие эффекты зерна для винтажности
function addVintageEffects() {
    const filmGrain = document.querySelector('.film-grain');
    
    setInterval(() => {
        if (Math.random() > 0.9) {
            filmGrain.style.opacity = '0.4';
            setTimeout(() => {
                filmGrain.style.opacity = '0.3';
            }, 100);
        }
    }, 2000);
}

// Запускаем винтажные эффекты
addVintageEffects(); 