class RPLFinanceDashboard {
    constructor() {
        this.clubs = clubsData.clubs;
        this.summary = clubsData.summary;
        this.currentFilter = {
            status: 'all',
            search: '',
            sortBy: 'revenue'
        };
        
        this.init();
    }

    init() {
        this.renderSummaryCards();
        this.renderTopRevenueClubs();
        this.renderClubsGrid();
        this.renderRevenueBreakdown();
        this.renderTopRevenue();
        this.renderTopExpenses();
        this.renderYouthExpenses();
        this.renderEfficiencyList();
        this.renderCriticalList();
        this.setupEventListeners();
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + ' млрд ₽';
        }
        return num.toFixed(1) + ' млн ₽';
    }

    formatPercent(num) {
        return num.toFixed(1) + '%';
    }

    renderSummaryCards() {
        const container = document.getElementById('summaryCards');
        const totalRevenue = this.clubs.reduce((sum, club) => sum + club['Общие доходы'], 0);
        const totalExpenses = this.clubs.reduce((sum, club) => sum + club['Общие расходы'], 0);
        const avgRevenue = totalRevenue / this.clubs.length;
        
        container.innerHTML = `
            <div class="summary-card">
                <div class="number">${this.clubs.length}</div>
                <div class="label">Клубов в анализе</div>
            </div>
            <div class="summary-card">
                <div class="number">${this.summary.profitable_clubs}</div>
                <div class="label">Прибыльные клубы</div>
            </div>
            <div class="summary-card">
                <div class="number">${this.summary.loss_making_clubs}</div>
                <div class="label">Убыточные клубы</div>
            </div>
            <div class="summary-card">
                <div class="number">${this.formatNumber(totalRevenue)}</div>
                <div class="label">Общие доходы</div>
            </div>
            <div class="summary-card">
                <div class="number">${this.formatNumber(avgRevenue)}</div>
                <div class="label">Средний доход</div>
            </div>
        `;
    }

    renderTopRevenueClubs() {
        const container = document.getElementById('topRevenueClubs');
        const topClubs = [...this.clubs]
            .sort((a, b) => b['Общие доходы'] - a['Общие доходы'])
            .slice(0, 5);

        container.innerHTML = topClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank">${index + 1}</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value">${this.formatNumber(club['Общие доходы'])}</div>
            </div>
        `).join('');
    }

    getFilteredClubs() {
        let filtered = [...this.clubs];

        // Фильтр по статусу
        if (this.currentFilter.status !== 'all') {
            const statusMap = {
                'profitable': 'Прибыльный',
                'loss-making': 'Убыточный'
            };
            filtered = filtered.filter(club => club.Статус === statusMap[this.currentFilter.status]);
        }

        // Поиск
        if (this.currentFilter.search) {
            const search = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(club => 
                club.Клуб.toLowerCase().includes(search) ||
                club.Город.toLowerCase().includes(search)
            );
        }

        // Сортировка
        const sortMap = {
            'revenue': 'Общие доходы',
            'assets': 'Общие активы',
            'profit': 'Прибыль/убыток до налогов',
            'name': 'Клуб'
        };

        const sortField = sortMap[this.currentFilter.sortBy];
        
        if (sortField === 'Клуб') {
            filtered.sort((a, b) => a[sortField].localeCompare(b[sortField]));
        } else {
            filtered.sort((a, b) => b[sortField] - a[sortField]);
        }

        return filtered;
    }

    renderClubsGrid() {
        const container = document.getElementById('clubsGrid');
        const clubs = this.getFilteredClubs();

        container.innerHTML = clubs.map(club => {
            const statusClass = club.Статус === 'Прибыльный' ? 'profitable' : 'loss-making';
            const profit = club['Прибыль/убыток до налогов'];
            
            return `
                <div class="club-card ${statusClass}">
                    <div class="club-header">
                        <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                        <div class="club-info">
                            <h3>${club.Клуб}</h3>
                            <p>${club['Полное название']} • ${club.Город}</p>
                            <span class="status-badge ${statusClass}">${club.Статус}</span>
                        </div>
                    </div>
                    <div class="club-stats">
                        <div class="stat-item">
                            <div class="stat-value">${this.formatNumber(club['Общие доходы'])}</div>
                            <div class="stat-label">Доходы</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.formatNumber(club['Общие расходы'])}</div>
                            <div class="stat-label">Расходы</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value ${profit >= 0 ? 'positive' : 'negative'}">${this.formatNumber(Math.abs(profit))}</div>
                            <div class="stat-label">${profit >= 0 ? 'Прибыль' : 'Убыток'}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.formatNumber(club['Общие активы'])}</div>
                            <div class="stat-label">Активы</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderRevenueBreakdown() {
        const container = document.getElementById('revenueBreakdown');
        
        const totalMatchDay = this.clubs.reduce((sum, club) => sum + club['Доходы в дни матчей'], 0);
        const totalCommercial = this.clubs.reduce((sum, club) => sum + club['Коммерческие доходы'], 0);
        const totalCompetition = this.clubs.reduce((sum, club) => sum + club['Доходы от соревнований'], 0);
        const totalOther = this.clubs.reduce((sum, club) => sum + club['Прочие доходы'], 0);
        const total = totalMatchDay + totalCommercial + totalCompetition + totalOther;

        container.innerHTML = `
            <div class="financial-indicator">
                <span class="indicator-label">Доходы в дни матчей</span>
                <span class="indicator-value">${this.formatNumber(totalMatchDay)} (${this.formatPercent(totalMatchDay / total * 100)})</span>
            </div>
            <div class="financial-indicator">
                <span class="indicator-label">Коммерческие доходы</span>
                <span class="indicator-value">${this.formatNumber(totalCommercial)} (${this.formatPercent(totalCommercial / total * 100)})</span>
            </div>
            <div class="financial-indicator">
                <span class="indicator-label">Доходы от соревнований</span>
                <span class="indicator-value">${this.formatNumber(totalCompetition)} (${this.formatPercent(totalCompetition / total * 100)})</span>
            </div>
            <div class="financial-indicator">
                <span class="indicator-label">Прочие доходы</span>
                <span class="indicator-value">${this.formatNumber(totalOther)} (${this.formatPercent(totalOther / total * 100)})</span>
            </div>
        `;
    }

    renderTopRevenue() {
        const container = document.getElementById('topRevenueList');
        const topClubs = [...this.clubs]
            .sort((a, b) => b['Общие доходы'] - a['Общие доходы'])
            .slice(0, 10);

        container.innerHTML = topClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank">${index + 1}</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value">${this.formatNumber(club['Общие доходы'])}</div>
            </div>
        `).join('');
    }

    renderTopExpenses() {
        const container = document.getElementById('topExpensesList');
        const topClubs = [...this.clubs]
            .sort((a, b) => b['Общие расходы'] - a['Общие расходы'])
            .slice(0, 10);

        container.innerHTML = topClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank">${index + 1}</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value">${this.formatNumber(club['Общие расходы'])}</div>
            </div>
        `).join('');
    }

    renderYouthExpenses() {
        const container = document.getElementById('youthExpensesList');
        const topClubs = [...this.clubs]
            .sort((a, b) => b['Расходы на молодежь'] - a['Расходы на молодежь'])
            .slice(0, 10);

        container.innerHTML = topClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank">${index + 1}</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value">${this.formatNumber(club['Расходы на молодежь'])}</div>
            </div>
        `).join('');
    }

    renderEfficiencyList() {
        const container = document.getElementById('efficiencyList');
        const efficiencyClubs = this.clubs.map(club => ({
            ...club,
            efficiency: club['Общие доходы'] > 0 ? (club['Прибыль/убыток до налогов'] / club['Общие доходы'] * 100) : -100
        }))
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 10);

        container.innerHTML = efficiencyClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank">${index + 1}</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value" style="color: ${club.efficiency >= 0 ? 'var(--sports-primary-color)' : 'var(--sports-red-a700)'}">${club.efficiency.toFixed(1)}%</div>
            </div>
        `).join('');
    }

    renderCriticalList() {
        const container = document.getElementById('criticalList');
        const criticalClubs = this.clubs
            .filter(club => club['Чистые активы'] < 0 || club['Денежные средства'] < 50)
            .sort((a, b) => a['Чистые активы'] - b['Чистые активы'])
            .slice(0, 10);

        container.innerHTML = criticalClubs.map((club, index) => `
            <div class="top-club-item">
                <div class="rank" style="color: var(--sports-red-a700);">⚠</div>
                <img src="${club.logo_url}" alt="${club.Клуб}" class="club-logo">
                <div class="club-details">
                    <div class="club-name">${club.Клуб}</div>
                    <div class="club-city">${club.Город}</div>
                </div>
                <div class="value" style="color: var(--sports-red-a700);">${this.formatNumber(club['Чистые активы'])}</div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Переключение табов
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Фильтры в разделе клубов
        document.getElementById('clubSearch').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.renderClubsGrid();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.renderClubsGrid();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentFilter.sortBy = e.target.value;
            this.renderClubsGrid();
        });
    }

    switchTab(tabName) {
        // Убираем активный класс со всех кнопок и контента
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Добавляем активный класс к выбранным
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }
}

// Инициализация дашборда при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new RPLFinanceDashboard();
}); 