class FootballLegendsApp {
    constructor() {
        this.players = footballLegends;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderPlayers();
        this.setupFilters();
        this.addAnimations();
    }

    renderPlayers() {
        const grid = document.getElementById('playersGrid');
        grid.innerHTML = '';

        const filteredPlayers = this.getFilteredPlayers();

        filteredPlayers.forEach((player, index) => {
            const card = this.createPlayerCard(player, index + 1);
            grid.appendChild(card);
        });

        // Добавляем анимацию появления
        setTimeout(() => {
            const cards = grid.querySelectorAll('.player-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }

    createPlayerCard(player, rank) {
        const card = document.createElement('div');
        card.className = `player-card ${player.active ? 'active-player' : ''}`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';

        const careerYears = parseInt(player.careerLength.split(' ')[0]);
        
        card.innerHTML = `
            <div class="player-header">
                <div class="player-rank">${rank}</div>
                <div class="player-info">
                    <h3>${player.name}${player.active ? '<span class="active-badge">⚡ Активен</span>' : ''}</h3>
                    <div class="player-country">${player.country}</div>
                </div>
            </div>
            
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-value">${player.careerLength}</span>
                    <div class="stat-label">⏰ Карьера</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.matches}</span>
                    <div class="stat-label">🎮 Матчи</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.goals}</span>
                    <div class="stat-label">⚽ Голы</div>
                </div>
            </div>
            
            <div class="player-description">
                ${player.description}
            </div>
        `;

        // Добавляем интерактивность
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        return card;
    }

    getFilteredPlayers() {
        switch (this.currentFilter) {
            case 'active':
                return this.players.filter(player => player.active);
            case 'retired': 
                return this.players.filter(player => !player.active);
            case '30plus':
                return this.players.filter(player => 
                    parseInt(player.careerLength.split(' ')[0]) >= 30
                );
            default:
                return this.players;
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Добавляем активный класс к текущей кнопке
                btn.classList.add('active');
                
                // Устанавливаем новый фильтр
                this.currentFilter = btn.dataset.filter;
                
                // Перерисовываем игроков с анимацией
                this.animateFilterChange();
            });
        });
    }

    animateFilterChange() {
        const grid = document.getElementById('playersGrid');
        const cards = grid.querySelectorAll('.player-card');
        
        // Анимация исчезновения
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
            }, index * 50);
        });

        // После исчезновения показываем новые карточки
        setTimeout(() => {
            this.renderPlayers();
        }, cards.length * 50 + 200);
    }

    addAnimations() {
        // Анимация для заголовка
        const title = document.querySelector('.title');
        title.style.animation = 'bounce 1s ease-in-out';

        // Добавляем CSS для анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .player-card {
                animation: fadeInUp 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);

        // Плавное появление элементов при скролле
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
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

        // Наблюдаем за элементами
        const elementsToAnimate = document.querySelectorAll('.intro, .filters, .footer');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// Инициализируем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new FootballLegendsApp();
});

// Добавляем эффекты для логотипа
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('click', () => {
            logo.style.animation = 'spin 0.5s ease-in-out';
            setTimeout(() => {
                logo.style.animation = '';
            }, 500);
        });
    }

    // CSS для вращения логотипа
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            to { transform: rotate(360deg) scale(1); }
        }
    `;
    document.head.appendChild(style);
}); 