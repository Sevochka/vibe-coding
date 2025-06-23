// Карусели
let currentSlideGirls = 0;
let currentSlideBoys = 0;
const slidesGirls = document.querySelectorAll('#carousel-girls .carousel-slide');
const slidesBoys = document.querySelectorAll('#carousel-boys .carousel-slide');
const totalSlidesGirls = slidesGirls.length;
const totalSlidesBoys = slidesBoys.length;

function showSlide(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }
}

function nextSlide(type) {
    if (type === 'girls') {
        currentSlideGirls = (currentSlideGirls + 1) % totalSlidesGirls;
        showSlide('carousel-girls', currentSlideGirls);
    } else if (type === 'boys') {
        currentSlideBoys = (currentSlideBoys + 1) % totalSlidesBoys;
        showSlide('carousel-boys', currentSlideBoys);
    }
}

function prevSlide(type) {
    if (type === 'girls') {
        currentSlideGirls = (currentSlideGirls - 1 + totalSlidesGirls) % totalSlidesGirls;
        showSlide('carousel-girls', currentSlideGirls);
    } else if (type === 'boys') {
        currentSlideBoys = (currentSlideBoys - 1 + totalSlidesBoys) % totalSlidesBoys;
        showSlide('carousel-boys', currentSlideBoys);
    }
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

// Инициализация каруселей
function initCarousels() {
    // Показать первые слайды
    showSlide('carousel-girls', 0);
    showSlide('carousel-boys', 0);

    // Автоматическая прокрутка для девочек
    let autoSlideGirlsInterval = setInterval(() => nextSlide('girls'), 5000);
    
    // Автоматическая прокрутка для мальчиков
    let autoSlideBоysInterval = setInterval(() => nextSlide('boys'), 5500);

    // Обработчики кнопок
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselType = btn.getAttribute('data-carousel');
            const isNext = btn.classList.contains('next');
            
            if (carouselType === 'girls') {
                clearInterval(autoSlideGirlsInterval);
                if (isNext) {
                    nextSlide('girls');
                } else {
                    prevSlide('girls');
                }
                autoSlideGirlsInterval = setInterval(() => nextSlide('girls'), 5000);
            } else if (carouselType === 'boys') {
                clearInterval(autoSlideBоysInterval);
                if (isNext) {
                    nextSlide('boys');
                } else {
                    prevSlide('boys');
                }
                autoSlideBоysInterval = setInterval(() => nextSlide('boys'), 5500);
            }
        });
    });

    // Пауза при наведении на карусели
    const girlsContainer = document.querySelector('#carousel-girls').closest('.carousel-container');
    const boysContainer = document.querySelector('#carousel-boys').closest('.carousel-container');

    if (girlsContainer) {
        girlsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideGirlsInterval);
        });
        
        girlsContainer.addEventListener('mouseleave', () => {
            autoSlideGirlsInterval = setInterval(() => nextSlide('girls'), 5000);
        });
    }

    if (boysContainer) {
        boysContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideBоysInterval);
        });
        
        boysContainer.addEventListener('mouseleave', () => {
            autoSlideBоysInterval = setInterval(() => nextSlide('boys'), 5500);
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
    // Инициализация каруселей
    initCarousels();
    
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