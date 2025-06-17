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
    } else {
        // Если дата наступила
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Показываем сообщение о том, что свадьба началась
        const countdownSection = document.querySelector('.countdown-section .section-title');
        countdownSection.textContent = 'Свадьба началась!';
        countdownSection.style.color = 'var(--accent-red)';
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
    button.style.background = 'var(--accent-green)';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'var(--accent-red)';
        button.style.transform = 'scale(1)';
    }, 3000);
}

// Простые эффекты для фотографий
function initPhotoEffects() {
    const photoFrames = document.querySelectorAll('.photo-frame');
    const vintagePhotos = document.querySelectorAll('.vintage-photo-item');
    
    // Эффекты для основных фото молодоженов
    photoFrames.forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            frame.style.transform = 'rotate(0deg) scale(1.05)';
        });
        
        frame.addEventListener('mouseleave', () => {
            if (frame.classList.contains('left-photo')) {
                frame.style.transform = 'rotate(-2deg) scale(1)';
            } else {
                frame.style.transform = 'rotate(2deg) scale(1)';
            }
        });
    });
    
    // Эффекты для дополнительных винтажных фото
    vintagePhotos.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'rotate(0deg) scale(1.1)';
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            let rotation;
            
            switch(index) {
                case 0:
                    rotation = '-1deg';
                    break;
                case 1:
                    rotation = '1.5deg';
                    break;
                case 2:
                    rotation = '-0.5deg';
                    break;
                default:
                    rotation = '0deg';
            }
            
            item.style.transform = `rotate(${rotation}) scale(1)`;
            item.style.zIndex = '1';
        });
    });
}

// Плавное появление элементов при прокрутке
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Обработка интерактивных элементов формы
function enhanceFormInteractivity() {
    const radioLabels = document.querySelectorAll('.radio-label');
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    
    // Эффекты для radio buttons
    radioLabels.forEach(label => {
        label.addEventListener('click', () => {
            // Убираем активный класс у всех radio в группе
            radioLabels.forEach(l => l.classList.remove('active'));
            // Добавляем активный класс к выбранному
            label.classList.add('active');
        });
    });
    
    // Эффекты для checkboxes
    checkboxLabels.forEach(label => {
        label.addEventListener('click', () => {
            setTimeout(() => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }, 50);
        });
    });
}

// Инициализация всех эффектов
document.addEventListener('DOMContentLoaded', () => {
    initPhotoEffects();
    enhanceFormInteractivity();
    initScrollAnimations();
});

// Добавляем стили для активных элементов формы
const formStyles = document.createElement('style');
formStyles.textContent = `
    .radio-label.active,
    .checkbox-label.active {
        background: var(--panel-frame) !important;
        border-color: var(--accent-red) !important;
        color: var(--text-dark) !important;
        font-weight: 700;
    }
    
    .radio-label.active .radio-custom,
    .checkbox-label.active .checkbox-custom {
        border-color: var(--accent-red) !important;
        background: var(--paper-white) !important;
    }
`;
document.head.appendChild(formStyles); 