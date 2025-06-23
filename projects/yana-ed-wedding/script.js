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

// Инициализация всех эффектов
document.addEventListener('DOMContentLoaded', () => {
    initPhotoEffects();
    initScrollAnimations();
}); 