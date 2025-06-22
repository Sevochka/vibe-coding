// Дата свадьбы - 30 августа 2025
const weddingDate = new Date('2025-08-30T15:00:00');

// Функция обратного отсчета
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
    } else {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
    }
}

// Карусель
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    const track = document.getElementById('carousel');
    const slideWidth = 100;
    track.style.transform = `translateX(-${index * slideWidth}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Автоматическая смена слайдов
function autoSlide() {
    nextSlide();
}

// Анимации при прокрутке
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Кнопка "наверх"
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-pink);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });
    
    document.body.appendChild(button);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Запуск обратного отсчета
    updateCountdown();
    setInterval(updateCountdown, 60000); // Обновляем каждую минуту

    // Инициализация карусели
    if (document.getElementById('carousel')) {
        showSlide(0);
        
        // Кнопки карусели
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Автоматическая смена слайдов каждые 5 секунд
        let autoSlideInterval = setInterval(autoSlide, 5000);
        
        // Пауза при наведении на карусель
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(autoSlide, 5000);
            });
        }
    }
    
    // Анимации при прокрутке
    animateOnScroll();
    
    // Создаем кнопку "наверх"
    createScrollToTopButton();
});

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