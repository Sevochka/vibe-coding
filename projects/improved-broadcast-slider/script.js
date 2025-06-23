class BroadcastSlider {
    constructor() {
        this.slider = document.getElementById('broadcastSlider');
        this.track = document.getElementById('sliderTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('indicators');
        
        this.currentIndex = 0;
        this.cardsPerView = 3;
        this.cardWidth = 216; // 200px + 16px gap
        this.totalCards = broadcastsData.length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.createIndicators();
        this.bindEvents();
        this.updateView();
        this.calculateResponsive();
        
        // Автопрокрутка
        this.startAutoplay();
    }
    
    createCards() {
        this.track.innerHTML = '';
        
        broadcastsData.forEach((broadcast) => {
            const card = this.createCard(broadcast);
            this.track.appendChild(card);
        });
    }
    
    createCard(broadcast) {
        const card = document.createElement('a');
        card.className = `broadcast-card ${broadcast.status}`;
        card.href = `https://www.sports.ru${broadcast.url}?utm_source=special-improved-broadcast-slider`;
        card.target = '_blank';
        
        const sportIcons = {
            football: '⚽',
            hockey: '🏒',
            basketball: '🏀',
            tennis: '🎾'
        };
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${broadcast.logo}" alt="${broadcast.title}" class="card-logo" loading="lazy">
                <div class="card-info">
                    <div class="card-title">${broadcast.title}</div>
                    <div class="card-subtitle">${broadcast.fullName}</div>
                </div>
            </div>
            <div class="card-footer">
                <div class="card-status ${broadcast.status}">
                    <div class="status-dot"></div>
                    ${broadcast.status === 'live' ? 'В эфире' : 'Скоро'}
                </div>
                <div class="card-time">${broadcast.nextMatch}</div>
            </div>
            <div class="sport-icon">${sportIcons[broadcast.sport] || '🏆'}</div>
        `;
        
        return card;
    }
    
    createIndicators() {
        this.indicators.innerHTML = '';
        
        const indicatorCount = Math.ceil(this.totalCards / this.cardsPerView);
        
        for (let i = 0; i < indicatorCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch события для мобильных устройств
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoplay();
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                isDragging = false;
            }
        });
        
        this.slider.addEventListener('touchend', () => {
            isDragging = false;
            this.startAutoplay();
        });
        
        // Пауза при наведении
        this.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Обновление при изменении размера окна
        window.addEventListener('resize', () => this.calculateResponsive());
    }
    
    calculateResponsive() {
        const containerWidth = this.slider.offsetWidth;
        
        if (containerWidth < 480) {
            this.cardsPerView = 1;
            this.cardWidth = 180 + 16;
        } else if (containerWidth < 600) {
            this.cardsPerView = 2;
            this.cardWidth = 180 + 16;
        } else {
            this.cardsPerView = 3;
            this.cardWidth = 216;
        }
        
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.updateView();
    }
    
    prevSlide() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateView();
    }
    
    nextSlide() {
        this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
        this.updateView();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.min(index * this.cardsPerView, this.maxIndex);
        this.updateView();
    }
    
    updateView() {
        const translateX = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Обновление кнопок
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.maxIndex;
        
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
        
        // Обновление индикаторов
        const activeIndicator = Math.floor(this.currentIndex / this.cardsPerView);
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicator);
        });
    }
    
    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateView();
        }, 4000);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new BroadcastSlider();
});

// Добавляем анимированный загрузчик
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'broadcast-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <div class="loader-text">Загружаем трансляции...</div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .broadcast-loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            gap: 16px;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--sports-grey-100);
            border-top: 3px solid var(--sports-primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loader-text {
            color: var(--sports-grey-600);
            font-size: 14px;
        }
    `;
    
    document.head.appendChild(style);
    return loader;
} 