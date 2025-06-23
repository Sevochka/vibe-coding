// Карусель
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    const carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
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

// Инициализация карусели
function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const carouselContainer = document.querySelector('.carousel-container');

    // Показать первый слайд
    showSlide(0);

    // Автоматическая прокрутка
    let autoSlideInterval = setInterval(nextSlide, 4000);

    // Обработчики кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            nextSlide();
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            prevSlide();
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }

    // Пауза при наведении
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }
}

// Эффекты для фотографий
function initPhotoEffects() {
    const photos = document.querySelectorAll('img');
    
    photos.forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            photo.style.transform = 'scale(1.05)';
            photo.style.transition = 'transform 0.3s ease';
        });
        
        photo.addEventListener('mouseleave', () => {
            photo.style.transform = 'scale(1)';
        });
    });
}

// Плавная прокрутка для якорей
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

// Добавление визуальных эффектов к цветовой палитре
function initColorPalette() {
    const colorItems = document.querySelectorAll('.color-item');
    
    colorItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.05)';
            item.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = 'var(--shadow)';
        });
    });
}

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карусели
    initCarousel();
    
    // Анимации при прокрутке
    animateOnScroll();
    
    // Создаем кнопку "наверх"
    createScrollToTopButton();
    
    // Эффекты для фотографий
    initPhotoEffects();
    
    // Плавная прокрутка
    initSmoothScroll();
    
    // Цветовая палитра
    initColorPalette();
    
    // Добавляем класс loaded для плавного появления
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}); 