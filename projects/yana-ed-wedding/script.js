// Карусели
let currentSlideGirls = 0;
let currentSlideBoys = 0;

// Инициализация каруселей
function initCarousels() {
    const slidesGirls = document.querySelectorAll('#carousel-girls .carousel-slide');
    const slidesBoys = document.querySelectorAll('#carousel-boys .carousel-slide');
    const totalSlidesGirls = slidesGirls.length; // 8 фотографий девочек
    const totalSlidesBoys = slidesBoys.length; // 4 фотографии мальчиков

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

    // Показать первые слайды
    showSlide('carousel-girls', 0);
    showSlide('carousel-boys', 0);

    // Обработчики кнопок (только ручное управление)
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselType = btn.getAttribute('data-carousel');
            const isNext = btn.classList.contains('next');
            
            if (carouselType === 'girls') {
                if (isNext) {
                    nextSlide('girls');
                } else {
                    prevSlide('girls');
                }
            } else if (carouselType === 'boys') {
                if (isNext) {
                    nextSlide('boys');
                } else {
                    prevSlide('boys');
                }
            }
        });
    });
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

// Карусель
class Carousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(`carousel-${carouselId}`);
        this.currentIndex = 0;
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        
        // Добавляем обработчики событий для кнопок
        const prevBtn = document.querySelector(`[data-carousel="${carouselId}"].prev`);
        const nextBtn = document.querySelector(`[data-carousel="${carouselId}"].next`);
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        
        this.updateCarousel();
    }
    
    updateCarousel() {
        const translateX = -this.currentIndex * 100;
        this.carousel.style.transform = `translateX(${translateX}%)`;
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
}

// Кликер сердечек
class HeartClicker {
    constructor() {
        this.heartCount = 0;
        this.heartCountElement = document.getElementById('heart-count');
        this.initClickablePhotos();
        this.loadHeartCount();
    }
    
    initClickablePhotos() {
        const clickablePhotos = document.querySelectorAll('.clickable-photo');
        clickablePhotos.forEach(photo => {
            photo.addEventListener('click', (e) => this.onPhotoClick(e));
        });
    }
    
    onPhotoClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        
        // Создаем летящее сердечко
        this.createFloatingHeart(x, y);
        
        // Увеличиваем счетчик
        this.incrementHeartCount();
    }
    
    createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤️';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        
        document.body.appendChild(heart);
        
        // Удаляем сердечко после анимации
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
    
    incrementHeartCount() {
        this.heartCount++;
        this.heartCountElement.textContent = this.heartCount;
        this.saveHeartCount();
    }
    
    saveHeartCount() {
        localStorage.setItem('wedding-heart-count', this.heartCount.toString());
    }
    
    loadHeartCount() {
        const saved = localStorage.getItem('wedding-heart-count');
        if (saved) {
            this.heartCount = parseInt(saved, 10) || 0;
            this.heartCountElement.textContent = this.heartCount;
        }
    }
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
    
    // Инициализируем карусели
    new Carousel('girls');
    new Carousel('boys');
    
    // Инициализируем кликер сердечек
    new HeartClicker();
}); 