class WeddingPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = questions.length + 2; // +2 для титульного и финального слайдов
        this.slidesCreated = false;
        
        this.init();
    }
    
    init() {
        this.createQuestionSlides();
        this.updateProgress();
        this.updateNavigation();
        this.updateSlideCounter();
        
        // Обработка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Escape') this.goToSlide(0);
        });
    }
    
    createQuestionSlides() {
        if (this.slidesCreated) return;
        
        const slidesContainer = document.getElementById('slides-container');
        
        questions.forEach((question, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide question-slide';
            slideElement.id = `slide-${index + 1}`;
            
            slideElement.innerHTML = `
                <div class="slide-content">
                    <div class="question-number">${question.id}</div>
                    <div class="question-icon">${question.icon}</div>
                    <div class="question-text">${question.text}</div>
                </div>
            `;
            
            slidesContainer.appendChild(slideElement);
        });
        
        this.slidesCreated = true;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideIndex) {
        // Скрыть текущий слайд
        const currentSlideElement = this.getCurrentSlideElement();
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Обновить индекс
        this.currentSlide = slideIndex;
        
        // Показать новый слайд
        const newSlideElement = this.getCurrentSlideElement();
        if (newSlideElement) {
            newSlideElement.classList.add('active');
        }
        
        // Обновить UI
        this.updateProgress();
        this.updateNavigation();
        this.updateSlideCounter();
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
        const progressPercent = (this.currentSlide / (this.totalSlides - 1)) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }
    
    updateNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // Кнопка "Назад"
        prevBtn.disabled = this.currentSlide === 0;
        
        // Кнопка "Далее"
        if (this.currentSlide === this.totalSlides - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
            nextBtn.disabled = false;
        }
    }
    
    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('current-slide');
        const totalSlidesSpan = document.getElementById('total-slides');
        
        currentSlideSpan.textContent = this.currentSlide + 1;
        totalSlidesSpan.textContent = this.totalSlides;
    }
    
    restart() {
        this.goToSlide(0);
    }
}

// Глобальные функции для HTML
let presentation;

function nextSlide() {
    presentation.nextSlide();
}

function prevSlide() {
    presentation.prevSlide();
}

function restartPresentation() {
    presentation.restart();
}

function goToSlide(index) {
    presentation.goToSlide(index);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    presentation = new WeddingPresentation();
    
    // Добавляем эффекты при загрузке
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Предзагрузка следующих слайдов для плавности
    preloadSlides();
});

function preloadSlides() {
    // Создаем невидимые элементы для предзагрузки
    const tempContainer = document.createElement('div');
    tempContainer.style.display = 'none';
    document.body.appendChild(tempContainer);
    
    questions.forEach((question, index) => {
        const tempSlide = document.createElement('div');
        tempSlide.innerHTML = `
            <div class="question-icon">${question.icon}</div>
            <div class="question-text">${question.text}</div>
        `;
        tempContainer.appendChild(tempSlide);
    });
    
    // Удаляем контейнер после небольшой задержки
    setTimeout(() => {
        document.body.removeChild(tempContainer);
    }, 1000);
}

// Дополнительные функции для улучшения UX
function addSlideTransitionEffects() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        slide.addEventListener('transitionend', (e) => {
            if (e.target === slide && slide.classList.contains('active')) {
                // Анимация появления контента
                const content = slide.querySelector('.slide-content');
                if (content) {
                    content.style.animation = 'slideIn 0.6s ease-out';
                }
            }
        });
    });
}

// Добавляем жесты для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп влево - следующий слайд
            nextSlide();
        } else {
            // Свайп вправо - предыдущий слайд
            prevSlide();
        }
    }
}

// Функция для полноэкранного режима
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Добавляем обработчик для ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Инициализация эффектов после создания презентации
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addSlideTransitionEffects, 100);
}); 