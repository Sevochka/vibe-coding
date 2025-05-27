class TableManager {
    constructor() {
        this.currentWeek = 1;
        this.isPlaying = false;
        this.playInterval = null;
        this.autoPlaySpeed = 1500; // время между турами в мс
        this.rowHeight = 30; // высота строки в пикселях
        
        this.standings = new Map();
        teams.forEach(team => {
            this.standings.set(team.id, {
                points: 0,
                gf: 0,
                ga: 0,
                gd: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                position: 0 // текущая позиция в таблице
            });
        });

        this.teamPositions = document.getElementById('teamPositions');
        this.setupTeamElements();
        this.setupControls();
        
        // Автоматически запускаем анимацию при загрузке
        setTimeout(() => {
            this.startAnimation();
        }, 1000);
    }
    
    // Создаем элементы команд в DOM
    setupTeamElements() {
        teams.forEach((team, index) => {
            const teamRow = document.createElement('div');
            teamRow.className = 'team-row';
            teamRow.id = `team-${team.id}`;
            teamRow.innerHTML = `
                <div class="position-number">1</div>
                <img src="${team.logo}" alt="${team.name}" class="team-logo" crossorigin="anonymous">
                <div class="team-name">${team.name}</div>
                <div class="team-stats">
                    <span class="team-played">0</span>
                    <span class="team-won">0</span>
                    <span class="team-drawn">0</span>
                    <span class="team-lost">0</span>
                    <span class="team-gd">0</span>
                </div>
                <div class="team-points">0</div>
            `;
            
            // Начальная позиция (все на первом месте)
            teamRow.style.transform = `translateY(${index * this.rowHeight}px)`;
            
            this.teamPositions.appendChild(teamRow);
        });
    }

    setupControls() {
        const playButton = document.getElementById('playButton');
        const weekSlider = document.getElementById('weekSlider');
        const currentWeek = document.getElementById('currentWeek');

        playButton.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stopAnimation();
                playButton.textContent = 'Воспроизвести';
            } else {
                this.startAnimation();
                playButton.textContent = 'Пауза';
            }
            this.isPlaying = !this.isPlaying;
        });

        weekSlider.addEventListener('input', (e) => {
            this.stopAnimation();
            playButton.textContent = 'Воспроизвести';
            this.isPlaying = false;
            this.currentWeek = parseInt(e.target.value);
            currentWeek.textContent = `Тур ${this.currentWeek}`;
            this.updateToWeek(this.currentWeek);
        });
        
        // Максимальное значение слайдера равно количеству доступных туров
        weekSlider.max = results.length;
    }

    startAnimation() {
        if (this.playInterval) return;
        
        this.playInterval = setInterval(() => {
            if (this.currentWeek < results.length) {
                this.currentWeek++;
                document.getElementById('weekSlider').value = this.currentWeek;
                document.getElementById('currentWeek').textContent = `Тур ${this.currentWeek}`;
                this.updateToWeek(this.currentWeek);
            } else {
                // Когда анимация достигает конца, мы перезапускаем её с первого тура
                this.currentWeek = 0;
            }
        }, this.autoPlaySpeed);
    }

    stopAnimation() {
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    updateToWeek(week) {
        // Сбрасываем таблицу
        this.standings.forEach((stats, teamId) => {
            Object.keys(stats).forEach(key => {
                stats[key] = 0;
            });
        });

        // Обновляем статистику для всех матчей до текущей недели
        for (let i = 0; i < week; i++) {
            const weekResults = results[i];
            if (!weekResults) continue;

            weekResults.matches.forEach(match => {
                const homeStats = this.standings.get(match.home);
                const awayStats = this.standings.get(match.away);
                
                if (!homeStats || !awayStats) {
                    console.warn(`Неизвестная команда в матче: ${match.home} vs ${match.away}`);
                    return;
                }
                
                const [homeGoals, awayGoals] = match.score;
                
                // Обновляем статистику домашней команды
                homeStats.played++;
                homeStats.gf += homeGoals;
                homeStats.ga += awayGoals;
                homeStats.gd = homeStats.gf - homeStats.ga;
                
                // Обновляем статистику гостевой команды
                awayStats.played++;
                awayStats.gf += awayGoals;
                awayStats.ga += homeGoals;
                awayStats.gd = awayStats.gf - awayStats.ga;
                
                if (homeGoals > awayGoals) {
                    homeStats.won++;
                    homeStats.points += 3;
                    awayStats.lost++;
                } else if (homeGoals < awayGoals) {
                    awayStats.won++;
                    awayStats.points += 3;
                    homeStats.lost++;
                } else {
                    homeStats.drawn++;
                    awayStats.drawn++;
                    homeStats.points += 1;
                    awayStats.points += 1;
                }
            });
        }

        // Сортируем команды
        const sortedTeams = Array.from(this.standings.entries()).sort((a, b) => {
            if (a[1].points !== b[1].points) {
                return b[1].points - a[1].points;
            }
            if (a[1].gd !== b[1].gd) {
                return b[1].gd - a[1].gd;
            }
            return b[1].gf - a[1].gf;
        });
        
        // Обновляем позиции команд
        sortedTeams.forEach((team, index) => {
            const [teamId, stats] = team;
            stats.position = index + 1;
            
            // Обновляем DOM-элемент
            const teamElement = document.getElementById(`team-${teamId}`);
            if (teamElement) {
                // Плавно перемещаем команду на новую позицию
                teamElement.style.transform = `translateY(${index * this.rowHeight}px)`;
                
                // Обновляем статистику
                teamElement.querySelector('.position-number').textContent = index + 1;
                teamElement.querySelector('.team-played').textContent = stats.played;
                teamElement.querySelector('.team-won').textContent = stats.won;
                teamElement.querySelector('.team-drawn').textContent = stats.drawn;
                teamElement.querySelector('.team-lost').textContent = stats.lost;
                teamElement.querySelector('.team-gd').textContent = stats.gd > 0 ? `+${stats.gd}` : stats.gd;
                teamElement.querySelector('.team-points').textContent = stats.points;
            }
        });
        
        // Отладочный вывод в консоль
        console.log('Тур', week, 'Таблица:', sortedTeams);
    }
    
    // Метод для отображения детальной статистики команды
    showTeamStats(teamId) {
        const stats = this.standings.get(teamId);
        if (!stats) return;
        
        const team = teams.find(t => t.id === teamId);
        
        alert(`
            Команда: ${team.name}
            Очки: ${stats.points}
            Игры: ${stats.played}
            Победы: ${stats.won}
            Ничьи: ${stats.drawn}
            Поражения: ${stats.lost}
            Забитые голы: ${stats.gf}
            Пропущенные голы: ${stats.ga}
            Разница голов: ${stats.gd}
        `);
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const manager = new TableManager();
    manager.updateToWeek(1);
}); 