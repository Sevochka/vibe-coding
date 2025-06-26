// Современная логика каруселей
class ModernCarousel {
    constructor(carouselType) {
        this.carouselType = carouselType;
        this.currentIndex = 0;
        this.carouselContainer = document.querySelector(`[data-carousel="${carouselType}"]`).closest('.vertical-carousel');
        this.track = document.getElementById(`carousel-${carouselType}`);
        this.slides = this.track.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.prevBtn = document.querySelector(`[data-carousel="${carouselType}"].prev`);
        this.nextBtn = document.querySelector(`[data-carousel="${carouselType}"].next`);
        
        this.init();
    }
    
    init() {
        // Устанавливаем начальное положение
        this.updateCarousel();
        
        // Добавляем обработчики событий
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prev();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.next();
            });
        }
        
        // Добавляем поддержку свайпов на мобильных
        this.addTouchSupport();
    }
    
    updateCarousel() {
        if (this.track && this.totalSlides > 0) {
            const translateX = -this.currentIndex * 100;
            this.track.style.transform = `translateX(${translateX}%)`;
        }
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = endX - startX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.prev(); // Свайп вправо - предыдущий слайд
            } else {
                this.next(); // Свайп влево - следующий слайд
            }
        }
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

// Кнопка "наверх" - перемещена влево
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
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

// Кликер сердечек - только для определенных фотографий
class HeartClicker {
    constructor() {
        this.heartCount = 0;
        this.heartCountElement = document.getElementById('heart-count');
        this.resetButton = document.getElementById('heart-reset');
        this.initClickablePhotos();
        this.initResetButton();
        this.loadHeartCount();
    }
    
    initClickablePhotos() {
        // Только фотографии с классом clickable-photo (ed, love, me, you, yana)
        const clickablePhotos = document.querySelectorAll('.clickable-photo');
        clickablePhotos.forEach(photo => {
            photo.addEventListener('click', (e) => this.onPhotoClick(e));
        });
    }
    
    initResetButton() {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetHeartCount());
        }
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
    
    resetHeartCount() {
        this.heartCount = 0;
        this.heartCountElement.textContent = this.heartCount;
        this.saveHeartCount();
        
        // Добавляем визуальный эффект сброса
        const resetButton = this.resetButton;
        resetButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            resetButton.style.transform = 'scale(1)';
        }, 150);
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
    // Анимации при прокрутке
    animateOnScroll();
    
    // Создаем кнопку "наверх" слева
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
    
    // Инициализируем карусели с новой логикой
    new ModernCarousel('girls');
    new ModernCarousel('boys');
    
    // Инициализируем кликер сердечек
    new HeartClicker();
}); 