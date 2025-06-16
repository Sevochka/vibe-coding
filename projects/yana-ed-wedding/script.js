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
        
        // Добавляем эффект мерцания для секунд
        const secondsElement = document.getElementById('seconds');
        secondsElement.style.textShadow = `0 0 ${10 + Math.random() * 10}px var(--vhs-cyan)`;
    } else {
        // Если дата наступила
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Показываем сообщение о том, что свадьба началась
        const countdownSection = document.querySelector('.countdown-section .section-title');
        countdownSection.textContent = 'СВАДЬБА НАЧАЛАСЬ!';
        countdownSection.style.animation = 'glitch 1s infinite';
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
    
    button.textContent = 'ОТПРАВЛЕНО!';
    button.style.background = 'linear-gradient(135deg, var(--vhs-cyan), var(--vhs-blue))';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, var(--vhs-pink), var(--vhs-purple))';
        button.style.transform = 'scale(1)';
    }, 3000);
}

// Добавляем эффект мерцания для заголовков
function addGlitchEffect() {
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        const originalText = title.textContent;
        
        title.addEventListener('mouseenter', () => {
            title.style.animation = 'glitch 0.5s infinite';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.animation = 'none';
        });
    });
}

// Добавляем эффект печатной машинки для timeline
function typewriterEffect() {
    const timelineItems = document.querySelectorAll('.timeline-content p');
    
    timelineItems.forEach((item, index) => {
        const text = item.textContent;
        item.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    item.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 30);
        }, index * 1000);
    });
}

// Добавляем эффект параллакса для VHS overlay
function parallaxEffect() {
    const vhsOverlay = document.querySelector('.vhs-overlay');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        vhsOverlay.style.transform = `translateY(${rate}px)`;
    });
}

// Добавляем эффект мерцания для цветовых образцов
function animateColorSwatches() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('mouseenter', () => {
            swatch.style.animation = 'float 2s ease-in-out infinite';
            swatch.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.3)';
        });
        
        swatch.addEventListener('mouseleave', () => {
            swatch.style.animation = 'none';
            swatch.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        });
    });
}

// Добавляем эффект звука для кнопок (визуальная имитация)
function addSoundEffect() {
    const buttons = document.querySelectorAll('button, .radio-label, .checkbox-label');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Создаем визуальный эффект "звука"
            const soundWave = document.createElement('div');
            soundWave.style.position = 'fixed';
            soundWave.style.top = '50%';
            soundWave.style.left = '50%';
            soundWave.style.width = '10px';
            soundWave.style.height = '10px';
            soundWave.style.background = 'var(--vhs-cyan)';
            soundWave.style.borderRadius = '50%';
            soundWave.style.transform = 'translate(-50%, -50%)';
            soundWave.style.pointerEvents = 'none';
            soundWave.style.zIndex = '9999';
            soundWave.style.opacity = '0.8';
            
            document.body.appendChild(soundWave);
            
            // Анимация расширения
            soundWave.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                { transform: 'translate(-50%, -50%) scale(20)', opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out'
            }).onfinish = () => {
                document.body.removeChild(soundWave);
            };
        });
    });
}

// Инициализация всех эффектов после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    addGlitchEffect();
    animateColorSwatches();
    addSoundEffect();
    parallaxEffect();
    
    // Запускаем эффект печатной машинки с задержкой
    setTimeout(typewriterEffect, 2000);
    
    // Добавляем обработчик для плавной прокрутки
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
});

// Добавляем эффект мерцания для VHS лейблов
setInterval(() => {
    const vhsLabels = document.querySelectorAll('.vhs-label');
    vhsLabels.forEach(label => {
        if (Math.random() > 0.7) {
            label.style.opacity = '0.3';
            setTimeout(() => {
                label.style.opacity = '1';
            }, 100);
        }
    });
}, 2000);

// Добавляем эффект статических помех для фона
function addStaticNoise() {
    const body = document.body;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            body.style.filter = 'brightness(1.1) contrast(1.05)';
            setTimeout(() => {
                body.style.filter = 'none';
            }, 50);
        }
    }, 1000);
}

// Запускаем эффект статических помех
addStaticNoise(); 