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
            <div class="stats-chart">
                <h3 class="chart-title">Голы по сезонам</h3>
                <div class="chart-bars">
                    ${stats.goals.map(season => `
                        <div class="chart-bar">
                            <div class="bar-label">${season.season}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(season.goals / 15) * 100}%">
                                    ${season.goals}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="stats-chart">
                <h3 class="chart-title">Голевые передачи по сезонам</h3>
                <div class="chart-bars">
                    ${stats.assists.map(season => `
                        <div class="chart-bar">
                            <div class="bar-label">${season.season}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(season.assists / 10) * 100}%">
                                    ${season.assists}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Сезон</th>
                        <th>Матчи</th>
                        <th>Голы</th>
                        <th>Передачи</th>
                        <th>Г+П</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.detailed.map(season => `
                        <tr>
                            <td><strong>${season.season}</strong></td>
                            <td>${season.matches}</td>
                            <td>${season.goals}</td>
                            <td>${season.assists}</td>
                            <td><strong>${season.goals + season.assists}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Анимация появления баров
        setTimeout(() => {
            const bars = this.widgetContent.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.width;
                }, index * 100);
            });
        }, 100);
    }
    
    renderSpartakStats() {
        this.widgetTitle.textContent = 'Результаты Спартака в РПЛ';
        
        const stats = statsData.spartak;
        
        this.widgetContent.innerHTML = `
            <div class="stats-chart">
                <h3 class="chart-title">Места в турнирной таблице РПЛ</h3>
                <div class="chart-bars">
                    ${stats.positions.map(season => `
                        <div class="chart-bar">
                            <div class="bar-label">${season.season}</div>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${100 - ((season.position - 1) / 15) * 100}%">
                                    ${season.position} место
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Сезон</th>
                        <th>Место</th>
                        <th>Очки</th>
                        <th>И</th>
                        <th>В</th>
                        <th>Н</th>
                        <th>П</th>
                    </tr>
                </thead>
                <tbody>
                    ${stats.detailed.map(season => `
                        <tr>
                            <td><strong>${season.season}</strong></td>
                            <td class="position-cell position-${season.position}">${season.position}</td>
                            <td><strong>${season.points}</strong></td>
                            <td>${season.matches}</td>
                            <td>${season.wins}</td>
                            <td>${season.draws}</td>
                            <td>${season.losses}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="stats-summary">
                <h3 class="chart-title">Краткая сводка</h3>
                <p>За последние 5 сезонов «Спартак» в среднем занимал <strong>${this.calculateAveragePosition(stats.detailed)} место</strong> в РПЛ.</p>
                <p>Лучший результат: <strong>${Math.min(...stats.detailed.map(s => s.position))} место</strong> (${stats.detailed.find(s => s.position === Math.min(...stats.detailed.map(s => s.position))).season})</p>
                <p>Худший результат: <strong>${Math.max(...stats.detailed.map(s => s.position))} место</strong> (${stats.detailed.find(s => s.position === Math.max(...stats.detailed.map(s => s.position))).season})</p>
            </div>
        `;
        
        // Анимация появления баров
        setTimeout(() => {
            const bars = this.widgetContent.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.width;
                }, index * 100);
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