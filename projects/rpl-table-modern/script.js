class RPLTable {
    constructor() {
        this.currentView = 'table'; // table или card
        this.currentTable = 'general'; // general, home, away
        this.currentSort = 'position';
        this.currentSeason = '2025';
        this.isDarkTheme = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTable();
        this.setupTheme();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // View toggle
        const viewToggle = document.getElementById('viewToggle');
        viewToggle?.addEventListener('click', () => this.toggleView());

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tableType = e.target.dataset.table;
                this.changeTable(tableType);
            });
        });

        // Season select
        const seasonSelect = document.getElementById('seasonSelect');
        seasonSelect?.addEventListener('change', (e) => {
            this.currentSeason = e.target.value;
            this.renderTable();
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        sortSelect?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTable();
        });

        // Modal close
        const modalClose = document.getElementById('modalClose');
        modalClose?.addEventListener('click', () => this.closeModal());

        // Modal background click
        const modal = document.getElementById('teamModal');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        
        // Save theme preference
        localStorage.setItem('rpl-table-theme', this.isDarkTheme ? 'dark' : 'light');
    }

    setupTheme() {
        // Load saved theme
        const savedTheme = localStorage.getItem('rpl-table-theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
            document.body.setAttribute('data-theme', savedTheme);
        }
    }

    toggleView() {
        this.currentView = this.currentView === 'table' ? 'card' : 'table';
        this.renderTable();
        
        // Update button icon
        const viewToggle = document.getElementById('viewToggle');
        const icon = this.currentView === 'table' ? 
            '<svg width="20" height="20" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' :
            '<svg width="20" height="20" fill="currentColor"><path d="M3 3h6v6H3zM14 3h6v6h-6zM14 14h6v6h-6zM3 14h6v6H3z"/></svg>';
        viewToggle.innerHTML = icon;
    }

    changeTable(tableType) {
        this.currentTable = tableType;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-table="${tableType}"]`).classList.add('active');
        
        this.renderTable();
    }

    getSortedTeams() {
        let teams = [...rplTeams];
        
        // Apply table type filtering if needed
        // For now, we'll use the same data for all table types
        // In a real app, you'd have different stats for home/away
        
        // Sort teams
        teams.sort((a, b) => {
            switch (this.currentSort) {
                case 'position':
                    return a.position - b.position;
                case 'points':
                    return b.points - a.points;
                case 'goals':
                    return b.goalsFor - a.goalsFor;
                case 'difference':
                    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                default:
                    return a.position - b.position;
            }
        });

        return teams;
    }

    renderTable() {
        const container = document.querySelector('.table-wrapper');
        const teams = this.getSortedTeams();

        if (this.currentView === 'table') {
            container.innerHTML = this.renderTableView(teams);
        } else {
            container.innerHTML = this.renderCardView(teams);
        }

        // Add click listeners to team rows/cards
        this.setupTeamClickListeners();
    }

    renderTableView(teams) {
        const tableHtml = `
            <table class="modern-table">
                <thead class="table-header">
                    <tr>
                        <th>#</th>
                        <th></th>
                        <th>Команда</th>
                        <th class="tooltip" data-tooltip="Игры">И</th>
                        <th class="tooltip" data-tooltip="Победы">В</th>
                        <th class="tooltip" data-tooltip="Ничьи">Н</th>
                        <th class="tooltip" data-tooltip="Поражения">П</th>
                        <th class="tooltip" data-tooltip="Забито мячей">ЗМ</th>
                        <th class="tooltip" data-tooltip="Пропущено мячей">ПМ</th>
                        <th class="tooltip" data-tooltip="Разность мячей">РМ</th>
                        <th class="tooltip" data-tooltip="Очки">О</th>
                        <th class="tooltip" data-tooltip="Форма">Форма</th>
                    </tr>
                </thead>
                <tbody>
                    ${teams.map(team => this.renderTableRow(team)).join('')}
                </tbody>
            </table>
        `;

        return tableHtml;
    }

    renderTableRow(team) {
        const goalDifference = team.goalsFor - team.goalsAgainst;
        const goalDifferenceSign = goalDifference > 0 ? '+' : '';
        
        return `
            <tr class="table-row zone-${team.zone}" data-team-id="${team.id}">
                <td class="table-cell">${team.position}</td>
                <td class="table-cell">
                    <div style="width: 4px; height: 20px; background: ${getZoneColor(team.zone)}; border-radius: 2px;"></div>
                </td>
                <td class="table-cell">
                    <div class="team-info">
                        <img src="${team.logo}" alt="${team.name}" class="team-logo" loading="lazy">
                        <span class="team-name">${team.name}</span>
                    </div>
                </td>
                <td class="table-cell">${team.games}</td>
                <td class="table-cell">${team.wins}</td>
                <td class="table-cell">${team.draws}</td>
                <td class="table-cell">${team.losses}</td>
                <td class="table-cell">${team.goalsFor}</td>
                <td class="table-cell">${team.goalsAgainst}</td>
                <td class="table-cell">${goalDifferenceSign}${goalDifference}</td>
                <td class="table-cell">
                    <span class="points-display">${team.points}</span>
                </td>
                <td class="table-cell">
                    <div class="form-indicator">
                        ${team.form.map(result => 
                            `<span class="form-badge ${result.toLowerCase() === 'w' ? 'win' : result.toLowerCase() === 'd' ? 'draw' : 'loss'}">
                                ${result}
                            </span>`
                        ).join('')}
                    </div>
                </td>
            </tr>
        `;
    }

    renderCardView(teams) {
        return `
            <div class="card-view">
                ${teams.map(team => this.renderTeamCard(team)).join('')}
            </div>
        `;
    }

    renderTeamCard(team) {
        const goalDifference = team.goalsFor - team.goalsAgainst;
        const goalDifferenceSign = goalDifference > 0 ? '+' : '';
        
        return `
            <div class="team-card zone-${team.zone}" data-team-id="${team.id}">
                <div class="card-header">
                    <div class="card-position">${team.position}</div>
                    <div class="card-team-info">
                        <img src="${team.logo}" alt="${team.name}" class="card-team-logo" loading="lazy">
                        <div class="card-team-name">${team.name}</div>
                    </div>
                    <div class="card-points">${team.points}</div>
                </div>
                
                <div class="card-stats">
                    <div class="card-stat">
                        <div class="card-stat-value">${team.games}</div>
                        <div class="card-stat-label">Игры</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${team.wins}</div>
                        <div class="card-stat-label">Победы</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${team.draws}</div>
                        <div class="card-stat-label">Ничьи</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${team.losses}</div>
                        <div class="card-stat-label">Поражения</div>
                    </div>
                </div>
                
                <div class="card-stats">
                    <div class="card-stat">
                        <div class="card-stat-value">${team.goalsFor}</div>
                        <div class="card-stat-label">Забито</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${team.goalsAgainst}</div>
                        <div class="card-stat-label">Пропущено</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value">${goalDifferenceSign}${goalDifference}</div>
                        <div class="card-stat-label">Разность</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-value" style="color: ${getZoneColor(team.zone)}">${getZoneName(team.zone).split(' ')[0]}</div>
                        <div class="card-stat-label">Зона</div>
                    </div>
                </div>
                
                <div class="card-form">
                    ${team.form.map(result => 
                        `<span class="form-badge ${result.toLowerCase() === 'w' ? 'win' : result.toLowerCase() === 'd' ? 'draw' : 'loss'}">
                            ${result}
                        </span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    setupTeamClickListeners() {
        const teamElements = document.querySelectorAll('[data-team-id]');
        teamElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const teamId = parseInt(e.currentTarget.dataset.teamId);
                this.showTeamModal(teamId);
            });
        });
    }

    showTeamModal(teamId) {
        const team = rplTeams.find(t => t.id === teamId);
        if (!team) return;

        const modal = document.getElementById('teamModal');
        const modalTeamName = document.getElementById('modalTeamName');
        const modalPosition = document.getElementById('modalPosition');
        const modalPoints = document.getElementById('modalPoints');
        const modalGames = document.getElementById('modalGames');
        const modalGoals = document.getElementById('modalGoals');
        const modalForm = document.getElementById('modalForm');

        modalTeamName.textContent = team.name;
        modalPosition.textContent = `#${team.position}`;
        modalPoints.textContent = team.points;
        modalGames.textContent = team.games;
        modalGoals.textContent = `${team.goalsFor}:${team.goalsAgainst}`;

        // Render form indicators
        modalForm.innerHTML = team.form.map(result => 
            `<span class="form-badge ${result.toLowerCase() === 'w' ? 'win' : result.toLowerCase() === 'd' ? 'draw' : 'loss'}">
                ${result}
            </span>`
        ).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('teamModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Analytics helpers
    calculateFormPercentage(team) {
        const wins = team.form.filter(result => result === 'W').length;
        return Math.round((wins / team.form.length) * 100);
    }

    getTeamEfficiency(team) {
        const totalPossiblePoints = team.games * 3;
        return Math.round((team.points / totalPossiblePoints) * 100);
    }

    addProgressAnimation() {
        // Add staggered animation to table rows
        const rows = document.querySelectorAll('.table-row, .team-card');
        rows.forEach((row, index) => {
            row.style.animationDelay = `${index * 0.05}s`;
        });
    }
}

// Utility functions for enhanced features
function animateValue(element, start, end, duration = 1000) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function addGoalProgressBars() {
    const teamRows = document.querySelectorAll('.table-row');
    teamRows.forEach(row => {
        const teamId = parseInt(row.dataset.teamId);
        const team = rplTeams.find(t => t.id === teamId);
        
        if (team) {
            // Add progress bar for goals
            const goalsCell = row.children[7]; // Goals for column
            const maxGoals = Math.max(...rplTeams.map(t => t.goalsFor));
            const percentage = (team.goalsFor / maxGoals) * 100;
            
            goalsCell.innerHTML += `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
        }
    });
}

// Enhanced search functionality
function addSearchFeature() {
    // This could be added to the filter panel
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск команды...';
    searchInput.className = 'season-select';
    searchInput.style.marginLeft = '10px';
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.table-row, .team-card');
        
        rows.forEach(row => {
            const teamName = row.querySelector('.team-name, .card-team-name').textContent.toLowerCase();
            if (teamName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    const filterOptions = document.querySelector('.filter-options');
    filterOptions?.appendChild(searchInput);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const rplTable = new RPLTable();
    
    // Add enhanced features after initial render
    setTimeout(() => {
        rplTable.addProgressAnimation();
        addGoalProgressBars();
        // addSearchFeature(); // Uncomment to enable search
    }, 100);
});

// Export for potential external use
if (typeof window !== 'undefined') {
    window.RPLTable = RPLTable;
} 