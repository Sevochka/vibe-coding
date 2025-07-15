class InteractiveNews {
    constructor() {
        this.modal = document.getElementById('modalOverlay');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.modalClose = document.getElementById('modalClose');
        this.statsWidget = document.getElementById('statsWidget');
        this.widgetClose = document.getElementById('widgetClose');
        this.widgetTitle = document.getElementById('widgetTitle');
        this.widgetContent = document.getElementById('widgetContent');
        
        this.currentEntity = null;
        this.currentQuestion = null;
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.setupInteractiveWords();
    }
    
    attachEventListeners() {
        // Закрытие модальных окон
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.widgetClose.addEventListener('click', () => this.closeWidget());
        
        // Закрытие по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Поиск статистики
        this.searchButton.addEventListener('click', () => this.searchStats());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchStats();
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeWidget();
            }
        });
    }
    
    setupInteractiveWords() {
        const interactiveWords = document.querySelectorAll('.interactive-word');
        
        interactiveWords.forEach(word => {
            word.addEventListener('click', (e) => {
                const entity = e.target.dataset.entity;
                const question = e.target.dataset.question;
                this.openModal(entity, question);
            });
        });
    }
    
    openModal(entity, question) {
        this.currentEntity = entity;
        this.currentQuestion = question;
        this.searchInput.value = question;
        this.modal.classList.add('active');
        this.searchInput.focus();
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.searchInput.value = '';
        this.currentEntity = null;
        this.currentQuestion = null;
    }
    
    closeWidget() {
        this.statsWidget.classList.remove('active');
    }
    
    async searchStats() {
        if (!this.currentEntity) return;
        
        this.closeModal();
        this.showWidget();
        this.showLoading();
        
        // Симуляция загрузки
        await this.delay(1500);
        
        if (this.currentEntity === 'barco') {
            this.renderBarcoStats();
        } else if (this.currentEntity === 'spartak') {
            this.renderSpartakStats();
        }
    }
    
    showWidget() {
        this.statsWidget.classList.add('active');
    }
    
    showLoading() {
        this.widgetTitle.textContent = 'Загрузка статистики...';
        this.widgetContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }
    
    renderBarcoStats() {
        this.widgetTitle.textContent = 'Статистика Эсекиэля Барко';
        
        this.widgetContent.innerHTML = `
            <div class="stats-image-container">
                <div class="stats-image placeholder-image">
                    <div class="placeholder-content">
                        <div class="player-photo">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="60" fill="#dc143c"/>
                                <circle cx="60" cy="45" r="20" fill="white"/>
                                <path d="M25 95 Q60 75 95 95" stroke="white" stroke-width="8" fill="white"/>
                                <text x="60" y="110" text-anchor="middle" fill="white" font-size="12" font-weight="bold">БАРКО</text>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="stats-overlay">
                    <div class="stats-badge">
                        <div class="player-name">Эсекиэль Барко</div>
                        <div class="team-badge">
                            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="20" fill="#dc143c"/>
                                <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                            </svg>
                            Спартак
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label">2022/23</div>
                            <div class="stat-value">12 голов</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2023/24</div>
                            <div class="stat-value">8 голов</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2024/25</div>
                            <div class="stat-value">5 голов</div>
                        </div>
                    </div>
                    
                    <div class="total-stats">
                        <span class="total-goals">25 голов за 3 сезона</span>
                    </div>
                </div>
            </div>
        `;
        
        // Анимация появления
        setTimeout(() => {
            const image = this.widgetContent.querySelector('.stats-image');
            const overlay = this.widgetContent.querySelector('.stats-overlay');
            if (image) image.classList.add('loaded');
            if (overlay) overlay.classList.add('show');
        }, 100);
    }
    
    renderSpartakStats() {
        this.widgetTitle.textContent = 'Результаты Спартака в РПЛ';
        
        this.widgetContent.innerHTML = `
            <div class="stats-image-container">
                <div class="stats-image placeholder-image spartak-image">
                    <div class="placeholder-content">
                        <div class="team-logo">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="60" fill="#dc143c"/>
                                <text x="60" y="75" text-anchor="middle" fill="white" font-size="32" font-weight="bold">S</text>
                                <text x="60" y="95" text-anchor="middle" fill="white" font-size="10" font-weight="bold">СПАРТАК</text>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="stats-overlay">
                    <div class="stats-badge">
                        <div class="player-name">ФК Спартак</div>
                        <div class="team-badge">
                            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="20" fill="#dc143c"/>
                                <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                            </svg>
                            РПЛ
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label">2020/21</div>
                            <div class="stat-value">2 место</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2021/22</div>
                            <div class="stat-value">10 место</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2022/23</div>
                            <div class="stat-value">4 место</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2023/24</div>
                            <div class="stat-value">3 место</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">2024/25</div>
                            <div class="stat-value">6 место</div>
                        </div>
                    </div>
                    
                    <div class="total-stats">
                        <span class="total-goals">Среднее место: 5.0</span>
                    </div>
                </div>
            </div>
        `;
        
        // Анимация появления
        setTimeout(() => {
            const image = this.widgetContent.querySelector('.stats-image');
            const overlay = this.widgetContent.querySelector('.stats-overlay');
            if (image) image.classList.add('loaded');
            if (overlay) overlay.classList.add('show');
        }, 100);
    }
    
    calculateAveragePosition(seasons) {
        const total = seasons.reduce((sum, season) => sum + season.position, 0);
        return Math.round(total / seasons.length * 10) / 10;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveNews();
});

// Дополнительные интерактивные эффекты
document.addEventListener('DOMContentLoaded', () => {
    // Эффект появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами новости
    const newsElements = document.querySelectorAll('.sb-paragraph, .news-content__first-paragraph');
    newsElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Эффект подсветки интерактивных слов
    const interactiveWords = document.querySelectorAll('.interactive-word');
    interactiveWords.forEach(word => {
        word.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        word.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}); 