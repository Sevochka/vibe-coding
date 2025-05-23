class FigureSkatingRatings {
    constructor() {
        this.data = [...skatersData];
        this.filteredData = [...this.data];
        this.currentView = 'table';
        this.filters = {
            gender: 'all',
            category: 'all',
            country: 'all',
            sort: 'rating'
        };
        
        this.init();
    }

    init() {
        this.hideLoading();
        this.setupEventListeners();
        this.applyFilters();
        this.render();
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 800);
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;
                
                // Update active state
                e.target.parentNode.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.filters[filterType] = filterValue;
                this.applyFilters();
                this.render();
            });
        });

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.value;
                
                this.filters[filterType] = filterValue;
                this.applyFilters();
                this.render();
            });
        });

        // View toggles
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                
                // Update active state
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentView = view;
                this.switchView();
            });
        });
    }

    applyFilters() {
        this.filteredData = this.data.filter(skater => {
            const genderMatch = this.filters.gender === 'all' || skater.gender === this.filters.gender;
            const categoryMatch = this.filters.category === 'all' || skater.category === this.filters.category;
            const countryMatch = this.filters.country === 'all' || skater.country === this.filters.country;
            
            return genderMatch && categoryMatch && countryMatch;
        });

        // Apply sorting
        this.filteredData.sort((a, b) => {
            switch (this.filters.sort) {
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'age':
                    return a.age - b.age;
                case 'country':
                    return a.countryName.localeCompare(b.countryName);
                default:
                    return 0;
            }
        });

        this.updateResultsCount();
    }

    updateResultsCount() {
        document.getElementById('results-count').textContent = this.filteredData.length;
    }

    switchView() {
        const tableView = document.getElementById('table-view');
        const cardsView = document.getElementById('cards-view');
        const emptyState = document.getElementById('empty-state');

        if (this.filteredData.length === 0) {
            tableView.classList.add('hidden');
            cardsView.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        if (this.currentView === 'table') {
            tableView.classList.remove('hidden');
            cardsView.classList.add('hidden');
            this.renderTable();
        } else {
            tableView.classList.add('hidden');
            cardsView.classList.remove('hidden');
            this.renderCards();
        }
    }

    render() {
        this.switchView();
    }

    renderTable() {
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = '';

        this.filteredData.forEach((skater, index) => {
            const rank = index + 1;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-column">${rank}</td>
                <td class="name-column">
                    <div class="skater-name">${skater.name}</div>
                    <div class="skater-age">${skater.age} лет</div>
                </td>
                <td class="country-column">
                    <span class="country-flag">${countryFlags[skater.country] || '🏳️'}</span>
                    ${skater.country}
                </td>
                <td class="category-column">${categoryTranslations[skater.category]}</td>
                <td class="rating-column">
                    <span class="rating-value">${skater.rating}</span>
                </td>
                <td class="change-column">
                    <span class="change-${this.getChangeClass(skater.change)}">
                        ${this.formatChange(skater.change)}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderCards() {
        const cardsGrid = document.getElementById('cards-grid');
        cardsGrid.innerHTML = '';

        this.filteredData.forEach((skater, index) => {
            const rank = index + 1;
            const card = document.createElement('div');
            card.className = 'skater-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-rank">${rank}</div>
                    <div class="card-change change-${this.getChangeClass(skater.change)}">
                        ${this.formatChange(skater.change)}
                    </div>
                </div>
                <div class="card-name">${skater.name}</div>
                <div class="card-age">${skater.age} лет</div>
                <div class="card-details">
                    <div class="card-detail">
                        <div class="card-detail-label">Страна</div>
                        <div class="card-detail-value">
                            ${countryFlags[skater.country] || '🏳️'} ${skater.countryName}
                        </div>
                    </div>
                    <div class="card-detail">
                        <div class="card-detail-label">Категория</div>
                        <div class="card-detail-value">${categoryTranslations[skater.category]}</div>
                    </div>
                </div>
                <div class="card-rating">
                    <div class="card-rating-label">Рейтинг</div>
                    <div class="card-rating-value">${skater.rating}</div>
                </div>
            `;
            cardsGrid.appendChild(card);
        });
    }

    getChangeClass(change) {
        if (change > 0) return 'positive';
        if (change < 0) return 'negative';
        return 'neutral';
    }

    formatChange(change) {
        if (change > 0) return `+${change}`;
        if (change < 0) return `${change}`;
        return '—';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FigureSkatingRatings();
}); 