class ElegantWeddingPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = questions.length + 2; // +2 для титульного и финального слайдов
        this.slidesCreated = false;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.createQuestionSlides();
        this.updateProgress();
        this.updateNavigation();
        this.updateSlideCounter();
        this.setupEventListeners();
        this.preloadAssets();
        
        // Инициализация aria-атрибутов
        this.updateAccessibility();
    }
    
    setupEventListeners() {
        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
            }
        });

        // Жесты для мобильных устройств
        this.setupTouchGestures();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        const presentationContainer = document.querySelector('.presentation-container');
        
        presentationContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        presentationContainer.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;
            const swipeThreshold = 50;
            
            // Проверяем, что горизонтальный свайп больше вертикального
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.nextSlide(); // Свайп влево - следующий слайд
                } else {
                    this.prevSlide(); // Свайп вправо - предыдущий слайд
                }
            }
        }, { passive: true });
    }
    
    createQuestionSlides() {
        if (this.slidesCreated) return;
        
        const slidesContainer = document.getElementById('slides-container');
        
        questions.forEach((question, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide question-slide';
            slideElement.id = `slide-${index + 1}`;
            slideElement.setAttribute('role', 'tabpanel');
            slideElement.setAttribute('aria-labelledby', `question-${index + 1}`);
            
            slideElement.innerHTML = `
                <div class="slide-content">
                    <div class="question-number" aria-hidden="true">${question.id}</div>
                    <div class="question-icon" role="img" aria-label="${this.getIconDescription(question.icon)}">${question.icon}</div>
                    <div class="question-text" id="question-${index + 1}">${question.text}</div>
                </div>
            `;
            
            slidesContainer.appendChild(slideElement);
        });
        
        this.slidesCreated = true;
    }
    
    getIconDescription(icon) {
        const iconDescriptions = {
            '🍽️': 'Тарелка с едой',
            '👨‍💼': 'Человек в деловом костюме',
            '🎭': 'Театральные маски',
            '✈️': 'Самолет',
            '🎤': 'Микрофон',
            '🛍️': 'Сумки для покупок',
            '🧸': 'Плюшевый мишка',
            '📺': 'Телевизор',
            '📚': 'Книги',
            '📖': 'Открытая книга',
            '☀️': 'Солнце',
            '⚽': 'Футбольный мяч',
            '🏆': 'Кубок',
            '👫': 'Друзья',
            '😄': 'Смеющееся лицо',
            '🏖️': 'Пляж',
            '😈': 'Озорное лицо',
            '👩‍🏫': 'Учительница',
            '🎂': 'Торт'
        };
        return iconDescriptions[icon] || 'Иконка';
    }
    
    nextSlide() {
        if (this.isTransitioning || this.currentSlide >= this.totalSlides - 1) return;
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        if (this.isTransitioning || this.currentSlide <= 0) return;
        this.goToSlide(this.currentSlide - 1);
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        this.isTransitioning = true;
        
        // Скрыть текущий слайд
        const currentSlideElement = this.getCurrentSlideElement();
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Обновить индекс
        this.currentSlide = slideIndex;
        
        // Показать новый слайд с задержкой для плавности
        setTimeout(() => {
            const newSlideElement = this.getCurrentSlideElement();
            if (newSlideElement) {
                newSlideElement.classList.add('active');
                
                // Фокус для доступности
                const focusElement = newSlideElement.querySelector('button, .question-text');
                if (focusElement) {
                    focusElement.setAttribute('tabindex', '-1');
                    focusElement.focus();
                }
            }
            
            // Обновить UI
            this.updateProgress();
            this.updateNavigation();
            this.updateSlideCounter();
            this.updateAccessibility();
            
            // Завершить переход
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
            
        }, 150);
    }
    
    getCurrentSlideElement() {
        if (this.currentSlide === 0) {
            return document.getElementById('slide-0'); // Титульный слайд
        } else if (this.currentSlide === this.totalSlides - 1) {
            return document.getElementById('slide-final'); // Финальный слайд
        } else {
            return document.getElementById(`slide-${this.currentSlide}`); // Вопросы
        }
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressBar = progressFill.parentElement;
        const progressPercent = (this.currentSlide / (this.totalSlides - 1)) * 100;
        
        progressFill.style.width = `${progressPercent}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(progressPercent));
    }
    
    updateNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // Кнопка "Назад"
        prevBtn.disabled = this.currentSlide === 0;
        
        // Кнопка "Далее"
        if (this.currentSlide === this.totalSlides - 1) {
            nextBtn.style.opacity = '0';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
            nextBtn.disabled = false;
        }
    }
    
    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('current-slide');
        const totalSlidesSpan = document.getElementById('total-slides');
        
        currentSlideSpan.textContent = this.currentSlide + 1;
        totalSlidesSpan.textContent = this.totalSlides;
    }
    
    updateAccessibility() {
        const currentSlideElement = this.getCurrentSlideElement();
        if (currentSlideElement) {
            // Обновляем title страницы
            const slideTitle = this.getSlideTitle();
            document.title = `${slideTitle} - Детские воспоминания`;
        }
    }
    
    getSlideTitle() {
        if (this.currentSlide === 0) {
            return 'Начало презентации';
        } else if (this.currentSlide === this.totalSlides - 1) {
            return 'Завершение презентации';
        } else {
            return `Вопрос ${this.currentSlide}`;
        }
    }
    
    restart() {
        this.goToSlide(0);
    }
    
    preloadAssets() {
        // Предзагрузка изображений и ресурсов
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
        link.as = 'style';
        document.head.appendChild(link);
    }
    
    handleResize() {
        // Обработка изменения размера окна
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Пересчет размеров при необходимости
            this.updateProgress();
        }, 250);
    }
    
    // Публичные методы для внешнего использования
    getCurrentSlideNumber() {
        return this.currentSlide + 1;
    }
    
    getTotalSlidesCount() {
        return this.totalSlides;
    }
    
    getProgress() {
        return (this.currentSlide / (this.totalSlides - 1)) * 100;
    }
}

// Глобальные функции для HTML
let presentation;

function nextSlide() {
    if (presentation) presentation.nextSlide();
}

function prevSlide() {
    if (presentation) presentation.prevSlide();
}

function restartPresentation() {
    if (presentation) presentation.restart();
}

function goToSlide(index) {
    if (presentation) presentation.goToSlide(index);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создание презентации
    presentation = new ElegantWeddingPresentation();
    
    // Добавление класса загрузки
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Добавление обработчиков для улучшения UX
    addPerformanceOptimizations();
    
    console.log('✨ Свадебная презентация "Детские воспоминания" загружена успешно!');
});

function addPerformanceOptimizations() {
    // Lazy loading для улучшения производительности
    if ('IntersectionObserver' in window) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('observed');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.slide').forEach(slide => {
            slideObserver.observe(slide);
        });
    }
    
    // Предотвращение двойного клика
    let lastClickTime = 0;
    document.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            e.preventDefault();
            return false;
        }
        lastClickTime = now;
    });
}

// Экспорт для возможного использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElegantWeddingPresentation };
} 