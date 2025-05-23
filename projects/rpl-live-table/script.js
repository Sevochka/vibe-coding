class LiveTable {
    constructor() {
        this.currentTeams = [...teams];
        this.currentMatches = [...virtualMatches];
        this.isAutoMode = false;
        this.autoInterval = null;
        this.scenarioIndex = 0;
        this.currentMinute = 0;
        
        this.init();
    }

    init() {
        this.renderTable();
        this.renderMatches();
        this.renderControls();
        this.bindEvents();
    }

    bindEvents() {
        // Метод для привязки событий, если понадобится в будущем
    }

    renderTable() {
        const tableContainer = document.getElementById('table-container');
        
        // Сортируем команды по очкам, затем по разности голов
        const sortedTeams = [...this.currentTeams].sort((a, b) => {
            if (a.points !== b.points) {
                return b.points - a.points;
            }
            return b.goalDifference - a.goalDifference;
        });

        // Обновляем позиции
        sortedTeams.forEach((team, index) => {
            team.position = index + 1;
        });

        let tableHTML = `
            <div class="table-row header">
                <div class="position">#</div>
                <div class="team-logo"></div>
                <div class="team-name">Команда</div>
                <div class="stats">И</div>
                <div class="stats">ГЗ</div>
                <div class="stats">ГП</div>
                <div class="points">О</div>
            </div>
        `;

        sortedTeams.forEach(team => {
            tableHTML += `
                <div class="table-row" data-team-id="${team.id}" style="animation-delay: ${team.position * 0.1}s">
                    <div class="position">${team.position}</div>
                    <div class="team-logo">${team.logo}</div>
                    <div class="team-name">${team.name}</div>
                    <div class="stats">${team.games}</div>
                    <div class="stats">${team.goalsFor}</div>
                    <div class="stats">${team.goalsAgainst}</div>
                    <div class="points">${team.points}</div>
                    <div class="position-change"></div>
                </div>
            `;
        });

        tableContainer.innerHTML = tableHTML;
        this.currentTeams = sortedTeams;
    }

    renderMatches() {
        const matchesContainer = document.getElementById('matches-container');
        
        let matchesHTML = '';
        this.currentMatches.forEach(match => {
            const homeTeam = this.currentTeams.find(t => t.name === match.homeTeam);
            const awayTeam = this.currentTeams.find(t => t.name === match.awayTeam);
            
            matchesHTML += `
                <div class="match-card" data-match-id="${match.id}">
                    <div class="match-header">
                        <div class="match-teams">
                            <span>${homeTeam.logo} ${match.homeTeam}</span>
                            <span>-</span>
                            <span>${match.awayTeam} ${awayTeam.logo}</span>
                        </div>
                        <div class="match-score">${match.homeScore} : ${match.awayScore}</div>
                    </div>
                    ${match.status === 'live' ? `<div class="match-minute">${match.minute}'</div>` : ''}
                </div>
            `;
        });

        matchesContainer.innerHTML = matchesHTML;
    }

    renderControls() {
        const controlsContainer = document.getElementById('controls-container');
        
        let controlsHTML = `
            <div class="control-section">
                <h3>🥅 Управление голами</h3>
                <div class="button-group">
        `;

        this.currentMatches.forEach(match => {
            if (match.status === 'live') {
                controlsHTML += `
                    <button class="btn" onclick="liveTable.addGoal(${match.id}, 'home')">
                        Гол ${match.homeTeam}
                    </button>
                    <button class="btn" onclick="liveTable.addGoal(${match.id}, 'away')">
                        Гол ${match.awayTeam}
                    </button>
                `;
            }
        });

        controlsHTML += `
                </div>
            </div>
            <div class="control-section">
                <h3>⚡ Автоматический режим</h3>
                <div class="button-group">
                    <button class="btn ${this.isAutoMode ? 'danger' : ''}" onclick="liveTable.toggleAutoMode()">
                        ${this.isAutoMode ? '⏹️ Остановить' : '▶️ Запустить'} автосимуляцию
                    </button>
                    <button class="btn secondary" onclick="liveTable.resetTable()">
                        🔄 Сбросить таблицу
                    </button>
                </div>
            </div>
        `;

        controlsContainer.innerHTML = controlsHTML;
    }

    addGoal(matchId, scorer) {
        const match = this.currentMatches.find(m => m.id === matchId);
        if (!match) return;

        const oldTeams = [...this.currentTeams];
        
        // Обновляем счет матча
        if (scorer === 'home') {
            match.homeScore++;
        } else {
            match.awayScore++;
        }

        // Обновляем статистику команд
        this.updateTeamStats(match);
        
        // Показываем уведомление о голе
        this.showGoalNotification(match, scorer);
        
        // Обновляем отображение
        this.animateTableUpdate(oldTeams);
        this.renderMatches();
        this.renderControls();
    }

    updateTeamStats(match) {
        const homeTeam = this.currentTeams.find(t => t.name === match.homeTeam);
        const awayTeam = this.currentTeams.find(t => t.name === match.awayTeam);

        if (homeTeam && awayTeam) {
            // Обновляем голы
            homeTeam.goalsFor = homeTeam.goalsFor - (match.homeScore - 1) + match.homeScore;
            homeTeam.goalsAgainst = homeTeam.goalsAgainst - (match.awayScore) + match.awayScore;
            awayTeam.goalsFor = awayTeam.goalsFor - (match.awayScore - 1) + match.awayScore;
            awayTeam.goalsAgainst = awayTeam.goalsAgainst - (match.homeScore) + match.homeScore;

            // Обновляем разность голов
            homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
            awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

            // Обновляем очки (простая логика для демо)
            if (match.homeScore > match.awayScore) {
                homeTeam.points = Math.max(homeTeam.points, teams.find(t => t.name === homeTeam.name).points + 3);
            } else if (match.homeScore < match.awayScore) {
                awayTeam.points = Math.max(awayTeam.points, teams.find(t => t.name === awayTeam.name).points + 3);
            } else if (match.homeScore === match.awayScore && match.homeScore > 0) {
                homeTeam.points = Math.max(homeTeam.points, teams.find(t => t.name === homeTeam.name).points + 1);
                awayTeam.points = Math.max(awayTeam.points, teams.find(t => t.name === awayTeam.name).points + 1);
            }
        }
    }

    animateTableUpdate(oldTeams) {
        const newTeams = [...this.currentTeams].sort((a, b) => {
            if (a.points !== b.points) {
                return b.points - a.points;
            }
            return b.goalDifference - a.goalDifference;
        });

        // Определяем изменения позиций
        const positionChanges = {};
        oldTeams.forEach(oldTeam => {
            const newTeam = newTeams.find(t => t.id === oldTeam.id);
            if (newTeam) {
                const oldPosition = oldTeam.position;
                const newPosition = newTeams.indexOf(newTeam) + 1;
                if (oldPosition !== newPosition) {
                    positionChanges[newTeam.id] = {
                        old: oldPosition,
                        new: newPosition,
                        direction: newPosition < oldPosition ? 'up' : 'down'
                    };
                }
            }
        });

        // Применяем анимацию изменения позиций
        Object.keys(positionChanges).forEach(teamId => {
            const change = positionChanges[teamId];
            const teamRow = document.querySelector(`[data-team-id="${teamId}"]`);
            if (teamRow) {
                const changeIndicator = teamRow.querySelector('.position-change');
                changeIndicator.textContent = change.direction === 'up' ? '↑' : '↓';
                changeIndicator.className = `position-change ${change.direction}`;
            }
        });

        // Перерисовываем таблицу с анимацией
        setTimeout(() => {
            this.renderTable();
        }, 300);
    }

    showGoalNotification(match, scorer) {
        const team = scorer === 'home' ? match.homeTeam : match.awayTeam;
        const notification = document.createElement('div');
        notification.className = 'goal-notification';
        notification.innerHTML = `
            <span class="goal-icon">⚽</span>
            <strong>ГОЛ!</strong> ${team} ${match.homeScore}:${match.awayScore}
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        
        if (this.isAutoMode) {
            this.startAutoSimulation();
        } else {
            this.stopAutoSimulation();
        }
        
        this.renderControls();
    }

    startAutoSimulation() {
        this.scenarioIndex = 0;
        this.currentMinute = 0;
        
        // Сбрасываем матчи
        this.currentMatches.forEach(match => {
            if (match.status === 'live') {
                match.homeScore = 0;
                match.awayScore = 0;
                match.minute = 0;
            }
        });

        this.autoInterval = setInterval(() => {
            this.currentMinute++;
            
            // Обновляем минуты всех live матчей
            this.currentMatches.forEach(match => {
                if (match.status === 'live') {
                    match.minute = this.currentMinute;
                }
            });

            // Проверяем сценарий голов
            const currentScenario = goalScenarios[this.scenarioIndex];
            if (currentScenario && this.currentMinute >= currentScenario.minute) {
                const match = this.currentMatches.find(m => m.id === currentScenario.matchId);
                if (match) {
                    this.addGoal(currentScenario.matchId, currentScenario.scorer);
                    
                    // Показываем описание
                    setTimeout(() => {
                        this.showGoalNotification({
                            homeTeam: match.homeTeam,
                            awayTeam: match.awayTeam,
                            homeScore: match.homeScore,
                            awayScore: match.awayScore
                        }, currentScenario.scorer);
                    }, 500);
                }
                this.scenarioIndex++;
            }

            // Останавливаем на 90 минуте или когда сценарии закончились
            if (this.currentMinute >= 90 || this.scenarioIndex >= goalScenarios.length) {
                this.stopAutoSimulation();
            }

            this.renderMatches();
        }, 2000); // Каждые 2 секунды = 1 минута
    }

    stopAutoSimulation() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        this.isAutoMode = false;
        this.renderControls();
    }

    resetTable() {
        this.stopAutoSimulation();
        this.currentTeams = [...teams];
        this.currentMatches = [...virtualMatches];
        this.scenarioIndex = 0;
        this.currentMinute = 0;
        
        // Сбрасываем счета матчей
        this.currentMatches.forEach(match => {
            match.homeScore = 0;
            match.awayScore = 0;
            match.minute = 0;
        });

        this.renderTable();
        this.renderMatches();
        this.renderControls();
    }
}

// Инициализация при загрузке страницы
let liveTable;
document.addEventListener('DOMContentLoaded', () => {
    liveTable = new LiveTable();
}); 