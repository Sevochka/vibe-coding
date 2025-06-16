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
        
        // Мерцание для цифрового дисплея
        const secondsElement = document.getElementById('seconds');
        if (seconds % 2 === 0) {
            secondsElement.style.textShadow = '0 0 15px var(--cassette-red)';
        } else {
            secondsElement.style.textShadow = '0 0 10px var(--cassette-red)';
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
        countdownSection.style.color = 'var(--cassette-red)';
        countdownSection.style.textShadow = '0 0 20px var(--cassette-red)';
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
    button.style.background = 'linear-gradient(135deg, var(--cassette-red), var(--film-sepia))';
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 0 20px var(--cassette-red)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, var(--vintage-brown), var(--cassette-red))';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 8px 20px rgba(139, 69, 19, 0.3)';
    }, 4000);
}

// Эффекты для винтажных фотографий
function initPhotoEffects() {
    const photoFrames = document.querySelectorAll('.photo-frame');
    const vintagePhotos = document.querySelectorAll('.vintage-photo-item');
    
    // Эффекты для основных фото молодоженов
    photoFrames.forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            frame.style.transform = 'rotate(0deg) scale(1.08)';
            frame.style.boxShadow = '0 15px 40px var(--shadow-brown)';
            
            const photo = frame.querySelector('.couple-photo');
            if (photo) {
                photo.style.filter = 'sepia(5%) contrast(1.3) brightness(1.1)';
            }
        });
        
        frame.addEventListener('mouseleave', () => {
            if (frame.classList.contains('left-photo')) {
                frame.style.transform = 'rotate(-3deg) scale(1)';
            } else {
                frame.style.transform = 'rotate(2deg) scale(1)';
            }
            frame.style.boxShadow = '0 8px 25px var(--shadow-brown)';
            
            const photo = frame.querySelector('.couple-photo');
            if (photo) {
                photo.style.filter = 'sepia(20%) contrast(1.1)';
            }
        });
    });
    
    // Эффекты для дополнительных винтажных фото
    vintagePhotos.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'rotate(0deg) scale(1.15)';
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            let rotation;
            let marginTop;
            
            switch(index) {
                case 0:
                    rotation = '-1deg';
                    marginTop = '0px';
                    break;
                case 1:
                    rotation = '1.5deg';
                    marginTop = '20px';
                    break;
                case 2:
                    rotation = '-0.5deg';
                    marginTop = '-10px';
                    break;
                default:
                    rotation = '0deg';
                    marginTop = '0px';
            }
            
            item.style.transform = `rotate(${rotation}) scale(1)`;
            item.style.marginTop = marginTop;
            item.style.zIndex = '1';
        });
    });
}

// Эффект мерцания пленки
function addFilmFlicker() {
    const filmOverlay = document.querySelector('.film-overlay');
    
    setInterval(() => {
        if (Math.random() > 0.85) {
            filmOverlay.style.opacity = '0.8';
            setTimeout(() => {
                filmOverlay.style.opacity = '0.6';
            }, 100);
        }
    }, 2500);
}

// Эффект вращения кассетных катушек
function animateCassetteReels() {
    const reels = document.querySelectorAll('.cassette-reel');
    
    reels.forEach(reel => {
        // Случайная скорость вращения для каждой катушки
        const speed = Math.random() * 5 + 8; // от 8 до 13 секунд
        reel.style.animationDuration = `${speed}s`;
        
        // Добавляем эффект при наведении
        reel.addEventListener('mouseenter', () => {
            reel.style.animationDuration = '2s';
            reel.style.borderColor = 'var(--film-sepia)';
        });
        
        reel.addEventListener('mouseleave', () => {
            reel.style.animationDuration = `${speed}s`;
            reel.style.borderColor = 'var(--cassette-red)';
        });
    });
}

// Эффекты для timeline в стиле блокнота
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    
                    // Добавляем эффект "написания" текста
                    const content = entry.target.querySelector('.timeline-content');
                    content.style.animation = 'typewriter 0.8s ease-out';
                }, index * 300);
            }
        });
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Эффекты для цветовых образцов краски
function animateColorSwatches() {
    const colorItems = document.querySelectorAll('.color-item');
    
    colorItems.forEach(item => {
        const paintTexture = item.querySelector('.paint-texture');
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-12px) rotate(5deg)';
            item.style.boxShadow = '0 12px 30px var(--shadow-brown)';
            
            if (paintTexture) {
                paintTexture.style.animation = 'paint-shimmer 1s ease-in-out infinite';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) rotate(0deg)';
            item.style.boxShadow = '0 5px 15px var(--shadow-brown)';
            
            if (paintTexture) {
                paintTexture.style.animation = 'none';
            }
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
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Эффект параллакса для панелек
function addParallaxEffect() {
    const panelkiBg = document.querySelector('.panelki-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        
        if (panelkiBg) {
            panelkiBg.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Эффект печатной машинки для заголовков
function addTypewriterEffect() {
    const titles = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                const text = title.textContent;
                title.textContent = '';
                
                let i = 0;
                const typeInterval = setInterval(() => {
                    title.textContent += text[i];
                    i++;
                    
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                    }
                }, 80);
            }
        });
    }, { threshold: 0.5 });
    
    titles.forEach(title => {
        observer.observe(title);
    });
}

// Добавляем CSS-анимации динамически
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typewriter {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes paint-shimmer {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes subtle-glow {
            0%, 100% { box-shadow: 0 0 5px var(--cassette-red); }
            50% { box-shadow: 0 0 15px var(--cassette-red); }
        }
    `;
    document.head.appendChild(style);
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

// Эффект винтажного мерцания для фотографий
function addVintagePhotoGlitch() {
    const photos = document.querySelectorAll('.couple-photo, .vintage-photo, .footer-couple-photo');
    
    setInterval(() => {
        if (Math.random() > 0.92) {
            const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
            
            randomPhoto.style.filter = 'sepia(60%) contrast(1.3) brightness(0.8) hue-rotate(10deg)';
            
            setTimeout(() => {
                if (randomPhoto.classList.contains('couple-photo')) {
                    randomPhoto.style.filter = 'sepia(20%) contrast(1.1)';
                } else if (randomPhoto.classList.contains('vintage-photo')) {
                    randomPhoto.style.filter = 'sepia(40%) contrast(1.1) brightness(0.9)';
                } else {
                    randomPhoto.style.filter = 'sepia(30%) contrast(1.1)';
                }
            }, 200);
        }
    }, 3000);
}

// Инициализация всех эффектов
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    initPhotoEffects();
    addFilmFlicker();
    animateCassetteReels();
    animateColorSwatches();
    addParallaxEffect();
    enhanceFormInteractivity();
    initScrollAnimations();
    addVintagePhotoGlitch();
    
    // Запускаем timeline анимацию с задержкой
    setTimeout(() => {
        animateTimeline();
        addTypewriterEffect();
    }, 1000);
});

// Добавляем стили для активных элементов формы
const formStyles = document.createElement('style');
formStyles.textContent = `
    .radio-label.active,
    .checkbox-label.active {
        background: var(--vintage-beige) !important;
        border-color: var(--cassette-red) !important;
        color: var(--film-dark) !important;
        font-weight: 600;
    }
    
    .radio-label.active .radio-custom,
    .checkbox-label.active .checkbox-custom {
        border-color: var(--cassette-red) !important;
        background: var(--paper-white) !important;
    }
`;
document.head.appendChild(formStyles); 