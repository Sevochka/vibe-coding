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
        
        const stats = statsData.barco;
        
        this.widgetContent.innerHTML = `
            <div class="infographic-container">
                <h3 class="infographic-title">Голы Барко по сезонам</h3>
                <div class="infographic-cards">
                    ${stats.goals.map((season, index) => `
                        <div class="infographic-card" style="animation-delay: ${index * 0.2}s">
                            <div class="card-header">
                                <div class="season-badge">${season.season}</div>
                                <div class="spartak-logo">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <circle cx="20" cy="20" r="20" fill="#dc143c"/>
                                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                                    </svg>
                                </div>
                            </div>
                            <div class="goals-display">
                                <div class="goals-number">${season.goals}</div>
                                <div class="goals-label">голов</div>
                            </div>
                            <div class="card-footer">
                                <div class="matches-info">${stats.detailed[index].matches} матчей</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="total-summary">
                    <div class="summary-card">
                        <div class="summary-icon">⚽</div>
                        <div class="summary-content">
                            <div class="summary-number">${stats.goals.reduce((sum, s) => sum + s.goals, 0)}</div>
                            <div class="summary-text">Всего голов за 3 сезона</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">🎯</div>
                        <div class="summary-content">
                            <div class="summary-number">${(stats.goals.reduce((sum, s) => sum + s.goals, 0) / stats.detailed.reduce((sum, s) => sum + s.matches, 0)).toFixed(2)}</div>
                            <div class="summary-text">Голов за матч</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Анимация появления карточек
        setTimeout(() => {
            const cards = this.widgetContent.querySelectorAll('.infographic-card');
            cards.forEach(card => {
                card.classList.add('animate-in');
            });
        }, 100);
    }
    
    renderSpartakStats() {
        this.widgetTitle.textContent = 'Результаты Спартака в РПЛ';
        
        const stats = statsData.spartak;
        
        this.widgetContent.innerHTML = `
            <div class="infographic-container">
                <h3 class="infographic-title">Места Спартака в турнирной таблице РПЛ</h3>
                <div class="infographic-cards spartak-positions">
                    ${stats.positions.map((season, index) => {
                        const positionClass = season.position <= 3 ? 'top-position' : season.position <= 6 ? 'mid-position' : 'low-position';
                        const positionIcon = season.position === 1 ? '🥇' : season.position === 2 ? '🥈' : season.position === 3 ? '🥉' : '📍';
                        return `
                        <div class="infographic-card position-card ${positionClass}" style="animation-delay: ${index * 0.2}s">
                            <div class="card-header">
                                <div class="season-badge">${season.season}</div>
                                <div class="spartak-logo">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <circle cx="20" cy="20" r="20" fill="#dc143c"/>
                                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
                                    </svg>
                                </div>
                            </div>
                            <div class="position-display">
                                <div class="position-icon">${positionIcon}</div>
                                <div class="position-number">${season.position}</div>
                                <div class="position-label">место</div>
                            </div>
                            <div class="card-footer">
                                <div class="points-info">${stats.detailed[index].points} очков</div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
                
                <div class="total-summary spartak-summary">
                    <div class="summary-card">
                        <div class="summary-icon">🏆</div>
                        <div class="summary-content">
                            <div class="summary-number">${this.calculateAveragePosition(stats.detailed)}</div>
                            <div class="summary-text">Среднее место за 5 сезонов</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">⭐</div>
                        <div class="summary-content">
                            <div class="summary-number">${Math.min(...stats.detailed.map(s => s.position))}</div>
                            <div class="summary-text">Лучший результат (${stats.detailed.find(s => s.position === Math.min(...stats.detailed.map(s => s.position))).season})</div>
                        </div>
                    </div>
                </div>
                
                <div class="season-timeline">
                    <h4 class="timeline-title">Динамика результатов</h4>
                    <div class="timeline-track">
                        ${stats.positions.map((season, index) => `
                            <div class="timeline-point position-${season.position}" style="left: ${(index / (stats.positions.length - 1)) * 100}%">
                                <div class="timeline-tooltip">
                                    <div class="tooltip-season">${season.season}</div>
                                    <div class="tooltip-position">${season.position} место</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Анимация появления карточек
        setTimeout(() => {
            const cards = this.widgetContent.querySelectorAll('.infographic-card');
            cards.forEach(card => {
                card.classList.add('animate-in');
            });
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